import "server-only";

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const registryPath = path.join(process.cwd(), "data", "clinics.json");
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseClinicsTable = safeIdentifier(process.env.SUPABASE_CLINICS_TABLE || "clinic_registry");

const defaultClinics = [
  {
    clinicId: "clinic_krystal_clinic_4ded0a",
    name: "Krystal Clinic",
    ownerName: "Dr Hasib",
    ownerEmail: "hasibulimam86@gmail.com",
    notificationEmail: "hasibulimam86@gmail.com",
    allowedDomains: [
      "sora.krystalclinicdelhi.com",
      "www.sora.krystalclinicdelhi.com",
      "krystalclinicdelhi.com",
      "www.krystalclinicdelhi.com",
    ],
    status: "active",
    verificationStatus: "verified",
    plan: "starter",
    reportSettings: {
      allowPremium: true,
      whiteLabel: false,
      customLogoUrl: null,
      forceReportType: "user_choice"
    },
    usage: {
      totalAssessments: 0,
      totalReports: 0,
      lastAssessmentAt: null,
    },
    createdAt: "2026-05-28T09:14:58.516Z",
    updatedAt: "2026-05-28T09:14:58.516Z",
  },
];

export async function listClinics() {
  if (hasSupabase()) {
    try {
      const rows = await supabaseRequest(`/${supabaseClinicsTable}?select=*&order=created_at.desc`);
      return rows.map(fromDbClinic);
    } catch (error) {
      console.error("Supabase clinic list failed; using local registry fallback:", error);
    }
  }

  const registry = await readRegistry();
  return registry.clinics.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getClinic(clinicId) {
  if (!clinicId) return null;
  if (hasSupabase()) {
    try {
      const rows = await supabaseRequest(`/${supabaseClinicsTable}?clinic_id=eq.${encodeURIComponent(clinicId)}&select=*&limit=1`);
      if (rows[0]) return fromDbClinic(rows[0]);
    } catch (error) {
      console.error("Supabase clinic lookup failed; using local registry fallback:", error);
    }
  }

  const registry = await readRegistry();
  return registry.clinics.find((clinic) => clinic.clinicId === clinicId) || null;
}

export async function createClinic(input) {
  const now = new Date().toISOString();
  const clinic = {
    clinicId: generateClinicId(input.name),
    name: cleanText(input.name),
    ownerName: cleanText(input.ownerName),
    ownerEmail: cleanText(input.ownerEmail).toLowerCase(),
    notificationEmail: cleanText(input.notificationEmail || input.ownerEmail).toLowerCase(),
    allowedDomains: normalizeDomains(input.allowedDomains),
    status: input.status === "trial" ? "trial" : "active",
    verificationStatus: "pending",
    plan: cleanText(input.plan || "starter"),
    widgetToken: crypto.randomBytes(24).toString("hex"),
    reportSettings: {
      allowPremium: true,
      whiteLabel: false,
      customLogoUrl: null,
      forceReportType: "user_choice"
    },
    usage: {
      totalAssessments: 0,
      totalReports: 0,
      lastAssessmentAt: null,
    },
    createdAt: now,
    updatedAt: now,
  };

  validateClinic(clinic);

  if (hasSupabase()) {
    const rows = await supabaseRequest(`/${supabaseClinicsTable}`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(toDbClinic(clinic)),
    });
    return fromDbClinic(rows[0]);
  }

  const registry = await readRegistry();
  registry.clinics.push(clinic);
  await writeRegistry(registry);
  return clinic;
}

export async function updateClinic(clinicId, patch) {
  if (hasSupabase()) {
    const current = await getClinic(clinicId);
    if (!current) return null;
    const updated = buildUpdatedClinic(current, patch);
    validateClinic(updated);
    const rows = await supabaseRequest(`/${supabaseClinicsTable}?clinic_id=eq.${encodeURIComponent(clinicId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(toDbClinic(updated)),
    });
    return rows[0] ? fromDbClinic(rows[0]) : null;
  }

  const registry = await readRegistry();
  const index = registry.clinics.findIndex((clinic) => clinic.clinicId === clinicId);
  if (index === -1) return null;

  const current = registry.clinics[index];
  const updated = buildUpdatedClinic(current, patch);
  validateClinic(updated);
  registry.clinics[index] = updated;
  await writeRegistry(registry);
  return updated;
}

export async function recordAssessment(clinicId) {
  if (!clinicId) return;

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // Format: YYYY-MM

  if (hasSupabase()) {
    try {
      // We read the current usage, update it with monthly tracking, and patch it back
      const clinic = await getClinic(clinicId);
      if (clinic) {
        const usage = clinic.usage || {};
        usage.totalAssessments = Number(usage.totalAssessments || 0) + 1;
        usage.lastAssessmentAt = now.toISOString();
        
        if (usage.currentMonth !== currentMonth) {
          usage.currentMonth = currentMonth;
          usage.monthlyAssessments = 0;
        }
        usage.monthlyAssessments = Number(usage.monthlyAssessments || 0) + 1;

        await supabaseRequest(`/${supabaseClinicsTable}?clinic_id=eq.${encodeURIComponent(clinicId)}`, {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({ usage }),
        });
      }
      return;
    } catch (error) {
      console.error("Supabase assessment counter failed; using local registry fallback:", error);
    }
  }

  const registry = await readRegistry();
  const clinic = registry.clinics.find((item) => item.clinicId === clinicId);
  if (!clinic) return;

  clinic.usage = clinic.usage || {};
  clinic.usage.totalAssessments = Number(clinic.usage.totalAssessments || 0) + 1;
  clinic.usage.lastAssessmentAt = now.toISOString();
  
  if (clinic.usage.currentMonth !== currentMonth) {
    clinic.usage.currentMonth = currentMonth;
    clinic.usage.monthlyAssessments = 0;
  }
  clinic.usage.monthlyAssessments = Number(clinic.usage.monthlyAssessments || 0) + 1;
  
  clinic.updatedAt = now.toISOString();
  try {
    await writeRegistry(registry);
  } catch (error) {
    console.error("Local assessment counter failed:", error);
  }
}

export function originMatchesClinic(origin, clinic) {
  if (!origin || !clinic) return false;
  let hostname = "";
  try {
    hostname = new URL(origin).hostname.toLowerCase();
  } catch {
    return false;
  }

  // Hardcode official domain to always be allowed for any clinic
  if (hostname === "sorafertility.com" || hostname === "www.sorafertility.com") {
    return true;
  }

  if (process.env.NODE_ENV !== "production" && (hostname === "localhost" || hostname === "127.0.0.1")) {
    return true;
  }

  return clinic.allowedDomains.some((domain) => {
    const normalized = domain.toLowerCase();
    return hostname === normalized || hostname.endsWith(`.${normalized}`);
  });
}

export function summarizeClinics(clinics) {
  return {
    totalClinics: clinics.length,
    activeClinics: clinics.filter((clinic) => clinic.status === "active").length,
    pendingVerification: clinics.filter((clinic) => clinic.verificationStatus === "pending").length,
    totalAssessments: clinics.reduce((sum, clinic) => sum + Number(clinic.usage?.totalAssessments || 0), 0),
  };
}

async function readRegistry() {
  try {
    const content = await fs.readFile(registryPath, "utf8");
    const parsed = JSON.parse(content);
    const clinics = Array.isArray(parsed.clinics) ? parsed.clinics : [];
    return { clinics: mergeDefaultClinics(clinics) };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { clinics: defaultClinics };
  }
}

function mergeDefaultClinics(clinics) {
  const defaultsById = new Map(defaultClinics.map((clinic) => [clinic.clinicId, clinic]));
  const merged = clinics.map((clinic) => {
    const defaultClinic = defaultsById.get(clinic.clinicId);
    if (!defaultClinic) return clinic;
    return {
      ...defaultClinic,
      ...clinic,
      allowedDomains: [...new Set([
        ...(clinic.allowedDomains || []),
        ...(defaultClinic.allowedDomains || []),
      ])],
      notificationEmail: clinic.notificationEmail || defaultClinic.notificationEmail,
      ownerEmail: clinic.ownerEmail || defaultClinic.ownerEmail,
    };
  });
  const ids = new Set(merged.map((clinic) => clinic.clinicId));
  return [
    ...merged,
    ...defaultClinics.filter((clinic) => !ids.has(clinic.clinicId)),
  ];
}

async function writeRegistry(registry) {
  await fs.mkdir(path.dirname(registryPath), { recursive: true });
  const tempPath = `${registryPath}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(registry, null, 2)}\n`);
  await fs.rename(tempPath, registryPath);
}

function generateClinicId(name) {
  const slug = cleanText(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 28) || "clinic";
  return `clinic_${slug}_${crypto.randomBytes(3).toString("hex")}`;
}

function normalizeDomains(value) {
  const raw = Array.isArray(value) ? value.join(",") : String(value || "");
  return [...new Set(raw
    .split(/[\n,]/)
    .map((item) => item.trim().toLowerCase())
    .map((item) => item.replace(/^https?:\/\//, "").replace(/\/.*$/, ""))
    .filter(Boolean))];
}

function cleanText(value) {
  return String(value || "").trim();
}

function validateClinic(clinic) {
  if (!clinic.name) throw new Error("Clinic name is required.");
  if (!clinic.ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clinic.ownerEmail)) {
    throw new Error("A valid owner email is required.");
  }
  if (!["active", "trial", "paused", "blocked"].includes(clinic.status)) {
    throw new Error("Invalid clinic status.");
  }
  if (!["pending", "verified", "rejected"].includes(clinic.verificationStatus)) {
    throw new Error("Invalid verification status.");
  }
  if (!clinic.allowedDomains.length) throw new Error("At least one allowed domain is required.");
}

function buildUpdatedClinic(current, patch) {
  return {
    ...current,
    name: patch.name !== undefined ? cleanText(patch.name) : current.name,
    ownerName: patch.ownerName !== undefined ? cleanText(patch.ownerName) : current.ownerName,
    ownerEmail: patch.ownerEmail !== undefined ? cleanText(patch.ownerEmail).toLowerCase() : current.ownerEmail,
    notificationEmail: patch.notificationEmail !== undefined ? cleanText(patch.notificationEmail).toLowerCase() : current.notificationEmail,
    allowedDomains: patch.allowedDomains !== undefined ? normalizeDomains(patch.allowedDomains) : current.allowedDomains,
    status: patch.status !== undefined ? cleanText(patch.status) : current.status,
    verificationStatus: patch.verificationStatus !== undefined ? cleanText(patch.verificationStatus) : current.verificationStatus,
    plan: patch.plan !== undefined ? cleanText(patch.plan) : current.plan,
    reportSettings: patch.reportSettings !== undefined ? patch.reportSettings : (current.reportSettings || { allowPremium: true, whiteLabel: false, customLogoUrl: null, forceReportType: "user_choice" }),
    usage: current.usage || { totalAssessments: 0, totalReports: 0, lastAssessmentAt: null },
    updatedAt: new Date().toISOString(),
  };
}

function hasSupabase() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

async function supabaseRequest(pathname, options = {}) {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1${pathname}`, {
    ...options,
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase request failed: ${response.status} ${detail}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function supabaseRpc(functionName, body) {
  return supabaseRequest(`/rpc/${functionName}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function toDbClinic(clinic) {
  return {
    clinic_id: clinic.clinicId,
    name: clinic.name,
    owner_name: clinic.ownerName,
    owner_email: clinic.ownerEmail,
    notification_email: clinic.notificationEmail,
    allowed_domains: clinic.allowedDomains,
    status: clinic.status,
    verification_status: clinic.verificationStatus,
    widget_token: clinic.widgetToken,
    plan: clinic.plan,
    report_settings: clinic.reportSettings,
    usage: clinic.usage,
    created_at: clinic.createdAt,
    updated_at: clinic.updatedAt,
  };
}

function fromDbClinic(row) {
  return {
    clinicId: row.clinic_id,
    name: row.name,
    ownerName: row.owner_name || "",
    ownerEmail: row.owner_email || "",
    notificationEmail: row.notification_email || "",
    allowedDomains: Array.isArray(row.allowed_domains) ? row.allowed_domains : [],
    status: row.status,
    verificationStatus: row.verification_status,
    widgetToken: row.widget_token,
    plan: row.plan,
    reportSettings: row.report_settings || { allowPremium: true, whiteLabel: false, customLogoUrl: null, forceReportType: "user_choice" },
    usage: row.usage || { totalAssessments: 0, totalReports: 0, lastAssessmentAt: null },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function safeIdentifier(value) {
  const identifier = String(value || "");
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
    throw new Error("Invalid Supabase table name.");
  }
  return identifier;
}
