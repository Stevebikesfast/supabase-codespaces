// auth.js
import { supabase } from './supabaseClient.js'

// Sign up a new user
export const signUp = async (email, password) => {
  try {
    const response = await fetch(`${supabase.supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': supabase.supabaseKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        options: {
          emailRedirectTo: `https://${chrome.runtime.id}.chromiumapp.org/`,
          data: {
            extension_id: chrome.runtime.id
          }
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error signing up:', data.error?.message || data.msg);
      return { 
        user: null, 
        error: { 
          message: data.error?.message || data.msg || 'Failed to sign up'
        }
      };
    }

    return { 
      user: data.user, 
      error: null,
      message: data.user?.confirmation_sent_at 
        ? 'Please check your email for confirmation link'
        : 'Signup successful'
    };
  } catch (err) {
    console.error('Unexpected error during sign up:', err);
    return { 
      user: null, 
      error: { 
        message: err.message || 'An unexpected error occurred during signup'
      }
    };
  }
}

// Sign in an existing user
export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${supabase.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabase.supabaseKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error signing in:', data.error?.message || data.msg);
      return { 
        user: null, 
        error: { 
          message: data.error?.message || data.msg || 'Failed to sign in'
        }
      };
    }

    return { user: data.user, error: null };
  } catch (err) {
    console.error('Unexpected error during sign in:', err);
    return { 
      user: null, 
      error: { 
        message: err.message || 'An unexpected error occurred during signin'
      }
    };
  }
}

// Get current user with session check
export const getUser = async () => {
  try {
    const response = await fetch(`${supabase.supabaseUrl}/auth/v1/user`, {
      headers: {
        'apikey': supabase.supabaseKey,
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { user: null, error: null }; // Not signed in
    }

    return { user: data, error: null };
  } catch (err) {
    console.error('Unexpected error getting user:', err);
    return { 
      user: null, 
      error: { 
        message: err.message || 'An unexpected error occurred getting user'
      }
    };
  }
}

// Sign out current user
export const signOut = async () => {
  try {
    const response = await fetch(`${supabase.supabaseUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'apikey': supabase.supabaseKey,
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Error signing out:', data.error?.message || data.msg);
      return { 
        error: { 
          message: data.error?.message || data.msg || 'Failed to sign out'
        }
      };
    }

    localStorage.removeItem('supabase.auth.token');
    return { error: null };
  } catch (err) {
    console.error('Unexpected error during sign out:', err);
    return { 
      error: { 
        message: err.message || 'An unexpected error occurred during signout'
      }
    };
  }
}

// Handle auth redirect for Chrome extension
export const handleAuthRedirect = async (url) => {
  try {
    const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1]);
    
    if (params.has('access_token')) {
      localStorage.setItem('supabase.auth.token', params.get('access_token'));
      const { user, error } = await getUser();
      
      if (error) {
        console.error('Error getting user after redirect:', error);
        return { session: null, error };
      }

      return { 
        session: { user, access_token: params.get('access_token') }, 
        error: null 
      };
    }

    return { session: null, error: null };
  } catch (err) {
    console.error('Unexpected error handling redirect:', err);
    return { 
      session: null, 
      error: { 
        message: err.message || 'An unexpected error occurred handling redirect'
      }
    };
  }
}
