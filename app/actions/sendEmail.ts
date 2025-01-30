"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: { email: string; phone: string; message: string }) {
  try {
    const response = await resend.emails.send({
      from: "team@passcore.it",
      to: "aptul99@gmail.com",
      subject: "New Contact Form Submission",
      html: `
        <h2>New Message from Contact Form</h2>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `,
    });

    return { success: true, response };
  } catch (error) {
    console.error("Resend error:", error);
    return { success: false, error };
  }
}
