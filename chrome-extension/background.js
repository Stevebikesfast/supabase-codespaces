// Import Supabase client from local file
importScripts('libs/supabase.js');

// Initialize the Supabase client
const supabase = supabaseJs.createClient(
  'https://gfahskcoysrpfkjcyrpu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA'
);

console.log('Supabase client initialized in background script');

async function fetchOpenAIKey() {
  try {
    console.log('Fetching OpenAI key from Supabase...');

    // Query the 'settings' table to get the OpenAI project key
    const { data, error } = await supabase
      .from('settings')
      .select('key_value')
      .eq('key_name', 'openai_project_key')
      .single();

    // Check for errors or missing data
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    if (!data) {
      throw new Error('Could not find OpenAI key in settings table');
    }

    console.log('Successfully fetched OpenAI key');
    return data.key_value;
  } catch (error) {
    console.error('Error fetching OpenAI key:', error);
    throw error;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_OPENAI_KEY') {
    fetchOpenAIKey()
      .then(key => {
        sendResponse({ success: true, key });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});
