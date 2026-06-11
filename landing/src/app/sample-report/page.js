"use client";
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PremiumReportTemplate from '../components/PremiumReportTemplate';

export default function SampleReportPage() {
  const printRef = useRef();

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const pages = document.querySelectorAll('.report-page');
    if (pages.length === 0) return;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`Sora_Premium_Report_Sample.pdf`);
  };

  const mockResults = {
    category: "high",
    detailedMeaning: "Based on the comprehensive analysis of your inputs, your fertility profile presents significant clinical flags that warrant immediate professional evaluation. This does not mean you cannot conceive, but it indicates the presence of factors that are statistically associated with a higher degree of reproductive difficulty.",
    recommendation: "Immediate consultation with a reproductive endocrinologist or fertility specialist.",
    redCount: 3,
    amberCount: 2,
    urgency: "Immediate",
    triggers: [
      "Age > 38 combined with absent/irregular cycles",
      "History of severe pelvic pain or diagnosed endometriosis",
      "Prior pelvic surgery affecting reproductive organs"
    ],
    flaggedFactors: [
      { key: "age", title: "Advanced Maternal Age", level: "red", label: "Age > 38", detail: "Egg quality and quantity naturally decline with age. At 39, the statistical probability of natural conception per cycle is reduced." },
      { key: "cycleReg", title: "Irregular Menstrual Cycles", level: "red", label: "Irregular/Absent", detail: "Irregular cycles often indicate ovulation dysfunction (anovulation or oligoovulation)." },
      { key: "endo", title: "Endometriosis Risk", level: "red", label: "Severe Pelvic Pain", detail: "Severe pelvic pain can be indicative of endometriosis, which can cause anatomical distortions or inflammation." },
      { key: "bmi", title: "BMI Consideration", level: "amber", label: "BMI 32", detail: "A BMI over 30 can affect hormonal balance and negatively impact ovulation." },
      { key: "thyroid", title: "Thyroid Condition", level: "amber", label: "Diagnosed Hypothyroidism", detail: "Unmanaged thyroid conditions can increase the risk of miscarriage and affect regular ovulation." }
    ],
    ovarianReserve: { reserve: "low" }
  };

  const mockFormData = {
    age: "39",
    bmi: "32",
    tryingStatus: "active",
    partnerSperm: "no"
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Sample Premium Report Generator</h1>
          <p style={{ color: '#6b7280' }}>Review the new premium design and dynamic pagination with mock data.</p>
        </div>
        <button 
          onClick={handleDownloadPdf}
          style={{ padding: '12px 24px', backgroundColor: '#5F7D67', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Download PDF Sample
        </button>
      </div>

      <div style={{ width: 'fit-content', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div ref={printRef} style={{ backgroundColor: '#e5e7eb' }}>
          <PremiumReportTemplate 
            results={mockResults} 
            formData={mockFormData} 
            leadName="Jane Doe" 
            reportSettings={{ whiteLabel: false }} 
          />
        </div>
      </div>
    </div>
  );
}
