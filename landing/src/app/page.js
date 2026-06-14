import { createClient } from "@supabase/supabase-js";
import ClientHome from "./ClientHome";

export const revalidate = 0; // Disable caching so SEO changes reflect immediately

import { buildMetadata, getStructuredData } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata("/", "SORA Fertility | Advanced Fertility Platform", "SORA brings enterprise-grade CRM software and patient-facing fertility risk tools into one unified platform.");
}

export default async function Home() {
  const jsonLd = await getStructuredData("/");

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <ClientHome />
    </>
  );
}
