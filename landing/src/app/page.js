import { createClient } from "@supabase/supabase-js";
import ClientHome from "./ClientHome";

export const revalidate = 0; // Disable caching so SEO changes reflect immediately

export async function generateMetadata() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return {
      title: "SORA Fertility | Advanced Fertility Platform",
      description: "SORA brings enterprise-grade CRM software and patient-facing fertility risk tools into one unified platform.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase.from("seo_settings").select("*").eq("page_route", "/").single();

  if (data) {
    return {
      title: data.meta_title || "SORA Fertility | Advanced Fertility Platform",
      description: data.meta_description || "SORA brings enterprise-grade CRM software and patient-facing fertility risk tools into one unified platform.",
      keywords: data.meta_keywords || "",
    };
  }

  return {
    title: "SORA Fertility | Advanced Fertility Platform",
    description: "SORA brings enterprise-grade CRM software and patient-facing fertility risk tools into one unified platform.",
  };
}

export default function Home() {
  return <ClientHome />;
}
