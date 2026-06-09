import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, ownerName, ownerEmail, password, allowedDomains } = body;

    if (!name || !ownerEmail || !password || !allowedDomains) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Supabase connection is not configured." },
        { status: 503 }
      );
    }

    // Check if email exists
    const { data: existing } = await supabaseAdmin
      .from("clinic_registry")
      .select("clinic_id")
      .eq("owner_email", ownerEmail.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, message: "A clinic with this email already exists." },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Generate unique widget token
    const widgetToken = crypto.randomBytes(24).toString("hex");
    
    // Generate a unique clinic ID slug
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 28) || "clinic";
    const clinicId = `clinic_${slug}_${crypto.randomBytes(3).toString("hex")}`;

    const newClinic = {
      clinic_id: clinicId,
      name: name.trim(),
      owner_name: ownerName?.trim() || "",
      owner_email: ownerEmail.toLowerCase().trim(),
      password_hash: passwordHash,
      widget_token: widgetToken,
      allowed_domains: Array.isArray(allowedDomains) ? allowedDomains : allowedDomains.split(",").map(d => d.trim()).filter(Boolean),
      status: "trial", // 14-day trial automatically
      verification_status: "pending",
      plan: "starter",
      feature_toggles: { whiteLabeling: false, customWebhooks: false, csvExport: false },
      widget_config: { primaryColor: "#000000", buttonText: "Start Assessment" }
    };

    const { error } = await supabaseAdmin
      .from("clinic_registry")
      .insert([newClinic]);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Clinic registered successfully. Welcome to your 14-day trial!" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Clinic Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
