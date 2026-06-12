"use client";

import React, { useState } from 'react';
import { CalendarHeart, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [results, setResults] = useState(null);

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
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', padding: '60px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link href="/tools" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 'bold', marginBottom: '24px', display: 'inline-block' }}>&larr; Back to Tools</Link>
        
        <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '56px', height: '56px', background: '#fce7f3', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarHeart size={28} color="#ec4899" />
            </div>
            <h1 style={{ fontSize: '28px', color: '#1e293b', margin: 0, fontWeight: '800' }}>Ovulation Calculator</h1>
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

            <button type="submit" style={{ background: '#ec4899', color: '#fff', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '12px' }}>
              Calculate Fertile Window
            </button>
          </form>

          {results && (
            <div style={{ marginTop: '40px', borderTop: '2px dashed #fce7f3', paddingTop: '40px' }}>
              <div style={{ background: '#fdf2f8', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                <h3 style={{ color: '#ec4899', margin: '0 0 8px 0', fontSize: '18px' }}>Estimated Fertile Window</h3>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#831843', marginBottom: '16px' }}>
                  {results.windowStart} – {results.windowEnd}
                </div>
                
                <h3 style={{ color: '#ec4899', margin: '0 0 4px 0', fontSize: '15px' }}>Highest Fertility (Ovulation)</h3>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#be185d' }}>
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
    </div>
  );
}
