import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "white", color: "#333", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: "80px 24px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "3rem", fontFamily: "var(--font-display, serif)", fontWeight: 800, color: "#011434", marginBottom: "32px" }}>Privacy Policy</h1>
        
        <div style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "#475569", display: "flex", flexDirection: "column", gap: "24px" }}>
          <p><strong>Last Updated:</strong> June 8, 2026</p>
          
          <p>
            At SORA Fertility, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>1. Information We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products, or otherwise contact us. The personal information that we collect depends on the context of your interactions with us and the platform, the choices you make, and the products and features you use.
          </p>
          <ul style={{ paddingLeft: "20px" }}>
            <li>Name and Contact Data (e.g., email address, phone number)</li>
            <li>Professional Data (e.g., clinic name, title)</li>
            <li>Usage Data (e.g., how you navigate our website)</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul style={{ paddingLeft: "20px" }}>
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To respond to user inquiries/offer support to users.</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>3. Data Security and Healthcare Compliance</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process, in alignment with HIPAA (US) and GDPR (EU) where applicable. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>4. Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may email us at privacy@sorafertility.com or by post to:
          </p>
          <address style={{ fontStyle: "normal", background: "#f8fafc", padding: "16px", borderRadius: "8px" }}>
            SORA Fertility Data Protection Officer<br />
            123 Innovation Drive<br />
            London, UK E1 6AN
          </address>
        </div>
      </main>

      <Footer />
    </div>
  );
}
