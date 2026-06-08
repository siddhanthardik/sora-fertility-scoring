"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RefreshCw, Star, Shield, ArrowUpRight } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar ctaText="Request Demo" />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>ENTERPRISE REPRODUCTIVE HEALTH</div>
            <h1 className={styles.heroTitle}>End-to-End IVF Clinic Management</h1>
            <p className={styles.heroDesc}>
              SORA brings enterprise-grade CRM software and patient-facing fertility risk tools into one unified platform. Designed exclusively to optimize fertility clinic workflows and acquire high-intent patients.
            </p>
            <div className={styles.heroActions}>
              <Link href="/crm" className={styles.btnPrimary}>Explore IVF CRM</Link>
              <Link href="/fertility-assessment" className={styles.btnSecondary}>View Patient Tools</Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.dashboardWrapper}>
              <Image src="/doctors.jpg" alt="SORA Dashboard" width={600} height={400} className={styles.dashboardImg} priority />
              <div className={styles.glassCard}>
                <div className={styles.glassIcon}><ArrowUpRight size={16} /></div>
                <div>
                  <div className={styles.glassLabel}>CONVERSION RATE</div>
                  <div className={styles.glassValue}>52.0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO SUITES SECTION */}
      <section className={styles.suitesSection}>
        <div className={styles.suitesInner}>
          <h2 className={styles.sectionTitle}>Two Powerful Suites. One Unified Platform.</h2>
          <div className={styles.accentLine}></div>

          <div className={styles.suitesGrid}>
            {/* IVF CRM Card */}
            <div className={styles.suiteCardWhite}>
              <div className={styles.suiteIconPrimary}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
              </div>
              <h3 className={styles.suiteTitle}>IVF CRM</h3>
              <p className={styles.suiteDesc}>
                A robust, specialized CRM designed to manage fertility leads, track clinical cycles, automate patient engagement, and provide a secure patient portal for your clinic.
              </p>
              <ul className={styles.suiteList}>
                <li><CheckCircle2 size={16} className={styles.checkIcon} /> Advanced Cycle Phase Tracking</li>
                <li><CheckCircle2 size={16} className={styles.checkIcon} /> HIPAA-Compliant Patient Portal</li>
                <li><CheckCircle2 size={16} className={styles.checkIcon} /> Automated Lead Nurturing</li>
              </ul>
              <Link href="/crm" className={styles.suiteLink}>Learn more about CRM <ArrowRight size={16} /></Link>
            </div>

            {/* Fertility Assessment Card */}
            <div className={styles.suiteCardGrey}>
              <div className={styles.suiteIconSecondary}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><circle cx="10" cy="13" r="2"></circle><path d="M10 17v-2"></path></svg>
              </div>
              <h3 className={styles.suiteTitle}>Fertility Assessment</h3>
              <p className={styles.suiteDesc}>
                A beautiful, embeddable white-label risk assessment tool. Engage website visitors, deliver instant personalized fertility reports, and capture high-intent leads.
              </p>
              
              <div className={styles.nestedCard}>
                <div className={styles.nestedLabel}>TRY THE EXPERIENCE</div>
                <div className={styles.nestedText}>Experience how patients feel when engaging with your brand through our risk tools.</div>
              </div>

              <Link href="/fertility-assessment" className={styles.suiteLink}>Try the Assessment Tool <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* UNIFIED ECOSYSTEM SECTION (Benefits) */}
      <section id="benefits" className={styles.ecoSection}>
        <div className={styles.ecoInner}>
          <div className={styles.ecoHeader}>
            <div className={styles.ecoHeaderLeft}>
              <h2 className={styles.sectionTitleEco}>A Unified Ecosystem for Superior Care</h2>
              <p className={styles.ecoDesc}>Our platform eliminates the fragmentation between marketing, intake, and clinical management.</p>
            </div>
            <div className={styles.ecoHeaderRight}>
              <button className={styles.btnBlack}>Platform Overview</button>
            </div>
          </div>

          <div className={styles.ecoGrid}>
            <div className={styles.ecoCard}>
              <div className={styles.ecoIcon}><RefreshCw size={20} /></div>
              <h4 className={styles.ecoCardTitle}>Accelerate Intake</h4>
              <p className={styles.ecoCardDesc}>Reduce friction in the patient journey with instant risk assessments that qualify leads before they reach your front desk.</p>
            </div>
            <div className={styles.ecoCard}>
              <div className={styles.ecoIcon}><Star size={20} /></div>
              <h4 className={styles.ecoCardTitle}>Unified Visibility</h4>
              <p className={styles.ecoCardDesc}>See every touchpoint from initial inquiry to cycle completion in a single, high-fidelity clinical dashboard.</p>
            </div>
            <div className={styles.ecoCard}>
              <div className={styles.ecoIcon}><Shield size={20} /></div>
              <h4 className={styles.ecoCardTitle}>Enterprise Security</h4>
              <p className={styles.ecoCardDesc}>Rest easy with HIPAA compliance, SOC2 adherence, and end-to-end encryption for all sensitive patient data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className={styles.howItWorksSection}>
        <div className={styles.howItWorksInner}>
          <h2 className={styles.sectionTitleCenter}>How SORA Works</h2>
          <div className={styles.accentLine}></div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Integrate & Customize</h3>
              <p className={styles.stepDesc}>Deploy our white-label tools on your site and integrate the CRM with your existing clinic systems in minutes.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Capture & Qualify</h3>
              <p className={styles.stepDesc}>Engage prospective patients with instant fertility reports, capturing high-intent leads automatically.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Manage & Convert</h3>
              <p className={styles.stepDesc}>Track cycle progress, nurture leads securely, and turn prospects into loyal patients through our unified portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className={styles.testimonialSection}>
        <div className={styles.testimonialInner}>
          <div className={styles.testiVisual}>
            <Image src="/doctors.png" alt="Doctors reviewing SORA on a laptop" width={500} height={500} className={styles.testiImg} />
            <div className={styles.testiBadge}>
              <div className={styles.badgeVal}>98%</div>
              <div className={styles.badgeLabel}>CLINIC SPECIALIST<br/>SATISFACTION</div>
            </div>
          </div>
          
          <div className={styles.testiContent}>
            <h2 className={styles.sectionTitle}>Designed by Specialists, for Specialists.</h2>
            <p className={styles.testiDesc}>
              We understand the complexity of reproductive medicine. SORA's platform is built to handle the unique nuances of IVF cycles, egg freezing, and donor management with clinical precision.
            </p>
            <div className={styles.quoteBlock}>
              <p className={styles.quoteText}>
                "SORA has transformed how we interact with prospective patients. The data density is incredible, yet the interface remains intuitive for our busy nursing staff."
              </p>
              <p className={styles.quoteAuthor}>— CLINICAL DIRECTOR, REPRODUCTIVE PARTNERS</p>
            </div>
            <button className={styles.btnPrimary}>Schedule a Demo</button>
          </div>
        </div>
      </section>

      {/* DARK CTA SECTION */}
      <section className={styles.ctaDarkSection}>
        <div className={styles.ctaDarkInner}>
          <h2 className={styles.ctaDarkTitle}>Supercharge Your Clinic's Performance</h2>
          <p className={styles.ctaDarkDesc}>
            Join the growing network of clinics optimizing their patient outcomes with SORA's intelligent fertility software.
          </p>
          <div className={styles.ctaDarkActions}>
            <button className={styles.btnPrimaryLg}>Request a Personalized Demo</button>
            <button className={styles.btnOutlineDark}>Contact Sales</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
