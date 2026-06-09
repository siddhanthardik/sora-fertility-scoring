import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const clinicId = cookieStore.get("sora_clinic_session")?.value;

    if (!clinicId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Supabase connection is not configured." }, { status: 503 });
    }

    const { data: leads, error } = await supabaseAdmin
      .from("assessments")
      .select("*")
      .eq("clinic_id", clinicId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error) {
    console.error("Fetch Leads Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const clinicId = cookieStore.get("sora_clinic_session")?.value;

    if (!clinicId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { assessmentId, status } = body;

    const { error } = await supabaseAdmin
      .from("assessments")
      .update({ status })
      .match({ id: assessmentId, clinic_id: clinicId });

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Update Lead Status Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
