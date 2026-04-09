/**
 * Supabase Client Configuration
 * 
 * Replace the URL and PUBLIC_KEY below with your Supabase project credentials.
 * Get them from your Supabase dashboard: Settings > API
 */

const SUPABASE_URL = "https://xmejpqnvwhciwzqywwuf.supabase.co"; // ← PASTE YOUR SUPABASE URL HERE
const SUPABASE_PUBLIC_KEY = "sb_publishable_RWinx5KSh8WvThLgaOeEqQ_2exkvbzD";

import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)

