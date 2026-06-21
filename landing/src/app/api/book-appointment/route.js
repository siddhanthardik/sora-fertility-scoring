import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseClient";

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, phone, country_code, preferred_date, preferred_time, consultation_notes } = payload;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required to book an appointment." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Database connection not configured." }, { status: 500 });
    }

    // Find the most recent lead with this email
    const { data: existingLeads, error: fetchError } = await supabaseAdmin
      .from("leads")
      .select("id")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching lead:", fetchError);
      return NextResponse.json({ success: false, message: "Database error." }, { status: 500 });
    }

    const leadId = existingLeads && existingLeads.length > 0 ? existingLeads[0].id : null;

    if (leadId) {
      // Update existing lead
      const { error: updateError } = await supabaseAdmin
        .from("leads")
        .update({
          name: name || undefined, // Update name if provided
          phone: phone || undefined,
          country_code: country_code || undefined,
          consultation_request: true,
          preferred_date,
          preferred_time,
          consultation_notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", leadId);

      if (updateError) {
        console.error("Error updating lead with consultation:", updateError);
        return NextResponse.json({ success: false, message: "Failed to update lead.", error: updateError }, { status: 500 });
      }
    } else {
      // Insert new lead (if they somehow bypassed the assessment)
      const { error: insertError } = await supabaseAdmin
        .from("leads")
        .insert([{
          name: name || "Anonymous Patient",
          email,
          phone,
          country_code,
          consultation_request: true,
          preferred_date,
          preferred_time,
          consultation_notes
        }]);

      if (insertError) {
        console.error("Error inserting new lead:", insertError);
        return NextResponse.json({ success: false, message: "Failed to save booking.", error: insertError }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: "Appointment request saved successfully." });

  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error.", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
