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
            </div>
          </div>

          <Link href="/#benefits" className={styles.navLink}>Benefits</Link>
          <Link href="/#how-it-works" className={styles.navLink}>How It Works</Link>
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
          <Link href="/#benefits" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Benefits</Link>
          <Link href="/#how-it-works" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>How It Works</Link>
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
