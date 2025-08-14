import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/env';

// Создаем клиент с SERVICE_ROLE_KEY для обхода возможных ограничений
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceRoleKey, {
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

// Также создаем клиент с ANON_KEY для сравнения
export const supabaseAnon = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
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