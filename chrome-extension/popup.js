document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('testButton');
    const statusDiv = document.getElementById('status');
    const resultDiv = document.getElementById('result');

    const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

    async function updateStatus(message) {
        statusDiv.textContent = message;
        console.log('Status:', message);
    }

    async function testConnection() {
        testButton.disabled = true;
        try {
            // Step 1: Get OpenAI key from Supabase
            await updateStatus('1. Fetching OpenAI key from Supabase...');
            
            const settingsResponse = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=key_value&key_name=eq.openai_project_key`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!settingsResponse.ok) {
                throw new Error(`Supabase API error: ${settingsResponse.status}`);
            }

            const settings = await settingsResponse.json();
            console.log('Supabase Response:', settings);

            if (!settings || settings.length === 0) {
                throw new Error('OpenAI key not found in settings table');
            }

            const openaiKey = settings[0].key_value;
            await updateStatus('2. Successfully retrieved OpenAI key');

            // Step 2: Test OpenAI connection
            await updateStatus('3. Testing OpenAI connection...');
            
            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [{
                        role: 'user',
                        content: 'Please respond with "Connection successful!" if you receive this message.'
                    }]
                })
            });

            if (!openaiResponse.ok) {
                const error = await openaiResponse.json();
                throw new Error(`OpenAI API error: ${error.error?.message || openaiResponse.status}`);
            }

            const openaiResult = await openaiResponse.json();
            console.log('OpenAI Response:', openaiResult);

            resultDiv.textContent = openaiResult.choices[0].message.content;
            await updateStatus('✓ All connection tests passed!');

        } catch (error) {
            console.error('Test failed:', error);
            await updateStatus(`Error: ${error.message}`);
            resultDiv.textContent = '';
        } finally {
            testButton.disabled = false;
        }
    }

    testButton.addEventListener('click', testConnection);
});
