"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, CalendarHeart, Scale, ChevronRight, Baby, Snowflake, Search, CheckCircle2, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ALL_TOOLS = [
  {
    id: "fertility-assessment",
    title: "Fertility Assessment",
    description: "Understand your reproductive health through a personalized risk assessment based on clinical guidelines.",
    category: "Trying to Conceive",
    href: "/fertility-assessment",
    icon: <Activity size={32} color="#ff2a5f" />,
    users: "18,500+",
    time: "5 min",
    features: ["Free", "No Login", "Instant Report"]
  },
  {
    id: "period-calculator",
    title: "Period Calculator",
    description: "Calculate your next period, ovulation estimate, and fertile window.",
    category: "Trying to Conceive",
    href: "/tools/period-calculator",
    icon: <Activity size={32} color="#ff2a5f" />,
    users: "14,100+",
    time: "1 min",
    features: ["Free", "No Login", "Instant Results"]
  },
  {
    id: "ovulation-calculator",
    title: "Ovulation Calculator",
    description: "Estimate your fertile window and ovulation date to optimize your chances of conceiving.",
    category: "Trying to Conceive",
    href: "/tools/ovulation-calculator",
    icon: <CalendarHeart size={32} color="#ff2a5f" />,
    users: "12,000+",
    time: "2 min",
    features: ["Free", "No Login", "Visual Calendar"]
  },
  {
    id: "due-date-calculator",
    title: "Due Date Calculator",
    description: "Calculate your estimated due date for natural pregnancy, IUI, and IVF.",
    category: "Pregnancy",
    href: "/tools/due-date-calculator",
    icon: <Baby size={32} color="#ff2a5f" />,
    users: "24,000+",
    time: "1 min",
    features: ["Free", "No Login", "IVF & IUI Support"]
  },
  {
    id: "egg-freezing-planner",
    title: "Egg Freezing Planner™",
    description: "Understand how age influences fertility preservation and explore your clinical timeline options.",
    category: "Future Planning",
    href: "/tools/egg-freezing-planner",
    icon: <Snowflake size={32} color="#ff2a5f" />,
    users: "8,200+",
    time: "4 min",
    features: ["Free", "No Login", "Download PDF"]
  },
  {
    id: "pcos-assessment",
    title: "PCOS Risk Assessment",
    description: "Evaluate your symptoms against clinical criteria for Polycystic Ovary Syndrome (PCOS).",
    category: "Hormonal Health",
    href: "/pcos-assessment",
    icon: <Activity size={32} color="#ff2a5f" />,
    users: "15,300+",
    time: "3 min",
    features: ["Free", "No Login", "Detailed Analysis"]
  },
  {
    id: "bmi-calculator",
    title: "BMI Fertility Calculator",
    description: "Check your Body Mass Index and understand its specific implications on your hormonal health.",
    category: "Hormonal Health",
    href: "/tools/bmi-calculator",
    icon: <Scale size={32} color="#ff2a5f" />,
    users: "5,400+",
    time: "1 min",
    features: ["Free", "No Login", "Clinical Guidance"]
  }
];

export default function ToolsHub() {
  const [soraId, setSoraId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let savedId = localStorage.getItem("soraId");
    if (!savedId) {
      savedId = "SRA-" + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem("soraId", savedId);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSoraId(savedId);
  }, []);

  const filteredTools = ALL_TOOLS.filter(tool => 
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ["Trying to Conceive", "Pregnancy", "Future Planning", "Hormonal Health"];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar />
      
      <div style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)', padding: '80px 20px', borderBottom: '1px solid #fce7f3' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', color: '#0f172a', fontWeight: '800', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>SORA Fertility Hub</h1>
          <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 32px 0', lineHeight: '1.6' }}>
            Private, evidence-based assessments and calculators to help you navigate every stage of your reproductive journey.
          </p>
          
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search fertility tools..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '20px 20px 20px 52px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                fontSize: '18px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .toolsLayout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .toolsLayout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ flex: 1, padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }} className="toolsLayout">
        <div className="toolsContent">
          {categories.map(category => {
            const categoryTools = filteredTools.filter(t => t.category === category);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: '64px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
                  {category}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                  {categoryTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
          
          {filteredTools.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <Search size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px' }}>No tools found matching &quot;{searchTerm}&quot;</p>
            </div>
          )}
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

function ToolCard({ tool }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={tool.href} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: '20px', 
        padding: '32px', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: isHovered ? '0 12px 24px -4px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: isHovered ? '#fbcfe8' : '#f1f5f9',
        height: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', background: '#fff1f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {tool.icon}
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>{tool.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#f59e0b', fontWeight: '700' }}>
              <div style={{ display: 'flex' }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
              </div>
              <span style={{ color: '#64748b', fontWeight: '500' }}>Used by {tool.users} women</span>
            </div>
          </div>
        </div>
        
        <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '15px', lineHeight: '1.6', flex: 1 }}>
          {tool.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          {tool.features.map((feature, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
              <CheckCircle2 size={16} color="#10b981" /> {feature}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
            <span>⏱ {tool.time}</span>
          </div>
          <div style={{ 
            color: isHovered ? '#fff' : '#f43f5e', 
            background: isHovered ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' : '#fff1f2',
            padding: '10px 20px', 
            borderRadius: '10px', 
            fontWeight: '700', 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}>
            Use Tool <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
