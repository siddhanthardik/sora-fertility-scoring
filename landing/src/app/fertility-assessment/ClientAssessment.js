"use client";

import { useEffect, useState } from "react";
import QuizWizard from "../components/QuizWizard";
import { trackEvent } from "../../lib/analytics";
import { ChunkErrorBoundary } from "../components/ChunkErrorBoundary";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import styles from "./page.module.css";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock,
  Search,
  Shield,
  ShieldOff,
  UserX,
  X,
  FileText
} from "lucide-react";

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    trackEvent({ event: "tool_viewed", tool: "fertility_assessment" });
  }, []);

  const handleStartAssessment = () => {
    trackEvent({ event: "tool_started", tool: "fertility_assessment" });
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
      text: "My cycles are irregular but my GP says everything is normal",
      colorClass: styles.iconRed
    },
    {
      icon: <Clock />,
      text: "I've been trying for 8 months and I don't know if I should worry",
      colorClass: styles.iconPurple
    },
    {
      icon: <FileText />,
      text: "My AMH results came back and I don't understand what they mean",
      colorClass: styles.iconBlue
    },
    {
      icon: <Search />,
      text: "I feel like I'm waiting for someone to tell me what to do next",
      colorClass: styles.iconYellow
    }
  ];

  return (
    <div className={styles.container}>
      <Navbar onCtaClick={handleStartAssessment} ctaText="Start fertility test" ctaColor="#e11d48" />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Know your fertility signals. <br />
              <span>Before time becomes pressure.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              A private, evidence-aligned fertility risk score — designed for women 25–45 who want clarity, not more waiting. Free. 5 minutes. No clinic required.
            </p>
            <button type="button" className={`${styles.btnPrimary} ${styles.btnHighlight}`} onClick={handleStartAssessment}>
              Start My Free Test <ArrowRight size={20} />
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
          <div>2M+ clinical inputs</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustItemIcon}><Clock size={18} /></div>
          <div>5 min to complete</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustItemIcon}><AlertTriangle size={18} /></div>
          <div>3 risk bands</div>
        </div>
        <div className={styles.trustItem}>
          <div className={styles.trustItemIcon}><Shield size={18} /></div>
          <div>Server-side scoring</div>
        </div>
      </div>

      {/* PROBLEM BLOCK */}
      <section className={styles.problemSection}>
        <div className={styles.problemHeader}>
          <h2 className={styles.problemTitle}>You've been trying to figure this out alone.</h2>
          <p className={styles.problemHook}>
            The irregular cycles. The months that feel like they disappear. The late-night Google searches that leave you more anxious than before. You deserve something better than waiting and wondering.
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
              <h3 className={styles.stepTitle}>Answer 27+ private questions</h3>
              <p className={styles.stepDesc}>Your cycle, health history, lifestyle, and optional lab values — all on a secure, private form.</p>
            </div>
            
            <div className={styles.howStep}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>SORA's engine scores inputs</h3>
              <p className={styles.stepDesc}>Our evidence-aligned FertiSTAT algorithm runs server-side. Instant. Secure. Never exposed in your browser.</p>
            </div>

            <div className={styles.howStep}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Receive your report</h3>
              <p className={styles.stepDesc}>A risk band (Low / Amber / High), your flagged factors, referral urgency, and clear next steps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE REPORT MOCKUP */}
      <section className={styles.reportSection} id="benefits">
        <div className={styles.reportHeader}>
          <h2 className={styles.problemTitle}>Clarity you can take to your doctor.</h2>
          <p className={styles.problemHook}>Every assessment generates a structured clinical report detailing your specific risk factors and suggested next steps.</p>
        </div>

        <div className={styles.reportMockupContainer}>
          <div className={styles.reportMockup}>
            <div className={styles.mockupHeader}>
              <div>
                <img src="/sora-logo.png" alt="SORA Fertility" style={{ width: '120px', height: 'auto', marginBottom: '8px' }} />
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>PREMIUM CLINICAL REPORT</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600 }}>Executive Summary</div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Page 1 of 5</div>
              </div>
            </div>

            <div className={styles.mockupGrid}>
              <div className={styles.mockupCard}>
                <div className={styles.mockupCardTitle}>Patient Profile</div>
                <div className={styles.mockupRow}><span>Age</span> <strong>28 Years</strong></div>
                <div className={styles.mockupRow}><span>BMI</span> <strong>25.5 kg/m²</strong></div>
                <div className={styles.mockupRow}><span>Goal</span> <strong>Actively Trying</strong></div>
              </div>

              <div className={styles.mockupCard}>
                <div className={styles.mockupCardTitle}>Clinical Triage Result</div>
                <div className={styles.mockupRow}><span>Overall Risk Band</span> <strong className={styles.mockupBand}>Low</strong></div>
                <div className={styles.mockupRow}><span>Red Markers</span> <strong style={{color: "hsl(0, 70%, 50%)"}}>0</strong></div>
                <div className={styles.mockupRow}><span>Referral Urgency</span> <strong>Routine</strong></div>
              </div>
            </div>

            <div className={styles.mockupCallout}>
              <div className={styles.mockupCalloutTitle}>Primary Recommendation</div>
              <div className={styles.mockupCalloutText}>
                Your answers suggest a lower risk profile. Continue healthy preconception habits and seek care if you have concerns.
              </div>
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
              <p>SORA is an evidence-aligned risk awareness tool. It helps you understand signals and prepare for a professional conversation.</p>
            </div>
            
            <div className={styles.privacyCard}>
              <div className={styles.privacyIcon}>
                <Shield size={32} />
              </div>
              <h4>Scored server-side</h4>
              <p>Your responses are securely processed on our servers and never stored in your browser or exposed to third parties.</p>
            </div>

            <div className={styles.privacyCard}>
              <div className={styles.privacyIcon}>
                <UserX size={32} />
              </div>
              <h4>No account required</h4>
              <p>No email address needed to start. You can take the entire assessment completely anonymously.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MID PAGE CTA & TESTIMONIAL */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to stop guessing?</h2>
          <p className={styles.ctaDesc}>
            5 minutes from now, you'll have a personalised fertility risk report — and a clear sense of what to do next.
          </p>
          <button type="button" className={`${styles.btnPrimary} ${styles.btnHighlight}`} onClick={handleStartAssessment}>
            Take the Free Assessment <ArrowRight size={20} />
          </button>

          <div className={styles.testimonialBox}>
            <div className={styles.quoteMark}>"</div>
            <div className={styles.testimonialQuote}>
              I'd spent months telling myself everything was probably fine. SORA gave me the clarity to finally book an appointment — and I'm so glad I did.
            </div>
            <div className={styles.testimonialAuthor}>
              — Priya, 31, Delhi
            </div>
          </div>
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
              <QuizWizard clinicId="clinic_sora_ivf_clinic_613110" />
            </ChunkErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
}
