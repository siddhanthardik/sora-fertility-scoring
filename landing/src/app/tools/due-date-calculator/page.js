"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Baby, CalendarCheck, CalendarDays, Dna, Download, Mail } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Weekly Insights Data
const insightsData = {
  default: { size: "Growing quickly!", what: ["Your baby is developing rapidly.", "Important structures are forming.", "Your body is adjusting to pregnancy."] },
  4: { size: "a poppy seed", what: ["Implantation is occurring.", "The amniotic sac and yolk sac are forming.", "The neural tube is developing."] },
  5: { size: "an apple seed", what: ["The heart is beginning to form.", "Major organs like kidneys and liver start developing.", "The umbilical cord is developing."] },
  6: { size: "a sweet pea", what: ["The heart is beating and can often be seen on ultrasound.", "Facial features are starting to form.", "Limb buds appear."] },
  7: { size: "a blueberry", what: ["Brain is developing rapidly.", "Arm and leg joints begin to form.", "Kidneys are preparing to produce urine."] },
  8: { size: "a raspberry", what: ["Facial structures continue developing.", "Heartbeat can usually be heard on doppler.", "Limb buds become more defined."] },
  9: { size: "a cherry", what: ["Bones are beginning to form.", "Fetal movement starts (though you can't feel it yet).", "Eyelids are forming."] },
  10: { size: "a strawberry", what: ["Vital organs are fully formed and starting to function.", "Fingernails and toenails are developing.", "The embryonic tail has disappeared."] },
  11: { size: "a fig", what: ["Tooth buds are forming.", "Hair follicles begin to develop.", "The diaphragm is forming."] },
  12: { size: "a plum", what: ["Reflexes are developing.", "The digestive system is practicing contractions.", "Bone marrow begins making white blood cells."] },
  13: { size: "a lemon", what: ["Vocal cords are forming.", "Intestines have moved into the abdomen.", "Fingerprints are already formed."] },
  14: { size: "a peach", what: ["Kidneys are producing urine.", "Facial muscles are getting a workout.", "Lanugo (fine hair) starts covering the body."] },
  15: { size: "an apple", what: ["Legs are growing longer than arms.", "The baby can sense light.", "Taste buds are forming."] },
  16: { size: "an avocado", what: ["The heart is pumping 25 quarts of blood a day.", "Scalp patterning has begun.", "You might start feeling 'flutters' (quickening)."] },
  20: { size: "a banana", what: ["The baby can swallow.", "Meconium is forming in the bowels.", "You can likely find out the sex on ultrasound."] },
  24: { size: "an ear of corn", what: ["Lungs are developing branches.", "Inner ear is fully developed, helping with balance.", "The baby is gaining baby fat."] },
  28: { size: "an eggplant", what: ["Eyes can open and close.", "Brain is developing billions of neurons.", "The baby is dreaming."] },
  32: { size: "a squash", what: ["Fingernails have grown to the fingertips.", "The baby is practicing breathing movements.", "Most major organ development is complete."] },
  36: { size: "a papaya", what: ["Lanugo is falling off.", "The baby is dropping into the pelvis.", "Lungs are almost fully mature."] },
  40: { size: "a small pumpkin", what: ["Your baby is fully cooked!", "Reflexes are coordinated.", "Ready to meet the world!"] }
};

export default function DueDateCalculator() {
  // Method State
  const [conceptionMethod, setConceptionMethod] = useState('natural'); // natural, iui, ivf
  
  // Natural Inputs
  const [naturalMethod, setNaturalMethod] = useState('lmp'); // lmp, conception, ultrasound
  const [dateInput, setDateInput] = useState('');
  const [usWeeks, setUsWeeks] = useState('');
  const [usDays, setUsDays] = useState('');

  // IUI Inputs
  const [iuiDate, setIuiDate] = useState('');

  // IVF Inputs
  const [ivfType, setIvfType] = useState('day5'); // day3, day5, day6
  const [transferDate, setTransferDate] = useState('');

  // Results
  const [results, setResults] = useState(null);
  
  // PDF Delivery
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const calculateDueDate = (e) => {
    e.preventDefault();
    let edd = null;
    let methodString = "";

    if (conceptionMethod === 'natural') {
      if (naturalMethod === 'lmp') {
        if (!dateInput) return;
        edd = new Date(dateInput);
        edd.setDate(edd.getDate() + 280);
        methodString = "Natural Pregnancy (Based on LMP)";
      } else if (naturalMethod === 'conception') {
        if (!dateInput) return;
        edd = new Date(dateInput);
        edd.setDate(edd.getDate() + 266);
        methodString = "Natural Pregnancy (Based on Conception)";
      } else if (naturalMethod === 'ultrasound') {
        if (!dateInput || !usWeeks) return;
        const scanDate = new Date(dateInput);
        const w = parseInt(usWeeks) || 0;
        const d = parseInt(usDays) || 0;
        const totalGestationalDaysAtScan = (w * 7) + d;
        const remainingDays = 280 - totalGestationalDaysAtScan;
        edd = new Date(scanDate);
        edd.setDate(edd.getDate() + remainingDays);
        methodString = "Natural Pregnancy (Based on Ultrasound)";
      }
    } else if (conceptionMethod === 'iui') {
      if (!iuiDate) return;
      edd = new Date(iuiDate);
      edd.setDate(edd.getDate() + 266);
      methodString = "IUI Pregnancy";
    } else if (conceptionMethod === 'ivf') {
      if (!transferDate) return;
      edd = new Date(transferDate);
      if (ivfType === 'day3') {
        edd.setDate(edd.getDate() + 263);
        methodString = "IVF - Day 3 Embryo Transfer";
      } else if (ivfType === 'day5') {
        edd.setDate(edd.getDate() + 261);
        methodString = "IVF - Day 5 Blastocyst Transfer";
      } else if (ivfType === 'day6') {
        edd.setDate(edd.getDate() + 260);
        methodString = "IVF - Day 6 Blastocyst Transfer";
      }
    }

    if (!edd) return;

    // Calculate current gestational age
    const today = new Date();
    // To find current gestational age: 280 days total - days until EDD
    const daysUntilDue = Math.round((edd - today) / (1000 * 60 * 60 * 24));
    let totalGestationalDays = 280 - daysUntilDue;
    
    // Floor at 0, Cap at 42 weeks (294 days)
    if (totalGestationalDays < 0) totalGestationalDays = 0;
    if (totalGestationalDays > 294) totalGestationalDays = 294;

    const currentWeeks = Math.floor(totalGestationalDays / 7);
    const currentDays = totalGestationalDays % 7;
    
    const formatDate = (date) => date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    // Timelines
    const trimester1 = new Date(edd); trimester1.setDate(trimester1.getDate() - 280 + (13 * 7));
    const trimester2 = new Date(edd); trimester2.setDate(trimester2.getDate() - 280 + (27 * 7));

    let trimester = "First Trimester";
    if (currentWeeks >= 14 && currentWeeks < 28) trimester = "Second Trimester";
    if (currentWeeks >= 28) trimester = "Third Trimester";

    setResults({
      eddRaw: edd,
      dueDate: formatDate(edd),
      gestationalAge: `${currentWeeks} weeks, ${currentDays} days`,
      currentWeeks,
      trimester,
      method: methodString,
      trimester1: formatDate(trimester1),
      trimester2: formatDate(trimester2)
    });
    setSendSuccess(false);
  };

  const handleSendPdf = async () => {
    if (!email) {
      alert("Please enter an email address to receive the PDF.");
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch('/api/tools/due-date', {
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
      const res = await fetch('/api/tools/due-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SORA_Pregnancy_Timeline.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error(err);
    }
    setIsSending(false);
  };

  // Get current insights
  let insights = insightsData.default;
  if (results) {
    if (insightsData[results.currentWeeks]) insights = insightsData[results.currentWeeks];
    // Fallbacks for gaps
    else if (results.currentWeeks > 4 && results.currentWeeks < 16) insights = insightsData[results.currentWeeks - 1] || insightsData.default;
    else if (results.currentWeeks > 16 && results.currentWeeks < 20) insights = insightsData[16];
    else if (results.currentWeeks > 20 && results.currentWeeks < 24) insights = insightsData[20];
    else if (results.currentWeeks > 24 && results.currentWeeks < 28) insights = insightsData[24];
    else if (results.currentWeeks > 28 && results.currentWeeks < 32) insights = insightsData[28];
    else if (results.currentWeeks > 32 && results.currentWeeks < 36) insights = insightsData[32];
    else if (results.currentWeeks > 36 && results.currentWeeks < 40) insights = insightsData[36];
    else if (results.currentWeeks >= 40) insights = insightsData[40];
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '60px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>Due Date Calculator</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: '#fff1f2', borderRadius: '16px', marginBottom: '24px' }}>
            <Baby size={32} color="#ff2a5f" />
          </div>
          <h1 style={{ fontSize: '36px', color: '#0f172a', fontWeight: '800', marginBottom: '16px' }}>SORA Pregnancy Due Date Calculator™</h1>
          <p style={{ fontSize: '18px', color: '#64748b' }}>Calculate your estimated due date for natural conception, IUI, IVF, and embryo transfer pregnancies.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '32px' }}>
          <form onSubmit={calculateDueDate}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#1e293b' }}>How did conception occur?</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['natural', 'iui', 'ivf'].map(method => (
                  <button 
                    key={method}
                    type="button" 
                    onClick={() => setConceptionMethod(method)}
                    style={{ flex: '1 1 150px', padding: '12px', borderRadius: '12px', border: `2px solid ${conceptionMethod === method ? '#ff2a5f' : '#e2e8f0'}`, background: conceptionMethod === method ? '#fff1f2' : '#fff', color: conceptionMethod === method ? '#e11d48' : '#475569', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    {method === 'natural' ? 'Natural Pregnancy' : method === 'iui' ? 'IUI' : 'IVF / Embryo Transfer'}
                  </button>
                ))}
              </div>
            </div>

            {/* NATURAL PREGNANCY */}
            {conceptionMethod === 'natural' && (
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Calculation Method</label>
                  <select 
                    value={naturalMethod} 
                    onChange={(e) => setNaturalMethod(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                  >
                    <option value="lmp">First day of last menstrual period (LMP)</option>
                    <option value="conception">Estimated conception date</option>
                    <option value="ultrasound">Ultrasound dating</option>
                  </select>
                </div>
                
                {(naturalMethod === 'lmp' || naturalMethod === 'conception') && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>{naturalMethod === 'lmp' ? 'LMP Date' : 'Conception Date'}</label>
                    <input 
                      type="date" required value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                    />
                  </div>
                )}

                {naturalMethod === 'ultrasound' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Scan Date</label>
                      <input 
                        type="date" required value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Weeks</label>
                      <input 
                        type="number" min="0" required value={usWeeks} onChange={(e) => setUsWeeks(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Days</label>
                      <input 
                        type="number" min="0" max="6" required value={usDays} onChange={(e) => setUsDays(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* IUI */}
            {conceptionMethod === 'iui' && (
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>IUI Procedure Date</label>
                <input 
                  type="date" required value={iuiDate} onChange={(e) => setIuiDate(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                />
              </div>
            )}

            {/* IVF */}
            {conceptionMethod === 'ivf' && (
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>What type of embryo transfer did you have?</label>
                  <select 
                    value={ivfType} 
                    onChange={(e) => setIvfType(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                  >
                    <option value="day3">Day 3 Embryo Transfer</option>
                    <option value="day5">Day 5 Blastocyst Transfer</option>
                    <option value="day6">Day 6 Blastocyst Transfer</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>Embryo Transfer Date</label>
                  <input 
                    type="date" required value={transferDate} onChange={(e) => setTransferDate(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            <button type="submit" style={{ width: '100%', padding: '16px', background: '#ff2a5f', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <CalendarCheck size={20} />
              Calculate Due Date
            </button>
          </form>
        </div>

        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Snapshot */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderTop: '8px solid #ff2a5f' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Pregnancy Snapshot</h2>
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: '32px' }}>
                🎉 {results.dueDate}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>You Are Currently</div>
                  <div style={{ color: '#ff2a5f', fontSize: '20px', fontWeight: 'bold' }}>{results.gestationalAge} pregnant</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Current Trimester</div>
                  <div style={{ color: '#0f172a', fontSize: '20px', fontWeight: 'bold' }}>{results.trimester}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Conception Method</div>
                  <div style={{ color: '#0f172a', fontSize: '16px', fontWeight: 'bold' }}>{results.method}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              {/* Timeline */}
              <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px' }}>Pregnancy Timeline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0' }}></div>
                  
                  <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ff2a5f', border: '4px solid #fff', zIndex: 1, boxShadow: '0 0 0 2px #ff2a5f' }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0f172a' }}>Today</div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>{results.gestationalAge}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', border: '4px solid #fff', zIndex: 1 }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#475569' }}>NT Scan (11–14 weeks)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', border: '4px solid #fff', zIndex: 1 }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#475569' }}>Anomaly Scan (18–22 weeks)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', border: '4px solid #fff', zIndex: 1 }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#475569' }}>Diabetes Screening (24–28 weeks)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', border: '4px solid #fff', zIndex: 1 }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#475569' }}>Growth Scan (32 weeks)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0f172a', border: '4px solid #fff', zIndex: 1 }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0f172a' }}>Estimated Due Date</div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>{results.dueDate}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', flex: 1 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Weekly Pregnancy Insights</h3>
                  <div style={{ color: '#ff2a5f', fontWeight: 'bold', marginBottom: '24px' }}>Week {results.currentWeeks}</div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Baby Development</div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>Your baby is approximately the size of {insights.size}.</div>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>What's Happening</div>
                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
                      {insights.what.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>Download Summary</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Get a PDF of your timeline, gestational age, and milestones.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button onClick={handleDownloadPdf} disabled={isSending} style={{ width: '100%', padding: '14px', background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
                      <Download size={18} />
                      Download PDF Instantly
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                      />
                      <button onClick={handleSendPdf} disabled={isSending} style={{ padding: '0 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isSending ? '...' : <Mail size={18} />}
                      </button>
                    </div>
                    {sendSuccess && <div style={{ color: '#10b981', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>Sent successfully!</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Table */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px' }}>Recommended Tests Timeline</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', color: '#64748b' }}>Pregnancy Week</th>
                      <th style={{ padding: '12px 16px', color: '#64748b' }}>Commonly Discussed Tests</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>6–8 weeks</td>
                      <td style={{ padding: '16px', color: '#475569' }}>Early viability scan</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>11–14 weeks</td>
                      <td style={{ padding: '16px', color: '#475569' }}>NT scan & NIPT</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>18–22 weeks</td>
                      <td style={{ padding: '16px', color: '#475569' }}>Anomaly scan (Anatomy ultrasound)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>24–28 weeks</td>
                      <td style={{ padding: '16px', color: '#475569' }}>Gestational diabetes screening</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>35–37 weeks</td>
                      <td style={{ padding: '16px', color: '#475569' }}>Group B Strep test (country dependent)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p style={{ marginTop: '24px', fontSize: '13px', color: '#94a3b8', textAlign: 'center', lineHeight: '1.5' }}>
              * This is an estimate based on medical averages. Only 4% of babies are actually born on their exact due date!<br/>
              Always consult your healthcare provider for clinical dating.
            </p>

          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
