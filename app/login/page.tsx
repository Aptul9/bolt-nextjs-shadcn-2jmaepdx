"use client";
import React, { useState } from "react";
import { login } from "@/app/login/actions";
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
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [isResetMode, setIsResetMode] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const toggleMode = () => {
    setIsResetMode(!isResetMode);
    setEmailError(null);
    setPasswordError(null);
    setResetEmailSent(false);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.trim() !== "";
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    if (hasSubmitted) {
      if (validateEmail(email)) {
        setEmailError(null);
      } else {
        setEmailError("Please enter a valid email address.");
      }
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    if (hasSubmitted) {
      if (validatePassword(password)) {
        setPasswordError(null);
      } else {
        setPasswordError("Password cannot be empty.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setIsLoading(true);
    setLoginError(null); // Clear any previous login errors

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!isResetMode && !validatePassword(password)) {
      setPasswordError("Password cannot be empty.");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (isValid) {
      try {
        if (!isResetMode) {
          const result = await login(formData);
          if (result?.error) {
            setLoginError(result.error);
          }
          // If no error, the server action will handle the redirect
        } else {
          const supabase = createClient();
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login/passwordreset`,
          });

          if (error) {
            setLoginError("Failed to send reset email. Please try again.");
          } else {
            setResetEmailSent(true);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setLoginError("An unexpected error occurred. Please try again.");
      }
    }
    setIsLoading(false);
  };

  const formContent = (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {loginError && (
        <Alert className="bg-red-50 border-red-200 mb-4">
          <AlertDescription className="text-red-800">
            {loginError}
          </AlertDescription>
        </Alert>
      )}

      {resetEmailSent && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <AlertDescription className="text-green-800">
            Check your email for password reset instructions.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-base sm:text-lg">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          className={`h-10 sm:h-12 text-base sm:text-lg ${
            emailError ? "border-red-500" : ""
          }`}
          onChange={handleEmailChange}
          disabled={isLoading}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isResetMode && (
          <motion.div
            key="password-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="password" className="text-base sm:text-lg">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className={`h-10 sm:h-12 text-base sm:text-lg ${
                passwordError ? "border-red-500" : ""
              }`}
              onChange={handlePasswordChange}
              disabled={isLoading}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full h-10 sm:h-12 text-base sm:text-lg"
          disabled={isLoading}
        >
          {isLoading
            ? "Loading..."
            : isResetMode
            ? "Send Reset Link"
            : "Sign In"}
        </Button>

        <Button
          type="button"
          variant="link"
          className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] underline hover:text-gray-800"
          onClick={toggleMode}
          disabled={isLoading}
        >
          {isResetMode ? "Back to Sign In" : "Forgot Password?"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex min-h-screen items-center justify-center sm:bg-gray-50 p-5 max-sm:p-8">
      <div className="w-full sm:hidden space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isResetMode ? "Reset Password" : "Sign In"}
          </h1>
          <p className="text-sm text-gray-500">
            {isResetMode
              ? "Enter your email to receive reset instructions"
              : "Enter your credentials to access your account"}
          </p>
        </div>
        {formContent}
      </div>

      <Card className="hidden sm:block w-full max-w-lg pt-4 px-4">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">
            {isResetMode ? "Reset Password" : "Sign In"}
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            {isResetMode
              ? "Enter your email to receive reset instructions"
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    </div>
  );
}
