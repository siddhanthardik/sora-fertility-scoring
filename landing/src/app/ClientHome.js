"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartPulse, BookOpen, ShieldCheck, Activity, CalendarHeart, Scale, Baby, Snowflake, ChevronRight } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DemoModal from "./components/DemoModal";
import styles from "./page.module.css";

export default function Home() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      <Navbar hideCta={true} />

      {/* SECTION 1: HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>ADVANCED FERTILITY PLATFORM</div>
            <h1 className={styles.heroTitle}>Understand Your Fertility.<br />Make Confident Decisions.</h1>
            <p className={styles.heroDesc}>
              Private fertility tools and evidence-based assessments designed to help you navigate every stage of your reproductive journey.
            </p>
            <div className={styles.heroActions}>
              <Link href="/tools" className={styles.btnPrimaryLg}>Explore Free Tools</Link>
              <a href="#clinics" className={styles.btnSecondaryLg}>For Fertility Clinics</a>
            </div>
            <div className={styles.trustBanner}>
              Trusted by women trying to conceive, planning ahead, and seeking clarity.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FREE FERTILITY TOOLS */}
      <section className={styles.toolsShowcaseSection}>
        <div className={styles.toolsShowcaseInner}>
          <div className={styles.sectionHeaderCenter}>
            <h2 className={styles.sectionTitle}>Free Fertility Tools</h2>
            <div className={styles.accentLine}></div>
            <p className={styles.sectionSubtitle}>Discover insights into your cycle, timeline, and hormonal health.</p>
          </div>

          <div className={styles.toolsShowcaseGrid}>
            <Link href="/fertility-assessment" className={styles.toolShowcaseCard}>
              <div className={styles.toolShowcaseIcon}><HeartPulse size={24} /></div>
              <h3 className={styles.toolShowcaseTitle}>Fertility Assessment</h3>
              <p className={styles.toolShowcaseDesc}>Comprehensive analysis of your reproductive timeline and risk factors.</p>
              <div className={styles.toolShowcaseLink}>Explore <ArrowRight size={14} /></div>
            </Link>
            
            <Link href="/tools/egg-freezing-planner" className={styles.toolShowcaseCard}>
              <div className={styles.toolShowcaseIcon}><Snowflake size={24} /></div>
              <h3 className={styles.toolShowcaseTitle}>Egg Freezing Planner</h3>
              <p className={styles.toolShowcaseDesc}>Understand how age influences fertility preservation and explore options.</p>
              <div className={styles.toolShowcaseLink}>Explore <ArrowRight size={14} /></div>
            </Link>

            <Link href="/tools/due-date-calculator" className={styles.toolShowcaseCard}>
              <div className={styles.toolShowcaseIcon}><Baby size={24} /></div>
              <h3 className={styles.toolShowcaseTitle}>Due Date Calculator</h3>
              <p className={styles.toolShowcaseDesc}>Calculate your estimated due date for natural pregnancy, IUI, and IVF.</p>
              <div className={styles.toolShowcaseLink}>Explore <ArrowRight size={14} /></div>
            </Link>

            <Link href="/pcos-assessment" className={styles.toolShowcaseCard}>
              <div className={styles.toolShowcaseIcon}><Activity size={24} /></div>
              <h3 className={styles.toolShowcaseTitle}>PCOS Assessment</h3>
              <p className={styles.toolShowcaseDesc}>Evaluate your symptoms against clinical criteria for Polycystic Ovary Syndrome.</p>
              <div className={styles.toolShowcaseLink}>Explore <ArrowRight size={14} /></div>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/tools" className={styles.btnOutlineDark} style={{ color: '#e11d48', borderColor: '#fce7f3', background: 'white' }}>Explore All Tools</Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: VALUE PROP */}
      <section className={styles.valuePropSection}>
        <div className={styles.valuePropInner}>
          <h2 className={styles.sectionTitleCenter}>Take the Guesswork Out of Fertility</h2>
          <div className={styles.accentLine}></div>

          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><Activity size={28} /></div>
              <h3 className={styles.valueTitle}>Assess</h3>
              <p className={styles.valueDesc}>Understand your reproductive health through personalized risk assessments.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><BookOpen size={28} /></div>
              <h3 className={styles.valueTitle}>Learn</h3>
              <p className={styles.valueDesc}>Get evidence-based insights without the confusing medical jargon.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><ShieldCheck size={28} /></div>
              <h3 className={styles.valueTitle}>Act</h3>
              <p className={styles.valueDesc}>Know exactly when it is time to seek support from a fertility specialist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED TOOL */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredInner}>
          <div className={styles.featuredContent}>
            <div className={styles.badge} style={{ background: '#e0e7ff', color: '#4338ca' }}>FEATURED TOOL OF THE MONTH</div>
            <h2 className={styles.featuredTitle}>Egg Freezing Planner™</h2>
            <p className={styles.featuredDesc}>
              A comprehensive guide to understanding your timeline, estimated costs, and clinical considerations for fertility preservation. Designed by experts, completely private.
            </p>
            <ul className={styles.featuredList}>
              <li><CheckCircle2 size={16} color="#4338ca" /> Age-based timeline forecasting</li>
              <li><CheckCircle2 size={16} color="#4338ca" /> Clinical risk factor breakdown</li>
              <li><CheckCircle2 size={16} color="#4338ca" /> Downloadable PDF report</li>
            </ul>
            <Link href="/tools/egg-freezing-planner" className={styles.btnPrimaryLg} style={{ background: '#4338ca', boxShadow: '0 4px 15px rgba(67, 56, 202, 0.4)' }}>Try Planner Free</Link>
          </div>
          <div className={styles.featuredVisual}>
            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
               <Snowflake size={64} color="#4338ca" style={{ marginBottom: '24px' }} />
               <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Your Preservation Journey</h3>
               <p style={{ color: '#64748b', lineHeight: '1.6' }}>Based on your inputs, freezing before age 32 yields the highest probability of future success...</p>
               <div style={{ marginTop: '24px', background: '#e0e7ff', color: '#4338ca', padding: '12px', borderRadius: '8px', fontWeight: '600', textAlign: 'center' }}>
                 Generate Report
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOR CLINICS */}
      <section id="clinics" className={styles.clinicsSection}>
        <div className={styles.clinicsInner}>
          <div className={styles.clinicsContent}>
            <h2 className={styles.clinicsTitle}>For Fertility Clinics</h2>
            <p className={styles.clinicsDesc}>
              Already helping patients? SORA Clinic powers lead management, cycle tracking, patient engagement, and fertility workflows. 
              Turn high-intent website visitors into booked consultations.
            </p>
            <button className={styles.btnBlack} onClick={() => setIsDemoModalOpen(true)}>Book CRM Demo</button>
          </div>
          <div className={styles.clinicsGrid}>
            <div className={styles.clinicsFeature}>
              <div className={styles.clinicsIcon}><CheckCircle2 size={16} /></div>
              <span>Automated Lead Nurturing</span>
            </div>
            <div className={styles.clinicsFeature}>
              <div className={styles.clinicsIcon}><CheckCircle2 size={16} /></div>
              <span>Clinical Cycle Tracking</span>
            </div>
            <div className={styles.clinicsFeature}>
              <div className={styles.clinicsIcon}><CheckCircle2 size={16} /></div>
              <span>Secure Patient Portal</span>
            </div>
            <div className={styles.clinicsFeature}>
              <div className={styles.clinicsIcon}><CheckCircle2 size={16} /></div>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY SORA IS DIFFERENT */}
      <section className={styles.whyDifferentSection}>
        <div className={styles.whyDifferentInner}>
          <h2 className={styles.sectionTitleCenter}>Why SORA Is Different</h2>
          <div className={styles.accentLine}></div>
          
          <div className={styles.differentGrid}>
            <div className={styles.differentCard}>
              <div className={styles.differentNumber}>01</div>
              <h3 className={styles.differentTitle}>Private & No Signup</h3>
              <p className={styles.differentDesc}>We believe your health data is yours. Use our calculators entirely anonymously without ever creating an account.</p>
            </div>
            <div className={styles.differentCard}>
              <div className={styles.differentNumber}>02</div>
              <h3 className={styles.differentTitle}>Evidence-Based</h3>
              <p className={styles.differentDesc}>Our logic is built upon leading medical society guidelines, ensuring you get clinical-grade insights.</p>
            </div>
            <div className={styles.differentCard}>
              <div className={styles.differentNumber}>03</div>
              <h3 className={styles.differentTitle}>Exclusively Fertility</h3>
              <p className={styles.differentDesc}>Unlike generic health trackers, SORA is designed specifically for complex reproductive health journeys.</p>
            </div>
            <div className={styles.differentCard}>
              <div className={styles.differentNumber}>04</div>
              <h3 className={styles.differentTitle}>Trusted by Clinics</h3>
              <p className={styles.differentDesc}>Top fertility specialists rely on SORA's enterprise software to manage their own patients.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
