"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Plus, Save, Trash2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CycleTracker() {
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flow, setFlow] = useState("Medium");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");

  const symptomOptions = ["Cramps", "Bloating", "Headache", "Acne", "Mood Swings", "Fatigue", "Breast Tenderness"];

  useEffect(() => {
    const saved = localStorage.getItem("sora_cycle_logs");
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  const saveLogs = (newLogs) => {
    setLogs(newLogs);
    localStorage.setItem("sora_cycle_logs", JSON.stringify(newLogs));
  };

  const toggleSymptom = (sym) => {
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter(s => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  const calculateCycleLength = (currentStart, prevStart) => {
    if (!prevStart) return null;
    const diffTime = Math.abs(new Date(currentStart) - new Date(prevStart));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!startDate) return;

    // Sort logs by date to calculate cycle length properly
    const tempLogs = [...logs, {
      id: Date.now().toString(),
      startDate,
      endDate,
      flow,
      symptoms,
      notes
    }].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Newest first

    // Calculate cycle lengths
    const processedLogs = tempLogs.map((log, index) => {
      const prevLog = tempLogs[index + 1]; // Because it's sorted newest first, the previous cycle is the next item in the array
      const cycleLength = prevLog ? calculateCycleLength(log.startDate, prevLog.startDate) : null;
      return { ...log, cycleLength };
    });

    saveLogs(processedLogs);
    
    // Reset form
    setStartDate("");
    setEndDate("");
    setFlow("Medium");
    setSymptoms([]);
    setNotes("");
    setShowForm(false);
  };

  const deleteLog = (id) => {
    const newLogs = logs.filter(l => l.id !== id);
    saveLogs(newLogs);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '60px 20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <Link href="/tools" style={{ color: '#64748b', textDecoration: 'none' }}>Tools Hub</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#ff2a5f' }}>Cycle Tracker</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', background: '#fff1f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={28} color="#ff2a5f" />
            </div>
            <h1 style={{ fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: '800' }}>Cycle Tracker</h1>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} style={{ background: '#ff2a5f', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Plus size={18} /> Add Log
            </button>
          )}
        </div>

        {showForm && (
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1e293b' }}>New Cycle Log</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Period Start Date</label>
                  <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Period End Date (Optional)</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Flow Intensity</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['Light', 'Medium', 'Heavy'].map(f => (
                    <button type="button" key={f} onClick={() => setFlow(f)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `2px solid ${flow === f ? '#ff2a5f' : '#e2e8f0'}`, background: flow === f ? '#fff1f2' : '#fff', color: flow === f ? '#e11d48' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}>{f}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Symptoms</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {symptomOptions.map(sym => (
                    <button type="button" key={sym} onClick={() => toggleSymptom(sym)} style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${symptoms.includes(sym) ? '#ff2a5f' : '#cbd5e1'}`, background: symptoms.includes(sym) ? '#ff2a5f' : '#fff', color: symptoms.includes(sym) ? '#fff' : '#475569', fontSize: '14px', cursor: 'pointer', transition: '0.2s' }}>
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '8px' }}>Notes</label>
                <textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any other observations..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none', resize: 'vertical' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, background: '#ff2a5f', color: '#fff', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Save size={20} /> Save Log</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {logs.length === 0 && !showForm && (
            <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>No cycle logs yet. Click 'Add Log' to start tracking.</p>
            </div>
          )}

          {logs.map(log => (
            <div key={log.id} style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
                    {new Date(log.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    {log.endDate && ` – ${new Date(log.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <span style={{ background: '#fff1f2', color: '#be123c', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>{log.flow} Flow</span>
                    {log.cycleLength && (
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>{log.cycleLength} Day Cycle</span>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteLog(log.id)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }}>
                  <Trash2 size={20} />
                </button>
              </div>
              
              {log.symptoms.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {log.symptoms.map(sym => (
                    <span key={sym} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', padding: '4px 10px', borderRadius: '12px' }}>{sym}</span>
                  ))}
                </div>
              )}

              {log.notes && (
                <p style={{ margin: 0, fontSize: '14px', color: '#475569', fontStyle: 'italic', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>"{log.notes}"</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
