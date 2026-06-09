import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export async function GET(request) {
  try {
    // Basic security: require an Authorization header or secret token
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET || 'sora_cron_secret';
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ success: false, message: "Unauthorized cron request." }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: "Supabase connection is not configured." }, { status: 503 });
    }

    // This fetches all active clinics and forcefully resets their currentMonth tracking if it's outdated
    // Note: The system already handles this dynamically during assessment recording, 
    // but this cron job ensures the database is completely clean at the start of the month.
    
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Fetch clinics where currentMonth is not the current calendar month
    const { data: clinics, error: fetchError } = await supabaseAdmin
      .from("clinic_registry")
      .select("clinic_id, usage")
      .not('usage->>currentMonth', 'eq', currentMonth);

    if (fetchError) throw fetchError;

    let resetCount = 0;

    for (const clinic of clinics) {
      const updatedUsage = {
        ...(clinic.usage || {}),
        currentMonth: currentMonth,
        monthlyAssessments: 0
      };

      const { error: updateError } = await supabaseAdmin
        .from("clinic_registry")
        .update({ usage: updatedUsage })
        .eq("clinic_id", clinic.clinic_id);

      if (!updateError) resetCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Usage reset successfully. Updated ${resetCount} clinics.` 
    }, { status: 200 });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
