export default async function handler(req, res) {
  const CHANNEL_USERNAME = 'iamdiethylmorphine';
  
  // Добавляем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    // Получаем HTML страницы канала
    const response = await fetch(`https://t.me/s/${CHANNEL_USERNAME}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Ищем все посты на странице
    const postMatches = [...html.matchAll(/data-post="[^"]*\/(\d+)"/g)];
    
    if (postMatches.length === 0) {
      return res.status(404).json({ 
        error: 'No posts found',
        channel: CHANNEL_USERNAME 
      });
    }
    
    // Получаем номер последнего поста (максимальный ID)
    const latestPostId = Math.max(...postMatches.map(m => parseInt(m[1])));
    
    // Кэшируем на 1 минуту
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    
    return res.status(200).json({
      success: true,
      channel: CHANNEL_USERNAME,
      latest_post_id: latestPostId,
      post_url: `https://t.me/${CHANNEL_USERNAME}/${latestPostId}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching Telegram post:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch latest post',
      message: error.message 
    });
  }
}