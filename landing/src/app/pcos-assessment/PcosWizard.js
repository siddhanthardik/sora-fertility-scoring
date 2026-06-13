"use client";

import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  ChevronLeft, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  RotateCcw,
  Clock,
  FileCheck,
  Award,
  BookOpen,
  Download
} from "lucide-react";
import styles from "./PcosWizard.module.css";
import PcosReportTemplate from "./PcosReportTemplate";
import { trackEvent } from "../../lib/analytics";

const CLINIC_ID = process.env.NEXT_PUBLIC_SORA_CLINIC_ID || "clinic_sora_ivf_clinic_613110";

const pcosSteps = [
  {
    section: "Eligibility",
    id: "age",
    question: "What is your current age?",
    hint: "Must be between 18 and 50.",
    type: "number",
    min: 10,
    max: 100,
    key: "age",
    placeholder: "Years"
  },
  {
    section: "Eligibility",
    id: "pregnancy",
    question: "Are you currently pregnant?",
    hint: "This assessment is for non-pregnant women.",
    type: "radio",
    key: "pregnancy",
    options: [
      { val: "yes", label: "Yes" },
      { val: "no", label: "No" }
    ]
  },
  {
    section: "Eligibility",
    id: "menopause",
    question: "Are you post-menopausal?",
    hint: "This assessment is designed for pre-menopausal women.",
    type: "radio",
    key: "menopause",
    options: [
      { val: "yes", label: "Yes" },
      { val: "no", label: "No" }
    ]
  },
  {
    section: "Menstrual History",
    id: "cycleLength",
    question: "What is your typical menstrual cycle length?",
    hint: "Count from the first day of one period to the first day of the next.",
    type: "radio",
    key: "cycleLength",
    options: [
      { val: "regular", label: "Regular (21-35 days)" },
      { val: "irregular", label: "Irregular (36-45 days)" },
      { val: "highlyIrregular", label: "Highly Irregular (>45 days) or Absent" }
    ]
  },
  {
    section: "Menstrual History",
    id: "periodsPerYear",
    question: "How many periods do you have in a typical year?",
    hint: "Exclude times when you were pregnant or using continuous hormonal contraception.",
    type: "radio",
    key: "periodsPerYear",
    options: [
      { val: "nineOrMore", label: "9 or more" },
      { val: "eightOrFewer", label: "8 or fewer" }
    ]
  },
  {
    section: "Physical Symptoms",
    id: "facialHair",
    question: "Do you experience excessive facial or body hair growth?",
    hint: "Think about coarse, dark hair on the chin, upper lip, chest, or abdomen.",
    type: "radio",
    key: "facialHair",
    options: [
      { val: "none", label: "None or minimal" },
      { val: "mild", label: "Mild to moderate" },
      { val: "severe", label: "Severe" }
    ]
  },
  {
    section: "Physical Symptoms",
    id: "acne",
    question: "Do you struggle with acne?",
    hint: "Especially persistent acne along the jawline or cystic acne.",
    type: "radio",
    key: "acne",
    options: [
      { val: "none", label: "None" },
      { val: "mild", label: "Mild or occasional" },
      { val: "severe", label: "Moderate to severe (persistent/cystic)" }
    ]
  },
  {
    section: "Physical Symptoms",
    id: "hairThinning",
    question: "Have you noticed hair thinning or hair loss on your scalp?",
    hint: "Particularly around the crown or widening of the hair part.",
    type: "radio",
    key: "hairThinning",
    options: [
      { val: "none", label: "None" },
      { val: "mild", label: "Mild to moderate (noticeable parting)" }
    ]
  },
  {
    section: "Metabolic Health",
    id: "heightweight",
    question: "What is your height and weight?",
    hint: "This helps calculate BMI, which is an important metabolic indicator.",
    type: "double"
  },
  {
    section: "Metabolic Health",
    id: "waist",
    question: "What is your waist circumference?",
    hint: "Measured around the smallest part of your waist, just above the belly button.",
    type: "radio",
    key: "waist",
    options: [
      { val: "normal", label: "Less than 80 cm (31.5 inches)" },
      { val: "high", label: "80 cm (31.5 inches) or more" },
      { val: "notSure", label: "Not sure" }
    ]
  },
  {
    section: "Metabolic Health",
    id: "acanthosis",
    question: "Have you noticed dark, velvety patches of skin?",
    hint: "Commonly found on the back of the neck, armpits, or groin (Acanthosis Nigricans).",
    type: "radio",
    key: "acanthosis",
    options: [
      { val: "no", label: "No" },
      { val: "yes", label: "Yes" }
    ]
  },
  {
    section: "Family History",
    id: "familyPcos",
    question: "Does anyone in your immediate family have PCOS?",
    hint: "Mother, sister, or daughter.",
    type: "radio",
    key: "familyPcos",
    options: [
      { val: "no", label: "No" },
      { val: "yes", label: "Yes" },
      { val: "notSure", label: "Not sure" }
    ]
  },
  {
    section: "Family History",
    id: "familyDiabetes",
    question: "Does anyone in your immediate family have Type 2 Diabetes?",
    hint: "Mother, father, brother, or sister.",
    type: "radio",
    key: "familyDiabetes",
    options: [
      { val: "no", label: "No" },
      { val: "yes", label: "Yes" },
      { val: "notSure", label: "Not sure" }
    ]
  },
  {
    section: "Fertility Goals",
    id: "tryingDuration",
    question: "Are you currently trying to conceive? If so, for how long?",
    hint: "PCOS can affect ovulation and time to conception.",
    type: "radio",
    key: "tryingDuration",
    options: [
      { val: "notTrying", label: "Not trying or less than 6 months" },
      { val: "sixToTwelve", label: "6 to 12 months" },
      { val: "overTwelve", label: "More than 12 months" }
    ]
  }
];

export default function PcosWizard({ clinicId = CLINIC_ID, onComplete }) {
  const leadStepIndex = pcosSteps.length;
  const resultStepIndex = pcosSteps.length + 1;
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  
  const [formData, setFormData] = useState({
    age: "",
    pregnancy: "",
    menopause: "",
    cycleLength: "",
    periodsPerYear: "",
    facialHair: "",
    acne: "",
    hairThinning: "",
    height: "",
    weight: "",
    bmi: "",
    waist: "",
    acanthosis: "",
    familyPcos: "",
    familyDiabetes: "",
  });

  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [leadConsent, setLeadConsent] = useState(false);

  useEffect(() => {
    const cardElement = document.getElementById("pcosWizardCard");
    if (cardElement) cardElement.scrollTop = 0;
  }, [currentStep]);

  const requestAssessment = async () => {
    const response = await fetch("/api/pcos-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Sora-Clinic-Id": clinicId },
      body: JSON.stringify(formData),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.assessment) {
      throw new Error(result?.message || "Assessment service failed.");
    }

    return result.assessment;
  };

  const handleNext = () => {
    const step = pcosSteps[currentStep];
    setError("");

    if (step.id === "age") {
      const val = Number(formData.age);
      if (!val || val < 10 || val > 100) {
        setError("Please enter a valid age.");
        return;
      }
      if (val < 18 || val > 50) {
        setError("This screening is designed for women aged 18-50. Please consult your physician for personalized advice.");
        return;
      }
    } else if (step.id === "pregnancy" && formData.pregnancy === "yes") {
      setError("This screening is intended for non-pregnant individuals. Please consult your OB/GYN.");
      return;
    } else if (step.id === "menopause" && formData.menopause === "yes") {
      setError("This screening is intended for pre-menopausal individuals. Please consult your doctor.");
      return;
    } else if (step.id === "heightweight") {
      const h = Number(formData.height);
      const w = Number(formData.weight);
      if (!h || !w || h < 130 || h > 220 || w < 30 || w > 250) {
        setError("Please enter realistic height (130-220 cm) and weight (30-250 kg).");
        return;
      }
      const bmiVal = Number((w / ((h / 100) ** 2)).toFixed(1));
      setFormData(prev => ({ ...prev, bmi: bmiVal }));
    } else if (step.type === "radio") {
      const val = formData[step.key];
      if (!val) {
        setError("Please select an option.");
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setCurrentStep(prev => prev - 1);
  };

  const handleRadioSelect = (step, option, autoAdvance = false) => {
    setFormData(prev => ({ ...prev, [step.key]: option.val }));
    setError("");
    if (autoAdvance) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 220);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim() || !leadPhone.trim() || !leadConsent) {
      setError("Please fill in all details and accept the consent.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Calculate Score Server Side
      const assessmentData = await requestAssessment();
      setResults(assessmentData);
      
      // 2. Submit Lead
      const payload = {
        clinicId,
        name: leadName,
        email: leadEmail,
        phone: `${countryCode} ${leadPhone}`,
        source: "pcos_assessment",
        age: formData.age,
        pcos_assessment_score: assessmentData.score,
        pcos_risk_level: assessmentData.category,
        pcos_pattern: assessmentData.patternInsights?.join(", "),
        pcos_responses: formData,
        lead_priority: assessmentData.score >= 50 ? "HIGH" : "NORMAL"
      };

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      trackEvent({ event: "tool_completed", tool: "pcos_assessment" });

      setCurrentStep(resultStepIndex);
    } catch (err) {
      setError(err.message || "Failed to process assessment.");
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === resultStepIndex && results) {
    return <PcosReportTemplate assessment={results} patientData={{ name: leadName, age: formData.age, bmi: formData.bmi }} onClose={onComplete} />;
  }

  const progressPct = Math.min(((currentStep) / pcosSteps.length) * 100, 100);

  return (
    <div className={styles.wizardContainer} id="pcosWizardCard">
      <div className={styles.wizardHeader}>
        <div className={styles.progressHeader}>
          {currentStep > 0 && currentStep < leadStepIndex && (
            <button className={styles.btnBackText} onClick={handleBack}><ChevronLeft size={16}/> Back</button>
          )}
          <span className={styles.progressText}>Step {Math.min(currentStep + 1, pcosSteps.length)} of {pcosSteps.length}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>

      <div className={styles.wizardBody}>
        {error && <div className={styles.errorMessage}><AlertTriangle size={18}/> {error}</div>}

        {currentStep < leadStepIndex && (
          <div className={styles.stepContent}>
            <div className={styles.sectionBadge}>{pcosSteps[currentStep].section}</div>
            <h2 className={styles.questionText}>{pcosSteps[currentStep].question}</h2>
            {pcosSteps[currentStep].hint && <p className={styles.questionHint}>{pcosSteps[currentStep].hint}</p>}

            {pcosSteps[currentStep].type === "radio" && (
              <div className={styles.optionsGrid}>
                {pcosSteps[currentStep].options.map(opt => (
                  <button 
                    key={opt.val}
                    className={`${styles.optionBtn} ${formData[pcosSteps[currentStep].key] === opt.val ? styles.selected : ""}`}
                    onClick={() => handleRadioSelect(pcosSteps[currentStep], opt, true)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {pcosSteps[currentStep].type === "number" && (
              <div className={styles.inputGroup}>
                <input 
                  type="number" 
                  className={styles.numInput}
                  value={formData[pcosSteps[currentStep].key]} 
                  onChange={(e) => setFormData(prev => ({...prev, [pcosSteps[currentStep].key]: e.target.value}))}
                  placeholder={pcosSteps[currentStep].placeholder}
                />
              </div>
            )}

            {pcosSteps[currentStep].type === "double" && (
              <div className={styles.doubleInputGrid}>
                <div className={styles.inputField}>
                  <label>Height (cm)</label>
                  <input type="number" className={styles.numInput} placeholder="e.g. 165" value={formData.height} onChange={(e) => setFormData(prev => ({...prev, height: e.target.value}))}/>
                </div>
                <div className={styles.inputField}>
                  <label>Weight (kg)</label>
                  <input type="number" className={styles.numInput} placeholder="e.g. 60" value={formData.weight} onChange={(e) => setFormData(prev => ({...prev, weight: e.target.value}))}/>
                </div>
              </div>
            )}
            
            <div className={styles.stepActions}>
              <button className={`${styles.btnPrimary} ${styles.btnNext}`} onClick={handleNext}>Next Step <ArrowRight size={18}/></button>
            </div>
          </div>
        )}

        {currentStep === leadStepIndex && (
          <div className={styles.leadCaptureSection}>
            <div className={styles.leadHeader}>
              <div className={styles.leadIcon}><FileCheck size={32} color="var(--color-primary)"/></div>
              <h2>Your assessment is ready.</h2>
              <p>Where should we send your secure risk report?</p>
            </div>
            
            <form onSubmit={handleLeadSubmit} className={styles.leadForm}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon}/>
                  <input type="text" placeholder="Jane Doe" value={leadName} onChange={e => setLeadName(e.target.value)} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon}/>
                  <input type="email" placeholder="jane@example.com" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Mobile Number</label>
                <div className={styles.phoneWrapper}>
                  <input type="text" className={styles.countryCodeInput} value={countryCode} onChange={e => setCountryCode(e.target.value)} required style={{width: "60px"}}/>
                  <div className={styles.inputWrapper} style={{flex: 1}}>
                    <Phone size={18} className={styles.inputIcon}/>
                    <input type="tel" placeholder="9876543210" value={leadPhone} onChange={e => setLeadPhone(e.target.value)} required />
                  </div>
                </div>
              </div>

              <div className={styles.consentCheckbox}>
                <input type="checkbox" id="consentBox" checked={leadConsent} onChange={e => setLeadConsent(e.target.checked)}/>
                <label htmlFor="consentBox">I consent to SORA processing my health inputs to generate a report, in accordance with the Privacy Policy.</label>
              </div>

              <button type="submit" disabled={loading} className={`${styles.btnPrimary} ${styles.btnSubmit}`}>
                {loading ? "Generating Report..." : "View My Report"} <Sparkles size={18}/>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
