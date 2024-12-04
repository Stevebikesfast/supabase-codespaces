// Import Supabase client from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

class SupabaseService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    try {
      this.client = createClient(
        SUPABASE_CONFIG.SUPABASE_URL,
        SUPABASE_CONFIG.SUPABASE_ANON_KEY
      );
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }

  async fetchOpenAIKey() {
    try {
      const { data, error } = await this.client
        .from('config')
        .select('openai_key')
        .single();

      if (error) throw error;
      return data.openai_key;
    } catch (error) {
      console.error('Error fetching OpenAI key:', error);
      throw error;
    }
  }
}

// Export the singleton instance
export const supabaseService = new SupabaseService();
