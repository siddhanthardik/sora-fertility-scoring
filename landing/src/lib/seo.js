import { createClient } from "@supabase/supabase-js";

export async function buildMetadata(pageRoute, defaultTitle, defaultDescription) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const baseMetadata = {
    title: defaultTitle,
    description: defaultDescription,
  };

  if (!supabaseUrl || !supabaseKey) {
    return baseMetadata;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from("seo_settings").select("*").eq("page_route", pageRoute).single();

  if (!data) return baseMetadata;

  const metadata = {
    title: data.meta_title || defaultTitle,
    description: data.meta_description || defaultDescription,
    keywords: data.meta_keywords || "",
    alternates: {},
    robots: {
      index: !data.noindex,
      follow: !data.nofollow,
    }
  };

  if (data.canonical_url) {
    metadata.alternates.canonical = data.canonical_url;
  }

  // Open Graph
  if (data.og_title || data.og_description || data.og_image) {
    metadata.openGraph = {
      title: data.og_title || metadata.title,
      description: data.og_description || metadata.description,
      images: data.og_image ? [{ url: data.og_image }] : [],
    };
  }

  // Twitter
  if (data.twitter_title || data.twitter_description || data.twitter_image || data.twitter_card) {
    metadata.twitter = {
      card: data.twitter_card || "summary_large_image",
      title: data.twitter_title || metadata.title,
      description: data.twitter_description || metadata.description,
      images: data.twitter_image ? [data.twitter_image] : [],
    };
  }

  return metadata;
}

export async function getStructuredData(pageRoute) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from("seo_settings").select("structured_data").eq("page_route", pageRoute).single();
  
  if (data && data.structured_data) {
    try {
      // Validate it's valid JSON
      const parsed = typeof data.structured_data === 'string' ? JSON.parse(data.structured_data) : data.structured_data;
      return JSON.stringify(parsed);
    } catch (e) {
      console.error("Invalid JSON-LD", e);
      return null;
    }
  }
  return null;
}
