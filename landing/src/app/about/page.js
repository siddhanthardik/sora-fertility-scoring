import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Heart, Activity, ShieldCheck, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export const metadata = {
  title: "About Us | SORA Fertility",
  description: "Learn about SORA Fertility's mission to optimize fertility clinic workflows and empower patients through intelligent risk awareness tools.",
};

export default function AboutPage() {
  const values = [
    {
      icon: <Heart size={32} />,
      title: "Empathy-Driven",
      description: "We build technology that acknowledges the emotional weight of the fertility journey. Our tools are designed to support patients with clarity and compassion, never overwhelm.",
    },
    {
      icon: <Activity size={32} />,
      title: "Clinical Precision",
      description: "Our algorithms and workflows are rooted in established clinical guidelines. We bridge the gap between complex reproductive science and accessible patient intelligence.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Uncompromising Privacy",
      description: "Fertility data is deeply personal. We adhere to the highest standards of data security and confidentiality, ensuring that patient information remains strictly protected.",
    },
  ];

  return (
    <div className={styles.container}>
      <Navbar />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>About SORA</h1>
        <p className={styles.heroDesc}>
          Empowering clinics with intelligent workflows and providing patients with the clarity they deserve.
        </p>
      </section>

      <main className={styles.main}>
        <section className={styles.missionSection}>
          <h2>Our Mission</h2>
          <p>
            At SORA Fertility, we believe that the journey to parenthood shouldn't be defined by confusion, administrative bottlenecks, or inaccessible care. Our mission is to fundamentally transform the fertility experience by equipping clinics with powerful, seamless CRM technology and empowering individuals with proactive, evidence-aligned fertility intelligence. We are dedicated to elevating the standard of reproductive care through precision software.
          </p>
        </section>

        <section className={styles.valuesSection}>
          <h2>Core Values</h2>
          <div className={styles.valuesGrid}>
            {values.map((value, idx) => (
              <div key={idx} className={styles.valueCard}>
                <div className={styles.iconWrapper}>
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Ready to elevate your clinic?</h2>
          <p>Discover how SORA's comprehensive software solutions can optimize your workflows and improve patient satisfaction.</p>
          <div className={styles.ctaButtons}>
            <Link href="/crm" className={styles.primaryCta}>
              Explore IVF CRM
            </Link>
            <Link href="/contact" className={styles.secondaryCta}>
              Contact Sales
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
