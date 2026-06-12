"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Snowflake, Download, Mail, Activity, Target, Shield, Clock, Heart, BookOpen, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function EggFreezingPlanner() {
  const [hasStarted, setHasStarted] = useState(false);
  
  // Inputs
  const [age, setAge] = useState(30);
  const [relationship, setRelationship] = useState('');
  const [timeline, setTimeline] = useState('');
  const [amh, setAmh] = useState('');
  const [pcos, setPcos] = useState('');
  const [earlyMenopause, setEarlyMenopause] = useState('');
  const [surgery, setSurgery] = useState('');
  const [cancer, setCancer] = useState('');

  // UI State
  const [results, setResults] = useState(null);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Scroll ref
  const resultsRef = useRef(null);

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    
    // Logic
    let baseLevel = 0;
    if (age < 30) baseLevel = 0;
    else if (age >= 30 && age <= 34) baseLevel = 1;
    else if (age >= 35 && age <= 37) baseLevel = 2;
    else if (age >= 38 && age <= 40) baseLevel = 3;
    else baseLevel = 4;

    if (cancer === 'yes' || surgery === 'yes' || earlyMenopause === 'yes') {
      baseLevel = Math.max(baseLevel, 4);
    } else if (amh && parseFloat(amh) < 1.0) {
      baseLevel = Math.max(baseLevel, 3);
    } else if (pcos === 'yes') {
      baseLevel = Math.max(baseLevel, 2);
    }

    const categories = [
      { id: 'info', name: 'Information Gathering Stage', desc: 'Many women use this stage to learn about future fertility options.' },
      { id: 'favorable', name: 'Favorable Planning Window', desc: 'You are in an optimal age range where egg freezing tends to yield higher numbers of eggs per cycle.' },
      { id: 'reasonable', name: 'Reasonable Time to Explore Options', desc: 'A great time to evaluate your reserve and discuss proactive preservation.' },
      { id: 'earlier', name: 'Earlier Discussion May Be Helpful', desc: 'Some women choose to seek specialist advice sooner to better understand available options.' },
      { id: 'prompt', name: 'Prompt Specialist Discussion Often Considered', desc: 'An earlier fertility consultation may provide clarity regarding available options and timelines.' },
    ];

    const category = categories[baseLevel];

    setResults({
      age,
      timeline: timeline || 'Not specified',
      category: category.name,
      categoryDesc: category.desc,
      amh,
      pcos,
      earlyMenopause,
      surgery,
      cancer
    });

    setSendSuccess(false);

    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSendPdf = async () => {
    if (!email) {
      alert("Please enter an email address to receive the PDF.");
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch('/api/tools/egg-freezing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results, email })
      });
      if (res.ok) setSendSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setIsSending(false);
  };

  const handleDownloadPdf = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/tools/egg-freezing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SORA_Egg_Freezing_Planner.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error(err);
    }
    setIsSending(false);
  };

  const RadioButton = ({ label, options, state, setState }) => (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e293b' }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {options.map(opt => (
          <button 
            key={opt.value}
            type="button" 
            onClick={() => setState(opt.value)}
            style={{ 
              padding: '12px 20px', 
              borderRadius: '12px', 
              border: `1px solid ${state === opt.value ? '#ff2a5f' : '#cbd5e1'}`, 
              background: state === opt.value ? '#fff1f2' : '#fff', 
              color: state === opt.value ? '#e11d48' : '#475569', 
              fontWeight: '600', 
              fontSize: '15px', 
              cursor: 'pointer', 
              transition: 'all 0.2s' 
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      
      {/* Top AdSense Placeholder */}
      <div style={{ width: '100%', padding: '20px', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', fontSize: '12px', letterSpacing: '1px' }}>
        Advertisement Space
      </div>

      <div style={{ flex: 1, padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>Egg Freezing Planner</span>
        </div>

        {!hasStarted ? (
          <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: '#fff1f2', borderRadius: '24px', marginBottom: '24px' }}>
              <Snowflake size={40} color="#ff2a5f" />
            </div>
            <h1 style={{ fontSize: '48px', color: '#0f172a', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px' }}>Egg Freezing Planner™</h1>
            <p style={{ fontSize: '20px', color: '#475569', maxWidth: '600px', margin: '0 auto 16px' }}>Understand how age influences fertility preservation and explore whether discussing egg freezing with a specialist may be worth considering.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '40px' }}>
              <Shield size={14} /> Educational • Private • No Signup Required
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button onClick={() => setHasStarted(true)} style={{ padding: '16px 32px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Start Planning <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Input Form */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '32px' }}>Your Information</h2>
              
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '18px' }}>Age: {age}</span>
                </label>
                <input 
                  type="range" 
                  min="18" max="45" 
                  value={age} 
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#ff2a5f', height: '6px', borderRadius: '8px', background: '#e2e8f0', outline: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', marginTop: '8px', fontWeight: 'bold' }}>
                  <span>18</span><span>45</span>
                </div>
              </div>

              <RadioButton 
                label="Planning Pregnancy Timeline (Optional)" 
                state={timeline} setState={setTimeline}
                options={[
                  { label: 'Within 1 year', value: 'Within 1 year' },
                  { label: '1–2 years', value: '1–2 years' },
                  { label: '2–5 years', value: '2–5 years' },
                  { label: 'More than 5 years', value: 'More than 5 years' },
                  { label: 'Unsure', value: 'Unsure' }
                ]}
              />

              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} color="#ff2a5f"/> Medical History (Optional)</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>
                    Known AMH Value (ng/mL) 
                    <span title="Anti-Müllerian Hormone (AMH) is one indicator of ovarian reserve." style={{ marginLeft: '6px', cursor: 'help', color: '#94a3b8', borderBottom: '1px dotted #94a3b8' }}>?</span>
                  </label>
                  <input 
                    type="number" step="0.1" placeholder="e.g. 2.5" 
                    value={amh} onChange={(e) => setAmh(e.target.value)}
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', width: '200px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                  <RadioButton label="Known PCOS Diagnosis" state={pcos} setState={setPcos} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }, { label: 'Unsure', value: 'unsure' }]} />
                  <RadioButton label="Family History of Early Menopause" state={earlyMenopause} setState={setEarlyMenopause} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
                  <RadioButton label="History of Ovarian Surgery" state={surgery} setState={setSurgery} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
                  <RadioButton label="Cancer Treatment History" state={cancer} setState={setCancer} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
                </div>
              </div>

              <button onClick={handleCalculate} style={{ width: '100%', padding: '20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                View Planner Results
                <ChevronRight size={20} />
              </button>
            </div>

            {results && (
              <div ref={resultsRef} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Hero Snapshot */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.03, transform: 'rotate(15deg)' }}>
                    <Snowflake size={250} fill="#000" />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff2a5f', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', marginBottom: '32px' }}>
                    <Target size={16} color="#ff2a5f" /> Your Planning Snapshot
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Current Age</div>
                      <div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a' }}>{results.age} years</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Planning Horizon</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#334155', marginTop: '6px' }}>{results.timeline === 'Not specified' ? 'Undecided' : `Pregnancy planned ${results.timeline.toLowerCase()}`}</div>
                    </div>
                  </div>

                  <div style={{ background: '#fff1f2', borderRadius: '16px', padding: '32px', borderLeft: '6px solid #ff2a5f' }}>
                    <div style={{ color: '#e11d48', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Planning Category</div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: '#9f1239', marginBottom: '8px' }}>{results.category}</div>
                    <div style={{ fontSize: '16px', color: '#be123c', fontWeight: '600', lineHeight: 1.5 }}>{results.categoryDesc}</div>
                  </div>

                  <div style={{ marginTop: '24px', fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} /> This is educational guidance and not a medical recommendation.
                  </div>
                </div>

                {/* Mid AdSense Placeholder */}
                <div style={{ width: '100%', padding: '20px', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', fontSize: '12px', letterSpacing: '1px', borderRadius: '16px' }}>
                  Advertisement Space
                </div>

                {/* Age-Based Trends Chart (Visual Mock) */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Age & Fertility Potential</h3>
                  <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>This chart visualizes the general trend of ovarian reserve relative to age.</p>
                  
                  <div style={{ position: 'relative', height: '200px', borderBottom: '2px solid #e2e8f0', borderLeft: '2px solid #e2e8f0', margin: '20px 0 40px 20px', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ position: 'absolute', bottom: '-25px', left: '-10px', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>20</div>
                    <div style={{ position: 'absolute', bottom: '-25px', right: '0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>45</div>
                    <div style={{ position: 'absolute', top: '-10px', left: '-30px', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', transform: 'rotate(-90deg)', transformOrigin: 'left bottom' }}>Reserve</div>

                    {/* SVG Curve */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', bottom: 0, left: 0 }}>
                      <path d="M 0,10 C 40,15 60,30 80,70 L 100,95 L 100,100 L 0,100 Z" fill="rgba(255, 42, 95, 0.1)" />
                      <path d="M 0,10 C 40,15 60,30 80,70 L 100,95" fill="none" stroke="#ff2a5f" strokeWidth="2" />
                    </svg>

                    {/* You Are Here Marker */}
                    {results.age >= 20 && results.age <= 45 && (
                      <div style={{ position: 'absolute', bottom: `${100 - (results.age < 30 ? 10 : results.age < 35 ? 20 : results.age < 38 ? 40 : results.age < 40 ? 60 : 85)}%`, left: `${((results.age - 20) / 25) * 100}%`, transform: 'translate(-50%, 50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                        <div style={{ background: '#0f172a', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap', marginBottom: '4px' }}>You are here</div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff2a5f', border: '2px solid #fff', boxShadow: '0 0 0 2px #ff2a5f' }}></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Two Column Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                  
                  {/* Journey Timeline */}
                  <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', marginBottom: '24px' }}>
                      <Clock size={16} /> Egg Freezing Journey
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: '#f1f5f9' }}></div>
                      {[
                        { title: 'Consultation', desc: 'Discuss your goals with a specialist.' },
                        { title: 'AMH & Ultrasound', desc: 'Testing to estimate your ovarian reserve.' },
                        { title: 'Treatment Planning', desc: 'Custom protocol & medication timeline.' },
                        { title: 'Ovarian Stimulation', desc: '10-14 days of hormone injections.' },
                        { title: 'Egg Retrieval', desc: 'A quick 15-min procedure under sedation.' },
                        { title: 'Storage', desc: 'Eggs are vitrified (flash-frozen) for the future.' }
                      ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff1f2', color: '#ff2a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0, border: '2px solid #fff' }}>{i + 1}</div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '16px', marginBottom: '2px' }}>{step.title}</div>
                            <div style={{ color: '#64748b', fontSize: '14px' }}>{step.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expected Costs */}
                  <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '40px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px' }}>Estimated Costs (India)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}><span style={{ color: '#475569' }}>Initial Consultation</span><span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹500–₹2,000</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}><span style={{ color: '#475569' }}>Hormone Testing</span><span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹1,000–₹5,000</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}><span style={{ color: '#475569' }}>Stimulation Meds</span><span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹40,000–₹80,000</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}><span style={{ color: '#475569' }}>Egg Retrieval Procedure</span><span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹80,000–₹1,50,000</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}><span style={{ color: '#475569' }}>Annual Storage</span><span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹10,000–₹20,000</span></div>
                    </div>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Total Estimated Range</div>
                      <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>₹1.2–₹2.5 lakh</div>
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>Actual costs vary significantly by clinic, medication dosage required, and geography.</div>
                  </div>

                </div>

                {/* Understanding Egg Numbers */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>Understanding Egg Numbers</h3>
                  <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                    Published studies suggest that women in different age groups often discuss different egg number targets with specialists to optimize chances of a future live birth.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                      <div style={{ color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>Age under 35</div>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: '#ff2a5f' }}>15–20 mature eggs</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                      <div style={{ color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>Age 35–37</div>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: '#ff2a5f' }}>20–25 mature eggs</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                      <div style={{ color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>Age 38–40</div>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: '#ff2a5f' }}>25–30 mature eggs</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', display: 'flex', gap: '8px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} /> These ranges are educational summaries from published literature and do not predict outcomes for any individual. Multiple cycles may be needed to reach a target.
                  </div>
                </div>

                {/* Factors & Questions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                  <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>What Influences Decisions?</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {['Age', 'AMH Level', 'Ovarian Reserve', 'Future Pregnancy Goals', 'Relationship Status', 'Career Goals', 'Cancer Treatments', 'Family History', 'Endometriosis / PCOS'].map(chip => (
                        <div key={chip} style={{ background: '#e2e8f0', color: '#334155', padding: '8px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: '600' }}>{chip}</div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#0f172a', borderRadius: '24px', padding: '40px', color: '#fff' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={20} /> Discussion Guide</h3>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '15px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
                      <li>What ovarian reserve tests would you recommend for me?</li>
                      <li>Based on my AMH, how many eggs might I retrieve in one cycle?</li>
                      <li>How many stimulation cycles are commonly needed for my age?</li>
                      <li>What are the exact expected costs including medication?</li>
                      <li>How long can eggs remain frozen at this clinic?</li>
                    </ul>
                  </div>
                </div>

                {/* PDF Download Section */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: '#fff1f2', borderRadius: '16px', marginBottom: '24px' }}>
                    <Download size={32} color="#ff2a5f" />
                  </div>
                  <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>Download Your Planner</h3>
                  <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>Save a beautiful PDF copy of your customized educational report to review later or share with your doctor.</p>
                  
                  <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <button onClick={handleDownloadPdf} disabled={isSending} style={{ width: '100%', padding: '16px', background: '#ff2a5f', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s', marginBottom: '24px' }}>
                      <Download size={18} />
                      Download PDF
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                      <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>or email it</span>
                      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="email" 
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' }}
                      />
                      <button onClick={handleSendPdf} disabled={isSending} style={{ padding: '0 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isSending ? '...' : <Mail size={20} />}
                      </button>
                    </div>
                    {sendSuccess && <div style={{ color: '#10b981', fontSize: '14px', textAlign: 'center', fontWeight: 'bold', marginTop: '12px' }}>Sent successfully!</div>}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Medical Disclaimer</div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                    SORA Egg Freezing Planner™ is intended for educational purposes only and does not provide medical advice, diagnosis, or treatment recommendations. Decisions regarding fertility preservation should always be made in consultation with qualified healthcare professionals.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Internal Linking & Bottom AdSense */}
      <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '60px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '32px' }}>Explore More Tools</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '60px' }}>
            {['Fertility Assessment', 'AMH Interpreter', 'IVF Cost Calculator', 'Due Date Calculator', 'PCOS Assessment'].map(tool => (
              <Link key={tool} href="/tools" style={{ background: '#f8fafc', color: '#0f172a', padding: '12px 24px', borderRadius: '100px', textDecoration: 'none', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                {tool}
              </Link>
            ))}
          </div>

          <div style={{ width: '100%', padding: '20px', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', fontSize: '12px', letterSpacing: '1px', borderRadius: '16px' }}>
            Advertisement Space
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
