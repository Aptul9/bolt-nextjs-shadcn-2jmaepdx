// utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAdminKey } from "@/constants/supabaseConfig";

export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey);
