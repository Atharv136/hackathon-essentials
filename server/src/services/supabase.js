import { createClient } from '@supabase/supabase-js';
import config from '../config/env.js';

const supabaseUrl = config.supabase.url;
// Use service role key if available, otherwise fallback to anon key
const supabaseKey = config.supabase.serviceRoleKey || config.supabase.anonKey || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.startsWith('https://your-')
);

export const supabaseServer = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export default supabaseServer;
