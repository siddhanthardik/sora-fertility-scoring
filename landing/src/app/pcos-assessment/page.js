import { createClient } from "@supabase/supabase-js";
import ClientPcosAssessment from "./ClientPcosAssessment";

export const revalidate = 0; // Disable caching so SEO changes reflect immediately

export async function generateMetadata() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return {
      title: "PCOS Risk Assessment | SORA",
      description: "Take the evidence-based PCOS Risk Assessment to understand your symptoms.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from("seo_settings").select("*").eq("page_route", "/pcos-assessment").single();

  if (data) {
    return {
      title: data.meta_title || "PCOS Risk Assessment | SORA",
      description: data.meta_description || "Take the evidence-based PCOS Risk Assessment to understand your symptoms.",
      keywords: data.meta_keywords || "",
    };
  }

  return {
    title: "PCOS Risk Assessment | SORA",
    description: "Take the evidence-based PCOS Risk Assessment to understand your symptoms.",
  };
}

export default function PcosAssessment() {
  return <ClientPcosAssessment />;
}
