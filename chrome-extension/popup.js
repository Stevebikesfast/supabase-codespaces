document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('testButton');
    const resultDiv = document.getElementById('result');

    const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
    const SUPABASE_KEY = 'PeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

    testButton.addEventListener('click', async () => {
        resultDiv.textContent = 'Testing connection...';
        
        try {
            // Test Supabase connection by fetching OpenAI key
            const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?key_name=eq.openai_project_key`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response:', data);

            if (!data || data.length === 0) {
                throw new Error('No OpenAI key found in settings table');
            }

            resultDiv.textContent = 'Successfully connected to Supabase and found OpenAI key!';
            console.log('OpenAI key:', data[0].key_value);

        } catch (error) {
            resultDiv.textContent = 'Error: ' + error.message;
            console.error('Full error:', error);
        }
    });
});
