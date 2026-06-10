"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, Code, LogOut, CreditCard, Menu, X } from "lucide-react";
import styles from "./clinicLayout.module.css";

export default function ClinicDashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/clinics/login", { method: "DELETE" });
    router.push("/clinic/login");
  };

  const navLinks = [
    { name: "Leads Dashboard", href: "/clinic", icon: LayoutDashboard },
    { name: "Widget Embed", href: "/clinic/widget", icon: Code },
    { name: "Billing", href: "/clinic/billing", icon: CreditCard },
    { name: "Settings", href: "/clinic/settings", icon: Settings },
  ];

  const isAuthPage = pathname === "/clinic/login" || pathname === "/clinic/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layoutContainer}>
      {/* Mobile Overlay */}
      <div 
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayOpen : ""}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <Image src="/sora-logo.png" alt="SORA Logo" width={210} height={68} style={{ width: "auto", height: "auto", objectFit: "contain" }} priority />
        </div>
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                <Icon className={styles.navIcon} size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className={styles.footer}>
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <LogOut className={styles.logoutIcon} size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <div className={styles.mobileBrand}>
            <Image src="/sora-logo.png" alt="SORA Logo" width={165} height={53} style={{ width: "auto", height: "auto", objectFit: "contain" }} priority />
          </div>
          <button 
            className={styles.menuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Page Content */}
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
