import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export async function GET(request) {
  try {
    // In a real app, you'd check superadmin authentication here (e.g., verifying a session cookie)
    
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Supabase connection is not configured." },
        { status: 503 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch leads." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Superadmin Leads Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
