"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Baby, CalendarClock, CalendarCheck } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function DueDateCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [results, setResults] = useState(null);

  const calculateDueDate = (e) => {
    e.preventDefault();
    if (!lastPeriodDate) return;

    const lmpDate = new Date(lastPeriodDate);
    
    // Naegele's rule: add 7 days to LMP, then subtract 3 months (or add 280 days total)
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280);

    // Calculate current gestational age
    const today = new Date();
    const diffTime = Math.abs(today - lmpDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let currentWeeks = Math.floor(diffDays / 7);
    let currentDays = diffDays % 7;
    
    // Cap at 42 weeks
    if (currentWeeks > 42) {
      currentWeeks = 42;
      currentDays = 0;
    }
    
    // Milestones
    const firstTrimesterEnd = new Date(lmpDate);
    firstTrimesterEnd.setDate(firstTrimesterEnd.getDate() + 13 * 7); // 13 weeks
    
    const secondTrimesterEnd = new Date(lmpDate);
    secondTrimesterEnd.setDate(secondTrimesterEnd.getDate() + 27 * 7); // 27 weeks

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    setResults({
      dueDate: formatDate(dueDate),
      gestationalAge: `${currentWeeks} weeks, ${currentDays} days`,
      firstTrimesterEnd: formatDate(firstTrimesterEnd),
      secondTrimesterEnd: formatDate(secondTrimesterEnd)
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '60px 20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>Due Date Calculator</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: '#fff1f2', borderRadius: '16px', marginBottom: '24px' }}>
            <Baby size={32} color="#ff2a5f" />
          </div>
          <h1 style={{ fontSize: '36px', color: '#0f172a', fontWeight: '800', marginBottom: '16px' }}>Due Date Calculator</h1>
          <p style={{ fontSize: '18px', color: '#64748b' }}>Calculate your estimated due date based on your last period.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '32px' }}>
          <form onSubmit={calculateDueDate}>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>First day of your last period:</label>
              <input 
                type="date"
                required
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '16px', background: '#ff2a5f', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CalendarCheck size={20} />
              Calculate Due Date
            </button>
          </form>
        </div>

        {results && (
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>Estimated Due Date</h2>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#ff2a5f', textAlign: 'center', marginBottom: '32px' }}>
              {results.dueDate}
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarClock size={18} color="#94a3b8" /> Current Gestational Age:
                </span>
                <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '16px' }}>{results.gestationalAge}</span>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>End of 1st Trimester:</span>
                <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '16px' }}>{results.firstTrimesterEnd}</span>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#475569' }}>End of 2nd Trimester:</span>
                <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '16px' }}>{results.secondTrimesterEnd}</span>
              </div>
            </div>
            <p style={{ marginTop: '24px', fontSize: '13px', color: '#94a3b8', textAlign: 'center', lineHeight: '1.5' }}>
              * This is an estimate based on a standard 28-day cycle. Only 4% of babies are actually born on their exact due date!
            </p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
