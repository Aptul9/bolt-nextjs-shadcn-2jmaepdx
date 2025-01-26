import { supabase } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

async function main() {
  try {
    //must set ENABLE_EMAIL_AUTOCONFIRM=true in the docker .env file
    const { data, error } = await supabase.auth.signUp({
      email: "example4@example.com",
      password: "password",
    });

    if (error) {
      console.error("Supabase Auth Error:", error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      console.error("No user created");
      return;
    }

    const tenantId = uuidv4();

    const { data: tenantData, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        id: tenantId,
        ownerId: userId,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        subscriptionType: "Standard",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .select()
      .single();

    if (tenantError) {
      console.error("Tenant Creation Error:", tenantError.message);
      return;
    }

    console.log("Tenant created:", tenantData);
  } catch (error) {
    console.error("Error in user and tenant creation:", error);
  }
}

main();
