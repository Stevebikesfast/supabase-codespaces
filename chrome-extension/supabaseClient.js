// supabaseClient.js
import { createClient } from './lib/supabase-js.js'

// Supabase configuration
const supabaseUrl = 'https://gfahskcoysrpfkjcyrpu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA';

// Initialize the Supabase client
export const supabase = {
  supabaseUrl,
  supabaseKey,
  auth: {
    signUp: async ({ email, password, options }) => {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, options })
        });
        
        const data = await response.json();
        if (!response.ok) throw data;
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    signInWithPassword: async ({ email, password }) => {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (!response.ok) throw data;
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    getUser: async () => {
      try {
        const token = localStorage.getItem('supabase.auth.token');
        if (!token) return { data: { user: null }, error: null };

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (!response.ok) throw data;
        return { data: { user: data }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },

    signOut: async () => {
      try {
        const token = localStorage.getItem('supabase.auth.token');
        if (!token) return { error: null };

        const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw data;
        }

        localStorage.removeItem('supabase.auth.token');
        return { error: null };
      } catch (error) {
        return { error };
      }
    },

    getSession: async () => {
      try {
        const token = localStorage.getItem('supabase.auth.token');
        if (!token) return { data: { session: null }, error: null };

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${token}`
          }
        });
        
        const user = await response.json();
        if (!response.ok) throw user;

        return { 
          data: { 
            session: { 
              user,
              access_token: token 
            }
          }, 
          error: null 
        };
      } catch (error) {
        return { data: { session: null }, error };
      }
    }
  }
};
