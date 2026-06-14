"use client";

import { useEffect, useState } from "react";
import PcosWizard from "./PcosWizard";
import { trackEvent } from "../../lib/analytics";
import { ChunkErrorBoundary } from "../components/ChunkErrorBoundary";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import styles from "../fertility-assessment/page.module.css";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock,
  Search,
  Shield,
  ShieldOff,
  UserX,
  FileText,
  X
} from "lucide-react";

export default function ClientPcosAssessment() {
  const currentYear = new Date().getFullYear();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    trackEvent({ event: "tool_viewed", tool: "pcos_assessment" });
  }, []);

  const handleStartAssessment = () => {
    trackEvent({ event: "tool_started", tool: "pcos_assessment" });
    setIsQuizOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = isQuizOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isQuizOpen]);

  const painPoints = [
    {
      icon: <Activity />,
      text: "I have unwanted hair growth or severe acne and wonder if it's normal.",
      colorClass: styles.iconRed
    },
    {
      icon: <Clock />,
      text: "My periods are unpredictable or very far apart.",
      colorClass: styles.iconPurple
    },
    {
      icon: <FileText />,
      text: "I'm struggling to manage my weight and I feel insulin resistant.",
      colorClass: styles.iconBlue
    },
    {
      icon: <Search />,
      text: "I'm trying to conceive but my irregular cycles are making it difficult.",
      colorClass: styles.iconYellow
    }
  ];

  return (
    <div className={styles.container}>
      <Navbar onCtaClick={handleStartAssessment} ctaText="Start PCOS Assessment" ctaColor="#e11d48" />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Understand your PCOS Risk. <br />
              <span>Evidence-based screening.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              A private, clinical-grade assessment to identify signs of Polycystic Ovary Syndrome (PCOS). Free. 5 minutes. Receive a personalized report.
            </p>
            <button type="button" className={`${styles.btnPrimary} ${styles.btnHighlight}`} onClick={handleStartAssessment}>
              Start My Free Assessment <ArrowRight size={20} />
            </button>
          </div>
          <div className={styles.heroImageWrapper}>
            <Image src="/hero-fertility.jpg" alt="Woman feeling relieved" width={600} height={600} className={styles.heroImage} priority />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <div className={styles.trustItemIcon}><Activity size={18} /></div>
          <div>Clinical criteria</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustItemIcon}><Clock size={18} /></div>
          <div>5 min to complete</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustItemIcon}><AlertTriangle size={18} /></div>
          <div>4 risk categories</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustItemIcon}><Shield size={18} /></div>
          <div>Server-side scoring</div>
        </div>
      </div>

      {/* PROBLEM BLOCK */}
      <section className={styles.problemSection}>
        <div className={styles.problemHeader}>
          <h2 className={styles.problemTitle}>PCOS is often missed or misdiagnosed.</h2>
          <p className={styles.problemHook}>
            Unpredictable periods, unexplainable weight gain, acne, and hair thinning. These symptoms are frequently dismissed. You deserve clarity and a structured way to discuss this with your doctor.
          </p>
        </div>
        
        <div className={styles.problemGrid}>
          {painPoints.map((point, idx) => (
            <div className={styles.problemCard} key={idx}>
              <div className={`${styles.problemIcon} ${point.colorClass}`}>{point.icon}</div>
              <div className={styles.problemText}>{point.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.howInner}>
          <h2 className={styles.howTitle}>Your risk score, in 3 steps.</h2>
          
          <div className={styles.howSteps}>
            <div className={styles.howDashedLine}></div>
            <div className={styles.howStep}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Answer private questions</h3>
              <p className={styles.stepDesc}>Details about your cycle, physical symptoms like hair growth and acne, and medical history.</p>
            </div>
            
            <div className={styles.howStep}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>SORA's engine scores inputs</h3>
              <p className={styles.stepDesc}>Our algorithm calculates a risk score based on established clinical parameters. Instant. Secure.</p>
            </div>

            <div className={styles.howStep}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Receive your report</h3>
              <p className={styles.stepDesc}>A comprehensive PDF detailing your risk level, major contributing factors, and pattern insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY & REASSURANCE */}
      <section className={styles.privacySection}>
        <div className={styles.privacyInner}>
          <h2 className={styles.privacyTitle}>Your answers stay with you.</h2>
          
          <div className={styles.privacyCards}>
            <div className={styles.privacyCard}>
              <div className={styles.privacyIcon}>
                <ShieldOff size={32} />
              </div>
              <h4>Not a medical diagnosis</h4>
              <p>This is a screening tool to help identify if you would benefit from further clinical evaluation.</p>
            </div>
            
            <div className={styles.privacyCard}>
              <div className={styles.privacyIcon}>
                <Shield size={32} />
              </div>
              <h4>Scored server-side</h4>
              <p>Your responses are securely processed and never exposed to third parties.</p>
            </div>

            <div className={styles.privacyCard}>
              <div className={styles.privacyIcon}>
                <UserX size={32} />
              </div>
              <h4>No account required</h4>
              <p>You can take the assessment entirely privately and optionally provide details for the report.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MID PAGE CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready for clarity?</h2>
          <p className={styles.ctaDesc}>
            5 minutes from now, you'll have a personalized report to discuss with your healthcare provider.
          </p>
          <button type="button" className={`${styles.btnPrimary} ${styles.btnHighlight}`} onClick={handleStartAssessment}>
            Take the Free Assessment <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <Footer />

      {isQuizOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsQuizOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsQuizOpen(false)} aria-label="Close assessment">
              <X width={20} height={20} />
            </button>
            <ChunkErrorBoundary>
              <PcosWizard clinicId="clinic_sora_ivf_clinic_613110" onComplete={() => setIsQuizOpen(false)} />
            </ChunkErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
}
