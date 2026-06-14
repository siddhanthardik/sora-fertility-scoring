import { createClient } from "@supabase/supabase-js";
import ClientPcosAssessment from "./ClientPcosAssessment";

export const revalidate = 0; // Disable caching so SEO changes reflect immediately

import { buildMetadata, getStructuredData } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata("/pcos-assessment", "PCOS Risk Assessment | SORA", "Take the evidence-based PCOS Risk Assessment to understand your symptoms.");
}

export default async function PcosAssessment() {
  const jsonLd = await getStructuredData("/pcos-assessment");

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <ClientPcosAssessment />
    </>
  );
}
