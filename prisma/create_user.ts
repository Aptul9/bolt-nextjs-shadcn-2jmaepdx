import { supabase } from "@/lib/supabase/client";

async function main() {

  const { error } = await supabase.auth.signUp({
    email: "example1@example.com",
    password: "password",
  });

  if (error) {
    console.error("Error:", error.message);
    return;
  }
}

main();

//must set ENABLE_EMAIL_AUTOCONFIRM=true in the docker .env file