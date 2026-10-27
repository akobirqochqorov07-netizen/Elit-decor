/**
 * POST /api/order
 *
 * Buyurtmani qabul qiladi, tekshiradi va Telegram botga yuboradi.
 * Bot token va chat ID FAQAT server environment o'zgaruvchilarida.
 */

import { NextRequest, NextResponse } from 'next/server';
import katalogData from '../../../../public/images/karnizlar/katalog.json';
import { escHtml, sendTelegramMessage } from '@/lib/telegram';

// ─── Tiplар ──────────────────────────────────────────────────────────────────

interface OrderItem {
    kod: string;
    miqdor: number;
}

interface OrderBody {
    ism: string;
    telefon: string;
    email?: string;
    izoh?: string;
    mahsulotlar: OrderItem[];
    /** honeypot — bot to'ldiradi, inson qoldiradi */
    website?: string;
    sahifa_url?: string;
}

// ─── Rate limiting (in-memory, per IP) ───────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 daqiqa

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    if (entry.count >= RATE_LIMIT_MAX) return true;
    entry.count++;
    return false;
}

// ─── Buyurtma raqami ──────────────────────────────────────────────────────────

function generateOrderId(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear().toString().slice(-2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

// ─── Toshkent vaqti ───────────────────────────────────────────────────────────

function tashkentTime(): string {
    return new Date().toLocaleString('uz-UZ', {
        timeZone: 'Asia/Tashkent',
        dateStyle: 'short',
        timeStyle: 'medium',
    });
}

// ─── Mahsulotlar tekshiruvi ───────────────────────────────────────────────────

interface RawMahsulot {
    kod: string;
    katalog: string;
    papka: string;
}

interface RawJson {
    kataloglar: unknown[];
    mahsulotlar: RawMahsulot[];
}

function toDisplayKod(kod: string): string {
    const match = kod.match(/karniz-(\d+)/);
    if (match) return `K-${match[1]}`;
    return kod.toUpperCase();
}

function buildTelegramMessage(
    orderId: string,
    body: OrderBody,
    resolvedItems: Array<{ item: OrderItem; mahsulot: RawMahsulot }>
): string {
    const itemLines = resolvedItems
        .map((r, i) => {
            const displayKod = toDisplayKod(r.item.kod);
            return `  ${i + 1}. ${escHtml(displayKod)} (${escHtml(r.mahsulot.katalog)}) — ${r.item.miqdor} p.m.`;
        })
        .join('\n');

    const jami_pm = resolvedItems.reduce((s, r) => s + r.item.miqdor, 0);

    return `🛒 Yangi buyurtma <b>#${escHtml(orderId)}</b>
👤 Ism: ${escHtml(body.ism)}
📞 Telefon: ${escHtml(body.telefon)}${body.email ? `\n✉️ Email: ${escHtml(body.email)}` : ''}${body.izoh ? `\n💬 Izoh: ${escHtml(body.izoh)}` : ''}

<b>Mahsulotlar:</b>
${itemLines}

Jami: ${resolvedItems.length} pozitsiya, ${jami_pm} p.m.
🕒 Vaqt: ${tashkentTime()}${body.sahifa_url ? `\n🌐 Sahifa: ${escHtml(body.sahifa_url)}` : ''}`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
    // 1. IP rate limit
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        req.headers.get('x-real-ip') ??
        'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json({ error: 'Juda ko\'p so\'rov. Biroz kuting.' }, { status: 429 });
    }

    // 2. Parse body
    let body: OrderBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Noto\'g\'ri so\'rov formati' }, { status: 400 });
    }

    // 3. Honeypot: agar "website" maydoni to'ldirilgan bo'lsa — bot
    if (body.website && body.website.trim().length > 0) {
        // Botga bildirmasdan muvaffaqiyatli javob qaytaramiz
        return NextResponse.json({ ok: true, orderId: '0000' });
    }

    // 4. Server-side validatsiya
    const errors: string[] = [];

    if (!body.ism || body.ism.trim().length < 2) errors.push('Ism noto\'g\'ri');
    if (body.ism && body.ism.length > 100) errors.push('Ism juda uzun');

    const phoneClean = (body.telefon ?? '').replace(/\s|\(|\)|-/g, '');
    if (!phoneClean || !/^\+?998\d{9}$/.test(phoneClean)) errors.push('Telefon formati noto\'g\'ri (+998XXXXXXXXX)');

    if (body.email && body.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push('Email formati noto\'g\'ri');
    }

    if (body.izoh && body.izoh.length > 1000) errors.push('Izoh juda uzun');

    if (!Array.isArray(body.mahsulotlar) || body.mahsulotlar.length === 0) {
        errors.push('Savat bo\'sh');
    }

    if (errors.length > 0) {
        return NextResponse.json({ error: errors.join('. ') }, { status: 422 });
    }

    // 5. Mahsulot kodlarini katalog.json dan tekshirish
    const raw = katalogData as RawJson;
    const mahsulotMap = new Map<string, RawMahsulot>();
    for (const m of raw.mahsulotlar) {
        mahsulotMap.set(m.kod, m);
    }

    const resolvedItems: Array<{ item: OrderItem; mahsulot: RawMahsulot }> = [];
    const invalidKodlar: string[] = [];

    for (const item of body.mahsulotlar) {
        const mahsulot = mahsulotMap.get(item.kod);
        if (!mahsulot) {
            invalidKodlar.push(item.kod);
            continue;
        }
        if (!Number.isInteger(item.miqdor) || item.miqdor <= 0 || item.miqdor > 10000) {
            return NextResponse.json({ error: `Noto'g'ri miqdor: ${item.kod}` }, { status: 422 });
        }
        resolvedItems.push({ item, mahsulot });
    }

    if (invalidKodlar.length > 0) {
        return NextResponse.json({ error: `Noto'g'ri mahsulot kodlari: ${invalidKodlar.join(', ')}` }, { status: 422 });
    }

    if (resolvedItems.length === 0) {
        return NextResponse.json({ error: 'Hech qanday mahsulot topilmadi' }, { status: 422 });
    }

    // 6. Buyurtma raqami va xabar yaratish
    const orderId = generateOrderId();
    const message = buildTelegramMessage(orderId, body, resolvedItems);

    // 7. Telegram ga yuborish
    const sent = await sendTelegramMessage(message);

    if (!sent) {
        console.error(`[order] Telegram xato. OrderId: ${orderId}`);
        return NextResponse.json(
            { error: 'Yuborib bo\'lmadi. Qayta urinib ko\'ring yoki qo\'ng\'iroq qiling.' },
            { status: 502 }
        );
    }

    return NextResponse.json({ ok: true, orderId });
}
