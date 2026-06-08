import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfService() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "white", color: "#333", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: "80px 24px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "3rem", fontFamily: "var(--font-display, serif)", fontWeight: 800, color: "#011434", marginBottom: "32px" }}>Terms of Service</h1>
        
        <div style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "#475569", display: "flex", flexDirection: "column", gap: "24px" }}>
          <p><strong>Last Updated:</strong> June 8, 2026</p>
          
          <p>
            Welcome to SORA Fertility. These Terms of Service ("Terms") govern your use of the SORA platform, website, and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>1. Acceptance of Terms</h2>
          <p>
            If you do not agree to these Terms, you must not access or use the Services. If you are using the Services on behalf of an organization (such as a clinic or hospital), you represent that you have the authority to bind that organization to these Terms.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>2. Medical Disclaimer</h2>
          <p>
            SORA Fertility provides software solutions for clinic management and patient education. <strong>We are not a healthcare provider.</strong> Our Services, including risk assessments and patient portals, do not constitute medical advice, diagnosis, or treatment. Clinicians retain full responsibility for patient care and medical decisions.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>3. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to use the Services only for lawful purposes and in compliance with all applicable healthcare regulations (e.g., HIPAA, GDPR).
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>4. Service Availability</h2>
          <p>
            While we strive for 99.9% uptime, we do not guarantee that the Services will be uninterrupted or error-free. We may temporarily suspend the Services for maintenance or upgrades.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SORA Fertility shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>6. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at legal@sorafertility.com.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
