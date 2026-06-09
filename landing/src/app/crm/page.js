"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DemoModal from "../components/DemoModal";
import styles from "./page.module.css";
import { Filter, CalendarDays, ShieldCheck, Smartphone, Check } from "lucide-react";

export default function CRMLanding() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      
      <Navbar />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Sora CRM — Complete Platform for <span className={styles.heroTitleBlue}>Modern IVF Clinics</span>
            </h1>
            <p className={styles.heroDesc}>
              Unify lead-to-billing workflows, clinical data, and patient self-service. Designed for high-end clinical precision and patient comfort.
            </p>
            <div className={styles.heroActions}>
              <button onClick={() => setIsDemoModalOpen(true)} className={styles.btnPrimary}>
                Schedule a Demo
              </button>
              <button onClick={() => setIsDemoModalOpen(true)} className={styles.btnSecondary}>
                View Features
              </button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImageWrapper}>
              <Image src="/crm-hero-dashboard.png" alt="Sora CRM Interface" width={600} height={500} className={styles.heroImage} priority />
              <div className={styles.hipaaBadge}>
                <ShieldCheck size={16} /> HIPAA Compliant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI SECTION */}
      <section className={styles.roiSection}>
        <div className={styles.roiHeader}>
          <h2 className={styles.roiTitle}>Why Sora CRM Drives ROI</h2>
          <p className={styles.roiSubtitle}>Tangible clinical and financial impact for modern fertility enterprises.</p>
        </div>
        <div className={styles.roiGrid}>
          <div className={styles.roiCard}>
            <div className={styles.roiValue} style={{ color: "#db2777" }}>35%</div>
            <h3 className={styles.roiCardTitle}>Increased Conversion</h3>
            <p className={styles.roiCardDesc}>Through automated lead nurturing and faster intake response times.</p>
          </div>
          <div className={styles.roiCard}>
            <div className={styles.roiValue} style={{ color: "#ec4899" }}>20h</div>
            <h3 className={styles.roiCardTitle}>Saved Weekly</h3>
            <p className={styles.roiCardDesc}>Per clinician by eliminating manual clinical data entry and workflow friction.</p>
          </div>
          <div className={styles.roiCard}>
            <div className={styles.roiValue} style={{ color: "#e11d48" }}>98%</div>
            <h3 className={styles.roiCardTitle}>Patient Retention</h3>
            <p className={styles.roiCardDesc}>Driven by the frictionless Patient Portal and self-service financial tools.</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTIONS */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          
          {/* Section 1: Lead Management */}
          <div className={styles.splitFeatureBlock}>
            <div className={styles.splitFeatureContent}>
              <h2 className={styles.groupTitle}>
                <Filter className={styles.groupIcon} size={24} color="#db2777" />
                Lead Management & Revenue Growth
              </h2>
              <p className={styles.groupDesc}>
                Convert inquiries into patient consults automatically. Capture, score, and nurture leads with modern pipelines built specifically for fertility practices.
              </p>
              <ul className={styles.featureBulletList}>
                <li>
                  <strong>Intelligent Funnel Tracking:</strong> Real-time visibility into your inquiry-to-consult pipeline.
                  <span className={styles.bulletBenefit}>REVENUE BENEFIT: 35% INCREASE IN LEAD THROUGHPUT</span>
                </li>
                <li>
                  <strong>Automated Lead Nurturing:</strong> Triggered follow-ups and educational drip campaigns.
                  <span className={styles.bulletBenefit}>REVENUE BENEFIT: REDUCED CHURN IN EARLY STAGES</span>
                </li>
                <li>
                  <strong>Integrated Call Tracking:</strong> Attribute every appointment back to the marketing source.
                  <span className={styles.bulletBenefit}>REVENUE BENEFIT: OPTIMIZED MARKETING SPEND</span>
                </li>
              </ul>
            </div>
            <div className={styles.splitFeatureVisual}>
              <div className={styles.featureGraphicWrapper}>
                <Image src="/crm-lead-funnel.png" alt="Sora CRM Lead Funnel" width={480} height={360} className={styles.featureGraphic} />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Operations */}
          <div className={`${styles.splitFeatureBlock} ${styles.splitFeatureReverse}`}>
            <div className={styles.splitFeatureContent}>
              <h2 className={styles.groupTitle}>
                <CalendarDays className={styles.groupIcon} size={24} color="#db2777" />
                Operational Efficiency & Clinical Excellence
              </h2>
              <p className={styles.groupDesc}>
                Streamline workflows for nurses and embryologists. Coordinate ultrasounds, bloodwork, and stimulation cycles in one high-fidelity clinical timeline.
              </p>
              <ul className={styles.featureBulletList}>
                <li>
                  <strong>One-Click Clinical Scheduling:</strong> Coordinate scan intervals, bloodwork, and procedures in a single click.
                  <span className={styles.bulletBenefit}>OPS BENEFIT: 20% REDUCTION IN SCHEDULING ERRORS</span>
                </li>
                <li>
                  <strong>Interactive Cycle Tracking:</strong> Dashboards showing stimulation graphs, hormone levels, and follicle growth charts.
                  <span className={styles.bulletBenefit}>CLINICAL BENEFIT: DATA-DRIVEN TREATMENT MODIFICATIONS</span>
                </li>
              </ul>
            </div>
            <div className={styles.splitFeatureVisual}>
              <div className={styles.featureGraphicWrapper}>
                <Image src="/crm-cycle-tracking.png" alt="Sora CRM Cycle Tracking" width={480} height={360} className={styles.featureGraphic} />
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Compliance */}
          <div className={styles.featureGroup}>
            <h2 className={styles.groupTitle}>
              <ShieldCheck className={styles.groupIcon} size={24} color="#db2777" />
              Financial & Compliance Core
            </h2>
            <div className={styles.featureCardsGrid3}>
              <div className={styles.featureCard}>
                <div className={styles.cardHeaderIcon}><ShieldCheck size={20} /></div>
                <h4>Seamless Billing Integration</h4>
                <p>Automated invoicing and payment tracking for cycle packages.</p>
                <div className={styles.cardFooter}>OPS BENEFIT: ZERO FRICTION PAYMENTS</div>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.cardHeaderIcon}><ShieldCheck size={20} /></div>
                <h4>Audit-Ready Reporting</h4>
                <p>Automated compliance exports for SART and national registries.</p>
                <div className={styles.cardFooter}>OPS BENEFIT: 100% DATA INTEGRITY</div>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.cardHeaderIcon}><ShieldCheck size={20} /></div>
                <h4>HIPAA/GDPR Core</h4>
                <p>Enterprise-grade encryption and access controls.</p>
                <div className={styles.cardFooter}>SECURITY BENEFIT: CLINICAL RISK MITIGATION</div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className={styles.featureGroup}>
            <h2 className={styles.groupTitle}>
              <Smartphone className={styles.groupIcon} size={24} color="#2563eb" />
              Patient Experience & Portal Benefits
            </h2>
            <div className={styles.portalBlock}>
              <div className={styles.portalContent}>
                <h3>The Modern Patient Portal</h3>
                <p>Provide your patients with the transparency they deserve. Results, medications, and financing—all in one place.</p>
                <ul className={styles.portalList}>
                  <li><Check size={16} color="#10b981" /> Mobile-optimized cycle status</li>
                  <li><Check size={16} color="#10b981" /> Digital consent and document signing</li>
                  <li><Check size={16} color="#10b981" /> Integrated medication reminders</li>
                </ul>
                <div className={styles.portalPill}>PATIENT BENEFIT: 50% DECREASE IN CALL VOLUME</div>
              </div>
              <div className={styles.portalVisual}>
                <Image 
                  src="/patient-portal-mobile.png" 
                  alt="Sora Patient Portal Mobile Screen" 
                  width={600} 
                  height={800} 
                  className={styles.portalImage}
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Clinic Operations?</h2>
          <p className={styles.ctaDesc}>
            Join the world's leading fertility networks scaling with Sora's unified CRM platform.
          </p>
          <div className={styles.ctaActions}>
            <button onClick={() => setIsDemoModalOpen(true)} className={styles.btnCtaPrimary}>
              Get Started Today
            </button>
            <button onClick={() => setIsDemoModalOpen(true)} className={styles.btnCtaSecondary}>
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
