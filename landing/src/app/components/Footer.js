import Link from "next/link";
import Image from "next/image";
import { Share2, Mail } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Image src="/sora-logo.png" alt="SORA Fertility" width={100} height={32} className={styles.logoImage} />
            <div className={styles.brandDesc}>
              Comprehensive software solutions designed exclusively to optimize fertility clinic workflows and patient experiences.
            </div>
          </div>

          <div className={styles.footerLinksWrapper}>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>PLATFORM</div>
              <Link href="/crm" className={styles.linkItem}>IVF CRM</Link>
              <Link href="/fertility-assessment" className={styles.linkItem}>Patient Assessment</Link>
              <Link href="#" className={styles.linkItem}>Clinic Portal</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>LEGAL</div>
              <Link href="/privacy-policy" className={styles.linkItem}>Privacy Policy</Link>
              <Link href="/terms-of-service" className={styles.linkItem}>Terms of Service</Link>
              <Link href="/cookie-policy" className={styles.linkItem}>Cookie Policy</Link>
              <Link href="/sitemap.xml" className={styles.linkItem}>Sitemap</Link>
            </div>

            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>COMPANY</div>
              <Link href="/about" className={styles.linkItem}>About Us</Link>
              <Link href="/contact" className={styles.linkItem}>Contact Support</Link>
              <Link href="#" className={styles.linkItem}>Clinic Login</Link>
              <div className={styles.socialLinks}>
                <button className={styles.socialBtn} aria-label="Share">
                  <Share2 size={16} />
                </button>
                <button className={styles.socialBtn} aria-label="Email">
                  <Mail size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.medicalDisclaimer}>
            <strong>Medical Disclaimer:</strong> SORA's patient-facing tools are intended for educational risk awareness and do not constitute medical advice, a diagnosis, or a treatment plan. Always consult a qualified fertility specialist for clinical decisions.
          </div>
          <div className={styles.copyright}>
            &copy; {currentYear} Sora Fertility Technologies. All rights reserved. Elevating the standard of care. Precision in reproductive health.
          </div>
        </div>
      </div>
    </footer>
  );
}
