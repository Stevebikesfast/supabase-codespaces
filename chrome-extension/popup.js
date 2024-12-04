document.addEventListener('DOMContentLoaded', () => {
  const testButton = document.getElementById('testButton');
  const statusDiv = document.getElementById('status');

  console.log('Popup initialized, setting up test button handler');

  testButton.addEventListener('click', async () => {
    console.log('Test button clicked, attempting to get OpenAI key...');
    statusDiv.textContent = 'Testing connection...';
    statusDiv.className = '';
    
    try {
      const key = await window.supabaseService.getOpenAIKey();
      
      const message = 'Successfully retrieved OpenAI key!';
      statusDiv.textContent = message;
      statusDiv.className = 'success';
      
      console.log('Success:', {
        message: message,
        keyLength: key ? key.length : 0,
        hasKey: !!key
      });
    } catch (error) {
      console.error('Error in popup handler:', {
        error: error,
        message: error.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        stack: error.stack
      });

      // Construct detailed error message
      let errorMessage = 'Error: ';
      if (error.message) errorMessage += error.message;
      if (error.details) errorMessage += ` (${error.details})`;
      if (error.hint) errorMessage += ` - ${error.hint}`;
      
      statusDiv.textContent = errorMessage;
      statusDiv.className = 'error';
    }
  });

  console.log('Popup initialization complete');
});
