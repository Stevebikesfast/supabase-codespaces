// setupProfiles.js
import { supabase } from './supabaseClient.js'

async function setupProfiles() {
  console.log('Setting up profiles table and trigger...\n')

  try {
    // Step 1: Create profiles table
    console.log('Creating profiles table...')
    const { error: tableError } = await supabase.rpc('setup_profiles', {
      sql: `
        -- Create profiles table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );

        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
          ) THEN
            CREATE POLICY "Users can view own profile" 
              ON public.profiles FOR SELECT 
              USING (auth.uid() = id);
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
          ) THEN
            CREATE POLICY "Users can update own profile" 
              ON public.profiles FOR UPDATE 
              USING (auth.uid() = id);
          END IF;
        END $$;

        -- Create trigger function
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger AS $$
        BEGIN
          INSERT INTO public.profiles (id)
          VALUES (new.id);
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Create trigger
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
          ) THEN
            CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW
              EXECUTE FUNCTION public.handle_new_user();
          END IF;
        END $$;

        -- Grant permissions
        GRANT ALL ON public.profiles TO authenticated;
        GRANT ALL ON public.profiles TO service_role;
      `
    })

    if (tableError) {
      console.error('❌ Error setting up profiles:', tableError)
      console.log('\nTrying alternative setup method...')
      
      // Try direct SQL execution
      const { error: directError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
          );
        `
      })

      if (directError) {
        console.error('❌ Direct SQL execution failed:', directError)
        console.log('\nRequired Manual Steps:')
        console.log('1. Go to Supabase SQL Editor')
        console.log('2. Run the following SQL:')
        console.log(`
          -- Create profiles table
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
          );

          -- Enable RLS
          ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

          -- Create policies
          CREATE POLICY "Users can view own profile" 
            ON public.profiles FOR SELECT 
            USING (auth.uid() = id);

          CREATE POLICY "Users can update own profile" 
            ON public.profiles FOR UPDATE 
            USING (auth.uid() = id);

          -- Create trigger function
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS trigger AS $$
          BEGIN
            INSERT INTO public.profiles (id)
            VALUES (new.id);
            RETURN new;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;

          -- Create trigger
          CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_new_user();

          -- Grant permissions
          GRANT ALL ON public.profiles TO authenticated;
          GRANT ALL ON public.profiles TO service_role;
        `)
        return
      }
    }

    console.log('✅ Profiles table and trigger set up successfully!\n')
    console.log('Next Steps:')
    console.log('1. Try signing up a new user')
    console.log('2. Verify profile is created automatically')
    console.log('3. Test authentication flow')

  } catch (err) {
    console.error('Unexpected error during setup:', err)
  }
}

// Run the setup
setupProfiles()
