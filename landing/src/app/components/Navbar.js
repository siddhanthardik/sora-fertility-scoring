"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar({ onCtaClick, ctaText = "Book a Demo", hideCta = false, ctaColor }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          <Image src="/sora-logo.png" alt="SORA Fertility" width={160} height={45} className={styles.logoImage} priority />
        </Link>

        <nav className={styles.nav}>
          <Link href="/crm" className={styles.navLink}>IVF CRM</Link>
          
          <div className={styles.dropdownContainer}>
            <span className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              Tools <ChevronDown width={14} height={14} />
            </span>
            <div className={styles.dropdownMenu}>
              <Link href="/fertility-assessment" className={styles.dropdownItem}>Fertility Assessment</Link>
              <Link href="/pcos-assessment" className={styles.dropdownItem}>PCOS Risk Assessment</Link>
              <Link href="/tools/period-calculator" className={styles.dropdownItem}>Period Calculator</Link>
              <Link href="/tools/due-date-calculator" className={styles.dropdownItem}>Due Date Calculator</Link>
              <Link href="/tools/ovulation-calculator" className={styles.dropdownItem}>Ovulation Calculator</Link>
              <Link href="/tools/bmi-calculator" className={styles.dropdownItem}>BMI Fertility Calculator</Link>
              {/* New Premium Tool */}
              <Link href="/tools/egg-freezing-planner" className={styles.dropdownItem}>Egg Freezing Planner</Link>
            </div>
          </div>

          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/blog" className={styles.navLink}>Blog</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>

        {!hideCta && (
          <div className={styles.desktopCta}>
            {onCtaClick ? (
              <button type="button" className={styles.btnNavCta} onClick={onCtaClick} style={ctaColor ? { backgroundColor: ctaColor } : {}}>
                {ctaText}
              </button>
            ) : (
              <Link href="/crm" className={styles.btnNavCta} style={{ textDecoration: 'none', ...(ctaColor ? { backgroundColor: ctaColor } : {}) }}>
                {ctaText}
              </Link>
            )}
          </div>
        )}

        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} color="#011434" /> : <Menu size={24} color="#011434" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileNav}>
          <Link href="/crm" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>IVF CRM</Link>
          <Link href="/fertility-assessment" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Fertility Assessment</Link>
          <Link href="/pcos-assessment" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>PCOS Assessment</Link>
          <Link href="/tools/period-calculator" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Period Calculator</Link>
          <Link href="/tools/due-date-calculator" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Due Date Calculator</Link>
          <Link href="/tools/ovulation-calculator" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Ovulation Calculator</Link>
          <Link href="/tools/bmi-calculator" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>BMI Calculator</Link>
          <Link href="/tools/egg-freezing-planner" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Egg Freezing Planner</Link>
          <Link href="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link href="/blog" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          {!hideCta && (
            <div className={styles.mobileCtaWrapper}>
              {onCtaClick ? (
                <button type="button" className={styles.btnNavCta} onClick={(e) => { setIsMobileMenuOpen(false); onCtaClick(e); }} style={ctaColor ? { backgroundColor: ctaColor } : {}}>
                  {ctaText}
                </button>
              ) : (
                <Link href="/crm" className={styles.btnNavCta} style={{ textDecoration: 'none', ...(ctaColor ? { backgroundColor: ctaColor } : {}) }} onClick={() => setIsMobileMenuOpen(false)}>
                  {ctaText}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
