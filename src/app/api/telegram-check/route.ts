/**
 * GET /api/telegram-check — Telegram sozlamalari to'g'rimi, tekshirish uchun.
 * Hech qanday maxfiy qiymat qaytarmaydi (token ham, chat ID ham ko'rsatilmaydi).
 */
import { NextResponse } from 'next/server';
import { getTelegramConfig } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
    const { token, chatIds } = getTelegramConfig();
    const result: Record<string, unknown> = {
        tokenSet: token.length > 0,
        chatIdCount: chatIds.length,
        tokenValid: false,
        botUsername: null,
    };

    if (token) {
        try {
            const r = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
                signal: AbortSignal.timeout(6000),
            });
            const data = await r.json().catch(() => ({}));
            result.tokenValid = r.ok && data?.ok === true;
            result.botUsername = result.tokenValid ? (data.result?.username ?? null) : null;
            if (!result.tokenValid) result.telegramError = data?.description ?? `HTTP ${r.status}`;
        } catch {
            result.telegramError = "Telegramga ulanib bo'lmadi";
        }
    }

    result.ready = result.tokenValid === true && chatIds.length > 0;
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
