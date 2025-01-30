"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { sendEmail } from "@/app/actions/sendEmail"; // Import the server action

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: ""
  });
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Added state for feedback message
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      const result = await sendEmail(formData);
      
      if (result.success) {
        setFeedbackMessage("Your message has been sent successfully! We'll get back to you soon.");
        setFormData({ email: "", phone: "", message: "" });
      } else {
        setFeedbackMessage("There was an error sending your message. Please try again later.");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen pt-24 pb-12 bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
              <p className="text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="How can we help you?"
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            {/* Display feedback message here */}
            {feedbackMessage && (
              <div className="mt-6 text-center">
                <p className="text-lg font-medium">{feedbackMessage}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
