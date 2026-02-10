<script>
(async function() {
  const TELEGRAM_CHANNEL = 'iamdiethylmorphine';
  const API_URL = 'https://your-vercel-app.vercel.app/api/telegram-latest'; // Ваш API
  
  const container = document.getElementById('telegram-content');
  
  try {
    // Получаем последний пост
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (!data.latest_post_id) {
      throw new Error('No post ID found');
    }
    
    // Создаем виджет с автоматически полученным ID
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-post', `${TELEGRAM_CHANNEL}/${data.latest_post_id}`);
    script.setAttribute('data-width', '100%');
    script.setAttribute('data-color', '343638');
    script.setAttribute('data-dark-color', 'FFFFFF');
    
    container.innerHTML = '';
    container.appendChild(script);
    
  } catch (error) {
    console.error('Failed to load latest Telegram post:', error);
    container.innerHTML = '<p style="text-align: center; color: #666;">Failed to load latest post</p>';
  }
})();
</script>