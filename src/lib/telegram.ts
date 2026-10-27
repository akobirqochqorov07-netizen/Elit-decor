/**
 * Server-only Telegram yuborish. Token hech qachon clientga chiqmaydi.
 */

export async function sendTelegramMessage(
    message: string,
    parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<boolean> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIdsRaw = process.env.TELEGRAM_CHAT_ID ?? '';

    if (!token || !chatIdsRaw) {
        console.error('[telegram] TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID topilmadi');
        return false;
    }

    const chatIds = chatIdsRaw.split(',').map((s) => s.trim()).filter(Boolean);

    const results = await Promise.allSettled(
        chatIds.map((chatId) =>
            fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: parseMode,
                }),
            }).then((r) => r.ok)
        )
    );

    return results.some((r) => r.status === 'fulfilled' && r.value === true);
}

export function escHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
