import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.brandName}>SORA Fertility</div>
            <div className={styles.brandDesc}>
              Comprehensive software solutions designed exclusively to optimize fertility clinic workflows and patient experiences.
            </div>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Platform</div>
              <Link href="/crm" className={styles.linkItem}>IVF CRM</Link>
              <Link href="/fertility-assessment" className={styles.linkItem}>Patient Assessment</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Legal</div>
              <Link href="/privacy-policy" className={styles.linkItem}>Privacy Policy</Link>
              <Link href="/terms-of-service" className={styles.linkItem}>Terms of Service</Link>
              <Link href="/cookie-policy" className={styles.linkItem}>Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.medicalDisclaimer}>
            <strong>Medical Disclaimer:</strong> SORA's patient-facing tools are intended for educational risk awareness and do not constitute medical advice, a diagnosis, or a treatment plan. Always consult a qualified fertility specialist for clinical decisions.
          </div>
          <div className={styles.copyright}>
            &copy; {currentYear} SORA Fertility. All rights reserved. Elevating the standard of care.
          </div>
        </div>
      </div>
    </footer>
  );
}
