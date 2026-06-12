"use client";

import React, { useState } from 'react';
import { Scale, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [results, setResults] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    if (!h || !w || h <= 0 || w <= 0) return;

    const bmiValue = w / Math.pow(h / 100, 2);
    const bmi = parseFloat(bmiValue.toFixed(1));

    let category = "";
    let implications = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "#3b82f6"; // blue
      implications = "Being underweight can cause irregular or absent periods (amenorrhea). This happens because your body may reduce estrogen production and stop ovulating to conserve energy. Gaining a small amount of weight can often restore regular ovulation.";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      category = "Normal (Asian Cut-offs)";
      color = "#10b981"; // green
      implications = "Your BMI is within the optimal range for reproductive health. Maintaining this weight supports regular ovulation and healthy hormone balance.";
    } else if (bmi >= 23 && bmi <= 24.9) {
      category = "Overweight (Asian Cut-offs)";
      color = "#f59e0b"; // yellow
      implications = "Based on Asian clinical cut-offs, this falls into the overweight category. Slight increases in weight can begin to increase insulin resistance, which may subtly impact ovulation or exacerbate underlying conditions like PCOS.";
    } else {
      category = "Obese (Asian Cut-offs)";
      color = "#ef4444"; // red
      implications = "Higher BMI is closely linked with increased insulin resistance and excess androgen production. This can disrupt regular ovulation and make conception more difficult. Losing just 5-10% of body weight can significantly improve ovulation rates.";
    }

    setResults({ bmi, category, implications, color });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '60px 20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>BMI & Fertility</span>
        </div>
        
        <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '56px', height: '56px', background: '#fff1f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={28} color="#ff2a5f" />
            </div>
            <h1 style={{ fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: '800' }}>BMI & Fertility</h1>
          </div>

          <form onSubmit={calculateBMI} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Height (cm)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 165"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Weight (kg)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 60"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                />
              </div>
            </div>

            <button type="submit" style={{ background: '#ff2a5f', color: '#fff', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '12px' }}>
              Calculate BMI
            </button>
          </form>

          {results && (
            <div style={{ marginTop: '40px', borderTop: '2px dashed #ffe4e6', paddingTop: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', fontWeight: '900', color: results.color, lineHeight: '1' }}>{results.bmi}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#475569', marginTop: '8px' }}>{results.category}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Info size={20} color="#0f172a" />
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Fertility Implications</h3>
                </div>
                <p style={{ margin: 0, color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>
                  {results.implications}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
