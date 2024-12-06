// background.js
import { handleAuthRedirect } from './auth.js'
import { supabase } from './supabaseClient.js'

// Handle auth redirects
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes('chromiumapp.org')) {
    // Close the auth tab
    chrome.tabs.remove(tabId)
    // Handle the auth redirect
    handleAuthRedirect(changeInfo.url)
  }
})

// Get the extension's redirect URL
function getRedirectURL() {
  return `https://${chrome.runtime.id}.chromiumapp.org/`
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'query_assistant') {
    try {
      // Check auth status first
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        sendResponse({ error: 'Authentication error: ' + authError.message })
        return true
      }

      if (!session && !request.context.isPaid) {
        // Allow free tier access without auth
        handleFreeQuery(request, sendResponse)
        return true
      }

      if (!session) {
        sendResponse({ error: 'Please sign in to access this feature' })
        return true
      }

      // Handle the assistant query
      const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=key_value&key_name=eq.openai_project_key`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get OpenAI key')
      }

      const settings = await response.json()
      const openaiKey = settings[0]?.key_value

      if (!openaiKey) {
        throw new Error('OpenAI key not found')
      }

      // Create thread
      const thread = await createThread(openaiKey)
      console.log('Thread created:', thread.id)

      // Add user's message
      await addMessage(openaiKey, thread.id, request.input)
      console.log('Message added to thread')

      // Run the assistant
      const run = await runAssistant(openaiKey, thread.id)
      console.log('Assistant run started:', run.id)

      // Wait for completion
      await waitForCompletion(openaiKey, thread.id, run.id)
      console.log('Run completed')

      // Get messages
      const messages = await getMessages(openaiKey, thread.id)
      console.log('Messages retrieved')

      // Send the last assistant message
      const lastAssistantMessage = messages.data
        .filter(msg => msg.role === 'assistant')
        .pop()

      sendResponse({ message: lastAssistantMessage?.content[0]?.text?.value || 'No response from assistant' })

    } catch (error) {
      console.error('Error:', error)
      sendResponse({ error: error.message })
    }
    return true
  }

  // Handle auth-related messages
  if (request.action === 'get_redirect_url') {
    sendResponse({ url: getRedirectURL() })
    return true
  }
})

// Helper function for free tier queries
async function handleFreeQuery(request, sendResponse) {
  try {
    if (request.context.assistant !== 'james') {
      sendResponse({ error: 'This assistant requires a paid subscription' })
      return
    }
    
    // Process free tier query...
    // Add your free tier logic here
    
    sendResponse({ message: 'Free tier response' })
  } catch (error) {
    console.error('Error in free query:', error)
    sendResponse({ error: error.message })
  }
}

// OpenAI helper functions
async function createThread(openaiKey) {
  const response = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  })
  return response.json()
}

async function addMessage(openaiKey, threadId, content) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({ role: 'user', content })
  })
  return response.json()
}

async function runAssistant(openaiKey, threadId) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({ assistant_id: 'asst_abc123' }) // Replace with actual assistant ID
  })
  return response.json()
}

async function waitForCompletion(openaiKey, threadId, runId) {
  const maxAttempts = 10
  let attempts = 0
  while (attempts < maxAttempts) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    const run = await response.json()
    if (run.status === 'completed') {
      return run
    }
    if (run.status === 'failed') {
      throw new Error('Assistant run failed')
    }
    attempts++
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  throw new Error('Timeout waiting for assistant response')
}

async function getMessages(openaiKey, threadId) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  })
  return response.json()
}
