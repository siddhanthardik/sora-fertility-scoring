import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseClient";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Supabase connection is not configured." },
        { status: 503 }
      );
    }

    // 1. Check if user exists
    const { data: clinic, error } = await supabaseAdmin
      .from("clinic_registry")
      .select("clinic_id, owner_email, status, name")
      .eq("owner_email", email.toLowerCase())
      .single();

    if (error || !clinic) {
      // Return 200 anyway for security (don't leak which emails are registered)
      return NextResponse.json({ success: true, message: "If an account exists, a reset link was sent." });
    }

    if (clinic.status === "blocked") {
      return NextResponse.json({ success: false, message: "This account has been blocked." }, { status: 403 });
    }

    // 2. Generate token and expiration (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000).toISOString();

    // 3. Save token in DB
    const { error: updateError } = await supabaseAdmin
      .from("clinic_registry")
      .update({
        reset_token: resetToken,
        reset_token_expires: expires
      })
      .eq("clinic_id", clinic.clinic_id);

    if (updateError) {
      console.error("Failed to save reset token:", updateError);
      return NextResponse.json({ success: false, message: "Failed to generate reset link." }, { status: 500 });
    }

    // 4. Send Email using existing Nodemailer setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // True for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetLink = `${origin}/clinic/reset-password?token=${resetToken}`;

    const smtpFrom = process.env.SMTP_FROM || `"SORA Fertility" <${process.env.SMTP_USER}>`;

    const mailOptions = {
      from: smtpFrom,
      to: clinic.owner_email,
      subject: "Password Reset Request - SORA Clinic",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2F4F4F;">Password Reset Request</h2>
          <p>Hello ${clinic.name},</p>
          <p>We received a request to reset the password for your clinic dashboard account.</p>
          <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #5F7D67; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 12px; color: #777;">SORA Fertility</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Reset link sent successfully." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
