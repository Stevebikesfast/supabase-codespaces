// This is a simplified version of the Supabase client for the Chrome extension
export const createClient = (supabaseUrl, supabaseKey, options = {}) => {
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  };

  const auth = {
    signUp: async ({ email, password, options = {} }) => {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, ...options })
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
            ...headers,
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

    getSession: async () => {
      try {
        const session = await chrome.storage.local.get('supabase_session');
        return { data: { session: session.supabase_session || null }, error: null };
      } catch (error) {
        return { data: { session: null }, error };
      }
    },

    getUser: async () => {
      try {
        const session = await chrome.storage.local.get('supabase_session');
        if (!session.supabase_session) {
          return { data: { user: null }, error: null };
        }
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            ...headers,
            'Authorization': `Bearer ${session.supabase_session.access_token}`
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
        await chrome.storage.local.remove('supabase_session');
        return { error: null };
      } catch (error) {
        return { error };
      }
    }
  };

  return {
    auth,
    from: (table) => ({
      select: (columns = '*') => ({
        single: async () => {
          try {
            const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&limit=1`, {
              headers
            });
            const data = await response.json();
            if (!response.ok) throw data;
            return { data: data[0], error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    })
  };
};
