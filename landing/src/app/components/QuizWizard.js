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
import styles from "./QuizWizard.module.css";
import PremiumReportTemplate from "./PremiumReportTemplate";

const LEAD_API_URL = "/api/leads";
const DEFAULT_CLINIC_ID = "clinic_krystal_clinic_4ded0a";
const CLINIC_ID = process.env.NEXT_PUBLIC_SORA_CLINIC_ID || DEFAULT_CLINIC_ID;

// Questionnaire definition shared with the server-side scoring payload.
const steps = [
  { 
    section: "Start Here", 
    id: "tryingStatus", 
    question: "Which best describes your current fertility goal?", 
    hint: "This helps tailor the guidance. There are no right or wrong answers.", 
    type: "radio", 
    key: "tryingStatus", 
    options: [
      { val: "active", label: "Actively trying now" }, 
      { val: "planning", label: "Planning a future pregnancy" }, 
      { val: "awareness", label: "Checking fertility awareness" }
    ] 
  },
  { 
    section: "Start Here", 
    id: "age", 
    question: "What is your current age?", 
    hint: "Age is one of the strongest predictors of egg quantity and egg quality.", 
    type: "number", 
    min: 18, 
    max: 55, 
    key: "age", 
    placeholder: "Years" 
  },
  { 
    section: "Start Here", 
    id: "heightweight", 
    question: "What is your height and weight?", 
    hint: "These are used only to calculate BMI, which can affect ovulation and treatment planning.", 
    type: "double" 
  },
  { 
    section: "Fertility Context", 
    id: "prevBirth", 
    question: "Have you ever given birth to a child?", 
    hint: "A previous live birth is a positive history factor, but does not rule out current issues.", 
    type: "radio", 
    key: "prevBirth", 
    options: [
      { val: "yes", label: "Yes" }, 
      { val: "no", label: "No" }
    ] 
  },
  { 
    section: "Fertility Context", 
    id: "tryDuration", 
    question: "How long have you been trying to conceive?", 
    hint: "Specialist referral timing depends strongly on age and how long you have been trying.", 
    type: "radio", 
    key: "tryDuration", 
    options: [
      { val: "notTrying", label: "Not currently trying" }, 
      { val: "under6", label: "Less than 6 months" }, 
      { val: "sixToEleven", label: "6-11 months" }, 
      { val: "over12", label: "12 months or longer" }
    ] 
  },
  { 
    section: "Fertility Context", 
    id: "intercourseTiming", 
    question: "When trying, how often do you have intercourse around the fertile window?", 
    hint: "The fertile window is the few days before ovulation and the day of ovulation.", 
    type: "radio", 
    key: "intercourseTiming", 
    options: [
      { val: "notTrying", label: "Not currently trying" }, 
      { val: "wellTimed", label: "Regular intercourse during the fertile window" }, 
      { val: "infrequent", label: "Intercourse may be too infrequent" }, 
      { val: "uncertain", label: "Fertile-window timing is uncertain" }
    ] 
  },
  { 
    section: "Fertility Context", 
    id: "partnerSperm", 
    question: "Is there a known partner sperm factor?", 
    hint: "Fertility is a couple-level issue. Semen testing is part of a complete evaluation.", 
    type: "radio", 
    key: "partnerSperm", 
    options: [
      { val: "no", label: "No known issue" }, 
      { val: "yes", label: "Yes, known sperm factor" }, 
      { val: "unknown", label: "Unknown / not tested" }
    ] 
  },
  { 
    section: "Cycles", 
    id: "cycleReg", 
    question: "Are your periods usually regular?", 
    hint: "Regular cycles usually suggest regular ovulation, although this is not guaranteed.", 
    type: "radio", 
    key: "cycleReg", 
    options: [
      { val: "regular", label: "Yes, regular" }, 
      { val: "irregular", label: "No, irregular or absent" }
    ] 
  },
  { 
    section: "Cycles", 
    id: "cycleLength", 
    question: "What is your usual cycle length?", 
    hint: "Count from the first day of one period to the first day of the next period.", 
    type: "radio", 
    key: "cycleLength", 
    options: [
      { val: "short", label: "Less than 21 days" }, 
      { val: "normal", label: "21-35 days" }, 
      { val: "long", label: "More than 35 days" }, 
      { val: "absent", label: "Absent periods" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Cycles", 
    id: "pcos", 
    question: "Have you been diagnosed with PCOS?", 
    hint: "PCOS can affect ovulation and may cause irregular cycles or hormonal variances.", 
    type: "radio", 
    key: "pcos", 
    options: [
      { val: "yes", label: "Yes" }, 
      { val: "no", label: "No" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Health Background", 
    id: "thyroid", 
    question: "Do you have a known thyroid condition?", 
    hint: "Thyroid imbalance can affect ovulation, miscarriage risk, and pregnancy health.", 
    type: "radio", 
    key: "thyroid", 
    options: [
      { val: "no", label: "No" }, 
      { val: "treated", label: "Yes, treated" }, 
      { val: "untreated", label: "Yes, untreated / uncontrolled" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Health Background", 
    id: "diabetes", 
    question: "Have you been diagnosed with diabetes, Type 1 or Type 2?", 
    hint: "Blood sugar control matters before pregnancy because it affects clinical outcomes.", 
    type: "radio", 
    key: "diabetes", 
    options: [
      { val: "no", label: "No" }, 
      { val: "controlled", label: "Yes, well controlled" }, 
      { val: "uncontrolled", label: "Yes, not well controlled" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Health Background", 
    id: "familyEarlyMenopause", 
    question: "Does your mother or sister have a history of menopause before age 45?", 
    hint: "Early menopause in close family members suggests risk of earlier reserve decline.", 
    type: "radio", 
    key: "familyEarlyMenopause", 
    options: [
      { val: "no", label: "No" }, 
      { val: "yes", label: "Yes" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Pregnancy History", 
    id: "pregnancyLosses", 
    question: "Have you had any pregnancy losses or miscarriages?", 
    hint: "Two or more losses deserve specialist review even if conception happens easily.", 
    type: "radio", 
    key: "pregnancyLosses", 
    options: [
      { val: "none", label: "None" }, 
      { val: "one", label: "One" }, 
      { val: "twoPlus", label: "Two or more" }
    ] 
  },
  { 
    section: "Pregnancy History", 
    id: "ectopicPregnancy", 
    question: "Have you ever had an ectopic pregnancy?", 
    hint: "An ectopic pregnancy can sometimes be linked with fallopian tube scarring.", 
    type: "radio", 
    key: "ectopicPregnancy", 
    options: [
      { val: "yes", label: "Yes" }, 
      { val: "no", label: "No" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Pelvic & Uterine Health", 
    id: "endo", 
    question: "Have you been diagnosed with endometriosis?", 
    hint: "Endometriosis can affect fertility through anatomy, inflammation, or scarring.", 
    type: "radio", 
    key: "endo", 
    options: [
      { val: "yes", label: "Yes" }, 
      { val: "no", label: "No" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Pelvic & Uterine Health", 
    id: "pelvicPain", 
    question: "Do you have painful periods or deep pelvic pain?", 
    hint: "This can help flag possible endometriosis severity or pelvic adhesions.", 
    type: "radio", 
    key: "pelvicPain", 
    options: [
      { val: "none", label: "No significant pain" }, 
      { val: "mild", label: "Yes, mild/moderate pain" }, 
      { val: "severe", label: "Yes, severe or deep pain" }
    ] 
  },
  { 
    section: "Pelvic & Uterine Health", 
    id: "uterineHistory", 
    question: "Have you had fibroids, uterine surgery, pelvic surgery, or a known uterine abnormality?", 
    hint: "Uterine and pelvic factors can affect implantation, miscarriage risk, or tubal function.", 
    type: "radio", 
    key: "uterineHistory", 
    options: [
      { id: "no", val: "no", label: "No", set: { pelvicSurgery: "no" } }, 
      { id: "uterine", val: "yes", label: "Yes - fibroids, uterine surgery, or uterine abnormality", set: { pelvicSurgery: "no" } }, 
      { id: "pelvic", val: "no", label: "Yes - pelvic/abdominal surgery, cysts, appendix, or endometriosis surgery", set: { pelvicSurgery: "yes" } },
      { id: "both", val: "yes", label: "Yes - both uterine and pelvic/abdominal surgery history", set: { pelvicSurgery: "yes" } },
      { id: "notSure", val: "notSure", label: "Not sure", set: { pelvicSurgery: "notSure" } }
    ] 
  },
  { 
    section: "Infection History", 
    id: "stiHistory", 
    question: "Have you ever had an STI that can affect fertility, such as chlamydia?", 
    hint: "Certain infections can affect the fallopian tubes silently.", 
    type: "radio", 
    key: "stiHistory", 
    options: [
      { val: "no", label: "No" }, 
      { val: "yes", label: "Yes" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Infection History", 
    id: "tbHistory", 
    question: "Have you ever had TB, or are you currently/previously treated for TB?", 
    hint: "TB history and treatment timing are relevant if TB involved the abdomen, pelvis, genital tract, or is currently being treated.", 
    type: "radio", 
    key: "tbHistory", 
    options: [
      { id: "no", val: "no", label: "No TB history or treatment", set: { tbTreatment: "no" } }, 
      { id: "pulmonary", val: "pulmonary", label: "Yes, pulmonary / lung TB - completed treatment", set: { tbTreatment: "completed" } }, 
      { id: "pelvic", val: "pelvic", label: "Yes, abdominal / pelvic / genital TB - completed treatment", set: { tbTreatment: "completed" } }, 
      { id: "current", val: "notSure", label: "Yes, currently on TB treatment", set: { tbTreatment: "current" } },
      { id: "notSure", val: "notSure", label: "Not sure", set: { tbTreatment: "notSure" } }
    ] 
  },
  { 
    section: "Medical Treatments", 
    id: "cancerTreatment", 
    question: "Have you ever had chemotherapy or radiation treatment?", 
    hint: "Chemo and radiation can significantly affect biological reserve markers.", 
    type: "radio", 
    key: "cancerTreatment", 
    options: [
      { val: "no", label: "No" }, 
      { val: "yes", label: "Yes" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Lifestyle", 
    id: "smoking", 
    question: "Do you currently smoke cigarettes or tobacco?", 
    hint: "Smoking can affect egg quality, miscarriage risk, and clinical success metrics.", 
    type: "radio", 
    key: "smoking", 
    options: [
      { val: "no", label: "No" }, 
      { val: "occasional", label: "Yes, occasionally" }, 
      { val: "daily", label: "Yes, daily" }
    ] 
  },
  { 
    section: "Lifestyle", 
    id: "caffeine", 
    question: "How much caffeine do you usually consume per day?", 
    hint: "A standard brewed coffee cup typically contains 100 mg of caffeine.", 
    type: "radio", 
    key: "caffeine", 
    options: [
      { val: "low", label: "Low: 0-100 mg/day" }, 
      { val: "moderate", label: "Moderate: 100-200 mg/day" }, 
      { val: "high", label: "High: more than 200 mg/day" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Lifestyle", 
    id: "alcohol", 
    question: "Do you drink more than 7 alcoholic drinks per week?", 
    hint: "One drink means roughly a small glass of wine or single beer.", 
    type: "radio", 
    key: "alcohol", 
    options: [
      { val: "no", label: "No" }, 
      { val: "yes", label: "Yes" }, 
      { val: "notSure", label: "Not sure" }
    ] 
  },
  { 
    section: "Lifestyle", 
    id: "recreationalDrugs", 
    question: "Do you currently use recreational or non-prescribed drugs?", 
    hint: "Recreational substances may interact with reproductive endocrine balancing.", 
    type: "radio", 
    key: "recreationalDrugs", 
    options: [
      { val: "no", label: "No" }, 
      { val: "occasional", label: "Yes, occasionally" }, 
      { val: "regular", label: "Yes, regularly" }
    ] 
  },
  { 
    section: "Optional Labs", 
    id: "labToggle", 
    question: "Would you like to add AMH, FSH, and AFC lab values?", 
    hint: "Adding these indicators enables separate AAFA-aligned ovarian reserve cluster reporting.", 
    type: "radio", 
    key: "includeLab", 
    options: [
      { val: "yes", label: "Yes, add clinical labs" }, 
      { val: "no", label: "No, skip labs" }
    ] 
  },
  { 
    section: "Optional Labs", 
    id: "labs", 
    question: "Enter your clinical lab values", 
    hint: "AMH (ovarian marker), FSH (measured cycle day 2-4), and AFC (Antral Follicle Count total follicles).", 
    type: "labs" 
  }
];

const getReadableValue = (key, value) => {
  if (value === undefined || value === null || value === "") return "Not entered / Skipped";
  
  const mapping = {
    tryingStatus: { active: "Actively trying now", planning: "Planning a future pregnancy", awareness: "Checking fertility awareness" },
    prevBirth: { yes: "Yes", no: "No" },
    tryDuration: { notTrying: "Not currently trying", under6: "Less than 6 months", sixToEleven: "6-11 months", over12: "12 months or longer" },
    intercourseTiming: { notTrying: "Not currently trying", wellTimed: "Regular intercourse during the fertile window", infrequent: "Infrequent intercourse", uncertain: "Fertile-window timing is uncertain" },
    partnerSperm: { no: "No known issue", yes: "Yes, known sperm factor", unknown: "Unknown / not tested" },
    cycleReg: { regular: "Yes, regular", irregular: "No, irregular or absent" },
    cycleLength: { short: "Less than 21 days", normal: "21-35 days", long: "More than 35 days", absent: "Absent periods", notSure: "Not sure" },
    pcos: { yes: "Yes", no: "No", notSure: "Not sure" },
    thyroid: { no: "No", treated: "Yes, treated", untreated: "Yes, untreated / uncontrolled", notSure: "Not sure" },
    diabetes: { no: "No", controlled: "Yes, well controlled", uncontrolled: "Yes, not well controlled", notSure: "Not sure" },
    familyEarlyMenopause: { no: "No", yes: "Yes", notSure: "Not sure" },
    pregnancyLosses: { none: "None", one: "One", twoPlus: "Two or more" },
    ectopicPregnancy: { yes: "Yes", no: "No", notSure: "Not sure" },
    endo: { yes: "Yes", no: "No", notSure: "Not sure" },
    pelvicPain: { none: "No significant pain", mild: "Yes, mild/moderate pain", severe: "Yes, severe or deep pain" },
    uterineHistory: { no: "No", yes: "Yes", notSure: "Not sure" },
    pelvicSurgery: { no: "No", yes: "Yes", notSure: "Not sure" },
    stiHistory: { no: "No", yes: "Yes", notSure: "Not sure" },
    tbHistory: { no: "No", pulmonary: "Yes, pulmonary / lung TB", pelvic: "Yes, abdominal / pelvic / genital TB", notSure: "Not sure" },
    tbTreatment: { no: "No", completed: "Yes, completed treatment", current: "Yes, currently on treatment", notSure: "Not sure" },
    cancerTreatment: { no: "No", yes: "Yes", notSure: "Not sure" },
    smoking: { no: "No", occasional: "Yes, occasionally", daily: "Yes, daily" },
    caffeine: { low: "Low: 0-100 mg/day", moderate: "Moderate: 100-200 mg/day", high: "High: more than 200 mg/day", notSure: "Not sure" },
    alcohol: { no: "No", yes: "Yes", notSure: "Not sure" },
    recreationalDrugs: { no: "No", occasional: "Yes, occasionally", regular: "Yes, regularly" },
    includeLab: { yes: "Yes, add clinical labs", no: "No, skip labs" }
  };

  if (mapping[key] && mapping[key][value] !== undefined) {
    return mapping[key][value];
  }

  if (key === "age") return `${value} Years`;
  if (key === "height") return `${value} cm`;
  if (key === "weight") return `${value} kg`;
  if (key === "bmi") return `${value} kg/m² (BMI)`;

  return String(value);
};

const getCombinedReadableValue = (items) => (
  items
    .map(([key, label, value]) => `${label}: ${getReadableValue(key, value)}`)
    .join("; ")
);

export default function QuizWizard({ clinicId = CLINIC_ID }) {
  const leadStepIndex = steps.length;
  const resultStepIndex = steps.length + 1;
  const labToggleStepIndex = steps.findIndex((step) => step.id === "labToggle");
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Form State matching all 27 clinical parameters
  const [formData, setFormData] = useState({
    tryingStatus: "",
    age: 30,
    height: "",
    weight: "",
    bmi: "",
    prevBirth: "",
    tryDuration: "",
    intercourseTiming: "",
    partnerSperm: "",
    cycleReg: "",
    cycleLength: "",
    pcos: "",
    thyroid: "",
    diabetes: "",
    familyEarlyMenopause: "",
    pregnancyLosses: "",
    ectopicPregnancy: "",
    endo: "",
    pelvicPain: "",
    uterineHistory: "",
    pelvicSurgery: "",
    stiHistory: "",
    tbHistory: "",
    tbTreatment: "",
    cancerTreatment: "",
    smoking: "",
    caffeine: "",
    alcohol: "",
    recreationalDrugs: "",
    includeLab: "",
    amhValue: "",
    amhUnit: "ng/mL",
    fsh: "",
    afc: ""
  });

  // Lead Intake fields
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [showData, setShowData] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultSubmitting, setConsultSubmitting] = useState(false);
  const [consultMessage, setConsultMessage] = useState("");
  const [consultForm, setConsultForm] = useState({
    preferredDate: "",
    preferredTime: "",
    notes: ""
  });

  // Force scrolls to the top of the card whenever we change question
  useEffect(() => {
    const cardElement = document.getElementById("wizardCard");
    if (cardElement) {
      cardElement.scrollTop = 0;
    }
  }, [currentStep]);

  // Assessment is calculated server-side so scoring rules are not shipped to the browser.
  const requestAssessment = async () => {
    const response = await fetch("/api/assess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sora-Clinic-Id": clinicId
      },
      body: JSON.stringify(formData),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false || !result?.assessment) {
      throw new Error(result?.message || "Assessment service failed.");
    }

    return normalizeAssessment(result.assessment);
  };

  const normalizeAssessment = (assessment) => ({
    category: assessment.category || "low",
    score: null,
    redCount: Number(assessment.redCount || 0),
    amberCount: Number(assessment.amberCount || 0),
    triggers: Array.isArray(assessment.referralTriggers) ? assessment.referralTriggers : [],
    flaggedFactors: Array.isArray(assessment.flaggedFactors) ? assessment.flaggedFactors : [],
    urgency: assessment.referralUrgency || "",
    ovarianReserve: assessment.ovarianReserve || null,
    recommendation: assessment.recommendation || "",
    detailedMeaning: assessment.detailedMeaning || ""
  });

  const handleNext = () => {
    const step = steps[currentStep];

    // Individual Step Validation
    setError("");

    if (step.id === "age") {
      const val = Number(formData.age);
      if (!val || val < 18 || val > 55) {
        setError("Please enter a valid age between 18 and 55.");
        return;
      }
    } else if (step.id === "heightweight") {
      const h = Number(formData.height);
      const w = Number(formData.weight);
      if (!h || !w || h < 130 || h > 220 || w < 30 || w > 250) {
        setError("Please enter a realistic height (130-220 cm) and weight (30-250 kg).");
        return;
      }
      const bmiVal = Number((w / ((h / 100) ** 2)).toFixed(1));
      setFormData(prev => ({ ...prev, bmi: bmiVal }));
    } else if (step.id === "labs") {
      const amh = Number(formData.amhValue);
      const fsh = Number(formData.fsh);
      const afc = Number(formData.afc);
      if (isNaN(amh) || isNaN(fsh) || isNaN(afc) || amh < 0 || fsh < 0 || afc < 0) {
        setError("Please enter valid positive lab values, or go back to skip labs.");
        return;
      }
    } else if (step.type === "radio") {
      const val = formData[step.key];
      if (!val) {
        setError("Please select an option.");
        return;
      }
    }

    // Skip labs step if lab toggle is No
    if (step.id === "labToggle" && formData.includeLab === "no") {
      setCurrentStep(leadStepIndex);
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError("");
    const prevStepIndex = currentStep - 1;

    // If going back from lead gate (index 29) and includeLab was 'no'
    if (currentStep === leadStepIndex && formData.includeLab === "no") {
      setCurrentStep(labToggleStepIndex);
      return;
    }

    setCurrentStep(prevStepIndex);
  };

  const handleRadioSelect = (step, option, autoAdvance = false) => {
    setFormData(prev => ({ ...prev, [step.key]: option.val, ...(option.set || {}) }));
    setError("");

    if (autoAdvance) {
      setTimeout(() => {
        // Evaluate lab toggle skip during auto advance
        if (step.key === "includeLab" && option.val === "no") {
          setCurrentStep(leadStepIndex);
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, 220);
    }
  };

  const isOptionSelected = (step, option) => {
    if (formData[step.key] !== option.val) return false;
    return Object.entries(option.set || {}).every(([key, value]) => formData[key] === value);
  };

  const buildLeadPayload = (triageResults, extra = {}) => ({
    source: "nextjs_full_27_questions",
    clinicId: clinicId,
    name: leadName.trim(),
    email: leadEmail.trim(),
    phone: leadPhone.trim(),
    age: String(formData.age),
    height: String(formData.height),
    weight: String(formData.weight),
    bmi: String(formData.bmi),
    sex: "Female", // Baseline context for FertiSTAT
    tryingStatus: formData.tryingStatus,
    prevBirth: formData.prevBirth,
    tryDuration: formData.tryDuration,
    intercourseTiming: formData.intercourseTiming,
    partnerSperm: formData.partnerSperm,
    cycleReg: formData.cycleReg,
    cycleLength: formData.cycleLength,
    pcos: formData.pcos,
    thyroid: formData.thyroid,
    diabetes: formData.diabetes,
    familyEarlyMenopause: formData.familyEarlyMenopause,
    pregnancyLosses: formData.pregnancyLosses,
    ectopicPregnancy: formData.ectopicPregnancy,
    endo: formData.endo,
    pelvicPain: formData.pelvicPain,
    uterineHistory: formData.uterineHistory,
    pelvicSurgery: formData.pelvicSurgery,
    stiHistory: formData.stiHistory,
    tbHistory: formData.tbHistory,
    tbTreatment: formData.tbTreatment,
    cancerTreatment: formData.cancerTreatment,
    smoking: formData.smoking,
    caffeine: formData.caffeine,
    alcohol: formData.alcohol,
    recreationalDrugs: formData.recreationalDrugs,
    includeLab: formData.includeLab,
    amhValue: formData.amhValue,
    amhUnit: formData.amhUnit,
    fsh: formData.fsh,
    afc: formData.afc,
    risk_category: triageResults.category,
    red_count: triageResults.redCount,
    amber_count: triageResults.amberCount,
    triage_index: null,
    referral_urgency: triageResults.urgency,
    referral_triggers: triageResults.triggers,
    flagged_factors: triageResults.flaggedFactors.map(f => ({
      key: f.key,
      title: f.title,
      level: f.level,
      label: f.label
    })),
    ovarian_reserve: triageResults.ovarianReserve,
    consent_marketing: true,
    report_requested: true,
    report_delivery_email: leadEmail.trim(),
    ...extra
  });

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!leadEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!leadPhone.trim() || leadPhone.replace(/\D/g, "").length < 8) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (!leadConsent) {
      setError("Please check the consent box to process your report.");
      return;
    }

    setError("");
    setLoading(true);

    let triageResults;
    try {
      triageResults = await requestAssessment();
    } catch (err) {
      setError(err.message || "Assessment service failed. Please try again.");
      setLoading(false);
      return;
    }

    const payload = buildLeadPayload(triageResults);

    try {
      const response = await fetch(LEAD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => null);

      if (!response.ok || resData?.success === false) {
        console.warn("Render lead API warning:", resData?.message || "Lead failed to save on Render node. Using client-side fail-safe.");
      }

      setResults(triageResults);
      setCurrentStep(resultStepIndex); // Gracefully transition to results dashboard
    } catch (err) {
      console.warn("Network or CORS error during lead submission, showing assessed result without lead confirmation:", err);
      setResults(triageResults);
      setCurrentStep(resultStepIndex); // Always guarantee report generation
    } finally {
      setLoading(false);
    }
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!results || consultSubmitting) return;

    if (!consultForm.preferredDate || !consultForm.preferredTime) {
      setConsultMessage("Please choose a preferred date and time window.");
      return;
    }

    setConsultSubmitting(true);
    setConsultMessage("");

    try {
      const response = await fetch(LEAD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildLeadPayload(results, {
          source: "nextjs_consultation_request",
          consultation_request: true,
          preferred_date: consultForm.preferredDate,
          preferred_time: consultForm.preferredTime,
          consultation_notes: consultForm.notes.trim(),
          report_requested: false
        })),
      });

      const resData = await response.json().catch(() => null);

      if (!response.ok || resData?.success === false) {
        throw new Error(resData?.message || "We could not submit the consultation request.");
      }

      setConsultMessage("Your priority consult request has been sent. A coordinator will use your saved contact details.");
      setConsultOpen(false);
    } catch (err) {
      setConsultMessage(err.message || "We could not submit the consultation request. Please try again.");
    } finally {
      setConsultSubmitting(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!results) return;
    setIsGeneratingPdf(true);
    setError("");
    
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;
      
      const pdf = new jsPDF({ unit: "px", format: "a4", orientation: "portrait" });
      const container = document.getElementById("premium-report-container");
      
      if (!container) throw new Error("Report container not found. It might still be loading.");
      
      const pages = container.querySelectorAll(".report-page");
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const canvas = await html2canvas(page, { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save(`Sora_Fertility_Report_${leadName.replace(/\\s+/g, "_") || "Patient"}.pdf`);
    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleRestart = () => {
    setFormData({
      tryingStatus: "",
      age: 30,
      height: "",
      weight: "",
      bmi: "",
      prevBirth: "",
      tryDuration: "",
      intercourseTiming: "",
      partnerSperm: "",
      cycleReg: "",
      cycleLength: "",
      pcos: "",
      thyroid: "",
      diabetes: "",
      familyEarlyMenopause: "",
      pregnancyLosses: "",
      ectopicPregnancy: "",
      endo: "",
      pelvicPain: "",
      uterineHistory: "",
      pelvicSurgery: "",
      stiHistory: "",
      tbHistory: "",
      tbTreatment: "",
      cancerTreatment: "",
      smoking: "",
      caffeine: "",
      alcohol: "",
      recreationalDrugs: "",
      includeLab: "",
      amhValue: "",
      amhUnit: "ng/mL",
      fsh: "",
      afc: ""
    });
    setLeadName("");
    setLeadEmail("");
    setLeadPhone("");
    setLeadConsent(false);
    setResults(null);
    setShowData(false);
    setConsultOpen(false);
    setConsultSubmitting(false);
    setConsultMessage("");
    setConsultForm({
      preferredDate: "",
      preferredTime: "",
      notes: ""
    });
    setCurrentStep(0);
    setError("");
  };

  const getStepIndicator = () => {
    // Return visible steps, hiding optional lab step if omitted
    const maxProgressSteps = formData.includeLab === "yes" ? steps.length : steps.length - 1;
    const currentProgressStep = currentStep === leadStepIndex ? maxProgressSteps : Math.min(currentStep + 1, maxProgressSteps);
    return `Question ${currentProgressStep} of ${maxProgressSteps}`;
  };

  const progressTotal = formData.includeLab === "yes" ? steps.length : steps.length - 1;
  const progressStep = currentStep === leadStepIndex ? progressTotal : Math.min(currentStep, progressTotal);
  const progressPercent = Math.round((progressStep / progressTotal) * 100);

  return (
    <div className={styles.quizContainer}>
      {currentStep < resultStepIndex ? (
        <div className={styles.quizCard} id="wizardCard">
          {/* Progress Indicator */}
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <AlertTriangle width={18} height={18} />
              <span>{error}</span>
            </div>
          )}

          {currentStep < leadStepIndex ? (
            /* RENDERING ALL 27 QUESTIONS INDIVIDUALLY */
            <div>
              {(() => {
                const step = steps[currentStep];
                return (
                  <div>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepSection}>
                        {step.section} · {getStepIndicator()}
                      </span>
                      <h3 className={styles.stepTitle}>{step.question}</h3>
                      {step.hint && <p className={styles.stepHint}>{step.hint}</p>}
                    </div>

                    {/* RENDER RADIO CHOICE STEP */}
                    {step.type === "radio" && (
                      <div className={styles.optionsGrid}>
                        {step.options.map(opt => (
                          <div 
                            key={opt.id || opt.val} 
                            className={`${styles.optionCard} ${isOptionSelected(step, opt) ? styles.selected : ""}`}
                            onClick={() => handleRadioSelect(step, opt, true)}
                          >
                            <div className={styles.radioCircle}>
                              <span className={styles.radioCircleInner}></span>
                            </div>
                            <span style={{ fontWeight: 600 }}>{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* RENDER NUMBER INPUT STEP (AGE) */}
                    {step.type === "number" && (
                      <div className={styles.sliderWrapper}>
                        <div className={styles.sliderValue}>
                          {formData.age}
                          <span className={styles.sliderValueSuffix}>yrs</span>
                        </div>
                        <input 
                          type="range" 
                          min={step.min} 
                          max={step.max} 
                          value={formData.age} 
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, age: Number(e.target.value) }));
                            setError("");
                          }}
                          className={styles.customSlider}
                        />
                        <div className={styles.sliderLabels}>
                          <span>{step.min}</span>
                          <span>30</span>
                          <span>40</span>
                          <span>{step.max}</span>
                        </div>
                      </div>
                    )}

                    {/* RENDER DOUBLE INPUT STEP (HEIGHT / WEIGHT) */}
                    {step.id === "heightweight" && (
                      <div style={{ margin: "25px 0" }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Your Height (cm)</label>
                          <input 
                            type="number"
                            placeholder="e.g. 165"
                            value={formData.height}
                            onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                            className={styles.formInput}
                            style={{ paddingLeft: "16px" }}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Your Weight (kg)</label>
                          <input 
                            type="number"
                            placeholder="e.g. 62"
                            value={formData.weight}
                            onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                            className={styles.formInput}
                            style={{ paddingLeft: "16px" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* RENDER LABS INPUT STEP */}
                    {step.id === "labs" && (
                      <div style={{ margin: "25px 0" }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Anti-Müllerian Hormone (AMH)</label>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <input 
                              type="number"
                              placeholder="Value"
                              step="any"
                              value={formData.amhValue}
                              onChange={(e) => setFormData(prev => ({ ...prev, amhValue: e.target.value }))}
                              className={styles.formInput}
                              style={{ paddingLeft: "16px", flex: 1 }}
                            />
                            <select 
                              value={formData.amhUnit} 
                              onChange={(e) => setFormData(prev => ({ ...prev, amhUnit: e.target.value }))}
                              className={styles.formInput}
                              style={{ width: "120px", padding: "10px" }}
                            >
                              <option value="ng/mL">ng/mL</option>
                              <option value="pmol/L">pmol/L</option>
                            </select>
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Follicle-Stimulating Hormone (FSH, CD 2-4)</label>
                          <input 
                            type="number"
                            placeholder="FSH Value (IU/L)"
                            step="any"
                            value={formData.fsh}
                            onChange={(e) => setFormData(prev => ({ ...prev, fsh: e.target.value }))}
                            className={styles.formInput}
                            style={{ paddingLeft: "16px" }}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Antral Follicle Count (AFC)</label>
                          <input 
                            type="number"
                            placeholder="Total follicles count"
                            value={formData.afc}
                            onChange={(e) => setFormData(prev => ({ ...prev, afc: e.target.value }))}
                            className={styles.formInput}
                            style={{ paddingLeft: "16px" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP BUTTON NAVIGATION */}
                    <div className={styles.buttonGroup} style={{ marginTop: "24px" }}>
                      <button className={styles.btnPrimary} onClick={handleNext}>
                        Continue <ArrowRight width={18} height={18} />
                      </button>
                      {currentStep > 0 && (
                        <button className={styles.btnSecondary} onClick={handleBack}>
                          <ChevronLeft width={18} height={18} /> Back
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* LEAD INTAKE GATE (STEP 29) */
            <div>
              <div className={styles.stepHeader}>
                <span className={styles.stepSection}>Confidential Delivery</span>
                <h3 className={styles.stepTitle}>Your FertiSTAT™ Triage is Complete</h3>
                <p className={styles.stepHint}>To safeguard clinical diagnostic privacy and prepare your risk metrics, please confirm your delivery information.</p>
              </div>

              <form onSubmit={handleLeadSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Full Name</label>
                  <div className={styles.inputWrapper}>
                    <User className={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="e.g. Sarah Jenkins"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Confidential Email Address</label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} />
                    <input 
                      type="email" 
                      placeholder="Sarah.j@example.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mobile Number (For Consultation Updates)</label>
                  <div className={styles.inputWrapper}>
                    <Phone className={styles.inputIcon} />
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 019-2834"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <label className={styles.consentLabel}>
                  <input 
                    type="checkbox"
                    checked={leadConsent}
                    onChange={(e) => setLeadConsent(e.target.checked)}
                    required
                  />
                  <span>
                    I agree to the secure delivery of my FertiSTAT fertility summary, and consent to receive follow-up advisor clinical matching calls/texts on this number.
                  </span>
                </label>

                <div className={styles.buttonGroup}>
                  <button 
                    type="submit" 
                    className={styles.btnPrimary}
                    disabled={loading}
                  >
                    {loading ? "Please wait while we generate your report" : "Generate My Clinical Report"} 
                    {!loading && <ArrowRight width={18} height={18} />}
                  </button>
                  <button 
                    type="button" 
                    className={styles.btnSecondary} 
                    onClick={handleBack}
                    disabled={loading}
                  >
                    <ChevronLeft width={18} height={18} /> Back
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* RESULTS DASHBOARD SCREEN (STEP 30) */
        <div className={`${styles.quizCard} ${styles.resultsCard}`} style={{ maxHeight: "560px", overflowY: "auto" }} id="wizardCard">
          <div className={styles.summaryHeader}>
            <span className={styles.summaryBadge}>FertiSTAT™ Calibration Complete</span>
            <h3 className={styles.summaryFor}>
              Triage Results for <span>{leadName}</span>
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", marginTop: "4px" }}>
              Age {formData.age} · BMI {formData.bmi} · Secure assessment complete
            </p>
          </div>

          {/* Animated Gauge Chart */}
          <div className={styles.gaugeContainer}>
            <svg className={styles.gaugeSvg}>
              <circle className={styles.gaugeTrack} cx="110" cy="110" r="85" />
              <circle 
                className={`${styles.gaugeFill} ${
                  results.category === "low" ? styles.low : results.category === "medium" ? styles.medium : styles.high
                }`} 
                cx="110" 
                cy="110" 
                r="85" 
                strokeDasharray={`${2 * Math.PI * 85}`}
                strokeDashoffset={`${
                  2 * Math.PI * 85 * (1 - (results.category === "low" ? 0.33 : results.category === "medium" ? 0.66 : 0.95))
                }`}
              />
            </svg>
            <div className={styles.gaugeCenter}>
              <span className={styles.gaugeValue}>
                {results.category.toUpperCase()}
              </span>
              <span className={styles.gaugeLabel}>Triage Tier</span>
            </div>
          </div>

          {/* Actions Button Bar */}
          <div className={styles.actionsRow}>
            <button 
              type="button" 
              className={styles.btnAction} 
              onClick={handleDownloadReport}
              disabled={isGeneratingPdf}
            >
              <Download width={16} height={16} />
              {isGeneratingPdf ? "Generating PDF..." : "Download Premium PDF Report"}
            </button>
          </div>

          {/* Category Recommendation Banner */}
          <div className={`${styles.categoryBanner} ${
            results.category === "low" ? styles.low : results.category === "medium" ? styles.medium : styles.high
          }`}>
            <h3 className={styles.bannerTitle}>
              <ShieldCheck width={22} height={22} />
              {results.category === "high" ? "Specialist Care Strongly Advised" : results.category === "medium" ? "Cautionary Action Suggested" : "Low Risk Profile"}
            </h3>
            <p className={styles.bannerDesc}>
              {results.urgency}. {results.category === "high" 
                ? "Our clinical engine has flagged immediate-referral parameters within your profile. Timely consultation with an IVF clinic specialist can mitigate timing concerns." 
                : results.category === "medium" 
                ? "Your history lists caution-triage markers. Proactive timeline checks or lifestyle tracking is recommended before proceeding." 
                : "Your answers present a stable clinical baseline. Continue preconception health habits and monitor cycle regularity."}
            </p>
          </div>

          {/* OVARIAN RESERVE LAB CLUSTER PANEL */}
          {results.ovarianReserve && (
            <div className={styles.categoryBanner} style={{ background: "hsl(140, 20%, 94%)", border: "1px solid var(--color-border)", margin: "25px 0" }}>
              <h3 className={styles.bannerTitle} style={{ color: "var(--color-primary-dark)" }}>
                <Award width={22} height={22} style={{ color: "var(--color-gold-dark)" }} />
                Ovarian Reserve: {results.ovarianReserve.reserve.toUpperCase()}
              </h3>
              <p className={styles.bannerDesc} style={{ color: "var(--color-text-main)" }}>
                Based on AMH ({formData.amhValue} {formData.amhUnit}), FSH ({formData.fsh} IU/L), and AFC ({formData.afc} follicles) parameters, you correspond to **AAFA Ovarian Reserve Cluster {results.ovarianReserve.cluster}**.
              </p>
            </div>
          )}

          {/* Clinical Flagged Markers (27 Questions detail outputs) */}
          <div className={styles.findingsSection}>
            <h4 className={styles.sectionTitle}>
              <Activity width={18} height={18} />
              Clinical Flagged Markers ({results.flaggedFactors.length})
            </h4>
            {results.flaggedFactors.length > 0 ? (
              <div className={styles.findingsList}>
                {results.flaggedFactors.map((factor, idx) => (
                  <div key={idx} className={styles.findingItem}>
                    <div className={`${styles.findingBullet} ${factor.level === "red" ? styles.red : styles.amber}`}></div>
                    <div className={styles.findingText}>
                      <strong>{factor.title}</strong>: {factor.label}. <br />
                      <span style={{ fontSize: "0.85rem", opacity: 0.8, display: "inline-block", marginTop: "4px" }}>
                        {factor.detail || "This factor serves as key medical context for reproductive planning."}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noFindings}>No red or amber parameters were identified. You present a green reference-level profile.</p>
            )}
          </div>

          {/* Complete Assessment Data Accordion */}
          <div className={styles.dataSection}>
            <button 
              type="button" 
              className={`${styles.accordionBtn} ${showData ? styles.open : ""}`}
              onClick={() => setShowData(!showData)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen width={18} height={18} /> View Your Complete Entered Answers
              </span>
              <span>{showData ? "▲" : "▼"}</span>
            </button>
            <div className={`${styles.accordionContent} ${showData ? styles.open : ""}`}>
              <table className={styles.dataTable}>
                <thead>
                  <tr style={{ background: "var(--color-primary)", color: "white" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left" }}>Metric Group</th>
                    <th style={{ padding: "10px 12px", textAlign: "left" }}>Clinical Question / Metric</th>
                    <th style={{ padding: "10px 12px", textAlign: "left" }}>Value Entered</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Personal Metrics */}
                  <tr className={styles.dataGroupRow}>
                    <td colSpan="3">Personal Parameters</td>
                  </tr>
                  <tr>
                    <td>Personal</td>
                    <td>Patient Age</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("age", formData.age)}</td>
                  </tr>
                  <tr>
                    <td>Personal</td>
                    <td>Height (cm)</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("height", formData.height)}</td>
                  </tr>
                  <tr>
                    <td>Personal</td>
                    <td>Weight (kg)</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("weight", formData.weight)}</td>
                  </tr>
                  <tr>
                    <td>Personal</td>
                    <td>Calculated BMI</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("bmi", formData.bmi)}</td>
                  </tr>

                  {/* Fertility Context */}
                  <tr className={styles.dataGroupRow}>
                    <td colSpan="3">Fertility Context</td>
                  </tr>
                  <tr>
                    <td>Context</td>
                    <td>Current Goal Focus</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("tryingStatus", formData.tryingStatus)}</td>
                  </tr>
                  <tr>
                    <td>Context</td>
                    <td>Active Try Duration</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("tryDuration", formData.tryDuration)}</td>
                  </tr>
                  <tr>
                    <td>Context</td>
                    <td>Previous Births</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("prevBirth", formData.prevBirth)}</td>
                  </tr>
                  <tr>
                    <td>Context</td>
                    <td>Intercourse Timing</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("intercourseTiming", formData.intercourseTiming)}</td>
                  </tr>
                  <tr>
                    <td>Context</td>
                    <td>Partner Sperm Factor</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("partnerSperm", formData.partnerSperm)}</td>
                  </tr>

                  {/* Menstrual & Endocrine */}
                  <tr className={styles.dataGroupRow}>
                    <td colSpan="3">Hormonal & Ovarian Status</td>
                  </tr>
                  <tr>
                    <td>Hormonal</td>
                    <td>Period Regularity</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("cycleReg", formData.cycleReg)}</td>
                  </tr>
                  <tr>
                    <td>Hormonal</td>
                    <td>Cycle Length</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("cycleLength", formData.cycleLength)}</td>
                  </tr>
                  <tr>
                    <td>Hormonal</td>
                    <td>PCOS Status</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("pcos", formData.pcos)}</td>
                  </tr>
                  <tr>
                    <td>Hormonal</td>
                    <td>Thyroid History</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("thyroid", formData.thyroid)}</td>
                  </tr>
                  <tr>
                    <td>Hormonal</td>
                    <td>Diabetes Condition</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("diabetes", formData.diabetes)}</td>
                  </tr>

                  {/* Pelvic & Medical */}
                  <tr className={styles.dataGroupRow}>
                    <td colSpan="3">Pelvic & Medical History</td>
                  </tr>
                  <tr>
                    <td>Pelvic</td>
                    <td>Endometriosis</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("endo", formData.endo)}</td>
                  </tr>
                  <tr>
                    <td>Pelvic</td>
                    <td>Severe Pelvic/Period Pain</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("pelvicPain", formData.pelvicPain)}</td>
                  </tr>
                  <tr>
                    <td>Pelvic</td>
                    <td>Uterine / Pelvic Surgery History</td>
                    <td style={{ fontWeight: 600 }}>
                      {getCombinedReadableValue([
                        ["uterineHistory", "Uterine", formData.uterineHistory],
                        ["pelvicSurgery", "Pelvic surgery", formData.pelvicSurgery]
                      ])}
                    </td>
                  </tr>
                  <tr>
                    <td>Pelvic</td>
                    <td>Pregnancy Losses</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("pregnancyLosses", formData.pregnancyLosses)}</td>
                  </tr>

                  {/* Infections & Treatments */}
                  <tr className={styles.dataGroupRow}>
                    <td colSpan="3">Medical Background</td>
                  </tr>
                  <tr>
                    <td>Medical</td>
                    <td>Prior Ectopic Pregnancy</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("ectopicPregnancy", formData.ectopicPregnancy)}</td>
                  </tr>
                  <tr>
                    <td>Medical</td>
                    <td>STI History</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("stiHistory", formData.stiHistory)}</td>
                  </tr>
                  <tr>
                    <td>Medical</td>
                    <td>TB History / Treatment</td>
                    <td style={{ fontWeight: 600 }}>
                      {getCombinedReadableValue([
                        ["tbHistory", "TB history", formData.tbHistory],
                        ["tbTreatment", "Treatment", formData.tbTreatment]
                      ])}
                    </td>
                  </tr>
                  <tr>
                    <td>Medical</td>
                    <td>Chemotherapy / Radiation</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("cancerTreatment", formData.cancerTreatment)}</td>
                  </tr>
                  <tr>
                    <td>Medical</td>
                    <td>Family Early Menopause</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("familyEarlyMenopause", formData.familyEarlyMenopause)}</td>
                  </tr>

                  {/* Lifestyle & Labs */}
                  <tr className={styles.dataGroupRow}>
                    <td colSpan="3">Lifestyle & Labs</td>
                  </tr>
                  <tr>
                    <td>Lifestyle</td>
                    <td>Cigarettes / Tobacco</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("smoking", formData.smoking)}</td>
                  </tr>
                  <tr>
                    <td>Lifestyle</td>
                    <td>Caffeine Consumption</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("caffeine", formData.caffeine)}</td>
                  </tr>
                  <tr>
                    <td>Lifestyle</td>
                    <td>Alcohol Intake</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("alcohol", formData.alcohol)}</td>
                  </tr>
                  <tr>
                    <td>Lifestyle</td>
                    <td>Recreational Drug Use</td>
                    <td style={{ fontWeight: 600 }}>{getReadableValue("recreationalDrugs", formData.recreationalDrugs)}</td>
                  </tr>
                  {formData.includeLab === "yes" && (
                    <>
                      <tr>
                        <td>Labs</td>
                        <td>AMH Value</td>
                        <td style={{ fontWeight: 600 }}>{formData.amhValue ? `${formData.amhValue} ${formData.amhUnit}` : "Not entered"}</td>
                      </tr>
                      <tr>
                        <td>Labs</td>
                        <td>FSH Value</td>
                        <td style={{ fontWeight: 600 }}>{formData.fsh ? `${formData.fsh} IU/L` : "Not entered"}</td>
                      </tr>
                      <tr>
                        <td>Labs</td>
                        <td>Antral Follicle Count</td>
                        <td style={{ fontWeight: 600 }}>{formData.afc ? `${formData.afc} Follicles` : "Not entered"}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Generation Matched Consultation Call Box */}
          <div className={styles.ctaBox}>
            <h3 className={styles.ctaTitle}>Book Your Free IVF Consultation Matching</h3>
            <p className={styles.ctaDesc}>
              Review your complete 27-question FertiSTAT findings in detail with one of our specialized fertility advisors. We will help map your diagnosis to top-tier laboratories and clinics.
            </p>
            <button
              type="button"
              className={styles.btnCta}
              onClick={() => {
                setConsultOpen(prev => !prev);
                setConsultMessage("");
              }}
            >
              <FileCheck width={20} height={20} /> Secure My Priority Consult
            </button>
            {consultOpen && (
              <form className={styles.consultForm} onSubmit={handleConsultSubmit}>
                <div className={styles.consultGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Date</label>
                    <input
                      type="date"
                      value={consultForm.preferredDate}
                      onChange={(e) => setConsultForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Time</label>
                    <div className={styles.inputWrapper}>
                      <Clock className={styles.inputIcon} />
                      <select
                        value={consultForm.preferredTime}
                        onChange={(e) => setConsultForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                        className={styles.formInput}
                        required
                      >
                        <option value="">Select a window</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Notes</label>
                  <textarea
                    value={consultForm.notes}
                    onChange={(e) => setConsultForm(prev => ({ ...prev, notes: e.target.value }))}
                    className={`${styles.formInput} ${styles.consultNotes}`}
                    placeholder="Share anything you want the coordinator to know"
                    maxLength={500}
                  />
                </div>
                <button type="submit" className={styles.btnConsultSubmit} disabled={consultSubmitting}>
                  {consultSubmitting ? "Sending Request..." : "Send Consultation Request"}
                </button>
              </form>
            )}
            {consultMessage && (
              <p className={styles.consultMessage}>{consultMessage}</p>
            )}
          </div>

          <p className={styles.resultsDisclaimer}>
            * This triage evaluation is calibrated against FertiSTAT (Bunting & Boivin, Human Reproduction, 2010) criteria. It is designed to evaluate statistical clinical indicators and does not constitute medical advice or predict personal pregnancy likelihood. All medical pathways require professional diagnostic testing.
          </p>

          <button className={styles.btnRestart} onClick={handleRestart}>
            <RotateCcw width={16} height={16} /> Restart Assessment
          </button>
        </div>
      )}
      
      {/* Hidden Premium Report Template for PDF Generation */}
      {results && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <PremiumReportTemplate 
            results={results} 
            formData={formData} 
            leadName={leadName} 
          />
        </div>
      )}
    </div>
  );
}
