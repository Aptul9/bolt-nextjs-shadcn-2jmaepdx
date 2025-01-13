// utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oneffsurlihlqrudjuzc.supabase.co"
// const supabase_key = process.env.NEXT_PUBLIC_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZWZmc3VybGlobHFydWRqdXpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjAxNzU4MCwiZXhwIjoyMDUxNTkzNTgwfQ.XFVk8dOfDh3tBgYmSZGAL5ZDSuRNWMQnpk9kwCh-beE"
const supabase_key = process.env.NEXT_PUBLIC_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZWZmc3VybGlobHFydWRqdXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTc1ODAsImV4cCI6MjA1MTU5MzU4MH0.oQxC6X3BjWavWQpsgBFHw0dsWZ3nJfHmyJyIBNY24y4"
export const supabase = createClient(supabase_url, supabase_key)