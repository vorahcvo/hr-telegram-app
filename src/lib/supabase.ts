import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/env';

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'hr-telegram-app'
    }
  }
});