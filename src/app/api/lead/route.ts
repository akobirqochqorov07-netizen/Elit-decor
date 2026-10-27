/**
 * POST /api/lead — qo'ng'iroq / kontakt so'rovi (mahsulotsiz).
 */

import { NextRequest, NextResponse } from 'next/server';
import { escHtml, sendTelegramMessage } from '@/lib/telegram';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

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

export async function POST(req: NextRequest): Promise<NextResponse> {
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        req.headers.get('x-real-ip') ??
        'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json({ error: "Juda ko'p so'rov. Biroz kuting." }, { status: 429 });
    }

    let body: {
        ism?: string;
        telefon?: string;
        email?: string;
        izoh?: string;
        website?: string;
        sahifa_url?: string;
    };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Noto'g'ri so'rov formati" }, { status: 400 });
    }

    if (body.website && body.website.trim().length > 0) {
        return NextResponse.json({ ok: true });
    }

    const ism = (body.ism ?? '').trim();
    const telefon = (body.telefon ?? '').trim();
    if (ism.length < 2) {
        return NextResponse.json({ error: "Ism noto'g'ri" }, { status: 422 });
    }
    if (telefon.length < 7) {
        return NextResponse.json({ error: "Telefon noto'g'ri" }, { status: 422 });
    }

    const message = `🔔 Yangi so'rov
👤 Ism: ${escHtml(ism)}
📞 Telefon: ${escHtml(telefon)}${body.email ? `\n✉️ Email: ${escHtml(body.email)}` : ''}${body.izoh ? `\n💬 Izoh: ${escHtml(body.izoh)}` : ''}${body.sahifa_url ? `\n🌐 Sahifa: ${escHtml(body.sahifa_url)}` : ''}`;

    const sent = await sendTelegramMessage(message);
    if (!sent) {
        return NextResponse.json(
            { error: "Yuborib bo'lmadi. Qayta urinib ko'ring." },
            { status: 502 }
        );
    }

    return NextResponse.json({ ok: true });
}
