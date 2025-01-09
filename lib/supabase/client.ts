import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oneffsurlihlqrudjuzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZWZmc3VybGlobHFydWRqdXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTc1ODAsImV4cCI6MjA1MTU5MzU4MH0.oQxC6X3BjWavWQpsgBFHw0dsWZ3nJfHmyJBNY24y4';

export const supabase = createClient(supabaseUrl, supabaseKey);