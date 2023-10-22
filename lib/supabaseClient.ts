import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_API as string);