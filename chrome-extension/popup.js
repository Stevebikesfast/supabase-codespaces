document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('testButton');
    const testMessage = document.getElementById('testMessage');
    const resultDiv = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    function updateStatus(message, isError = false) {
        statusDiv.textContent = message;
        statusDiv.style.color = isError ? 'red' : 'black';
        console.log(`Status: ${message}`);
    }

    async function getOpenAIKey() {
        updateStatus('Step 1/3: Fetching OpenAI key from Supabase...');
        
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: 'GET_OPENAI_KEY' }, response => {
                if (response.success) {
                    console.log('Successfully retrieved OpenAI key');
                    updateStatus('✓ Step 1/3: Successfully retrieved OpenAI key from Supabase');
                    resolve(response.key);
                } else {
                    console.error('Error getting OpenAI key:', response.error);
                    reject(new Error(response.error));
                }
            });
        });
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
            // Step 1: Fetch OpenAI key from Supabase via background script
            const openaiKey = await getOpenAIKey();

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
