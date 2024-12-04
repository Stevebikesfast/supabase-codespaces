document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');

  try {
    // Test Supabase connection by attempting to fetch OpenAI key
    const key = await window.supabaseService.fetchOpenAIKey();
    
    statusDiv.textContent = 'Successfully connected to Supabase!';
    statusDiv.className = 'success';
    console.log('OpenAI key retrieved successfully');
  } catch (error) {
    statusDiv.textContent = 'Error connecting to Supabase: ' + error.message;
    statusDiv.className = 'error';
    console.error('Connection error:', error);
  }
});
