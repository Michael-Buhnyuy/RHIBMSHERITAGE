// src/supabaseClient.d.ts
declare module '../supabaseClient' {
  import { SupabaseClient } from '@supabase/supabase-js';
  const supabase: SupabaseClient;
  export default supabase;
}