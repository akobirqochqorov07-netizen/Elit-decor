/**
 * Server-only Telegram yuborish. Token hech qachon clientga chiqmaydi.
 *
 * Kerakli muhit o'zgaruvchilari (Vercel → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN  — @BotFather bergan token
 *   TELEGRAM_CHAT_ID    — chat ID (bir nechta bo'lsa vergul bilan: "123,456")
 */

export type TelegramResult = { ok: boolean; reason?: 'config' | 'telegram' };

export function getTelegramConfig() {
    const token = (process.env.TELEGRAM_BOT_TOKEN ?? '').trim();
    const chatIds = (process.env.TELEGRAM_CHAT_ID ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return { token, chatIds };
}

export async function sendTelegram(
    message: string,
    parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<TelegramResult> {
    const { token, chatIds } = getTelegramConfig();

    if (!token || chatIds.length === 0) {
        console.error('[telegram] TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID topilmadi (Vercel Environment Variables)');
        return { ok: false, reason: 'config' };
    }

    const results = await Promise.allSettled(
        chatIds.map(async (chatId) => {
            const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: parseMode }),
                signal: AbortSignal.timeout(8000),
            });
            if (!r.ok) {
                let description = '';
                try {
                    description = (await r.json()).description ?? '';
                } catch {
                    /* ignore */
                }
                // Token log'ga yozilmaydi
                console.error(`[telegram] chat ${chatId}: HTTP ${r.status} ${description}`);
            }
            return r.ok;
        })
    );

    const ok = results.some((r) => r.status === 'fulfilled' && r.value === true);
    if (!ok) {
        results.forEach((r) => {
            if (r.status === 'rejected') console.error('[telegram] so\'rov xatosi:', String(r.reason));
        });
    }
    return ok ? { ok: true } : { ok: false, reason: 'telegram' };
}

/** Eski nom (moslik uchun) */
export async function sendTelegramMessage(
    message: string,
    parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<boolean> {
    return (await sendTelegram(message, parseMode)).ok;
}

export function tashkentTime(): string {
    return new Date().toLocaleString('uz-UZ', {
        timeZone: 'Asia/Tashkent',
        dateStyle: 'short',
        timeStyle: 'medium',
    });
}

export function escHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
