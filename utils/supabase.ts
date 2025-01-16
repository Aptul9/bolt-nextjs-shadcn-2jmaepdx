// utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseKey } from "@/constants/supabaseConfig";

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
