"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar({ onCtaClick, ctaText = "Book a Demo" }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          <Image src="/sora-logo.png" alt="SORA Fertility" width={280} height={80} className={styles.logoImage} />
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
        </nav>

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
    </header>
  );
}
