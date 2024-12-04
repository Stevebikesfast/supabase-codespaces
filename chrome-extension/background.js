const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';
const ASSISTANT_ID = 'asst_ZfHROr8g5jAEZA3HgtpBd4VT';

let cachedOpenAIKey = null;

async function getOpenAIKey() {
    if (cachedOpenAIKey) return cachedOpenAIKey;

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

    cachedOpenAIKey = data[0].key_value;
    return cachedOpenAIKey;
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
        const error = await response.json();
        throw new Error(`Thread creation failed: ${error.error?.message || response.statusText}`);
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
        const error = await response.json();
        throw new Error(`Failed to add message: ${error.error?.message || response.statusText}`);
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
            assistant_id: ASSISTANT_ID
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to run assistant: ${error.error?.message || response.statusText}`);
    }

    return await response.json();
}

async function waitForCompletion(openaiKey, threadId, runId) {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (attempts < maxAttempts) {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'OpenAI-Beta': 'assistants=v1'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Status check failed: ${error.error?.message || response.statusText}`);
        }

        const runStatus = await response.json();

        switch (runStatus.status) {
            case 'completed':
                return true;
            case 'failed':
                throw new Error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
            case 'expired':
                throw new Error('Run expired');
            case 'cancelled':
                throw new Error('Run cancelled');
            default:
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
        }
    }

    throw new Error('Run timed out');
}

async function getMessages(openaiKey, threadId) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get messages: ${error.error?.message || response.statusText}`);
    }

    return await response.json();
}

async function handleAssistantQuery(input) {
    try {
        // Get OpenAI key
        const openaiKey = await getOpenAIKey();
        
        // Create thread
        const thread = await createThread(openaiKey);
        
        // Add user's message
        await addMessage(openaiKey, thread.id, input);
        
        // Run the assistant
        const run = await runAssistant(openaiKey, thread.id);
        
        // Wait for completion
        await waitForCompletion(openaiKey, thread.id, run.id);
        
        // Get messages
        const messages = await getMessages(openaiKey, thread.id);
        
        // Find assistant's response
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        if (!assistantMessage) {
            throw new Error('No response received from assistant');
        }

        return { message: assistantMessage.content[0].text.value };
    } catch (error) {
        console.error('Assistant query error:', error);
        return { error: error.message };
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'query_assistant') {
        handleAssistantQuery(request.input)
            .then(sendResponse)
            .catch(error => sendResponse({ error: error.message }));
        return true; // Will respond asynchronously
    }
});
