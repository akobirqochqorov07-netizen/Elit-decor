/**
 * GET /api/telegram-check — Telegram sozlamalari to'g'rimi, aniq ko'rsatadi.
 * Hech qanday maxfiy qiymat qaytarmaydi (token ham, chat ID ham ko'rsatilmaydi).
 */
import { NextResponse } from 'next/server';
import { getTelegramConfig } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

async function tg(token: string, method: string, query = '') {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}${query}`, {
        signal: AbortSignal.timeout(6000),
    });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok && data?.ok === true, data, status: r.status };
}

export async function GET(): Promise<NextResponse> {
    const { token, chatIds } = getTelegramConfig();

    // Nomlari TELEGRAM / BOT / CHAT so'zlarini o'z ichiga olgan o'zgaruvchilar (faqat nomlar, qiymat emas)
    const envNamesSeen = Object.keys(process.env).filter((k) => /TELEGRAM|BOT|CHAT/i.test(k));

    const result: Record<string, unknown> = {
        deployment: {
            env: process.env.VERCEL_ENV ?? 'local',
            commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7) || null,
            branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
        },
        envNamesSeen,
        tokenSet: token.length > 0,
        tokenLooksOk: /^\d{6,}:[A-Za-z0-9_-]{30,}$/.test(token),
        chatIdCount: chatIds.length,
        tokenValid: false,
        botUsername: null,
        chats: [] as unknown[],
    };

    if (token) {
        try {
            const me = await tg(token, 'getMe');
            result.tokenValid = me.ok;
            result.botUsername = me.ok ? (me.data.result?.username ?? null) : null;
            if (!me.ok) result.telegramError = me.data?.description ?? `HTTP ${me.status}`;

            if (me.ok) {
                const chats = [];
                for (let i = 0; i < chatIds.length; i++) {
                    const id = chatIds[i];
                    const r = await tg(token, 'getChat', `?chat_id=${encodeURIComponent(id)}`);
                    chats.push({
                        n: i + 1,
                        format: /^-?\d+$/.test(id) ? 'raqam' : id.startsWith('@') ? '@username' : 'NOTO\'G\'RI',
                        reachable: r.ok,
                        error: r.ok ? null : (r.data?.description ?? `HTTP ${r.status}`),
                    });
                }
                result.chats = chats;
            }
        } catch {
            result.telegramError = "Telegramga ulanib bo'lmadi";
        }
    }

    const chats = result.chats as { reachable: boolean }[];
    const anyChatOk = chats.some((c) => c.reachable);
    result.ready = result.tokenValid === true && anyChatOk;

    // Odam tilida xulosa (birinchi topilgan muammo)
    let hint = 'Hammasi tayyor. Forma yuborib ko\'ring.';
    if (!token && envNamesSeen.length === 0) {
        hint = "Bu deploy'da Telegram o'zgaruvchilari umuman yo'q. Vercel'da qo'shgandan KEYIN Redeploy qiling yoki yangi deploy kuting.";
    } else if (!token) {
        hint = "TELEGRAM_BOT_TOKEN nomi topilmadi. Topilgan nomlar: " + envNamesSeen.join(', ') + ". Nomni aynan TELEGRAM_BOT_TOKEN qiling.";
    } else if (chatIds.length === 0) {
        hint = "TELEGRAM_CHAT_ID topilmadi yoki bo'sh. Nomni va qiymatni tekshiring.";
    } else if (!result.tokenValid) {
        hint = "Token Telegram tomonidan qabul qilinmadi (" + String(result.telegramError ?? '?') + "). BotFather'dan yangi tokenni qayta nusxalang.";
    } else if (!anyChatOk) {
        hint = "Token to'g'ri, lekin chat ID ishlamayapti. Chat ID noto'g'ri yoki botga o'sha chatdan /start yozilmagan (guruh bo'lsa, bot guruhga qo'shilmagan).";
    }
    result.hint = hint;

    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
