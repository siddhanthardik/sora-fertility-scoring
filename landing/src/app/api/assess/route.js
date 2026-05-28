import { NextResponse } from "next/server";
import { assessFertilityPayload } from "../../lib/fertilityAssessment";
import { getClinic, originMatchesClinic, recordAssessment } from "../../lib/clinicRegistry";

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
  } catch {
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

    const assessment = assessFertilityPayload(payload);
    await recordAssessment(access.clinic?.clinicId);

    return NextResponse.json(
      {
        success: true,
        assessment,
      },
      { headers }
    );
  } catch (error) {
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
  if (!Number.isFinite(bmi) || bmi < 10 || bmi > 60) {
    return { ok: false, message: "BMI is outside the supported range." };
  }

  for (const [field, allowed] of Object.entries(fieldRules)) {
    if (payload[field] === undefined || payload[field] === "") continue;
    if (!allowed.includes(String(payload[field]))) {
      return { ok: false, message: `Invalid value for ${field}.` };
    }
  }

  if (payload.includeLab === "yes") {
    const amh = Number(payload.amhValue);
    const fsh = Number(payload.fsh);
    const afc = Number(payload.afc);
    if (!Number.isFinite(amh) || amh < 0 || amh > 100) {
      return { ok: false, message: "AMH is outside the supported range." };
    }
    if (!Number.isFinite(fsh) || fsh < 0 || fsh > 100) {
      return { ok: false, message: "FSH is outside the supported range." };
    }
    if (!Number.isFinite(afc) || afc < 0 || afc > 100) {
      return { ok: false, message: "AFC is outside the supported range." };
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
    "Access-Control-Allow-Headers": "Content-Type, X-Sora-Clinic-Id",
    "Vary": "Origin",
  };
}

async function verifyClinicAccess(request) {
  const origin = request.headers.get("origin");
  const clinicId = request.headers.get("x-sora-clinic-id") || "";
  const allowPublicDemo = process.env.SORA_ALLOW_PUBLIC_DEMO_ASSESSMENT === "true" || process.env.NODE_ENV !== "production";

  if (allowPublicDemo && isAllowedDemoOrigin(request)) {
    return { ok: true, clinic: null };
  }

  if (!clinicId) {
    return { ok: false, message: "Clinic ID is required." };
  }

  if (process.env.NODE_ENV === "production" && !origin) {
    return { ok: false, message: "Request origin is required." };
  }

  const clinic = await getClinic(clinicId);
  if (!clinic) {
    return { ok: false, message: "Clinic ID was not found." };
  }

  if (!["active", "trial"].includes(clinic.status)) {
    return { ok: false, message: "This clinic is not active." };
  }

  if (clinic.verificationStatus !== "verified") {
    return { ok: false, message: "This clinic is not verified yet." };
  }

  if (origin && !originMatchesClinic(origin, clinic)) {
    return { ok: false, message: "This domain is not approved for this clinic." };
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
