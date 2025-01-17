"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("code");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setMessage({
        type: "error",
        content:
          "Invalid or missing reset token. Please request a new password reset link.",
      });
    }
  }, [token]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      setMessage({
        type: "error",
        content:
          "Invalid or missing token. Please request a new password reset link.",
      });
      setIsLoading(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        content: "Password reset successfully! Redirecting to login...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        content:
          error instanceof Error ? error.message : "Failed to reset password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form className="space-y-4" onSubmit={handleResetPassword} noValidate>
      {message && (
        <Alert
          className={
            message.type === "success"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }
        >
          <AlertDescription
            className={
              message.type === "success" ? "text-green-800" : "text-red-800"
            }
          >
            {message.content}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-base sm:text-lg">
          New Password
        </Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`h-10 sm:h-12 text-base sm:text-lg ${
            passwordError ? "border-red-500" : ""
          }`}
          disabled={isLoading || !token}
          placeholder="Enter your new password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-base sm:text-lg">
          Confirm Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`h-10 sm:h-12 text-base sm:text-lg ${
            passwordError ? "border-red-500" : ""
          }`}
          disabled={isLoading || !token}
          placeholder="Confirm your new password"
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full h-10 sm:h-12 text-base sm:text-lg"
          disabled={isLoading || !token}
        >
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </Button>

        <Button
          type="button"
          variant="link"
          className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] underline hover:text-gray-800"
          onClick={() => router.push("/login")}
        >
          Back to Sign In
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex min-h-screen items-center justify-center sm:bg-gray-50 p-5 max-sm:p-8">
      <div className="w-full sm:hidden space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500">Enter your new password below</p>
        </div>
        {formContent}
      </div>

      <Card className="hidden sm:block w-full max-w-lg pt-4 px-4">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Reset Password</CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
