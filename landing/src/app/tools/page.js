"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, CalendarHeart, Scale, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ToolsHub() {
  const [soraId, setSoraId] = useState("");

  useEffect(() => {
    let savedId = localStorage.getItem("soraId");
    if (!savedId) {
      savedId = "SRA-" + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem("soraId", savedId);
    }
    setSoraId(savedId);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '60px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', color: '#0f172a', fontWeight: '800', marginBottom: '16px' }}>Free Fertility Tools</h1>
          <p style={{ fontSize: '18px', color: '#64748b' }}>Track your cycle, calculate ovulation, and understand your fertility better.</p>
          {soraId && (
            <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', background: '#e2e8f0', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#475569' }}>
              Your Anonymous SORA ID: <strong style={{ color: '#0f172a', marginLeft: '6px' }}>{soraId}</strong>
            </div>
          )}
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <ToolCard 
            title="Ovulation Calculator"
            description="Estimate your fertile window and ovulation date to optimize your chances of conceiving."
            icon={<CalendarHeart size={32} color="#ff2a5f" />}
            href="/tools/ovulation-calculator"
          />
          <ToolCard 
            title="BMI Fertility Calculator"
            description="Check your Body Mass Index and understand its specific implications on your hormonal health."
            icon={<Scale size={32} color="#ff2a5f" />}
            href="/tools/bmi-calculator"
          />
          <ToolCard 
            title="Cycle Tracker"
            description="Log your periods, symptoms, and flow to find patterns in your menstrual health."
            icon={<Activity size={32} color="#ff2a5f" />}
            href="/tools/cycle-tracker"
          />
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ToolCard({ title, description, icon, href }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        padding: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        border: '1px solid #f1f5f9'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
      }}
      >
        <div style={{ width: '64px', height: '64px', background: '#fff1f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>{title}</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '15px', lineHeight: '1.5' }}>{description}</p>
        </div>
        <ChevronRight size={24} color="#cbd5e1" />
      </div>
    </Link>
  );
}
