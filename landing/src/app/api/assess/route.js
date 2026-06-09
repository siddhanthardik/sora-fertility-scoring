import { NextResponse } from "next/server";
import { assessFertilityPayload } from "../../lib/fertilityAssessment";
import { getClinic, originMatchesClinic, recordAssessment } from "../../lib/clinicRegistry";
import { getSettings } from "../../lib/settingsRegistry";
import { generateAssessmentPDF } from "../../lib/pdfGenerator";
import { supabaseAdmin } from "../../lib/supabaseClient";

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const fieldRules = {
  tryingStatus: ["active", "planning", "awareness"],
  prevBirth: ["yes", "no"],
  tryDuration: ["notTrying", "under6", "sixToEleven", "over12"],
  intercourseTiming: ["notTrying", "wellTimed", "infrequent", "uncertain"],
  partnerSperm: ["no", "yes", "unknown"],
  cycleReg: ["regular", "irregular"],
  cycleLength: ["short", "normal", "long", "absent", "notSure"],
  pcos: ["yes", "no", "notSure"],
  thyroid: ["no", "treated", "untreated", "notSure"],
  diabetes: ["no", "controlled", "uncontrolled", "notSure"],
  familyEarlyMenopause: ["no", "yes", "notSure"],
  pregnancyLosses: ["none", "one", "twoPlus"],
  ectopicPregnancy: ["yes", "no", "notSure"],
  endo: ["yes", "no", "notSure"],
  pelvicPain: ["none", "mild", "severe"],
  uterineHistory: ["no", "yes", "notSure"],
  pelvicSurgery: ["no", "yes", "notSure"],
  stiHistory: ["no", "yes", "notSure"],
  tbHistory: ["no", "pulmonary", "pelvic", "notSure"],
  tbTreatment: ["no", "completed", "current", "notSure"],
  cancerTreatment: ["no", "yes", "notSure"],
  smoking: ["no", "occasional", "daily"],
  caffeine: ["low", "moderate", "high", "notSure"],
  alcohol: ["no", "yes", "notSure"],
  recreationalDrugs: ["no", "occasional", "regular"],
  includeLab: ["yes", "no"],
  amhUnit: ["ng/mL", "pmol/L"],
};

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function POST(request) {
  const headers = corsHeaders(request);
  let access;
  try {
    access = await verifyClinicAccess(request);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Assessment service is not configured." },
      { status: 503, headers }
    );
  }

  if (!access.ok) {
    return NextResponse.json(
      { success: false, message: access.message },
      { status: 403, headers }
    );
  }

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 80_000) {
      return NextResponse.json(
        { success: false, message: "Payload is too large." },
        { status: 413, headers }
      );
    }

    const payload = await request.json();
    const validation = validatePayload(payload);
    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400, headers }
      );
    }

    // 1. Calculate Score
    const assessment = assessFertilityPayload(payload);
    
    // Extract Patient Info
    const patientInfo = {
      name: payload.name || "Anonymous",
      email: payload.email || "no-email@provided.com",
      phone: payload.phone || "",
      age: payload.age || "",
    };

    let pdfUrl = null;

    if (supabaseAdmin && access.clinic) {
      // 2. Generate PDF
      const pdfBuffer = await generateAssessmentPDF(patientInfo, assessment);
      
      // 3. Upload to Supabase Storage
      const fileName = `${access.clinic.clinic_id}_${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('reports')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (!uploadError && uploadData) {
        // Get signed URL or public URL (using signed since it's private)
        const { data: urlData } = await supabaseAdmin.storage
          .from('reports')
          .createSignedUrl(fileName, 60 * 60 * 24 * 30); // 30 days
        pdfUrl = urlData?.signedUrl || null;
      }

      // 4. Save to Assessments Table
      const { error: dbError } = await supabaseAdmin.from('assessments').insert([{
        clinic_id: access.clinic.clinic_id,
        patient_name: patientInfo.name,
        patient_email: patientInfo.email,
        patient_phone: patientInfo.phone,
        age: Number(patientInfo.age),
        bmi: Number(payload.bmi) || null,
        payload: payload,
        fertistat_score: assessment.weightedTotal,
        risk_band: assessment.category,
        flagged_factors: assessment.flaggedFactors || [],
        pdf_url: pdfUrl,
        status: 'new'
      }]);

      if (dbError) {
        console.error("Failed to save assessment to Supabase:", dbError);
      }
    }

    // Record usage counter
    await recordAssessment(access.clinic?.clinicId || access.clinic?.clinic_id);

    return NextResponse.json(
      {
        success: true,
        assessment,
        pdfUrl
      },
      { headers }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message || "Assessment failed." },
      { status: 500, headers }
    );
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, message: "Invalid assessment payload." };
  }

  const age = Number(payload.age);
  const bmi = Number(payload.bmi);
  if (!Number.isFinite(age) || age < 18 || age > 55) {
    return { ok: false, message: "Age is outside the supported range." };
  }
  if (payload.bmi && (!Number.isFinite(bmi) || bmi < 10 || bmi > 60)) {
    return { ok: false, message: "BMI is outside the supported range." };
  }

  for (const [field, allowed] of Object.entries(fieldRules)) {
    if (payload[field] === undefined || payload[field] === "") continue;
    if (!allowed.includes(String(payload[field]))) {
      return { ok: false, message: `Invalid value for ${field}.` };
    }
  }

  return { ok: true };
}

function corsHeaders(request) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = origin || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Sora-Clinic-Id, X-Sora-Widget-Token",
    "Vary": "Origin",
  };
}

async function verifyClinicAccess(request) {
  const origin = request.headers.get("origin");
  const clinicId = request.headers.get("x-sora-clinic-id");
  const widgetToken = request.headers.get("x-sora-widget-token");
  
  const allowPublicDemo = process.env.SORA_ALLOW_PUBLIC_DEMO_ASSESSMENT === "true" || process.env.NODE_ENV !== "production";

  if (!clinicId && !widgetToken && allowPublicDemo && isAllowedDemoOrigin(request)) {
    return { ok: true, clinic: null };
  }

  if (!clinicId && !widgetToken) {
    return { ok: false, message: "Clinic ID or Widget Token is required." };
  }

  let clinic = null;

  if (widgetToken && supabaseAdmin) {
    const { data } = await supabaseAdmin.from('clinic_registry').select('*').eq('widget_token', widgetToken).single();
    if (data) clinic = data;
  } else if (clinicId) {
    clinic = await getClinic(clinicId);
  }

  if (!clinic) {
    return { ok: false, message: "Clinic was not found or invalid token." };
  }

  if (!["active", "trial"].includes(clinic.status)) {
    return { ok: false, message: "This clinic is not active." };
  }

  const packages = await import("../../lib/settingsRegistry").then(m => m.getPackages());
  const planName = clinic.plan?.toLowerCase() || "starter";
  const pkg = packages.find(p => p.name.toLowerCase() === planName);
  const planLimit = pkg ? pkg.assessment_limit : null;
  
  if (planLimit !== null && planLimit !== undefined) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const isCurrentMonth = clinic.usage?.currentMonth === currentMonth;
    const monthlyUsage = isCurrentMonth ? Number(clinic.usage?.monthlyAssessments || 0) : 0;
    
    if (monthlyUsage >= planLimit) {
      return { ok: false, message: "This clinic has reached its monthly assessment limit." };
    }
  }

  return { ok: true, clinic };
}

function isAllowedDemoOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const configured = (process.env.SORA_ALLOWED_WIDGET_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const allowed = configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS;

  return allowed.includes(origin);
}
