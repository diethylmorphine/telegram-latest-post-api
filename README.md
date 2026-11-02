# Telegram Latest Post API

Получает ID и ссылку на последний пост публичного Telegram-канала, разбирая HTML страницы `t.me/s/<channel>`.

## Endpoints

### GET `/api/telegram-latest`
Возвращает ID последнего поста канала.

**Response:**
```json
{
  "success": true,
  "channel": "iamdiethylmorphine",
  "latest_post_id": 297,
  "post_url": "https://t.me/iamdiethylmorphine/297",
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

## Deploy to Vercel

1. Подключите этот репозиторий к Vercel
2. Деплой произойдёт автоматически
3. Используйте URL: `https://your-app.vercel.app/api/telegram-latest`

## Environment Variables (Optional)

`TELEGRAM_CHANNEL_USERNAME` — необязательное имя публичного канала без `@`. По умолчанию используется `iamdiethylmorphine`. Этот проект не вызывает Telegram Bot API и не требует токена бота.

## Local checks

Requires Node.js 20 or newer. Run `npm test`; tests mock the Telegram page request and need no credentials.
