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
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, blogs: data || [] }, { status: 200 });
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, title, excerpt, content, author_name, cover_image, published } = await request.json();

    if (!slug || !title) {
      return NextResponse.json({ success: false, message: "Slug and title are required." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("blog_posts")
      .upsert({
        slug,
        title,
        excerpt,
        content,
        author_name,
        cover_image,
        published,
        updated_at: new Date().toISOString()
      }, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: "Blog saved successfully.", blog: data }, { status: 200 });
  } catch (error) {
    console.error("Blog Upsert Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}
