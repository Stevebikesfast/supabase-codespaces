// supabaseClient.js
import { createClient } from './lib/supabase-js.js';

// Supabase configuration
const supabaseUrl = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export a function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error('Unexpected error checking Supabase connection:', err);
    return { success: false, error: err };
  }
};

// Export the redirect URL for use in auth functions
export const getRedirectUrl = () => {
  return `https://${chrome.runtime.id}.chromiumapp.org/`;
};
