"use client";

import React, { useState } from 'react';
import { CalendarHeart, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { trackEvent } from '../../../lib/analytics';

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [results, setResults] = useState(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  React.useEffect(() => {
    trackEvent({ event: "tool_viewed", tool: "ovulation_calculator" });
  }, []);

  const trackStart = () => {
    if (!hasTrackedStart) {
      trackEvent({ event: "tool_started", tool: "ovulation_calculator" });
      setHasTrackedStart(true);
    }
  };

  const calculateOvulation = (e) => {
    e.preventDefault();
    if (!lastPeriod || !cycleLength) return;

    // Luteal phase is usually 14 days
    const lutealPhase = 14;
    const cycleDays = parseInt(cycleLength);
    
    const periodDate = new Date(lastPeriod);
    
    // Estimated ovulation day
    const ovulationDate = new Date(periodDate);
    ovulationDate.setDate(periodDate.getDate() + (cycleDays - lutealPhase));

    // Fertile window (5 days before ovulation + day of ovulation)
    const windowStart = new Date(ovulationDate);
    windowStart.setDate(ovulationDate.getDate() - 5);
    
    const windowEnd = new Date(ovulationDate);
    windowEnd.setDate(ovulationDate.getDate() + 1);

    const formatOpts = { day: 'numeric', month: 'long' };
    
    setResults({
      ovulation: ovulationDate.toLocaleDateString(undefined, formatOpts),
      windowStart: windowStart.toLocaleDateString(undefined, formatOpts),
      windowEnd: windowEnd.toLocaleDateString(undefined, formatOpts)
    });
    trackEvent({ event: "tool_completed", tool: "ovulation_calculator" });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div className="toolLayout tool-page-wrapper">
        <div className="toolContent">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>Ovulation Calculator</span>
        </div>
        
        <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} onFocusCapture={trackStart} onClickCapture={trackStart}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', background: '#fff1f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarHeart size={24} color="#ff2a5f" />
            </div>
            <h1 style={{ fontSize: '24px', color: '#1e293b', margin: 0, fontWeight: '800' }}>Ovulation Calculator</h1>
          </div>

          <form onSubmit={calculateOvulation} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>First day of your last period</label>
              <input 
                type="date" 
                value={lastPeriod}
                onChange={e => setLastPeriod(e.target.value)}
                required
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Average cycle length (days)</label>
              <input 
                type="number" 
                min="20" max="45"
                value={cycleLength}
                onChange={e => setCycleLength(e.target.value)}
                required
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
              />
            </div>

            <button type="submit" style={{ background: '#e11d48', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '12px' }}>
              Calculate Fertile Window
            </button>
          </form>

          {results && (
            <div style={{ marginTop: '40px', borderTop: '2px dashed #ffe4e6', paddingTop: '40px' }}>
              <div style={{ background: '#fff1f2', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                <h3 style={{ color: '#ff2a5f', margin: '0 0 8px 0', fontSize: '18px' }}>Estimated Fertile Window</h3>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#be123c', marginBottom: '16px' }}>
                  {results.windowStart} – {results.windowEnd}
                </div>
                
                <h3 style={{ color: '#ff2a5f', margin: '0 0 4px 0', fontSize: '15px' }}>Highest Fertility (Ovulation)</h3>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#e11d48' }}>
                  {results.ovulation}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#fff1f2', padding: '16px', borderRadius: '12px', border: '1px solid #ffe4e6' }}>
                <AlertCircle color="#e11d48" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '13px', color: '#9f1239', lineHeight: '1.5' }}>
                  <strong>Disclaimer:</strong> This is an estimate based on averages and may not reflect your actual ovulation date. Do not use this tool for contraception. If you have irregular cycles, these estimates may be inaccurate.
                </p>
              </div>
            </div>
          )}
        </div>
        </div>
        
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* AdSense Placement */}
          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '24px', textAlign: 'center', color: '#64748b', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Advertisement</div>
              <div style={{ fontSize: '12px' }}>[ Paste Google AdSense Code Here (300x600) ]</div>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
