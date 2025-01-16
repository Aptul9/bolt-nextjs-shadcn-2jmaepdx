import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from '@/constants/supabaseConfig';

export const supabase = createClient(supabaseUrl, supabaseKey);