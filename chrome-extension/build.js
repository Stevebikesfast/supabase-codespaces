import { copyFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function copySupabaseClient() {
    try {
        // Create libs directory if it doesn't exist
        await mkdir(join(__dirname, 'libs'), { recursive: true });

        // Copy Supabase client
        await copyFile(
            join(__dirname, 'node_modules/@supabase/supabase-js/dist/umd/supabase.js'),
            join(__dirname, 'libs/supabase.js')
        );

        console.log('Successfully copied Supabase client');
    } catch (error) {
        console.error('Error copying files:', error);
        process.exit(1);
    }
}

copySupabaseClient();
