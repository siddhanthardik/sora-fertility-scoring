"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Activity, CalendarDays } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { trackEvent } from '../../../lib/analytics';

export default function PeriodCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [results, setResults] = useState(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  React.useEffect(() => {
    trackEvent({ event: "tool_viewed", tool: "period_calculator" });
  }, []);

  const trackStart = () => {
    if (!hasTrackedStart) {
      trackEvent({ event: "tool_started", tool: "period_calculator" });
      setHasTrackedStart(true);
    }
  };

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
    trackEvent({ event: "tool_completed", tool: "period_calculator" });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <style>{`
        .toolLayout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .toolLayout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ flex: 1, padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }} className="toolLayout">
        <div className="toolContent">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>Period Calculator</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: '#fff1f2', borderRadius: '16px', marginBottom: '16px' }}>
            <Activity size={24} color="#e11d48" />
          </div>
          <h1 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>Period Calculator</h1>
          <p style={{ fontSize: '16px', color: '#64748b' }}>Calculate your next period, ovulation estimate, and fertile window.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '32px' }} onFocusCapture={trackStart} onClickCapture={trackStart}>
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

            <button type="submit" style={{ width: '100%', padding: '12px 24px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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

      {/* SEO & Educational Content Section */}
      <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#334155', lineHeight: 1.8, fontSize: '18px' }}>
          
          <h2 style={{ fontSize: '32px', color: '#0f172a', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            Understanding Your Menstrual Cycle & Fertile Window
          </h2>
          <p style={{ marginBottom: '32px' }}>
            Whether you are trying to conceive or simply want to understand your body better, tracking your menstrual cycle is one of the most powerful steps you can take for your reproductive health. The <strong>SORA Period Calculator</strong> uses clinical averages to estimate your next period, your likely ovulation day, and the most fertile days of your cycle.
          </p>

          <h3 style={{ fontSize: '24px', color: '#0f172a', fontWeight: 'bold', marginBottom: '16px', marginTop: '48px' }}>
            What is the "Fertile Window"?
          </h3>
          <p style={{ marginBottom: '24px' }}>
            Your fertile window is the brief period during your menstrual cycle when pregnancy is possible. It typically spans <strong>six days</strong>: the five days leading up to ovulation, plus the day of ovulation itself. Sperm can survive in the female reproductive tract for up to 5 days, which is why having intercourse before you actually ovulate can still result in conception.
          </p>

          <h3 style={{ fontSize: '24px', color: '#0f172a', fontWeight: 'bold', marginBottom: '16px', marginTop: '48px' }}>
            How do you calculate ovulation?
          </h3>
          <p style={{ marginBottom: '24px' }}>
            Ovulation is the release of a mature egg from the ovary. For women with a standard 28-day cycle, ovulation usually occurs around day 14. However, the true medical calculation is that ovulation happens approximately <strong>14 days before the start of your next period</strong>. 
          </p>
          <p style={{ marginBottom: '32px' }}>
            This means if you have a 32-day cycle, you likely ovulate around day 18, not day 14. Our calculator handles this math automatically to give you the most accurate prediction possible based on your cycle length.
          </p>

          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #ff2a5f', marginTop: '48px', marginBottom: '48px' }}>
            <h4 style={{ fontSize: '20px', color: '#0f172a', fontWeight: 'bold', marginBottom: '12px' }}>
              Frequently Asked Questions
            </h4>
            
            <div style={{ marginBottom: '24px' }}>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>How accurate is this calculator?</strong>
              <span>This calculator provides a clinical estimate based on averages. If your cycles are highly irregular, ovulation may not be perfectly predictable using math alone. We recommend pairing this with ovulation predictor kits (OPKs) or basal body temperature tracking.</span>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Can I get pregnant outside my fertile window?</strong>
              <span>While highly unlikely, it is technically possible if you miscalculate your window due to an unexpected shift in ovulation. If you are trying to avoid pregnancy, do not rely solely on calendar math.</span>
            </div>

            <div>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>What if my cycle is shorter than 21 days or longer than 35 days?</strong>
              <span>Cycles outside the 21–35 day range may indicate an underlying condition like PCOS or thyroid issues. We highly recommend taking the SORA Clinical Assessment for personalized guidance.</span>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
