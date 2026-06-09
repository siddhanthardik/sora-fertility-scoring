import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const clinicId = cookieStore.get("sora_clinic_session")?.value;

    if (!clinicId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { data: clinic, error } = await supabaseAdmin
      .from("clinic_registry")
      .select("widget_token, widget_config, allowed_domains")
      .eq("clinic_id", clinicId)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, widget: clinic }, { status: 200 });
  } catch (error) {
    console.error("Fetch Widget Info Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const clinicId = cookieStore.get("sora_clinic_session")?.value;

    if (!clinicId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { widget_config, allowed_domains } = body;

    const { error } = await supabaseAdmin
      .from("clinic_registry")
      .update({ widget_config, allowed_domains })
      .eq("clinic_id", clinicId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Widget config updated" });
  } catch (error) {
    console.error("Update Widget Config Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
