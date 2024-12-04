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

            // Verify Supabase data
            if (!settings || settings.length === 0) {
                throw new Error('No data found in settings table');
            }

            const openaiSetting = settings.find(s => s.key_name === 'openai_project_key');
            if (!openaiSetting) {
                throw new Error('OpenAI key not found in settings');
            }

            statusDiv.textContent = '✓ Supabase: Successfully retrieved OpenAI key';
            
            // Show Supabase results
            resultDiv.innerHTML = '<strong>Supabase Data:</strong>\n' + 
                `<pre>${JSON.stringify(settings, null, 2)}</pre>`;

            // Test OpenAI connection
            statusDiv.textContent = '✓ Supabase Success - Testing OpenAI...';
            
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
            
            // Verify OpenAI response
            if (!openaiResult.choices || !openaiResult.choices[0]?.message?.content) {
                throw new Error('Invalid OpenAI response format');
            }

            // Show OpenAI results
            resultDiv.innerHTML += '\n<strong>OpenAI Response:</strong>\n' + 
                `<pre>${JSON.stringify(openaiResult, null, 2)}</pre>`;

            // Show final verification
            statusDiv.innerHTML = `
                <div style="color: #155724; background-color: #d4edda; padding: 10px; border-radius: 4px;">
                    ✓ Connections Verified:
                    <br>1. Supabase: Successfully accessed settings table
                    <br>2. OpenAI Key: Retrieved from settings
                    <br>3. OpenAI API: Successful test response
                </div>
            `;

        } catch (error) {
            statusDiv.innerHTML = `
                <div style="color: #721c24; background-color: #f8d7da; padding: 10px; border-radius: 4px;">
                    ✗ Error: ${error.message}
                </div>
            `;
            console.error('Full error:', error);
        } finally {
            testButton.disabled = false;
        }
    }

    testButton.addEventListener('click', testConnection);
});
