document.addEventListener('DOMContentLoaded', () => {
  const testButton = document.getElementById('testButton');
  const statusDiv = document.getElementById('status');

  testButton.addEventListener('click', async () => {
    try {
      // Test connection by attempting to fetch OpenAI key
      const key = await window.supabaseService.getOpenAIKey();
      
      const message = 'Successfully retrieved OpenAI key!';
      statusDiv.textContent = message;
      statusDiv.className = 'success';
      console.log(message);
      console.log('Key:', key);
    } catch (error) {
      let errorMessage = error.message || 'Unknown error occurred';
      // If it's an object, try to get more details
      if (error.code || error.details || error.hint) {
        errorMessage = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`.trim();
      }
      
      statusDiv.textContent = 'Error: ' + errorMessage;
      statusDiv.className = 'error';
      console.error('Connection error:', error);
    }
  });
});
