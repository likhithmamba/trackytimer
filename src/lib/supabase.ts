import { createClient } from '@supabase/supabase-js';

// These environment variables must be set in .env.local
// SUPABASE_URL: Your project URL (e.g., https://xyz.supabase.co)
// SUPABASE_SERVICE_ROLE_KEY: The secret key for server-side access (NEVER expose to client)

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    // In development/build, we might not have keys yet.
    // We allow instantiation but warn.
    console.warn('Supabase keys missing. DB calls will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
