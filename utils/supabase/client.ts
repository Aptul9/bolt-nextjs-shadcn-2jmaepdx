import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseKey } from "@/constants/supabaseConfig";
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
