class SupabaseService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    try {
      this.client = supabase.createClient(
        SUPABASE_CONFIG.SUPABASE_URL,
        SUPABASE_CONFIG.SUPABASE_ANON_KEY
      );
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }

  async getOpenAIKey() {
    try {
      const { data, error } = await this.client
        .from('private.api_keys')
        .select('key')
        .eq('key_type', 'openai')
        .single();

      if (error) throw error;
      return data.key;
    } catch (error) {
      console.error('Error fetching OpenAI key:', error);
      throw error;
    }
  }
}

// Create global instance
window.supabaseService = new SupabaseService();
