import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const payload = await req.json();

    const { session_id, event_name, tool_name, metadata, url } = payload;

    if (!session_id || !event_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("sora_events").insert({
      session_id,
      event_name,
      tool_name,
      metadata: metadata || {},
      url
    });

    if (error) {
      console.error("Failed to insert event into Supabase:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics track route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
