"use client";

import { useEffect, useState } from "react";
import QuizWizard from "./components/QuizWizard";
import styles from "./page.module.css";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isQuizOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isQuizOpen]);

  const benefits = [
    {
      icon: <AlertTriangle width={22} height={22} />,
      title: "Spot Risk Signals Early",
      copy: "Age, cycle pattern, medical history, lifestyle, partner context, and optional lab markers are organized into clear risk bands.",
    },
    {
      icon: <FileText width={22} height={22} />,
      title: "Get A Discussion-Ready Report",
      copy: "The result is built for informed next steps with clinician discussion points, referral guidance, and flagged factors.",
    },
    {
      icon: <Shield width={22} height={22} />,
      title: "Private Server-Side Scoring",
      copy: "The assessment logic runs on SORA's protected backend instead of exposing the scoring model in browser code.",
    },
  ];

  const reasons = [
    "You are planning pregnancy and want a baseline before waiting months.",
    "You have irregular cycles, painful periods, PCOS, thyroid, diabetes, TB history, surgery, or pregnancy losses.",
    "You are 35 or older and want clearer timing for specialist review.",
    "You have AMH, FSH, or AFC values and want them organized into an ovarian reserve context.",
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <div className={styles.logoIconWrapper}>
              <Heart className={styles.logoIcon} width={22} height={22} fill="var(--color-primary)" />
            </div>
            <div className={styles.logoText}>
              SORA <span>Fertility</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <a href="#benefits" className={styles.navLink}>Benefits</a>
            <a href="#why-test" className={styles.navLink}>Why Test</a>
            <a href="#privacy" className={styles.navLink}>Privacy</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
          </nav>

          <button type="button" className={styles.btnNavCta} onClick={() => setIsQuizOpen(true)}>
            START TEST
          </button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={`${styles.heroContent} animate-fadeInUp`}>
            <div className={styles.heroBadge}>
              <Sparkles width={12} height={12} style={{ color: "var(--color-risk-red-text)", marginRight: "6px" }} />
              Evidence-aligned fertility awareness tool
            </div>

            <h1 className={styles.heroTitle}>
              SORA Fertility: <br />
              <span className={styles.heroTitleHighlight}>Know your fertility signals</span>{" "}
              <span className={styles.heroTitleNormal}>before time becomes pressure</span>
            </h1>

            <p className={styles.heroDesc}>
              A private fertility risk check that turns your answers into a clear summary of red and amber factors,
              referral urgency, and optional ovarian reserve context.
            </p>

            <div className={styles.heroButtonRow}>
              <button type="button" className={styles.btnHeroPink} onClick={() => setIsQuizOpen(true)}>
                <FileText width={18} height={18} />
                Start Fertility Check
              </button>

              <a href="#benefits" className={styles.btnHeroPurple}>
                <ChevronRight width={18} height={18} />
                See Benefits
              </a>
            </div>
          </div>

          <div className={`${styles.heroVisual} animate-fadeInUp`} style={{ animationDelay: "0.2s" }}>
            <div className={styles.toolPreview}>
              <div className={styles.previewTop}>
                <span>SORA Fertility Report</span>
                <Shield width={18} height={18} />
              </div>
              <div className={styles.previewMeter}>
                <div />
              </div>
              <div className={styles.previewCards}>
                <div>
                  <span>Risk Band</span>
                  <strong>Amber</strong>
                </div>
                <div>
                  <span>Referral</span>
                  <strong>Review advised</strong>
                </div>
              </div>
              <div className={styles.previewList}>
                <p><CheckCircle2 size={16} /> Cycle and age context</p>
                <p><CheckCircle2 size={16} /> Medical history signals</p>
                <p><CheckCircle2 size={16} /> Optional AMH, FSH, AFC review</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statsBanner}>
          <div className={styles.statCol}>
            <div className={styles.statNum}>27+</div>
            <div className={styles.statLabel}>RISK INPUTS</div>
          </div>
          <div className={styles.statCol}>
            <div className={styles.statNum}>3</div>
            <div className={styles.statLabel}>RISK BANDS</div>
          </div>
          <div className={styles.statCol}>
            <div className={styles.statNum}>5</div>
            <div className={styles.statLabel}>MINUTES</div>
          </div>
          <div className={styles.statCol}>
            <div className={styles.statNum}>100%</div>
            <div className={styles.statLabel}>PRIVATE SCORING</div>
          </div>
        </div>
      </section>

      <section className={styles.solutions} id="benefits">
        <div className={styles.solutionsHeader}>
          <h2 className={styles.solutionsTitle}>What SORA Fertility Helps You Understand</h2>
          <p className={styles.solutionsSubtitle}>
            The tool is not a diagnosis. It is a structured way to identify when routine waiting may be reasonable and when specialist discussion may be smarter.
          </p>
        </div>

        <div className={styles.solutionsGrid}>
          <div className={styles.solutionCardPopular}>
            <div className={styles.solutionBadge}>CORE TOOL</div>
            <h3 className={styles.popularCardTitle}>Fertility Risk Awareness Check</h3>
            <p className={styles.popularCardDesc}>
              Answer guided questions and receive a practical summary of fertility risk signals, referral urgency, and discussion points.
            </p>
            <button type="button" className={styles.btnExploreIvf} onClick={() => setIsQuizOpen(true)}>
              Take The Check <ChevronRight width={16} height={16} />
            </button>
            <div className={styles.babyIconOutline}>
              <BarChart3 width={120} height={120} style={{ opacity: 0.12, color: "white" }} />
            </div>
          </div>

          <div className={styles.smallCardsCol}>
            {benefits.slice(0, 2).map((benefit) => (
              <div className={styles.solutionCardPurple} key={benefit.title}>
                <div className={styles.dropperIconWrapper}>{benefit.icon}</div>
                <h4 className={styles.smallCardTitle}>{benefit.title}</h4>
                <p className={styles.smallCardDesc}>{benefit.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.capsulesRow}>
          <div className={styles.capsuleCard}><Activity width={16} height={16} /> <span>Cycle Pattern</span></div>
          <div className={styles.capsuleCard}><Clock width={16} height={16} /> <span>Trying Duration</span></div>
          <div className={styles.capsuleCard}><Award width={16} height={16} /> <span>Ovarian Reserve</span></div>
          <div className={styles.capsuleCard}><Lock width={16} height={16} /> <span>Secure Assessment</span></div>
        </div>
      </section>

      <section className={styles.professionals} id="why-test">
        <div className={styles.proHeader}>
          <div className={styles.proBadge}>WHY TEST EARLY</div>
          <h2 className={styles.proTitle}>Fertility is easier to plan when signals are visible</h2>
          <p className={styles.proSubtitle}>
            Many fertility factors are time-sensitive, treatable, or worth discussing earlier than people expect.
          </p>
        </div>

        <div className={styles.insightGrid}>
          {reasons.map((reason, index) => (
            <div className={styles.insightCard} key={reason}>
              <div className={styles.stepNum}>{index + 1}</div>
              <p>{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.testimonials} id="privacy">
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.testimonialsTitle}>Built For Privacy And Clarity</h2>
          <p className={styles.testimonialsSubtitle}>
            Sensitive fertility answers deserve a careful workflow.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {benefits.map((item) => (
            <div className={styles.testimonialCard} key={item.title}>
              <div className={styles.quoteIcon}>{item.icon}</div>
              <h3 className={styles.authorName}>{item.title}</h3>
              <p className={styles.quoteText}>{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.pathSection} id="how-it-works">
        <h2 className={styles.pathTitle}>How The Fertility Check Works</h2>

        <div className={styles.pathGrid}>
          <div className={styles.pathStep}>
            <div className={styles.stepNum}>1</div>
            <h3 className={styles.stepTitle}>Answer Guided Questions</h3>
            <p className={styles.stepDesc}>
              Share age, BMI, cycle history, reproductive context, medical history, lifestyle, and optional lab values.
            </p>
          </div>

          <div className={styles.pathStep}>
            <div className={styles.stepNum}>2</div>
            <h3 className={styles.stepTitle}>Receive Risk Bands</h3>
            <p className={styles.stepDesc}>
              SORA returns a low, medium, or high risk summary with red and amber factors clearly separated.
            </p>
          </div>

          <div className={styles.pathStep}>
            <div className={styles.stepNum}>3</div>
            <h3 className={styles.stepTitle}>Discuss Next Steps</h3>
            <p className={styles.stepDesc}>
              Use your report to decide whether routine planning, lifestyle review, testing, or specialist advice is appropriate.
            </p>
          </div>
        </div>

        <button type="button" className={styles.btnPathCta} onClick={() => setIsQuizOpen(true)}>
          Start My Fertility Check
        </button>
      </section>

      <footer className={styles.footer} id="footer">
        <div className={styles.footerInner}>
          <div className={styles.footerCol}>
            <div className={styles.logo} style={{ color: "white", marginBottom: "20px" }}>
              <Heart width={24} height={24} fill="var(--color-gold)" style={{ color: "var(--color-gold)" }} />
              <div>SORA <span>Fertility</span></div>
            </div>
            <p className={styles.footerDesc}>
              SORA Fertility provides private fertility risk awareness tools for people planning, trying, or thinking ahead.
            </p>
            <div className={styles.footerDisclaimer}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <ShieldAlert width={16} height={16} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                <strong>Clinical Qualifier:</strong>
              </div>
              This fertility check is educational risk awareness, not a diagnosis, treatment plan, or pregnancy prediction. Always consult a licensed clinician for medical decisions.
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4>Tool Coverage</h4>
            <ul className={styles.footerLinkList}>
              <li><a href="#benefits">Risk Factors</a></li>
              <li><a href="#why-test">Why Test Early</a></li>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Contact</h4>
            <div className={styles.contactInfoRow}>
              <Mail className={styles.contactIcon} width={18} height={18} />
              <span>support@sorafertility.com</span>
            </div>
            <div className={styles.contactInfoRow}>
              <Lock className={styles.contactIcon} width={18} height={18} />
              <span>Private server-side scoring and clinic-controlled integrations.</span>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div>&copy; {currentYear} SORA Fertility. Educational fertility awareness technology.</div>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#privacy">Privacy</a>
            <a href="#footer">Terms</a>
          </div>
        </div>
      </footer>

      {isQuizOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsQuizOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsQuizOpen(false)} aria-label="Close assessment">
              <X width={20} height={20} />
            </button>
            <QuizWizard />
          </div>
        </div>
      )}
    </div>
  );
}
