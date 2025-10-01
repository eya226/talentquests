import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Supabase credentials are not defined.

    Please create a .env file in the root of the project with the following content:

    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

    You can get these values from your Supabase project's API settings.
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);