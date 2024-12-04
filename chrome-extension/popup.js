document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assistant-form');
    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const responseDiv = document.getElementById('response');

    const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';
    const DAVID_ASSISTANT_ID = 'asst_ZfHROr8g5jAEZA3HgtpBd4VT';

    async function fetchOpenAIKey() {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=key_value&key_name=eq.openai_project_key`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch OpenAI key from Supabase');
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error('OpenAI key not found in settings');
        }

        return data[0].key_value;
    }

    async function createThread(openaiKey) {
        const response = await fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`,
                'OpenAI-Beta': 'assistants=v1'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to create thread');
        }

        return await response.json();
    }

    async function addMessage(openaiKey, threadId, content) {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`,
                'OpenAI-Beta': 'assistants=v1'
            },
            body: JSON.stringify({
                role: 'user',
                content: content
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add message to thread');
        }

        return await response.json();
    }

    async function runAssistant(openaiKey, threadId) {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`,
                'OpenAI-Beta': 'assistants=v1'
            },
            body: JSON.stringify({
                assistant_id: DAVID_ASSISTANT_ID
            })
        });

        if (!response.ok) {
            throw new Error('Failed to run assistant');
        }

        return await response.json();
    }

    async function checkRunStatus(openaiKey, threadId, runId) {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'OpenAI-Beta': 'assistants=v1'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to check run status');
        }

        return await response.json();
    }

    async function getMessages(openaiKey, threadId) {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'OpenAI-Beta': 'assistants=v1'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get messages');
        }

        return await response.json();
    }

    async function waitForCompletion(openaiKey, threadId, runId) {
        while (true) {
            const runStatus = await checkRunStatus(openaiKey, threadId, runId);
            if (runStatus.status === 'completed') {
                return true;
            } else if (runStatus.status === 'failed') {
                throw new Error('Assistant run failed');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async function handleQuery(query) {
        try {
            responseDiv.textContent = 'Connecting to assistant...';
            submitButton.disabled = true;

            // Get OpenAI key
            const openaiKey = await fetchOpenAIKey();
            
            // Create a thread
            const thread = await createThread(openaiKey);
            
            // Add user's message
            await addMessage(openaiKey, thread.id, query);
            
            // Run the assistant
            responseDiv.textContent = 'David is thinking...';
            const run = await runAssistant(openaiKey, thread.id);
            
            // Wait for completion
            await waitForCompletion(openaiKey, thread.id, run.id);
            
            // Get messages
            const messages = await getMessages(openaiKey, thread.id);
            
            // Get assistant's response (first message is the most recent)
            const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
            if (!assistantMessage) {
                throw new Error('No response from assistant');
            }

            return assistantMessage.content[0].text.value;

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const query = userInput.value.trim();
        if (!query) return;

        try {
            const response = await handleQuery(query);
            responseDiv.textContent = response;
        } catch (error) {
            responseDiv.textContent = `Error: ${error.message}`;
            responseDiv.classList.add('error');
        } finally {
            submitButton.disabled = false;
        }
    });
});
