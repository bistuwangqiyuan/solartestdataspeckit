import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { supabaseMock } from './supabase-mock';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use mock client if environment variables are not set
export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? supabaseMock as any
  : createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'pv-sdm',
        },
      },
    });

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error);
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}