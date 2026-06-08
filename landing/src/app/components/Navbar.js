"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar({ onCtaClick, ctaText = "Request Demo" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.leftNav}>
          <Link href="/" className={styles.logo}>
            <Image src="/sora-logo.png" alt="SORA Fertility" width={120} height={40} className={styles.logoImage} />
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>Platform</Link>
            <Link href="/crm" className={styles.navLink}>Solutions</Link>
            <Link href="#" className={styles.navLink}>Case Studies</Link>
            <Link href="/fertility-assessment" className={styles.navLink}>Resources</Link>
            <Link href="#" className={styles.navLink}>About</Link>
          </nav>
        </div>

        <div className={styles.desktopActions}>
          <Link href="/login" className={styles.loginLink}>Login</Link>
          {onCtaClick ? (
            <button type="button" className={styles.btnNavCta} onClick={onCtaClick}>
              {ctaText}
            </button>
          ) : (
            <Link href="/crm" className={styles.btnNavCta} style={{ textDecoration: 'none' }}>
              {ctaText}
            </Link>
          )}
        </div>

        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Platform</Link>
          <Link href="/crm" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Solutions</Link>
          <Link href="#" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Case Studies</Link>
          <Link href="/fertility-assessment" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
          <Link href="#" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <div className={styles.mobileActions}>
            <Link href="/login" className={styles.loginLinkMobile} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            {onCtaClick ? (
              <button type="button" className={styles.btnNavCta} onClick={() => { onCtaClick(); setIsMobileMenuOpen(false); }}>
                {ctaText}
              </button>
            ) : (
              <Link href="/crm" className={styles.btnNavCta} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
