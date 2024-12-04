class SupabaseService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    try {
      console.log('Initializing Supabase client...');
      this.client = supabase.createClient(
        SUPABASE_CONFIG.SUPABASE_URL,
        SUPABASE_CONFIG.SUPABASE_ANON_KEY
      );
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async getOpenAIKey() {
    try {
      console.log('Starting query to private.api_keys table...');
      
      // Explicitly use schema.table format
      const { data, error } = await this.client
        .from('private.api_keys')
        .select('key')
        .eq('key_type', 'openai')
        .single();

      console.log('Query response:', {
        hasData: !!data,
        hasError: !!error,
        fullResponse: { data, error }
      });

      if (error) {
        console.error('Database query error:', {
          error: error,
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      if (!data) {
        console.error('No data returned from query');
        throw new Error('No OpenAI key found');
      }

      console.log('Successfully retrieved OpenAI key');
      return data.key;
    } catch (error) {
      console.error('Error in getOpenAIKey:', {
        error: error,
        message: error.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        stack: error.stack
      });
      throw error;
    }
  }
}

// Create global instance
console.log('Creating SupabaseService instance...');
window.supabaseService = new SupabaseService();
console.log('SupabaseService instance created');
