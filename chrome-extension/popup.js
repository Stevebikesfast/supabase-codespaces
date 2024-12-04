document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('testButton');
    const testMessage = document.getElementById('testMessage');
    const resultDiv = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

    function updateStatus(message, isError = false) {
        statusDiv.textContent = message;
        statusDiv.style.color = isError ? 'red' : 'black';
        console.log(`Status: ${message}`);
    }

    async function fetchOpenAIKey() {
        updateStatus('Step 1/3: Fetching OpenAI key from Supabase...');
        
        // First, let's check what's in the settings table
        const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=*`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!checkResponse.ok) {
            const errorText = await checkResponse.text();
            console.error('Supabase Error:', {
                status: checkResponse.status,
                statusText: checkResponse.statusText,
                error: errorText
            });
            throw new Error(`Supabase API error! status: ${checkResponse.status}, details: ${errorText}`);
        }

        const allSettings = await checkResponse.json();
        console.log('All settings in table:', allSettings);

        // Now try to find our specific key
        const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=key_value&key_name=eq.openai_project_key`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Supabase API error! status: ${response.status}, details: ${errorText}`);
        }

        const data = await response.json();
        console.log('Specific key query response:', data);

        if (!data || data.length === 0) {
            console.error('Settings table data:', {
                allSettings: allSettings,
                specificQuery: data
            });
            throw new Error('Could not find OpenAI key in settings table. Please check if key_name="openai_project_key" exists.');
        }

        updateStatus('✓ Step 1/3: Successfully retrieved OpenAI key from Supabase');
        return data[0].key_value;
    }

    async function makeOpenAIRequest(openaiKey, message) {
        updateStatus('Step 2/3: Sending message to OpenAI...');
        
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
        console.log('OpenAI Response:', {
            success: true,
            data: data,
            message: 'Successfully received response from OpenAI'
        });

        updateStatus('✓ Step 2/3: Successfully received response from OpenAI');
        return data.choices[0]?.message?.content || 'No response from assistant';
    }

    async function displayResponse(response) {
        updateStatus('Step 3/3: Displaying response...');
        resultDiv.textContent = response;
        updateStatus('✓ Step 3/3: All steps completed successfully!');
        
        console.log('Test Summary:', {
            supabaseConnection: '✓ Success',
            openAIKeyRetrieval: '✓ Success',
            openAIResponse: '✓ Success',
            responseDisplayed: '✓ Success'
        });
    }

    testButton.addEventListener('click', async () => {
        testButton.disabled = true;
        resultDiv.textContent = '';
        
        try {
            // Step 1: Fetch OpenAI key from Supabase
            const openaiKey = await fetchOpenAIKey();

            // Step 2: Make OpenAI API call
            const message = testMessage.value.trim() || 'Hello, can you help me test if this connection is working?';
            const response = await makeOpenAIRequest(openaiKey, message);

            // Step 3: Display result
            await displayResponse(response);

        } catch (error) {
            updateStatus(`Error: ${error.message}`, true);
            console.error('Test Failed:', {
                error: error,
                message: error.message,
                stack: error.stack
            });
        } finally {
            testButton.disabled = false;
        }
    });
});
