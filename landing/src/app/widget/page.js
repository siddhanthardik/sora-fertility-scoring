import QuizWizard from "../components/QuizWizard";

export default function WidgetPage({ searchParams }) {
  // Extract clinicId from the query string (?clinicId=...)
  const clinicId = searchParams.clinicId;

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        {/* Render QuizWizard with the specific clinicId */}
        <QuizWizard clinicId={clinicId} />
      </div>
    </main>
  );
}
