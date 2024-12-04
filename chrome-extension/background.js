// Assistant IDs mapping
const ASSISTANTS = {
  'David': 'ZfHROr8g5jAEZA3HgtpBd4VT',
  'James': 'KU36EdfB300bU6thcFGloMC3',
  'Maya': 'TiwJg7g4ADVOc304Z6btxcSN',
  'Marcus': 'mLuXIK4Dq9EvEgiAuWX89yja',
  'Sarah': 'qnef4J22UaggREIffmdJ60Ye',
  'Alex': 'SEpK5PwswVJmYKIObjwiYttw'
};

// Supabase configuration
const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
const SUPABASE_ANON_KEY = 'PeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

// Initialize Supabase client
let supabaseClient = null;
let openaiKey = null;

// Function to initialize Supabase client
async function initSupabase() {
  if (!supabaseClient) {
    console.log('Initializing Supabase client...');
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized');
  }
  return supabaseClient;
}

// Function to fetch OpenAI key from settings table
async function fetchOpenAIKey() {
  try {
    console.log('Fetching OpenAI key from settings table...');
    const client = await initSupabase();
    const { data, error } = await client
      .from('settings')
      .select('key_value')
      .eq('key_name', 'openai_project_key')
      .single();

    if (error) {
      console.error('Error fetching OpenAI key:', error);
      throw error;
    }

    if (!data) {
      console.error('No OpenAI key found in settings table');
      throw new Error('OpenAI key not found');
    }

    openaiKey = data.key_value;
    console.log('Successfully retrieved OpenAI key');
    return openaiKey;
  } catch (error) {
    console.error('Error in fetchOpenAIKey:', error);
    throw error;
  }
}

// Function to make OpenAI API call
async function makeOpenAICall(assistantId, userMessage) {
  try {
    if (!openaiKey) {
      await fetchOpenAIKey();
    }

    console.log('Making OpenAI API call for assistant:', assistantId);
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
    console.log('OpenAI API response:', data);

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.choices[0]?.message?.content || 'No response from assistant';
  } catch (error) {
    console.error('Error in makeOpenAICall:', error);
    throw error;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);

  if (request.type === 'GET_ASSISTANTS') {
    console.log('Sending assistants list');
    sendResponse({ assistants: Object.keys(ASSISTANTS) });
  }
  
  if (request.type === 'SEND_MESSAGE') {
    console.log('Processing message for assistant:', request.assistant);
    makeOpenAICall(ASSISTANTS[request.assistant], request.message)
      .then(response => {
        console.log('Successfully got response from OpenAI');
        sendResponse({ success: true, response });
      })
      .catch(error => {
        console.error('Error processing message:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});
