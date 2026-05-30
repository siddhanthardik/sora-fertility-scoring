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
  Settings,
  X,
  Search,
  ChevronLeft,
  ChevronRight
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
  
  // Settings Modal State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [planLimits, setPlanLimits] = useState({ starter: 100, growth: 500, enterprise: "" });
  const [widgetHostUrl, setWidgetHostUrl] = useState("http://localhost:3000");
  const [limitsMessage, setLimitsMessage] = useState("");

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredClinics = useMemo(() => {
    let result = clinics || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.ownerName && c.ownerName.toLowerCase().includes(q)) || 
        (c.ownerEmail && c.ownerEmail.toLowerCase().includes(q)) || 
        (c.clinicId && c.clinicId.toLowerCase().includes(q))
      );
    }
    return result;
  }, [clinics, searchQuery]);

  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage) || 1;
  const paginatedClinics = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClinics.slice(start, start + itemsPerPage);
  }, [filteredClinics, currentPage]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const loadSettings = useCallback(async () => {
    const response = await fetch("/api/superadmin/plan-limits");
    if (response.ok) {
      const result = await response.json();
      setPlanLimits({
        starter: result.planLimits?.starter ?? "",
        growth: result.planLimits?.growth ?? "",
        enterprise: result.planLimits?.enterprise ?? ""
      });
      if (result.widgetHostUrl) {
        setWidgetHostUrl(result.widgetHostUrl);
      }
    }
  }, []);

  const checkSession = useCallback(async () => {
    const response = await fetch("/api/superadmin/session");
    if (response.ok) {
      setAuthenticated(true);
      await loadClinics();
      await loadSettings();
    }
    setLoading(false);
  }, [loadClinics, loadSettings]);

  useEffect(() => {
    // Session state is read from the server-only auth cookie on first load.
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
    await loadSettings();
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

  async function updatePassword(event) {
    event.preventDefault();
    setSettingsMessage("");
    const response = await fetch("/api/superadmin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    const result = await response.json();
    if (!response.ok) {
      setSettingsMessage(result.message || "Could not update password.");
      return;
    }
    setSettingsMessage("Password updated successfully.");
    setNewPassword("");
    setTimeout(() => {
      setSettingsOpen(false);
      setSettingsMessage("");
    }, 2000);
  }

  async function updateLimits(event) {
    event.preventDefault();
    setLimitsMessage("");
    const response = await fetch("/api/superadmin/plan-limits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planLimits, widgetHostUrl }),
    });
    const result = await response.json();
    if (!response.ok) {
      setLimitsMessage(result.message || "Could not update limits.");
      return;
    }
    setLimitsMessage("Plan limits saved successfully.");
    setTimeout(() => setLimitsMessage(""), 2000);
  }

  function embedSnippet(clinic) {
    const host = widgetHostUrl.trim().replace(/\/$/, ""); 
    return `<script src="${host}/fertility-widget.js" data-clinic-id="${clinic.clinicId}"></script>\n<div data-sora-fertility-widget></div>`;
  }

  async function copyEmbed(clinic) {
    await navigator.clipboard.writeText(embedSnippet(clinic));
    setMessage(`Copied embed snippet for ${clinic.name}.`);
  }

  if (loading) {
    return <main className={styles.loginContainer}>Loading superadmin...</main>;
  }

  if (!authenticated) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#111827' }}><KeyRound size={32} /></div>
            <h1>SORA Superadmin</h1>
            <p>Manage clinics, settings, and infrastructure.</p>
          </div>
          <form className={styles.loginForm} onSubmit={login}>
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                type="password"
                placeholder="Enter Superadmin password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button className={styles.btnPrimary} type="submit"><ShieldCheck size={18} /> Sign in</button>
            {message && <div className={styles.error}>{message}</div>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.dashboard}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.eyebrow}>Private Operations</span>
          <h1>Clinic Registry</h1>
        </div>
        <div className={styles.topActions}>
          <button className={styles.btnSecondary} type="button" onClick={() => setSettingsOpen(true)}><Settings size={16} /> Settings</button>
          <button className={styles.btnSecondary} type="button" onClick={loadClinics}><RefreshCw size={16} /> Refresh</button>
          <button className={styles.btnSecondary} type="button" onClick={logout}>Sign out</button>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.statsRow}>
          <Metric label="Total Clinics" value={summary?.totalClinics || 0} />
          <Metric label="Active Clinics" value={summary?.activeClinics || 0} />
          <Metric label="Pending Verification" value={summary?.pendingVerification || 0} />
          <Metric label="Assessments" value={summary?.totalAssessments || 0} />
        </section>

        <section className={styles.clinicMain}>
          <div className={styles.addClinicCard}>
            <h2 className={styles.sectionTitle}><Plus size={18} /> Add Clinic</h2>
            <form className={styles.loginForm} onSubmit={createClinic}>
              <div className={styles.inputGroup}>
                <label>Clinic Name</label>
                <input className={styles.input} placeholder="Acme Fertility" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Owner Name</label>
                <input className={styles.input} placeholder="Dr. Smith" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
              </div>
              <div className={styles.inputGroup}>
                <label>Owner Email</label>
                <input className={styles.input} type="email" placeholder="smith@acme.com" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} />
              </div>
              <div className={styles.inputGroup}>
                <label>Notification Email</label>
                <input className={styles.input} type="email" placeholder="leads@acme.com" value={form.notificationEmail} onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })} />
              </div>
              <div className={styles.inputGroup}>
                <label>Allowed Domains</label>
                <input className={styles.input} placeholder="acme.com, clinic.com" value={form.allowedDomains} onChange={(e) => setForm({ ...form, allowedDomains: e.target.value })} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.inputGroup}>
                  <label>Plan</label>
                  <select className={styles.input} value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Status</label>
                  <select className={styles.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <button className={styles.btnPrimary} type="submit" style={{ marginTop: '8px' }}>Create Clinic</button>
              {message && <div className={styles.message}>{message}</div>}
            </form>
          </div>

          <div>
            <div className={styles.listControls}>
              <div className={styles.searchWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input 
                  type="text" 
                  className={styles.searchInput}
                  placeholder="Search clinics by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className={styles.pageInfo}>
                Showing {filteredClinics.length} clinics
              </div>
            </div>

            <div className={styles.clinicList}>
              {paginatedClinics.map((clinic) => (
                <article className={styles.clinicRow} key={clinic.clinicId}>
                  <div className={styles.clinicHeader}>
                    <div className={styles.clinicTitle}>
                      <h3>{clinic.name}</h3>
                      <p>{clinic.ownerName || "Owner not set"} · {clinic.ownerEmail}</p>
                    </div>
                    <div className={styles.badges}>
                      <select 
                        className={styles.inlineSelect} 
                        value={clinic.plan} 
                        onChange={(e) => updateClinic(clinic.clinicId, { plan: e.target.value })}
                      >
                        <option value="starter">STARTER</option>
                        <option value="growth">GROWTH</option>
                        <option value="enterprise">ENTERPRISE</option>
                      </select>
                      
                      <select 
                        className={`${styles.inlineSelect} ${styles[clinic.status]}`} 
                        value={clinic.status} 
                        onChange={(e) => updateClinic(clinic.clinicId, { status: e.target.value })}
                      >
                        <option value="active">ACTIVE</option>
                        <option value="trial">TRIAL</option>
                        <option value="paused">PAUSED</option>
                        <option value="blocked">BLOCKED</option>
                      </select>
                      
                      <span className={`${styles.badge} ${styles[clinic.verificationStatus]}`}>{clinic.verificationStatus}</span>
                    </div>
                  </div>

                  <div className={styles.clinicStats}>
                    <div className={styles.miniStat}>
                      <span>Clinic ID</span>
                      <strong>{clinic.clinicId}</strong>
                    </div>
                    <div className={styles.miniStat}>
                      <span>Assessments</span>
                      <strong>{clinic.usage?.totalAssessments || 0}</strong>
                    </div>
                    <div className={styles.miniStat}>
                      <span>Last Used</span>
                      <strong>{clinic.usage?.lastAssessmentAt ? new Date(clinic.usage.lastAssessmentAt).toLocaleDateString() : "Never"}</strong>
                    </div>
                  </div>

                  <div className={styles.embedBlock}>{embedSnippet(clinic)}</div>

                  <div className={styles.clinicActions}>
                    <button className={styles.btnSecondary} type="button" onClick={() => updateClinic(clinic.clinicId, { verificationStatus: "verified" })}>
                      <CheckCircle2 size={16} /> Verify
                    </button>
                    <button className={styles.btnSecondary} type="button" onClick={() => updateClinic(clinic.clinicId, { status: clinic.status === "active" ? "paused" : "active" })}>
                      <PauseCircle size={16} /> {clinic.status === "active" ? "Pause" : "Activate"}
                    </button>
                    <button className={`${styles.btnSecondary} ${styles.btnDanger}`} type="button" onClick={() => updateClinic(clinic.clinicId, { status: "blocked" })}>
                      <XCircle size={16} /> Block
                    </button>
                    <button className={styles.btnSecondary} type="button" onClick={() => copyEmbed(clinic)}>
                      <Copy size={16} /> Copy Embed
                    </button>
                  </div>
                </article>
              ))}

              {paginatedClinics.length === 0 && (
                <div style={{ textAlign: 'center', padding: '64px', color: '#6B7280' }}>
                  No clinics found matching your search.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  className={styles.btnSecondary} 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                <button 
                  className={styles.btnSecondary} 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {settingsOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Settings</h2>
              <button className={styles.modalClose} onClick={() => setSettingsOpen(false)}><X size={20} /></button>
            </div>
            
            <div className={styles.modalContent}>
              <form onSubmit={updatePassword} className={styles.settingsSection}>
                <div>
                  <h3>Superadmin Password</h3>
                  <p className={styles.settingsDesc}>Change your dashboard login password.</p>
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    className={styles.input}
                    type="password" 
                    placeholder="Enter new password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <button className={styles.btnSecondary} style={{ width: 'fit-content' }} type="submit">Update Password</button>
                {settingsMessage && (
                  <div className={settingsMessage.includes("successfully") ? styles.message : styles.error}>
                    {settingsMessage}
                  </div>
                )}
              </form>

              <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB' }} />

              <form onSubmit={updateLimits} className={styles.settingsSection}>
                <div>
                  <h3>Plan Limits Manager</h3>
                  <p className={styles.settingsDesc}>
                    Set the max monthly assessments for each plan. Leave empty for unlimited.
                  </p>
                </div>
                
                <div className={styles.limitsGrid}>
                  <div className={styles.inputGroup}>
                    <label>Starter Limit</label>
                    <input 
                      className={styles.input}
                      type="number" 
                      placeholder="Unlimited"
                      value={planLimits.starter}
                      onChange={(e) => setPlanLimits({ ...planLimits, starter: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Growth Limit</label>
                    <input 
                      className={styles.input}
                      type="number" 
                      placeholder="Unlimited"
                      value={planLimits.growth}
                      onChange={(e) => setPlanLimits({ ...planLimits, growth: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Enterprise Limit</label>
                    <input 
                      className={styles.input}
                      type="number" 
                      placeholder="Unlimited"
                      value={planLimits.enterprise}
                      onChange={(e) => setPlanLimits({ ...planLimits, enterprise: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <h3 style={{ marginBottom: '8px' }}>Widget Host URL</h3>
                  <p className={styles.settingsDesc} style={{ marginBottom: '16px' }}>
                    The domain where your app is hosted (e.g. https://your-app.com). Used for the "Copy Embed" snippets.
                  </p>
                  <input 
                    className={styles.input}
                    type="url" 
                    placeholder="https://..."
                    value={widgetHostUrl}
                    onChange={(e) => setWidgetHostUrl(e.target.value)}
                    required
                  />
                </div>

                <button className={styles.btnPrimary} type="submit">Save All Settings</button>
                {limitsMessage && (
                  <div className={limitsMessage.includes("successfully") ? styles.message : styles.error}>
                    {limitsMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}
