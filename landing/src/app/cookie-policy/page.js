import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CookiePolicy() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "white", color: "#333", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: "80px 24px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "3rem", fontFamily: "var(--font-display, serif)", fontWeight: 800, color: "#011434", marginBottom: "32px" }}>Cookie Policy</h1>
        
        <div style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "#475569", display: "flex", flexDirection: "column", gap: "24px" }}>
          <p><strong>Last Updated:</strong> June 8, 2026</p>
          
          <p>
            This Cookie Policy explains how SORA Fertility ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our websites. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>Why do we use cookies?</h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Websites for advertising, analytics and other purposes.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>Types of cookies we use</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li><strong>Essential cookies:</strong> These cookies are strictly necessary to provide you with services available through our Websites and to use some of its features, such as access to secure areas (e.g., the CRM dashboard).</li>
            <li><strong>Performance and functionality cookies:</strong> These are used to enhance the performance and functionality of our Websites but are non-essential to their use.</li>
            <li><strong>Analytics and customization cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Websites are being used or how effective our marketing campaigns are.</li>
            <li><strong>Advertising cookies:</strong> These cookies are used to make advertising messages more relevant to you. We use third-party advertising companies, including Google, to serve ads when you visit our website. Third party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>Google Ads Settings</a>.</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", color: "#011434", marginTop: "16px" }}>How can I control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager or by amending your web browser controls to accept or refuse cookies.
          </p>

          <p>
            If you have any questions about our use of cookies or other technologies, please email us at privacy@sorafertility.com.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
