"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Activity, CalendarDays } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PeriodCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [results, setResults] = useState(null);

  const calculatePeriod = (e) => {
    e.preventDefault();
    if (!lastPeriodDate || !cycleLength) return;

    const startDate = new Date(lastPeriodDate);
    const cycle = parseInt(cycleLength, 10);
    
    // Calculate Next Period
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycle);
    
    // Calculate Ovulation (typically 14 days before next period)
    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);
    
    // Calculate Fertile Window (5 days before ovulation to 1 day after)
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    };

    let fwString = "";
    if (fertileStart.getMonth() === fertileEnd.getMonth()) {
      fwString = `${fertileStart.getDate()}–${fertileEnd.getDate()} ${fertileStart.toLocaleDateString('en-US', { month: 'long' })}`;
    } else {
      fwString = `${formatDate(fertileStart)} – ${formatDate(fertileEnd)}`;
    }

    setResults({
      nextPeriod: formatDate(nextPeriodDate),
      fertileWindow: fwString,
      ovulationEstimate: formatDate(ovulationDate)
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '60px 20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>Period Calculator</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: '#fff1f2', borderRadius: '16px', marginBottom: '24px' }}>
            <Activity size={32} color="#ff2a5f" />
          </div>
          <h1 style={{ fontSize: '36px', color: '#0f172a', fontWeight: '800', marginBottom: '16px' }}>Period Calculator</h1>
          <p style={{ fontSize: '18px', color: '#64748b' }}>Calculate your next period, ovulation estimate, and fertile window.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '32px' }}>
          <form onSubmit={calculatePeriod}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Last period:</label>
              <input 
                type="date"
                required
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }}
              />
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Average cycle length (days):</label>
              <input 
                type="number"
                min="20"
                max="45"
                required
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '16px', background: '#ff2a5f', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CalendarDays size={20} />
              Calculate
            </button>
          </form>
        </div>

        {results && (
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px', textAlign: 'center' }}>Results:</h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>Next period:</span>
                <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '18px' }}>{results.nextPeriod}</span>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>Fertile window:</span>
                <span style={{ fontWeight: 'bold', color: '#ff2a5f', fontSize: '18px' }}>{results.fertileWindow}</span>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>Ovulation estimate:</span>
                <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '18px' }}>{results.ovulationEstimate}</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: '#fff1f2', borderRadius: '24px', padding: '32px', textAlign: 'center', border: '1px solid #ffe4e6' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#e11d48', marginBottom: '12px' }}>Trying to conceive?</h3>
          <p style={{ color: '#be123c', marginBottom: '20px', fontSize: '15px' }}>Discover insights about your reproductive health and get personalized guidance with our clinical assessment.</p>
          <Link href="/fertility-assessment" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#e11d48', textDecoration: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 'bold', fontSize: '15px', border: '1px solid #fecdd3', transition: 'background 0.2s' }}>
            Take SORA Fertility Assessment
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
}
