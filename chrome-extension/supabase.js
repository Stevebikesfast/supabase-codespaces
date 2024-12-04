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

// Create a singleton instance
const supabaseService = new SupabaseService();
