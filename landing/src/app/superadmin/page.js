"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  KeyRound,
  PauseCircle,
  Plus,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import styles from "./superadmin.module.css";

const emptyForm = {
  name: "",
  ownerName: "",
  ownerEmail: "",
  notificationEmail: "",
  allowedDomains: "",
  plan: "starter",
  status: "trial",
};

export default function SuperadminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [clinics, setClinics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const sortedClinics = useMemo(() => clinics || [], [clinics]);

  const loadClinics = useCallback(async () => {
    const response = await fetch("/api/superadmin/clinics");
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Could not load clinics.");
      return;
    }
    setClinics(result.clinics);
    setSummary(result.summary);
  }, []);

  const checkSession = useCallback(async () => {
    const response = await fetch("/api/superadmin/session");
    if (response.ok) {
      setAuthenticated(true);
      await loadClinics();
    }
    setLoading(false);
  }, [loadClinics]);

  useEffect(() => {
    // Session state is read from the server-only auth cookie on first load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkSession();
  }, [checkSession]);

  async function login(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/superadmin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Login failed.");
      return;
    }
    setAuthenticated(true);
    setPassword("");
    await loadClinics();
  }

  async function logout() {
    await fetch("/api/superadmin/session", { method: "DELETE" });
    setAuthenticated(false);
    setClinics([]);
    setSummary(null);
  }

  async function createClinic(event) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/superadmin/clinics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Could not create clinic.");
      return;
    }
    setForm(emptyForm);
    setMessage(`Created ${result.clinic.name}.`);
    await loadClinics();
  }

  async function updateClinic(clinicId, patch) {
    const response = await fetch("/api/superadmin/clinics/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicId, patch }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Could not update clinic.");
      return;
    }
    await loadClinics();
  }

  function embedSnippet(clinic) {
    return `<script src="https://cdn.sora.com/fertility-widget.js" data-clinic-id="${clinic.clinicId}"></script>\n<div data-sora-fertility-widget></div>`;
  }

  async function copyEmbed(clinic) {
    await navigator.clipboard.writeText(embedSnippet(clinic));
    setMessage(`Copied embed snippet for ${clinic.name}.`);
  }

  if (loading) {
    return <main className={styles.shell}>Loading superadmin...</main>;
  }

  if (!authenticated) {
    return (
      <main className={styles.loginShell}>
        <form className={styles.loginPanel} onSubmit={login}>
          <div className={styles.loginIcon}><KeyRound size={24} /></div>
          <h1>SORA Superadmin</h1>
          <p>Manage clinic verification, domains, subscriptions, and usage.</p>
          <input
            type="password"
            placeholder="Superadmin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit"><ShieldCheck size={18} /> Sign in</button>
          {message && <div className={styles.error}>{message}</div>}
        </form>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div>
          <span className={styles.eyebrow}>Private Operations</span>
          <h1>Clinic Registry</h1>
        </div>
        <div className={styles.topActions}>
          <button type="button" onClick={loadClinics}><RefreshCw size={16} /> Refresh</button>
          <button type="button" onClick={logout}>Sign out</button>
        </div>
      </header>

      <section className={styles.metrics}>
        <Metric label="Total Clinics" value={summary?.totalClinics || 0} />
        <Metric label="Active Clinics" value={summary?.activeClinics || 0} />
        <Metric label="Pending Verification" value={summary?.pendingVerification || 0} />
        <Metric label="Assessments" value={summary?.totalAssessments || 0} />
      </section>

      <section className={styles.workspace}>
        <form className={styles.createPanel} onSubmit={createClinic}>
          <h2><Plus size={18} /> Add Clinic</h2>
          <input placeholder="Clinic name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Owner name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
          <input placeholder="Owner email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} />
          <input placeholder="Notification email" value={form.notificationEmail} onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })} />
          <textarea placeholder="Allowed domains, comma or line separated" value={form.allowedDomains} onChange={(e) => setForm({ ...form, allowedDomains: e.target.value })} />
          <div className={styles.inlineFields}>
            <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="trial">Trial</option>
              <option value="active">Active</option>
            </select>
          </div>
          <button type="submit"><Plus size={16} /> Create Clinic ID</button>
          {message && <div className={styles.message}>{message}</div>}
        </form>

        <section className={styles.clinicList}>
          {sortedClinics.map((clinic) => (
            <article className={styles.clinicRow} key={clinic.clinicId}>
              <div className={styles.clinicMain}>
                <div>
                  <h2>{clinic.name}</h2>
                  <p>{clinic.ownerName || "Owner not set"} · {clinic.ownerEmail}</p>
                </div>
                <div className={styles.badges}>
                  <span className={styles.badge}>{clinic.plan}</span>
                  <span className={`${styles.badge} ${styles[clinic.status]}`}>{clinic.status}</span>
                  <span className={`${styles.badge} ${styles[clinic.verificationStatus]}`}>{clinic.verificationStatus}</span>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div><span>Clinic ID</span><strong>{clinic.clinicId}</strong></div>
                <div><span>Domains</span><strong>{clinic.allowedDomains.join(", ")}</strong></div>
                <div><span>Assessments</span><strong>{clinic.usage?.totalAssessments || 0}</strong></div>
                <div><span>Last Used</span><strong>{clinic.usage?.lastAssessmentAt ? new Date(clinic.usage.lastAssessmentAt).toLocaleString() : "Never"}</strong></div>
              </div>

              <pre className={styles.embed}>{embedSnippet(clinic)}</pre>

              <div className={styles.rowActions}>
                <button type="button" onClick={() => updateClinic(clinic.clinicId, { verificationStatus: "verified" })}>
                  <CheckCircle2 size={16} /> Verify
                </button>
                <button type="button" onClick={() => updateClinic(clinic.clinicId, { status: clinic.status === "active" ? "paused" : "active" })}>
                  <PauseCircle size={16} /> {clinic.status === "active" ? "Pause" : "Activate"}
                </button>
                <button type="button" onClick={() => updateClinic(clinic.clinicId, { status: "blocked" })}>
                  <XCircle size={16} /> Block
                </button>
                <button type="button" onClick={() => copyEmbed(clinic)}>
                  <Copy size={16} /> Copy Embed
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
