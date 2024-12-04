document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('testButton');
    const testMessage = document.getElementById('testMessage');
    const resultDiv = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
    const SUPABASE_KEY = 'PeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

    async function fetchOpenAIKey() {
        statusDiv.textContent = 'Fetching OpenAI key from Supabase...';
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?key_name=eq.openai_project_key`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Supabase API error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Supabase response:', data);

        if (!data || data.length === 0) {
            throw new Error('No OpenAI key found in settings table');
        }

        return data[0].key_value;
    }

    async function makeOpenAIRequest(openaiKey, message) {
        statusDiv.textContent = 'Sending message to OpenAI...';
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant testing the connection between a Chrome extension, Supabase, and OpenAI.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('OpenAI response:', data);

        return data.choices[0]?.message?.content || 'No response from assistant';
    }

    testButton.addEventListener('click', async () => {
        testButton.disabled = true;
        resultDiv.textContent = '';
        
        try {
            // Step 1: Fetch OpenAI key from Supabase
            const openaiKey = await fetchOpenAIKey();
            console.log('Successfully retrieved OpenAI key');

            // Step 2: Make OpenAI API call
            const message = testMessage.value.trim() || 'Hello, can you help me test if this connection is working?';
            const response = await makeOpenAIRequest(openaiKey, message);

            // Step 3: Display result
            statusDiv.textContent = 'Test completed successfully!';
            resultDiv.textContent = response;

        } catch (error) {
            statusDiv.textContent = 'Error occurred!';
            resultDiv.textContent = 'Error: ' + error.message;
            console.error('Full error:', error);
        } finally {
            testButton.disabled = false;
        }
    });
});
