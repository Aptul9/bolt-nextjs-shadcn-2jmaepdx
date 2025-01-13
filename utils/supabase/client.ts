import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://oneffsurlihlqrudjuzc.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZWZmc3VybGlobHFydWRqdXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTc1ODAsImV4cCI6MjA1MTU5MzU4MH0.oQxC6X3BjWavWQpsgBFHw0dsWZ3nJfHmyJyIBNY24y4"
  );
}
