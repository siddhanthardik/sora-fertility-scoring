import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Supabase connection is not configured." },
        { status: 503 }
      );
    }

    // 1. Find clinic by token and verify expiration
    const { data: clinic, error } = await supabaseAdmin
      .from("clinic_registry")
      .select("clinic_id, reset_token_expires, status")
      .eq("reset_token", token)
      .single();

    if (error || !clinic) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    if (clinic.status === "blocked") {
      return NextResponse.json({ success: false, message: "This account has been blocked." }, { status: 403 });
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(clinic.reset_token_expires);
    if (now > expiresAt) {
      return NextResponse.json(
        { success: false, message: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 2. Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // 3. Update password and clear token
    const { error: updateError } = await supabaseAdmin
      .from("clinic_registry")
      .update({
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expires: null
      })
      .eq("clinic_id", clinic.clinic_id);

    if (updateError) {
      console.error("Failed to update password:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Password updated successfully." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
