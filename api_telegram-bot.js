// Этот метод использует ваш бот токен для более стабильного получения данных
export default async function handler(req, res) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Храним в переменных окружения!
  const CHANNEL_ID = '@iamdiethylmorphine';
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }
  
  try {
    // Получаем информацию о канале
    const chatResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${CHANNEL_ID}`
    );
    
    const chatData = await chatResponse.json();
    
    if (!chatData.ok) {
      throw new Error(chatData.description || 'Failed to get chat info');
    }
    
    // Примечание: для получения последних сообщений бот должен быть админом канала
    // Или использовать метод с парсингом HTML как выше
    
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    
    return res.status(200).json({
      success: true,
      channel: chatData.result.username,
      title: chatData.result.title,
      description: chatData.result.description,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Telegram Bot API Error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}