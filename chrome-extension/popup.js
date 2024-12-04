document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.getElementById('testButton');
    const resultDiv = document.getElementById('result');

    // Initialize Supabase client
    const supabase = supabase.createClient(
        'https://gfahskcoysrpfkjcyrpu.supabase.co',
        'PeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYWhza2NveXNycGZramN5cnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzEyNjQsImV4cCI6MjA0ODgwNzI2NH0.fdbimvLKdCboPP6qo2Y7cgxronU1JtMcfBVXV1WhfuA'
    );

    testButton.addEventListener('click', async () => {
        resultDiv.textContent = 'Testing connection...';
        
        try {
            // Test Supabase connection by fetching OpenAI key
            const { data, error } = await supabase
                .from('settings')
                .select('key_value')
                .eq('key_name', 'openai_project_key')
                .single();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('No OpenAI key found in settings table');
            }

            resultDiv.textContent = 'Successfully connected to Supabase and found OpenAI key!';
            console.log('OpenAI key:', data.key_value);

        } catch (error) {
            resultDiv.textContent = 'Error: ' + error.message;
            console.error('Full error:', error);
        }
    });
});
