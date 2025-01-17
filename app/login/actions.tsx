"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return the error message instead of redirecting
    return {
      error: getErrorMessage(error.message)
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// Helper function to get user-friendly error messages
function getErrorMessage(error: string): string {
  switch (error) {
    case "Invalid login credentials":
      return "Invalid email or password. Please try again.";
    case "Email not confirmed":
      return "Please verify your email address before logging in.";
    default:
      return "An error occurred during login. Please try again.";
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  // Extract data from the form
  const data = {
    token: formData.get("token") as string,
    newPassword: formData.get("newPassword") as string,
  };

  // Validate inputs
  if (!data.token || !data.newPassword) {
    redirect("/error?message=Invalid input");
  }

  // Update the user's password
  const { error } = await supabase.auth.updateUser(
    { password: data.newPassword },
  );

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/login"); // Redirect to login after successful password reset
}