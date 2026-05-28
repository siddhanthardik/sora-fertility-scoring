import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getClinic } from "../../lib/clinicRegistry";

const getReadableValue = (key, value) => {
  if (value === undefined || value === null || value === "") return "Not entered / Skipped";
  
  const mapping = {
    // Start Here
    tryingStatus: { active: "Actively trying now", planning: "Planning a future pregnancy", awareness: "Checking fertility awareness" },
    prevBirth: { yes: "Yes", no: "No" },
    tryDuration: { notTrying: "Not currently trying", under6: "Less than 6 months", sixToEleven: "6-11 months", over12: "12 months or longer" },
    intercourseTiming: { notTrying: "Not currently trying", wellTimed: "Regular intercourse during the fertile window", infrequent: "Intercourse may be too infrequent", uncertain: "Fertile-window timing is uncertain" },
    partnerSperm: { no: "No known issue", yes: "Yes, known sperm factor", unknown: "Unknown / not tested" },
    
    // Cycles
    cycleReg: { regular: "Yes, regular", irregular: "No, irregular or absent" },
    cycleLength: { short: "Less than 21 days", normal: "21-35 days", long: "More than 35 days", absent: "Absent periods", notSure: "Not sure" },
    pcos: { yes: "Yes", no: "No", notSure: "Not sure" },
    
    // Health Background
    thyroid: { no: "No", treated: "Yes, treated", untreated: "Yes, untreated / uncontrolled", notSure: "Not sure" },
    diabetes: { no: "No", controlled: "Yes, well controlled", uncontrolled: "Yes, not well controlled", notSure: "Not sure" },
    familyEarlyMenopause: { no: "No", yes: "Yes", notSure: "Not sure" },
    
    // Pregnancy History
    pregnancyLosses: { none: "None", one: "One", twoPlus: "Two or more" },
    ectopicPregnancy: { yes: "Yes", no: "No", notSure: "Not sure" },
    
    // Pelvic & Uterine
    endo: { yes: "Yes", no: "No", notSure: "Not sure" },
    pelvicPain: { none: "No significant pain", mild: "Yes, mild/moderate pain", severe: "Yes, severe or deep pain" },
    uterineHistory: { no: "No", yes: "Yes", notSure: "Not sure" },
    pelvicSurgery: { no: "No", yes: "Yes", notSure: "Not sure" },
    
    // Infections
    stiHistory: { no: "No", yes: "Yes", notSure: "Not sure" },
    tbHistory: { no: "No", pulmonary: "Yes, pulmonary / lung TB", pelvic: "Yes, pelvic / genital TB", notSure: "Not sure" },
    tbTreatment: { no: "No", completed: "Yes, completed treatment", current: "Yes, currently on treatment", notSure: "Not sure" },
    
    // Medical & Lifestyle
    cancerTreatment: { no: "No", yes: "Yes", notSure: "Not sure" },
    smoking: { no: "No", occasional: "Yes, occasionally", daily: "Yes, daily" },
    caffeine: { low: "Low: 0-100 mg/day", moderate: "Moderate: 100-200 mg/day", high: "High: more than 200 mg/day", notSure: "Not sure" },
    alcohol: { no: "No", yes: "Yes", notSure: "Not sure" },
    recreationalDrugs: { no: "No", occasional: "Yes, occasionally", regular: "Yes, regularly" },
    
    // Labs
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

function escapePayload(value) {
  if (Array.isArray(value)) return value.map(escapePayload);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, escapePayload(item)]));
  }
  if (typeof value !== "string") return value;
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeHeaderText(value) {
  return String(value || "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .slice(0, 120);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export async function POST(request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 150_000) {
      return NextResponse.json(
        { success: false, message: "Payload is too large." },
        { status: 413 }
      );
    }

    const rawPayload = await request.json();
    const deliveryEmail = String(rawPayload?.email || rawPayload?.report_delivery_email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryEmail)) {
      return NextResponse.json(
        { success: false, message: "A valid email is required." },
        { status: 400 }
      );
    }

    const payload = escapePayload(rawPayload);
    const clinicId = String(rawPayload?.clinicId || rawPayload?.clinic_id || "").trim();
    const clinic = clinicId ? await getClinic(clinicId).catch((error) => {
      console.error("Clinic lookup for lead notification failed:", error);
      return null;
    }) : null;
    const clinicNotificationEmail = String(clinic?.notificationEmail || clinic?.ownerEmail || "").trim();
    const shouldNotifyClinic = rawPayload?.consent_marketing === true
      || rawPayload?.contactConsent === true
      || rawPayload?.leadConsent === true;

    // 1. Submit lead to Render Database API
    let renderSaved = false;
    let renderErrorMsg = "";
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const renderResponse = await fetch("https://sora-fertility-bot.onrender.com/api/leads", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(rawPayload),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (renderResponse.ok) {
        renderSaved = true;
      } else {
        const errJson = await renderResponse.json().catch(() => null);
        renderErrorMsg = errJson?.message || "Render node rejected payload.";
      }
    } catch (dbErr) {
      console.error("Failed to forward lead to database Render node:", dbErr);
      renderErrorMsg = dbErr.name === "AbortError" ? "Render lead forward timed out." : dbErr.message;
    }

    // 2. Dispatch Triage Report HTML Email using SMTP via Nodemailer
    let emailSent = false;
    let emailErrorMsg = "";
    let clinicNotificationSent = false;
    let clinicNotificationError = "";

    const { 
      email, 
      name, 
      phone, 
      age, 
      risk_category,
      referral_urgency, 
      referral_triggers, 
      flagged_factors, 
      ovarian_reserve,
      includeLab,
      consultation_request,
      preferred_date,
      preferred_time,
      consultation_notes
    } = payload;
    const safeRiskCategory = ["high", "medium", "low"].includes(risk_category) ? risk_category : "low";
    const safeReferralTriggers = Array.isArray(referral_triggers) ? referral_triggers : [];
    const safeFlaggedFactors = Array.isArray(flagged_factors) ? flagged_factors : [];
    const isConsultationRequest = consultation_request === true;
    const consultationBlock = isConsultationRequest ? `
      <div style="background: #fff7ea; border: 1px solid #DFBA89; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 8px; color: #1F2B22;">Priority Consultation Request</h3>
        <p style="margin: 4px 0;"><strong>Preferred date:</strong> ${preferred_date || "Not specified"}</p>
        <p style="margin: 4px 0;"><strong>Preferred time:</strong> ${preferred_time || "Not specified"}</p>
        ${consultation_notes ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${consultation_notes}</p>` : ""}
      </div>
    ` : "";

    // Check if SMTP is configured in environmental options, with clinical spa fallback
    const smtpHost = process.env.SMTP_HOST || "";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";
    const smtpFrom = process.env.SMTP_FROM || `"Sora Fertility Network" <clinical.reports@sorafertility.com>`;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        const riskColor = safeRiskCategory === "high" ? "#a93f3f" : (safeRiskCategory === "medium" ? "#d39a27" : "#42734c");
        const riskBg = safeRiskCategory === "high" ? "#fae9e7" : (safeRiskCategory === "medium" ? "#fff1d9" : "#e8f3ea");

        // Compile HTML Content
        let htmlBody = `
          <div style="font-family: Arial, sans-serif; color: #1F2B22; background: #FAF9F6; padding: 30px; line-height: 1.6; max-width: 680px; margin: 0 auto; border-radius: 16px;">
            <div style="text-align: center; border-bottom: 2px solid #5F7D67; padding-bottom: 20px; margin-bottom: 25px;">
              <h1 style="color: #1F2B22; margin: 0; font-size: 26px;">Sora Fertility Clinic</h1>
              <p style="color: #5F7D67; margin: 4px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">Confidential Triage & FertiSTAT Report</p>
            </div>

            <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #e3e7e2;">
              <h3 style="margin-top: 0; color: #1F2B22; border-bottom: 1px solid #e3e7e2; padding-bottom: 8px;">Patient Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #63716b; width: 40%;">Full Name:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #63716b;">Age:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${age} Years</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #63716b;">Mobile Line:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #63716b;">Delivery Email:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${email}</td>
                </tr>
              </table>
            </div>

            <div style="background: ${riskBg}; color: ${riskColor}; border-radius: 12px; padding: 24px; margin-bottom: 25px; border: 1px solid ${riskColor}40;">
              <h2 style="margin: 0 0 8px; text-transform: uppercase; font-size: 20px; letter-spacing: 0.05em;">Triage Tier: ${safeRiskCategory.toUpperCase()}</h2>
              <p style="margin: 0; font-size: 15px; font-weight: bold; color: #1F2B22;">Referral Guidance: ${referral_urgency}</p>
            </div>

            ${ovarian_reserve ? `
              <div style="background: #F5E3E0; border-left: 4px solid #DFBA89; border-radius: 8px; padding: 16px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 6px; color: #1F2B22;">🧬 Ovarian Reserve Calibration</h3>
                <p style="margin: 0; font-size: 14px;">Correspond to **AAFA Ovarian Reserve Cluster ${ovarian_reserve.cluster}** — indicating **${ovarian_reserve.reserve}** reserve parameters.</p>
              </div>
            ` : ""}

            ${safeReferralTriggers.length > 0 ? `
              <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #e3e7e2;">
                <h3 style="margin-top: 0; color: #a93f3f;">Clinical Referral Triggers</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${safeReferralTriggers.map(t => `<li style="margin-bottom: 8px; font-size: 14px;">${t}</li>`).join("")}
                </ul>
              </div>
            ` : ""}

            ${safeFlaggedFactors.length > 0 ? `
              <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #e3e7e2;">
                <h3 style="margin-top: 0; color: #1F2B22;">Flagged Risk Markers (${safeFlaggedFactors.length})</h3>
                ${safeFlaggedFactors.map(f => `
                  <div style="border-left: 3px solid ${f.level === "red" ? "#a93f3f" : "#d39a27"}; padding-left: 10px; margin: 12px 0;">
                    <strong style="font-size: 14px; color: #1F2B22;">${f.title}</strong><br />
                    <span style="font-size: 13px; color: #63716b;">Status: ${f.label}</span>
                  </div>
                `).join("")}
              </div>
            ` : ""}

            <!-- NEW SECTION: COMPREHENSIVE PATIENT QUESTIONNAIRE DATA SUMMARY -->
            <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #e3e7e2;">
              <h3 style="margin-top: 0; color: #1F2B22; border-bottom: 1px solid #e3e7e2; padding-bottom: 8px;">Your Complete Assessment Data</h3>
              <p style="font-size: 13px; color: #63716b; margin-top: 4px; margin-bottom: 12px;">Here is the exact data you entered in the questionnaire, utilized to calculate your triage report:</p>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #5F7D67; color: white;">
                    <th style="padding: 8px; text-align: left; border-radius: 6px 0 0 0;">Parameter Group</th>
                    <th style="padding: 8px; text-align: left;">Clinical Question / Metric</th>
                    <th style="padding: 8px; text-align: left; border-radius: 0 6px 0 0;">Value Entered</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Personal Metrics -->
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td rowspan="4" style="padding: 8px; font-weight: bold; color: #5F7D67; vertical-align: top; border-right: 1px solid #edf0ed; background: #FAF9F6;">Personal</td>
                    <td style="padding: 8px;">Patient Age</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("age", age)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Height (cm)</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("height", payload.height)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Weight (kg)</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("weight", payload.weight)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Calculated BMI</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("bmi", payload.bmi)}</td>
                  </tr>

                  <!-- Fertility Context -->
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td rowspan="5" style="padding: 8px; font-weight: bold; color: #5F7D67; vertical-align: top; border-right: 1px solid #edf0ed; background: #FAF9F6;">Context</td>
                    <td style="padding: 8px;">Current Goal Focus</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("tryingStatus", payload.tryingStatus)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Active Try Duration</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("tryDuration", payload.tryDuration)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Previous Births</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("prevBirth", payload.prevBirth)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Intercourse Timing</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("intercourseTiming", payload.intercourseTiming)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Partner Sperm factor</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("partnerSperm", payload.partnerSperm)}</td>
                  </tr>

                  <!-- Menstrual & Endocrine -->
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td rowspan="5" style="padding: 8px; font-weight: bold; color: #5F7D67; vertical-align: top; border-right: 1px solid #edf0ed; background: #FAF9F6;">Hormonal</td>
                    <td style="padding: 8px;">Period regularity</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("cycleReg", payload.cycleReg)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Cycle length</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("cycleLength", payload.cycleLength)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">PCOS status</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("pcos", payload.pcos)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Thyroid history</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("thyroid", payload.thyroid)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Diabetes condition</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("diabetes", payload.diabetes)}</td>
                  </tr>

                  <!-- Pelvic & Medical -->
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td rowspan="5" style="padding: 8px; font-weight: bold; color: #5F7D67; vertical-align: top; border-right: 1px solid #edf0ed; background: #FAF9F6;">Pelvic / Hist</td>
                    <td style="padding: 8px;">Endometriosis</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("endo", payload.endo)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Severe Pelvic/Period Pain</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("pelvicPain", payload.pelvicPain)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Uterine factor / Fibroids</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("uterineHistory", payload.uterineHistory)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Prior Pelvic surgeries</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("pelvicSurgery", payload.pelvicSurgery)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Pregnancy losses</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("pregnancyLosses", payload.pregnancyLosses)}</td>
                  </tr>

                  <!-- Infections & Treatments -->
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td rowspan="6" style="padding: 8px; font-weight: bold; color: #5F7D67; vertical-align: top; border-right: 1px solid #edf0ed; background: #FAF9F6;">Medical</td>
                    <td style="padding: 8px;">Prior Ectopic Pregnancy</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("ectopicPregnancy", payload.ectopicPregnancy)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">STI history</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("stiHistory", payload.stiHistory)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Tuberculosis history</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("tbHistory", payload.tbHistory)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">TB Treatment history</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("tbTreatment", payload.tbTreatment)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Chemotherapy / Radiation</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("cancerTreatment", payload.cancerTreatment)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Family early menopause</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("familyEarlyMenopause", payload.familyEarlyMenopause)}</td>
                  </tr>

                  <!-- Lifestyle & Labs -->
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td rowspan="7" style="padding: 8px; font-weight: bold; color: #5F7D67; vertical-align: top; border-right: 1px solid #edf0ed; background: #FAF9F6;">Lifestyle & Labs</td>
                    <td style="padding: 8px;">Cigarettes / Tobacco</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("smoking", payload.smoking)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Caffeine Consumption</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("caffeine", payload.caffeine)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Alcohol intake</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("alcohol", payload.alcohol)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Recreational drug use</td>
                    <td style="padding: 8px; font-weight: bold;">${getReadableValue("recreationalDrugs", payload.recreationalDrugs)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">AMH Value</td>
                    <td style="padding: 8px; font-weight: bold;">${payload.amhValue ? `${payload.amhValue} ${payload.amhUnit}` : "Not entered"}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">FSH Value</td>
                    <td style="padding: 8px; font-weight: bold;">${payload.fsh ? `${payload.fsh} IU/L` : "Not entered"}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #edf0ed;">
                    <td style="padding: 8px;">Antral Follicle Count (AFC)</td>
                    <td style="padding: 8px; font-weight: bold;">${payload.afc ? `${payload.afc} Follicles` : "Not entered"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="background: #5F7D67; color: white; text-align: center; border-radius: 12px; padding: 24px; box-shadow: 0 4px 10px rgba(95,125,103,0.15); margin-bottom: 25px;">
              <h3 style="margin-top: 0; color: #DFBA89; font-size: 16px;">Next Step: Your Complimentary consultation</h3>
              <p style="margin: 0 0 15px; font-size: 13px;">Discuss these FertiSTAT findings with a clinical matching expert to review top-tier laboratories and clinics.</p>
              <a href="https://sora-fertility-bot.onrender.com/" target="_blank" style="background: #DFBA89; color: #1F2B22; font-weight: bold; border-radius: 8px; padding: 10px 20px; text-decoration: none; display: inline-block; font-size: 13px;">Book My Secure Consultation</a>
            </div>

            <p style="font-size: 11px; color: #63716b; line-height: 1.5; margin-top: 20px; border-top: 1px solid #e3e7e2; padding-top: 15px; text-align: justify;">
              * **Clinical Disclaimer**: Sora Fertility risk assessments are designed for educational triage and statistics tracking based on peer-reviewed metrics (FertiSTAT, Bunting & Boivin, 2010). It does not constitute medical diagnosis, treatment prescription, or pregnancy guarantees. Always consult a licensed clinical professional for comprehensive path mapping.
            </p>
          </div>
        `;

        await transporter.sendMail({
          from: smtpFrom,
          to: deliveryEmail,
          subject: `${safeHeaderText(name || "Your")} - Your Sora Fertility FertiSTAT Report`,
          html: htmlBody
        });

        emailSent = true;

        if (shouldNotifyClinic && isValidEmail(clinicNotificationEmail)) {
          try {
            const clinicHtmlBody = `
              <div style="font-family: Arial, sans-serif; color: #1F2B22; background: #FAF9F6; padding: 24px; line-height: 1.6; max-width: 680px; margin: 0 auto;">
                <h2 style="margin: 0 0 8px;">New SORA Fertility Lead</h2>
                <p style="margin: 0 0 16px; color: #5F7D67;"><strong>Mapped clinic:</strong> ${clinic?.name || clinicId || "Clinic not found"}</p>
                <div style="background: #ffffff; border: 1px solid #e3e7e2; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Age:</strong> ${age}</p>
                <p><strong>Triage tier:</strong> ${safeRiskCategory.toUpperCase()}</p>
                <p><strong>Referral guidance:</strong> ${referral_urgency}</p>
              </div>
              ${consultationBlock}
              <p style="font-size: 13px; color: #63716b;">The user consented to secure delivery of the FertiSTAT fertility summary and follow-up advisor clinical matching calls/texts.</p>
              ${htmlBody}
            </div>
          `;

            await transporter.sendMail({
              from: smtpFrom,
              to: clinicNotificationEmail,
              replyTo: deliveryEmail,
              subject: `${isConsultationRequest ? "Priority consult request" : "New SORA fertility lead"} - ${safeHeaderText(name || "Patient")}`,
              html: clinicHtmlBody
            });
            clinicNotificationSent = true;
          } catch (clinicMailErr) {
            console.error("Clinic notification email send failure:", clinicMailErr);
            clinicNotificationError = clinicMailErr.message;
          }
        } else if (shouldNotifyClinic) {
          clinicNotificationError = clinicId
            ? "Mapped clinic notification email is missing or invalid."
            : "Clinic ID was not provided with the lead payload.";
        }
      } catch (mailErr) {
        console.error("Nodemailer SMTP email send failure:", mailErr);
        emailErrorMsg = mailErr.message;
        if (shouldNotifyClinic && !clinicNotificationSent) {
          clinicNotificationError = mailErr.message;
        }
      }
    } else {
      console.warn("SMTP email environment variables are not configured. Skipping email delivery.");
      emailErrorMsg = "SMTP variables not defined on Next.js server node.";
      if (shouldNotifyClinic) {
        clinicNotificationError = "SMTP variables not defined on Next.js server node.";
      }
    }

    // 3. Return full compilation status back to client
    return NextResponse.json({
      success: true,
      render_database_saved: renderSaved,
      database_error: renderErrorMsg,
      email_dispatched: emailSent,
      email_error: emailErrorMsg,
      clinic_notification_dispatched: clinicNotificationSent,
      clinic_notification_email: clinicNotificationEmail || null,
      clinic_notification_error: clinicNotificationError
    });

  } catch (err) {
    console.error("Sora API Route proxy error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server proxy error." },
      { status: 500 }
    );
  }
}
