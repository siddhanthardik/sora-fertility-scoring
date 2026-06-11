import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Validate session using the superadmin cookie
function checkAuth(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  return cookieHeader.includes("sora_superadmin=authenticated");
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("seo_settings")
    .select("*")
    .order("page_route", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, seoSettings: data || [] }, { status: 200 });
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { page_route, meta_title, meta_description, meta_keywords } = await request.json();

    if (!page_route || !meta_title) {
      return NextResponse.json({ success: false, message: "Page route and title are required." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("seo_settings")
      .upsert({
        page_route,
        meta_title,
        meta_description,
        meta_keywords,
        updated_at: new Date().toISOString()
      }, { onConflict: "page_route" });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: "SEO settings saved." }, { status: 200 });
  } catch (error) {
    console.error("SEO Upsert Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
