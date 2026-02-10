# Telegram Latest Post API

Автоматическое получение последнего поста из Telegram канала для встраивания на сайт.

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

Для использования Bot API метода:
- `TELEGRAM_BOT_TOKEN` - токен вашего Telegram бота