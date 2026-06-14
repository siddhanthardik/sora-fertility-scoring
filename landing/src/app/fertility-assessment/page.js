import { createClient } from "@supabase/supabase-js";
import ClientAssessment from "./ClientAssessment";

export const revalidate = 0; // Disable caching so SEO changes reflect immediately

import { buildMetadata, getStructuredData } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata("/fertility-assessment", "Fertility Risk Assessment | SORA", "Take the evidence-aligned fertility risk awareness check.");
}

export default async function FertilityAssessment() {
  const jsonLd = await getStructuredData("/fertility-assessment");

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <ClientAssessment />
    </>
  );
}
