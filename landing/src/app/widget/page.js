import QuizWizard from "../components/QuizWizard";
import { getClinic } from "../lib/clinicRegistry";

export default async function WidgetPage({ searchParams }) {
  // Extract clinicId from the query string (?clinicId=...)
  const clinicId = searchParams.clinicId;
  const clinic = await getClinic(clinicId);

  const reportSettings = clinic?.reportSettings || {
    allowPremium: false,
    whiteLabel: false,
    customLogoUrl: null,
    forceReportType: "basic"
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        {/* Render QuizWizard with the specific clinicId and settings */}
        <QuizWizard clinicId={clinicId} reportSettings={reportSettings} />
      </div>
    </main>
  );
}
