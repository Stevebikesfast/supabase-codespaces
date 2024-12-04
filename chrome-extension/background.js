// Initialize Supabase client
let supabaseClient = null;

// Initialize OpenAI client
let openaiKey = null;

// Assistant IDs mapping
const ASSISTANTS = {
  'David': 'ZfHROr8g5jAEZA3HgtpBd4VT',
  'James': 'KU36EdfB300bU6thcFGloMC3',
  'Maya': 'TiwJg7g4ADVOc304Z6btxcSN',
  'Marcus': 'mLuXIK4Dq9EvEgiAuWX89yja',
  'Sarah': 'qnef4J22UaggREIffmdJ60Ye',
  'Alex': 'SEpK5PwswVJmYKIObjwiYttw'
};

// Initialize Supabase client
async function initSupabase() {
  if (!supabaseClient) {
    const { createClient } = supabase;
    supabaseClient = createClient(
      'https://gfahskcoysrpfkjcyrpu.supabase.co',
      'PeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA'
    );
  }
  return supabaseClient;
}

// Fetch OpenAI key from Supabase
async function fetchOpenAIKey() {
  try {
    const supabase = await initSupabase();
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key_name', 'openai_project_key')
      .single();

    if (error) throw error;
    if (!data) throw new Error('OpenAI key not found');

    openaiKey = data.value;
    return true;
  } catch (error) {
    console.error('Error fetching OpenAI key:', error);
    return false;
  }
}

// Make OpenAI API call
async function makeOpenAICall(assistantId, userMessage) {
  if (!openaiKey) {
    await fetchOpenAIKey();
  }

  try {
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
            content: `You are assistant ${assistantId}. Please help the user with their query.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from assistant';
  } catch (error) {
    console.error('Error making OpenAI call:', error);
    throw error;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_ASSISTANTS') {
    sendResponse({ assistants: Object.keys(ASSISTANTS) });
  }
  
  if (request.type === 'SEND_MESSAGE') {
    makeOpenAICall(ASSISTANTS[request.assistant], request.message)
      .then(response => sendResponse({ success: true, response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
});
