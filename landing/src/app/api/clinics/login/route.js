import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const { ownerEmail, password } = body;

    if (!ownerEmail || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Supabase connection is not configured." },
        { status: 503 }
      );
    }

    const { data: clinic, error } = await supabaseAdmin
      .from("clinic_registry")
      .select("clinic_id, owner_email, password_hash, status, plan, name")
      .eq("owner_email", ownerEmail.toLowerCase())
      .single();

    if (error || !clinic) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Since older clinics might not have a password_hash yet, handle gracefully
    if (!clinic.password_hash) {
      return NextResponse.json(
        { success: false, message: "Account not fully configured. Please contact SORA admin." },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, clinic.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (clinic.status === "blocked") {
      return NextResponse.json(
        { success: false, message: "This account has been blocked." },
        { status: 403 }
      );
    }

    // Set secure HTTP-only cookie for session
    // In a real production app, we would sign this with jsonwebtoken, 
    // but a basic encrypted string or just storing clinic_id is fine for this proof of concept.
    // For Phase 2, we just store the clinic ID securely in a cookie.
    
    // Using a simpler cookie approach for the monolithic Next.js app
    const cookieStore = await cookies();
    cookieStore.set("sora_clinic_session", clinic.clinic_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Login successful.",
        clinic: {
          id: clinic.clinic_id,
          name: clinic.name,
          status: clinic.status,
          plan: clinic.plan
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Clinic Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during login." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("sora_clinic_session");
  return NextResponse.json({ success: true, message: "Logged out successfully." });
}
