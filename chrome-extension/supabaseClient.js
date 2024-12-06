// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://gfahskcoysrpfkjcyrpu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA'

// Chrome extension ID
const extensionId = 'cfieicihcnkackalakpoceehceollknm'
const redirectUrl = `https://${extensionId}.chromiumapp.org/`

// Initialize the Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'chrome-extension'
    }
  },
  db: {
    schema: 'public'
  }
})

// Export a function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  try {
    // Try a simple public table query first
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .single()
    
    if (error) {
      console.error('Supabase connection error:', error.message)
      return { success: false, error }
    }
    
    return { success: true, error: null }
  } catch (err) {
    console.error('Unexpected error checking Supabase connection:', err)
    return { success: false, error: err }
  }
}

// Export the redirect URL for use in auth functions
export const getRedirectUrl = () => redirectUrl
