/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

/// <reference types="@supabase/supabase-js" />

declare module 'supabaseClient.js' {
  const supabase: any;
  export default supabase;
}

declare module '../supabaseClient.js' {
  const supabase: any;
  export = supabase;
}
