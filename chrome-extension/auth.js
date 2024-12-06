// auth.js
import { supabase } from './supabaseClient.js'

// Get redirect URL from extension
async function getRedirectUrl() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'get_redirect_url' }, (response) => {
      resolve(response?.url || `https://${chrome.runtime.id}.chromiumapp.org/`)
    })
  })
}

// Sign up a new user
export const signUp = async (email, password) => {
  try {
    const redirectTo = await getRedirectUrl()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          extension_id: chrome.runtime.id
        }
      }
    })

    if (error) {
      console.error('Error signing up:', error.message)
      return { user: null, error }
    }

    if (!data?.user) {
      console.error('No user data received')
      return { 
        user: null, 
        error: { message: 'Failed to create user account' }
      }
    }

    return { 
      user: data.user, 
      error: null,
      message: data.user.confirmation_sent_at 
        ? 'Please check your email for confirmation link'
        : 'Signup successful'
    }
  } catch (err) {
    console.error('Unexpected error during sign up:', err)
    return { 
      user: null, 
      error: { 
        message: err.message || 'An unexpected error occurred during signup'
      }
    }
  }
}

// Sign in an existing user
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Error signing in:', error.message)
      return { user: null, error }
    }

    if (!data?.user) {
      console.error('No user data received')
      return { 
        user: null, 
        error: { message: 'Failed to sign in' }
      }
    }

    return { user: data.user, error: null }
  } catch (err) {
    console.error('Unexpected error during sign in:', err)
    return { 
      user: null, 
      error: { 
        message: err.message || 'An unexpected error occurred during signin'
      }
    }
  }
}

// Get current user with session check
export const getUser = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Error getting session:', sessionError.message)
      return { user: null, error: sessionError }
    }

    if (!session) {
      return { user: null, error: null }
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError.message)
      return { user: null, error: userError }
    }

    if (!user) {
      return { 
        user: null, 
        error: { message: 'No user found' }
      }
    }

    return { user, error: null }
  } catch (err) {
    console.error('Unexpected error getting user:', err)
    return { 
      user: null, 
      error: { 
        message: err.message || 'An unexpected error occurred getting user'
      }
    }
  }
}

// Sign out current user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
      return { error }
    }
    return { error: null }
  } catch (err) {
    console.error('Unexpected error during sign out:', err)
    return { 
      error: { 
        message: err.message || 'An unexpected error occurred during signout'
      }
    }
  }
}

// Handle auth redirect for Chrome extension
export const handleAuthRedirect = async (url) => {
  try {
    // Extract hash or query parameters from URL
    const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1])
    
    // If we have an access token, set the session
    if (params.has('access_token')) {
      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: params.get('access_token'),
        refresh_token: params.get('refresh_token')
      })

      if (error) {
        console.error('Error setting session:', error.message)
        return { session: null, error }
      }

      return { session, error: null }
    }

    // Otherwise check current session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error handling redirect:', error.message)
      return { session: null, error }
    }

    if (session) {
      console.log('User authenticated:', session.user)
      return { session, error: null }
    }

    return { session: null, error: null }
  } catch (err) {
    console.error('Unexpected error handling redirect:', err)
    return { 
      session: null, 
      error: { 
        message: err.message || 'An unexpected error occurred handling redirect'
      }
    }
  }
}
