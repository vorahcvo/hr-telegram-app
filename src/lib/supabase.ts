import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/env';
import { logger } from '../utils/logger';
import { Database } from '../types/supabase';

// Initialize Supabase client with ANON_KEY
export const supabase = createClient<Database>(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
});

// Initialize Supabase client with SERVICE_ROLE_KEY for server-side like operations (if needed)
// Note: This key should generally not be exposed on the client-side in production.
// It's used here for diagnostic purposes as per user's n8n example.
export const supabaseServiceRole = createClient<Database>(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceRoleKey, {
  auth: {
    persistSession: false, // Service role key should not persist sessions
    autoRefreshToken: false,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
});

// Alias for backward compatibility
export const supabaseAnon = supabase;

export async function testSupabaseConnection(clientType: 'anon' | 'service_role') {
  const client = clientType === 'anon' ? supabase : supabaseServiceRole;
  const key = clientType === 'anon' ? SUPABASE_CONFIG.anonKey : SUPABASE_CONFIG.serviceRoleKey;
  logger.info(`🔌 DEBUG: Тест с ${clientType.toUpperCase()}_KEY`);
  try {
    // Attempt to fetch a non-existent table to test connection without requiring specific data
    const { data, error } = await client.from('users').select('*').limit(1);
    if (error) {
      logger.info(`📊 DEBUG: ${clientType.toUpperCase()}_KEY результат`, { data, error });
      return { success: false, error };
    }
    logger.info(`📊 DEBUG: ${clientType.toUpperCase()}_KEY результат`, { data, error: null });
    return { success: true, data };
  } catch (e: any) {
    logger.info(`📊 DEBUG: ${clientType.toUpperCase()}_KEY результат`, { data: null, error: { message: e.message, details: '', hint: '', code: '' } });
    return { success: false, error: { message: e.message, details: '', hint: '', code: '' } };
  }
}