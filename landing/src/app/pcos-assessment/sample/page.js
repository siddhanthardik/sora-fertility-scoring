"use client";

import React from 'react';
import PcosReportTemplate from '../PcosReportTemplate';

export default function SamplePcosReport() {
  const samplePatientData = {
    name: "Jane Doe (Sample)",
    age: 28,
    bmi: 27.5
  };

  const sampleAssessmentData = {
    score: 68,
    percentile: 88,
    category: "High Pattern Match",
    domainScores: {
      menstrual: 25,
      androgen: 10,
      metabolic: 18,
      familyFertility: 15
    },
    patterns: {
      ovulatory: true,
      metabolic: true,
      androgen: false,
      leanPcos: false,
      lowSymptom: false
    },
    dominantPatternText: "Predominantly Metabolic Pattern: Your symptoms suggest that metabolic factors and insulin resistance may be strongly driving your hormonal imbalances.",
    contributingFactors: [
      "Irregular cycle length (36-45 days)",
      "Elevated BMI (Obese category by Asian cut-offs)",
      "Increased waist circumference (>= 80 cm / 31.5 inches)",
      "Presence of Acanthosis Nigricans (dark velvety skin patches)"
    ],
    whatThisMeans: [
      "Irregular ovulation",
      "Difficulty conceiving",
      "Weight management challenges",
      "Insulin resistance",
      "Long-term metabolic health"
    ],
    fertilityImpact: "Some symptoms reported can be associated with irregular ovulation. This does NOT mean infertility. Many women with similar patterns conceive naturally or with targeted treatment.",
    actionPlan: [
      { week: "Week 1", task: "Start tracking cycle dates and symptoms." },
      { week: "Week 2", task: "Schedule a gynecologist or endocrinologist consultation." },
      { week: "Week 3", task: "Discuss whether hormone and metabolic testing may be appropriate." },
      { week: "Week 4", task: "Review lifestyle modifications and reassess personal health goals." }
    ],
    suggestedTests: [
      "Pelvic Ultrasound",
      "Total & Free Testosterone",
      "TSH (Thyroid)",
      "Prolactin",
      "HbA1c & Fasting Insulin",
      "Lipid Profile"
    ]
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <PcosReportTemplate 
        assessment={sampleAssessmentData} 
        patientData={samplePatientData} 
        onClose={() => alert('Close clicked')} 
      />
    </div>
  );
}
