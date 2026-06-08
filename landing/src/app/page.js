import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import styles from "./page.module.css";
import { ArrowRight, Database, Stethoscope } from "lucide-react";

export default function PlatformHome() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.container}>
      <Navbar ctaText="Contact Us" />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            End-to-End Clinic Management
          </h1>
          <p className={styles.heroSubtitle}>
            SORA brings enterprise-grade CRM software and patient-facing fertility risk tools into one unified platform. Designed exclusively to optimize fertility clinic workflows and acquire high-intent patients.
          </p>
          <div className={styles.heroActions}>
            <Link href="/crm" className={styles.btnPrimary}>
              Explore IVF CRM <ArrowRight size={20} />
            </Link>
            <Link href="/fertility-assessment" className={styles.btnSecondary}>
              View Patient Tools <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* PLATFORM OVERVIEW SECTION */}
      <section className={styles.platformSection}>
        <div className={styles.platformInner}>
          <div className={styles.platformHeader}>
            <h2>Two Powerful Suites. One Unified Platform.</h2>
          </div>
          
          <div className={styles.platformImageWrapper}>
            <Image src="/clinic-dashboard.jpg" alt="Clinic Dashboard" width={1200} height={600} className={styles.platformImage} />
          </div>
          
          <div className={styles.platformGrid}>
            <div className={styles.platformCard}>
              <Database className={styles.cardIcon} size={48} />
              <h3 className={styles.cardTitle}>IVF CRM</h3>
              <p className={styles.cardDesc}>
                A robust, specialized CRM designed to manage fertility leads, track clinical cycles, automate patient engagement, and provide a secure patient portal for your clinic.
              </p>
              <Link href="/crm" className={styles.cardLink}>
                Learn more about CRM <ArrowRight size={18} />
              </Link>
            </div>

            <div className={styles.platformCard}>
              <Stethoscope className={styles.cardIcon} size={48} />
              <h3 className={styles.cardTitle}>Fertility Assessment</h3>
              <p className={styles.cardDesc}>
                A beautiful, embeddable white-label risk assessment tool. Engage website visitors, deliver instant personalized fertility reports, and capture high-intent leads directly into your CRM.
              </p>
              <Link href="/fertility-assessment" className={styles.cardLink}>
                Try the Assessment Tool <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
