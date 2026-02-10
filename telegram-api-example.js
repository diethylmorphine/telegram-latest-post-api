// Пример серверного кода (Node.js + Vercel/Netlify Functions)
const TELEGRAM_BOT_TOKEN = 'your_bot_token';
const CHANNEL_USERNAME = '@iamdiethylmorphine';

async function getLatestPost() {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=-1`
  );
  
  // Или используйте метод getChannelMessages если у бота есть доступ
  const channelResponse = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=${CHANNEL_USERNAME}`
  );
  
  const data = await response.json();
  return data;
}