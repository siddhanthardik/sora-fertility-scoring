"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DemoModal from "../components/DemoModal";
import styles from "./page.module.css";
import {
  BarChart3,
  CalendarDays,
  Lock,
  LayoutDashboard,
  Users,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ClipboardList
} from "lucide-react";

export default function CRMLanding() {
  const currentYear = new Date().getFullYear();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const features = [
    {
      icon: <LayoutDashboard size={32} />,
      title: "Admin Dashboard",
      desc: "Get a bird's-eye view of your clinic's daily pulse. Track total active cycles, appointments, and pending tasks instantly.",
      colorClass: "blue"
    },
    {
      icon: <Users size={32} />,
      title: "Lead Management Kanban",
      desc: "Stop losing leads in spreadsheets. Manage inquiries through a visual pipeline and convert prospects into registered patients.",
      colorClass: "purple"
    },
    {
      icon: <ClipboardList size={32} />,
      title: "Patient & Cycle Tracking",
      desc: "A centralized repository for all patients. Track ongoing treatment cycles, assign protocols, and manage clinical phases.",
      colorClass: "green"
    },
    {
      icon: <CalendarDays size={32} />,
      title: "Appointment Scheduling",
      desc: "A robust clinic calendar for scheduling consultations and ultrasounds. Supports multi-doctor views and conflict detection.",
      colorClass: "orange"
    },
    {
      icon: <CreditCard size={32} />,
      title: "Packages & Billing",
      desc: "Create standardized clinical packages (e.g., Single Cycle IVF), track patient ledgers, and generate professional invoices.",
      colorClass: "blue"
    },
    {
      icon: <Lock size={32} />,
      title: "Secure Patient Portal",
      desc: "A welcoming interface for patients to track progress, fill medical intakes, sign digital consents, and request appointments.",
      colorClass: "purple"
    }
  ];

  return (
    <div className={styles.container}>
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />

      {/* Sticky navigation with CTA */}
      <Navbar ctaText="Book a Demo" onCtaClick={() => setIsDemoModalOpen(true)} />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            Enterprise Clinic Management
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleHighlight}>Turn inquiries into outcomes.</span><br />
            Comprehensive Clinic Management.
          </h1>
          <p className={styles.heroDesc}>
            Stop wrestling with generic spreadsheets and outdated software. SORA CRM is purpose-built to scale your fertility clinic, automate patient acquisition, and streamline clinical cycles.
          </p>
          <div className={styles.heroActions}>
            <button onClick={() => setIsDemoModalOpen(true)} className={styles.btnHeroPrimary}>
              Book a Demo <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Everything your clinic needs to thrive</h2>
          <p className={styles.featuresSubtitle}>
            From the front desk to the embryology lab, SORA CRM connects every part of your practice with specialized, easy-to-use tools.
          </p>
        </div>
        
        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <div className={styles.featureCard} key={idx}>
              <div className={`${styles.iconWrapper} ${styles[feature.colorClass]}`}>
                {feature.icon}
              </div>
              <h3 className={styles.featureCardTitle}>{feature.title}</h3>
              <p className={styles.featureCardDesc}>{feature.desc}</p>
              <button onClick={() => setIsDemoModalOpen(true)} className={styles.featureCardLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                See it in action <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className={styles.showcase}>
        <div className={styles.showcaseInner}>
          <div className={styles.showcaseContent}>
            <h2>Data-Driven Clinical & Financial Outcomes</h2>
            <p>
              Make informed decisions with powerful reporting tools that give you unparalleled insight into your clinic's performance. Never miss a lead or a clinical milestone again.
            </p>
            <ul className={styles.showcaseList}>
              <li><CheckCircle2 className={styles.checkIcon} size={24} /> Clinical outcomes and cycle success rates</li>
              <li><CheckCircle2 className={styles.checkIcon} size={24} /> Lead conversion and acquisition pipeline data</li>
              <li><CheckCircle2 className={styles.checkIcon} size={24} /> Financial performance, revenue, and invoice aging</li>
              <li><CheckCircle2 className={styles.checkIcon} size={24} /> Role-based access control for secure data management</li>
            </ul>
          </div>
          <div className={styles.showcaseVisual}>
            <div className={styles.showcaseVisualPlaceholder}>
              <BarChart3 size={80} />
              <div style={{ fontWeight: 800, fontSize: "1.4rem" }}>Advanced Analytics Dashboard</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to modernize your IVF center?</h2>
          <p className={styles.ctaDesc}>
            Join the top clinics that trust SORA CRM to streamline their operations, improve patient experiences, and drive better outcomes.
          </p>
          <button onClick={() => setIsDemoModalOpen(true)} className={styles.btnCtaWhite}>
            Book Your Free Demo Today <ChevronRight size={24} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
