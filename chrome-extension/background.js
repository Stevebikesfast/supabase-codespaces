// Import Supabase client
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
const SUPABASE_ANON_KEY = 'PeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase client initialized');

// OpenAI key storage
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

// Fetch OpenAI key from Supabase
async function fetchOpenAIKey() {
  try {
    console.log('Fetching OpenAI key from Supabase...');
    const { data, error } = await supabase
      .from('settings')
      .select('key_value')
      .eq('key_name', 'openai_project_key')
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No OpenAI key found in settings');
      throw new Error('OpenAI key not found');
    }

    console.log('Successfully retrieved OpenAI key');
    openaiKey = data.key_value;
    return openaiKey;
  } catch (error) {
    console.error('Error fetching OpenAI key:', error);
    return null;
  }
}

// Make OpenAI API call
async function makeOpenAICall(assistantId, userMessage) {
  console.log('Making OpenAI API call for assistant:', assistantId);
  
  if (!openaiKey) {
    console.log('No OpenAI key found, fetching...');
    await fetchOpenAIKey();
  }

  if (!openaiKey) {
    throw new Error('OpenAI key is missing. Cannot make API call.');
  }

  try {
    console.log('Sending request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are assistant ${assistantId}. Please help the user with their query.`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI API response:', data);

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message);
    }

    const messageContent = data.choices[0]?.message?.content;
    if (!messageContent) {
      console.error('No message content in OpenAI response');
      throw new Error('No response from assistant');
    }

    return messageContent;
  } catch (error) {
    console.error('Error making OpenAI call:', error);
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
