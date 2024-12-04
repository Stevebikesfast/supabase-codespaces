document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('testButton');
    const statusDiv = document.getElementById('status');
    const resultDiv = document.getElementById('result');

    const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

    async function testConnection() {
        testButton.disabled = true;
        statusDiv.textContent = 'Testing...';
        resultDiv.textContent = '';
        
        try {
            // Step 1: Test Supabase Connection
            statusDiv.textContent = 'Connecting to Supabase...';
            const settingsResponse = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!settingsResponse.ok) {
                throw new Error(`Supabase Error: ${settingsResponse.status} - ${settingsResponse.statusText}`);
            }

            const settings = await settingsResponse.json();
            resultDiv.textContent = 'Supabase Response:\n' + JSON.stringify(settings, null, 2);

            // Log full response for debugging
            console.log('Raw Supabase Response:', {
                status: settingsResponse.status,
                headers: Object.fromEntries(settingsResponse.headers.entries()),
                data: settings
            });

            if (!settings || settings.length === 0) {
                throw new Error('No data found in settings table');
            }

            // Show what we found
            statusDiv.textContent = `Found ${settings.length} rows in settings table. Checking for OpenAI key...`;

            // Look for OpenAI key
            const openaiSetting = settings.find(s => s.key_name === 'openai_project_key');
            if (!openaiSetting) {
                throw new Error('OpenAI key not found in settings');
            }

            statusDiv.textContent = 'Found OpenAI key. Testing OpenAI connection...';

            // Test OpenAI connection
            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiSetting.key_value}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [{
                        role: 'user',
                        content: 'Say "OpenAI connection verified" if you receive this.'
                    }]
                })
            });

            if (!openaiResponse.ok) {
                const error = await openaiResponse.json();
                throw new Error(`OpenAI Error: ${error.error?.message || openaiResponse.statusText}`);
            }

            const openaiResult = await openaiResponse.json();
            
            // Show both results
            resultDiv.textContent = 
                'Supabase Data:\n' + 
                JSON.stringify(settings, null, 2) + 
                '\n\nOpenAI Response:\n' + 
                JSON.stringify(openaiResult, null, 2);

            statusDiv.textContent = 'Test Complete - Check results below';

        } catch (error) {
            statusDiv.textContent = `Error: ${error.message}`;
            console.error('Full error:', error);
        } finally {
            testButton.disabled = false;
        }
    }

    testButton.addEventListener('click', testConnection);
});
