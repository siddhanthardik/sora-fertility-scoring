import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const clinicId = cookieStore.get("sora_clinic_session")?.value;

    if (!clinicId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { data: clinic, error } = await supabaseAdmin
      .from("clinic_registry")
      .select("name, owner_name, owner_email, notification_email")
      .eq("clinic_id", clinicId)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, settings: clinic }, { status: 200 });
  } catch (error) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const clinicId = cookieStore.get("sora_clinic_session")?.value;

    if (!clinicId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, owner_name, notification_email, password } = body;

    const updates = { name, owner_name, notification_email };

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updates.password_hash = await bcrypt.hash(password, salt);
    }

    const { error } = await supabaseAdmin
      .from("clinic_registry")
      .update(updates)
      .eq("clinic_id", clinicId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Settings updated successfully." });
  } catch (error) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
