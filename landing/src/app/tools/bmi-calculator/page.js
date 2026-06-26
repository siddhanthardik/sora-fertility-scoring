"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Activity, Scale } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AdsterraAd from '../../components/AdsterraAd';
import { trackEvent } from '../../../lib/analytics';

export default function BmiCalculator() {
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [results, setResults] = useState(null);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  React.useEffect(() => {
    trackEvent({ event: "tool_viewed", tool: "bmi_calculator" });
  }, []);

  const trackStart = () => {
    if (!hasTrackedStart) {
      trackEvent({ event: "tool_started", tool: "bmi_calculator" });
      setHasTrackedStart(true);
    }
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    let bmi = 0;

    if (unit === 'metric') {
      if (!heightCm || !weightKg) return;
      const heightM = parseFloat(heightCm) / 100;
      bmi = parseFloat(weightKg) / (heightM * heightM);
    } else {
      if (!heightFt || !weightLbs) return;
      const ft = parseFloat(heightFt);
      const inches = parseFloat(heightIn) || 0;
      const totalInches = (ft * 12) + inches;
      const lbs = parseFloat(weightLbs);
      bmi = (lbs / (totalInches * totalInches)) * 703;
    }

    if (isNaN(bmi) || bmi <= 0) return;

    let category = '';
    let fertilityImpact = '';
    let color = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      fertilityImpact = 'Being underweight can cause irregular cycles or stop ovulation entirely (amenorrhea). This can make it difficult to conceive. It is highly recommended to speak with a fertility specialist or nutritionist.';
      color = '#eab308'; // yellow
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Healthy Weight';
      fertilityImpact = 'Your BMI is in the optimal range for conception. This supports healthy ovulation and is associated with the highest rates of natural conception and IVF success.';
      color = '#10b981'; // green
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      fertilityImpact = 'Being slightly overweight can disrupt hormones and affect ovulation, especially if you have conditions like PCOS. Even a 5% reduction in weight can significantly improve your chances of conception.';
      color = '#f97316'; // orange
    } else {
      category = 'Obesity';
      fertilityImpact = 'A high BMI is linked to irregular ovulation, hormone imbalances, and lower success rates with fertility treatments like IVF. Medical guidelines recommend weight management to improve both maternal and fetal health during pregnancy.';
      color = '#ef4444'; // red
    }

    setResults({
      bmi: bmi.toFixed(1),
      category,
      fertilityImpact,
      color
    });
    trackEvent({ event: "tool_completed", tool: "bmi_calculator" });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div className="toolLayout tool-page-wrapper">
        <div className="tool-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
            <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
            <ChevronRight size={14} color="#94a3b8" />
            <span style={{ color: '#ff2a5f' }}>BMI Fertility Calculator</span>
          </div>


        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: '#fff1f2', borderRadius: '16px', marginBottom: '16px' }}>
            <Scale size={24} color="#e11d48" />
          </div>
          <h1 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>BMI Fertility Calculator</h1>
          <p style={{ fontSize: '16px', color: '#64748b' }}>Calculate your BMI and understand how your weight impacts your reproductive health.</p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <AdsterraAd size="468x60" className="ad-desktop-only" />
          <AdsterraAd size="300x250" className="ad-mobile-only" />
        </div>

        <div className="tool-form-card" onFocusCapture={trackStart} onClickCapture={trackStart}>
          
          <div className="tool-unit-toggle">
            <button 
              onClick={() => { setUnit('metric'); setResults(null); }}
              style={{ padding: '8px 24px', borderRadius: '100px', fontWeight: 'bold', fontSize: '15px', border: 'none', background: unit === 'metric' ? '#0f172a' : '#f1f5f9', color: unit === 'metric' ? '#fff' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Metric (kg/cm)
            </button>
            <button 
              onClick={() => { setUnit('imperial'); setResults(null); }}
              style={{ padding: '8px 24px', borderRadius: '100px', fontWeight: 'bold', fontSize: '15px', border: 'none', background: unit === 'imperial' ? '#0f172a' : '#f1f5f9', color: unit === 'imperial' ? '#fff' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Imperial (lbs/ft)
            </button>
          </div>

          <form onSubmit={calculateBMI}>
            {unit === 'metric' ? (
              <div className="tool-input-grid-2">
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Height (cm)</label>
                  <input 
                    type="number" required min="50" max="250" value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Weight (kg)</label>
                  <input 
                    type="number" required min="20" max="300" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                  />
                </div>
              </div>
            ) : (
              <div className="tool-input-grid-3">
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Height (ft)</label>
                  <input 
                    type="number" required min="2" max="8" value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Height (in)</label>
                  <input 
                    type="number" min="0" max="11" value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Weight (lbs)</label>
                  <input 
                    type="number" required min="40" max="700" step="0.1" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '12px 24px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Scale size={20} />
              Calculate My BMI
            </button>
          </form>
        </div>

        {results && (
          <div style={{ marginBottom: '32px' }}>
            <AdsterraAd size="728x90" className="ad-desktop-only" />
            <AdsterraAd size="300x250" className="ad-mobile-only" />
          </div>
        )}

        {results && (
          <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', marginBottom: '32px', textAlign: 'center', borderTop: `8px solid ${results.color}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Results</h2>
            <div style={{ fontSize: '64px', fontWeight: '900', color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>{results.bmi}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: results.color, marginBottom: '24px' }}>{results.category}</div>
            
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>What this means for your fertility:</h3>
              <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
                {results.fertilityImpact}
              </p>
            </div>
          </div>
        )}
        </div>

        <aside style={{ position: 'sticky', top: '100px' }}>
          <AdsterraAd size="300x250" />
          <AdsterraAd size="160x300" />
        </aside>

      </div>

      {/* SEO & Educational Content Section */}
      <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#334155', lineHeight: 1.8, fontSize: '18px' }}>
          
          <h2 style={{ fontSize: '32px', color: '#0f172a', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            How Does BMI Affect Fertility?
          </h2>
          <p style={{ marginBottom: '32px' }}>
            Body Mass Index (BMI) is a clinical measurement that uses your height and weight to estimate body fat. When it comes to fertility, weight plays a crucial role in hormonal balance. Both being underweight and overweight can significantly disrupt the hormones required for regular ovulation and conception.
          </p>

          <h3 style={{ fontSize: '24px', color: '#0f172a', fontWeight: 'bold', marginBottom: '16px', marginTop: '48px' }}>
            The Ideal BMI for Conception
          </h3>
          <p style={{ marginBottom: '24px' }}>
            Medical research indicates that the optimal BMI for natural conception and IVF success falls within the "Healthy Weight" category (<strong>18.5 to 24.9</strong>). Within this range, women are most likely to experience regular menstrual cycles and predictable ovulation.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}><strong>Underweight (BMI &lt; 18.5):</strong> Can lead to hypothalamic amenorrhea, where the brain stops sending signals to the ovaries to release an egg.</li>
            <li style={{ marginBottom: '12px' }}><strong>Overweight/Obese (BMI &ge; 25):</strong> Excess fat tissue produces excess estrogen and is linked to insulin resistance. This can prevent ovulation and is closely tied to Polycystic Ovary Syndrome (PCOS).</li>
          </ul>

          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #ff2a5f', marginTop: '48px', marginBottom: '48px' }}>
            <h4 style={{ fontSize: '20px', color: '#0f172a', fontWeight: 'bold', marginBottom: '12px' }}>
              Frequently Asked Questions
            </h4>
            
            <div style={{ marginBottom: '24px' }}>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Can losing weight improve my chances of getting pregnant?</strong>
              <span>Yes. For women with a high BMI, losing just 5% to 10% of total body weight can dramatically improve ovulation rates and boost the success of fertility treatments.</span>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>Does BMI affect male fertility?</strong>
              <span>Absolutely. High BMI in men is associated with lower testosterone levels, decreased sperm concentration, and reduced sperm motility. A healthy weight improves fertility for both partners.</span>
            </div>

            <div>
              <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>What if my BMI is high due to muscle mass?</strong>
              <span>BMI doesn't distinguish between fat and muscle. If you are highly athletic or muscular, your BMI might fall into the "overweight" category despite having a low body fat percentage. Your doctor will look at your overall clinical picture.</span>
            </div>
          </div>

          <div style={{ background: '#fff1f2', borderRadius: '24px', padding: '32px', textAlign: 'center', border: '1px solid #ffe4e6' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#e11d48', marginBottom: '12px' }}>Wondering about your fertility health?</h3>
            <p style={{ color: '#be123c', marginBottom: '20px', fontSize: '15px' }}>Take our clinical assessment to understand your reproductive timeline and receive personalized guidance.</p>
            <Link href="/fertility-assessment" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#e11d48', textDecoration: 'none', padding: '12px 24px', borderRadius: '100px', fontWeight: 'bold', fontSize: '15px', border: '1px solid #fecdd3', transition: 'background 0.2s' }}>
              Take SORA Fertility Assessment
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
