import { createClient } from "@supabase/supabase-js";
import ClientAssessment from "./ClientAssessment";

export const revalidate = 0; // Disable caching so SEO changes reflect immediately

export async function generateMetadata() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return {
      title: "Fertility Risk Assessment | SORA",
      description: "Take the evidence-aligned fertility risk awareness check.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from("seo_settings").select("*").eq("page_route", "/fertility-assessment").single();

  if (data) {
    return {
      title: data.meta_title || "Fertility Risk Assessment | SORA",
      description: data.meta_description || "Take the evidence-aligned fertility risk awareness check.",
      keywords: data.meta_keywords || "",
    };
  }

  return {
    title: "Fertility Risk Assessment | SORA",
    description: "Take the evidence-aligned fertility risk awareness check.",
  };
}

export default function FertilityAssessment() {
  return <ClientAssessment />;
}
