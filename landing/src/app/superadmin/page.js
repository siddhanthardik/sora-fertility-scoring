"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Copy,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  X,
  Activity,
  Users,
  PackageOpen,
  Check,
  Trash2
} from "lucide-react";
import Image from "next/image";

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
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [widgetHostUrl, setWidgetHostUrl] = useState("http://localhost:3000");
  const [limitsMessage, setLimitsMessage] = useState("");

  const [packages, setPackages] = useState([]);
  const [newFeatureText, setNewFeatureText] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeTab, setActiveTab] = useState("clinics");

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const loadClinics = useCallback(async () => {
    const response = await fetch("/api/superadmin/clinics");
    const result = await response.json();
    if (response.ok) {
      setClinics(result.clinics);
      setSummary(result.summary);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    const response = await fetch("/api/superadmin/plan-limits");
    if (response.ok) {
      const result = await response.json();
      if (result.widgetHostUrl) setWidgetHostUrl(result.widgetHostUrl);
    }
  }, []);

  const loadPackages = useCallback(async () => {
    const response = await fetch("/api/superadmin/packages");
    if (response.ok) {
      const result = await response.json();
      setPackages(result.packages || []);
    }
  }, []);

  const checkSession = useCallback(async () => {
    const response = await fetch("/api/superadmin/session");
    if (response.ok) {
      setAuthenticated(true);
      await loadClinics();
      await loadSettings();
      await loadPackages();
    }
    setLoading(false);
  }, [loadClinics, loadSettings, loadPackages]);

  useEffect(() => {
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
    await loadPackages();
  }

  async function logout() {
    await fetch("/api/superadmin/session", { method: "DELETE" });
    setAuthenticated(false);
    setClinics([]);
    setPackages([]);
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
    setMessage(`Successfully created ${result.clinic.name}.`);
    setActiveTab("clinics");
    await loadClinics();
  }

  async function updateClinic(clinicId, patch) {
    const response = await fetch("/api/superadmin/clinics/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicId, patch }),
    });
    if (response.ok) {
      await loadClinics();
    }
  }

  async function updatePassword(event) {
    event.preventDefault();
    setSettingsMessage("");
    const response = await fetch("/api/superadmin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    if (response.ok) {
      setSettingsMessage("Password updated successfully.");
      setNewPassword("");
      setTimeout(() => {
        setSettingsOpen(false);
        setSettingsMessage("");
      }, 2000);
    } else {
      setSettingsMessage("Could not update password.");
    }
  }

  async function updateLimits(event) {
    event.preventDefault();
    setLimitsMessage("");
    const response = await fetch("/api/superadmin/plan-limits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgetHostUrl }),
    });
    if (response.ok) {
      setLimitsMessage("Platform settings saved successfully.");
      setTimeout(() => setLimitsMessage(""), 2000);
    } else {
      setLimitsMessage("Could not update limits.");
    }
  }

  async function handleUpdatePackage(pkgId, updates) {
    const response = await fetch(`/api/superadmin/packages/${pkgId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (response.ok) {
      await loadPackages();
    }
  }

  function addFeature(pkgId) {
    const text = newFeatureText[pkgId];
    if (!text) return;
    const pkg = packages.find(p => p.id === pkgId);
    handleUpdatePackage(pkgId, { features: [...(pkg.features || []), text] });
    setNewFeatureText({ ...newFeatureText, [pkgId]: "" });
  }

  function removeFeature(pkgId, index) {
    const pkg = packages.find(p => p.id === pkgId);
    const newFeatures = [...pkg.features];
    newFeatures.splice(index, 1);
    handleUpdatePackage(pkgId, { features: newFeatures });
  }

  function embedSnippet(clinic) {
    const host = widgetHostUrl.trim().replace(/\/$/, ""); 
    return `<script src="${host}/embed.js" data-sora-token="${clinic.widgetToken || 'YOUR_TOKEN'}"></script>\n<div data-sora-fertility-widget></div>`;
  }

  async function copyEmbed(clinic) {
    await navigator.clipboard.writeText(embedSnippet(clinic));
    alert(`Copied embed snippet for ${clinic.name}.`);
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>Loading SORA Superadmin...</div>;
  }

  if (!authenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <Image src="/sora-logo.png" alt="SORA Logo" width={210} height={68} style={{ objectFit: "contain", marginBottom: "1rem" }} priority />
            <p>Restricted Access. Superadmins only.</p>
          </div>
          <form onSubmit={login}>
            <div>
              <input
                type="password"
                className={styles.loginInput}
                placeholder="Enter access code..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.loginBtn}>
              Authenticate
            </button>
            {message && <div className={styles.errorMsg}>{message}</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Image src="/sora-logo.png" alt="SORA Logo" width={180} height={53} style={{ objectFit: "contain" }} priority />
        </div>
        <nav className={styles.sidebarNav}>
          <button 
            onClick={() => setActiveTab("clinics")}
            className={`${styles.navItem} ${activeTab === "clinics" ? styles.active : ""}`}
          >
            <Building2 size={20} />
            Registered Clinics
          </button>
          <button 
            onClick={() => setActiveTab("add")}
            className={`${styles.navItem} ${activeTab === "add" ? styles.active : ""}`}
          >
            <Plus size={20} />
            Add New Clinic
          </button>
          <button 
            onClick={() => setActiveTab("packages")}
            className={`${styles.navItem} ${activeTab === "packages" ? styles.active : ""}`}
          >
            <PackageOpen size={20} />
            Package Manager
          </button>
          <button 
            onClick={() => setSettingsOpen(true)}
            className={styles.navItem}
          >
            <Settings size={20} />
            Platform Settings
          </button>
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={logout} className={styles.logoutBtn}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>{activeTab === "clinics" ? "Network Dashboard" : activeTab === "packages" ? "Package Manager" : "Register New Clinic"}</h1>
            <p>Manage all SORA SaaS tenants across the network.</p>
          </div>
          <button onClick={() => { loadClinics(); loadPackages(); }} className={styles.btnSecondary}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        <div className={styles.scrollArea}>
          
          {/* Dashboard Metrics */}
          {activeTab === "clinics" && (
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <Building2 size={80} className={styles.metricIcon} />
                <span className={styles.metricCardTitle}>Total Clinics</span>
                <h3 className={styles.metricCardValue}>{summary?.totalClinics || 0}</h3>
              </div>
              <div className={styles.metricCard}>
                <Activity size={80} className={styles.metricIcon} color="#22c55e" />
                <span className={styles.metricCardTitle}>Active</span>
                <h3 className={styles.metricCardValue} style={{color: '#16a34a'}}>{summary?.activeClinics || 0}</h3>
              </div>
              <div className={styles.metricCard}>
                <ShieldCheck size={80} className={styles.metricIcon} color="#f59e0b" />
                <span className={styles.metricCardTitle}>Pending Auth</span>
                <h3 className={styles.metricCardValue} style={{color: '#d97706'}}>{summary?.pendingVerification || 0}</h3>
              </div>
              <div className={styles.metricCard} style={{background: 'linear-gradient(135deg, #2563eb, #1e40af)', color: 'white', borderColor: 'transparent'}}>
                <Users size={80} className={styles.metricIcon} color="rgba(255,255,255,0.2)" />
                <span className={styles.metricCardTitle} style={{color: '#bfdbfe'}}>Assessments</span>
                <h3 className={styles.metricCardValue} style={{color: 'white'}}>{summary?.totalAssessments || 0}</h3>
              </div>
            </div>
          )}

          {activeTab === "clinics" && (
            <div className={styles.tableContainer}>
              <div className={styles.tableToolbar}>
                <div className={styles.searchInputWrapper}>
                  <Search className={styles.searchIcon} size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, or ID..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <span style={{fontSize: '0.875rem', color: '#64748b'}}>Showing {filteredClinics.length} tenants</span>
              </div>
              
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Clinic Profile</th>
                    <th>Usage</th>
                    <th>Subscription</th>
                    <th>Status</th>
                    <th style={{textAlign: 'right'}}>Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClinics.map((clinic) => (
                    <tr key={clinic.clinicId}>
                      <td>
                        <div className={styles.clinicName}>{clinic.name}</div>
                        <div className={styles.clinicMeta}>
                          <span>{clinic.ownerName || "No Owner Name"}</span>
                          <span>{clinic.ownerEmail}</span>
                          <span className={styles.clinicId}>{clinic.clinicId}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.usageRow}>
                          <span className={styles.usageLabel}>Total Leads:</span>
                          <span className={styles.usageValue}>{clinic.usage?.totalAssessments || 0}</span>
                        </div>
                        <div className={styles.usageRow}>
                          <span className={styles.usageLabel}>This Month:</span>
                          <span className={styles.usageValue}>{clinic.usage?.monthlyAssessments || 0}</span>
                        </div>
                      </td>
                      <td>
                        <select 
                          value={clinic.plan} 
                          onChange={(e) => updateClinic(clinic.clinicId, { plan: e.target.value })}
                          className={styles.selectInput}
                          style={{
                            backgroundColor: clinic.plan === 'enterprise' ? '#f3e8ff' : clinic.plan === 'growth' ? '#dbeafe' : '#f1f5f9',
                            color: clinic.plan === 'enterprise' ? '#6b21a8' : clinic.plan === 'growth' ? '#1e40af' : '#334155',
                            borderColor: 'transparent'
                          }}
                        >
                          <option value="starter">STARTER</option>
                          <option value="growth">GROWTH</option>
                          <option value="enterprise">ENTERPRISE</option>
                        </select>
                      </td>
                      <td>
                        <div className={styles.statusStack}>
                          <select 
                            value={clinic.status} 
                            onChange={(e) => updateClinic(clinic.clinicId, { status: e.target.value })}
                            className={styles.selectInput}
                            style={{
                              backgroundColor: clinic.status === 'active' ? '#dcfce7' : clinic.status === 'trial' ? '#dbeafe' : clinic.status === 'blocked' ? '#fee2e2' : '#fef3c7',
                              color: clinic.status === 'active' ? '#166534' : clinic.status === 'trial' ? '#1e40af' : clinic.status === 'blocked' ? '#991b1b' : '#92400e',
                              borderColor: 'transparent'
                            }}
                          >
                            <option value="active">ACTIVE</option>
                            <option value="trial">TRIAL</option>
                            <option value="paused">PAUSED</option>
                            <option value="blocked">BLOCKED</option>
                          </select>
                          <select 
                            value={clinic.verificationStatus} 
                            onChange={(e) => updateClinic(clinic.clinicId, { verificationStatus: e.target.value })}
                            className={styles.selectInput}
                            style={{
                              backgroundColor: clinic.verificationStatus === 'verified' ? '#ecfdf5' : '#fffbeb',
                              color: clinic.verificationStatus === 'verified' ? '#059669' : '#d97706',
                              borderColor: 'transparent'
                            }}
                          >
                            <option value="verified">VERIFIED</option>
                            <option value="pending">PENDING</option>
                          </select>
                        </div>
                      </td>
                      <td style={{textAlign: 'right'}}>
                        <button onClick={() => copyEmbed(clinic)} className={styles.btnIcon}>
                          <Copy size={16} /> Code
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedClinics.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{textAlign: 'center', padding: '48px', color: '#94a3b8'}}>
                        No clinics found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {totalPages > 1 && (
                <div style={{padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '0.875rem', color: '#64748b'}}>Page {currentPage} of {totalPages}</span>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button className={styles.btnSecondary} disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                    <button className={styles.btnSecondary} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "add" && (
            <div className={styles.formCard}>
              <h2>Create New Clinic Tenant</h2>
              {message && <div className={styles.alertSuccess}>{message}</div>}
              <form onSubmit={createClinic}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Clinic Name</label>
                  <input className={styles.input} placeholder="Acme Fertility" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Owner Name</label>
                    <input className={styles.input} placeholder="Dr. Smith" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Owner Email</label>
                    <input className={styles.input} type="email" placeholder="smith@acme.com" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Notification Email</label>
                  <input className={styles.input} type="email" placeholder="leads@acme.com" value={form.notificationEmail} onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })} />
                  <span className={styles.helpText}>Leave blank to use Owner Email.</span>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Allowed Domains</label>
                  <input className={styles.input} placeholder="acme.com, clinic.com" value={form.allowedDomains} onChange={(e) => setForm({ ...form, allowedDomains: e.target.value })} required />
                  <span className={styles.helpText}>Comma-separated list of domains allowed to embed the widget.</span>
                </div>
                
                <div className={styles.formRow} style={{paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #e2e8f0'}}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Initial Plan</label>
                    <select className={styles.input} value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                      <option value="starter">Starter</option>
                      <option value="growth">Growth</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Account Status</label>
                    <select className={styles.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="trial">14-Day Trial</option>
                      <option value="active">Active Immediately</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.btnPrimary}>
                    Provision Clinic
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "packages" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Subscription Plans</h2>
                <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Configure pricing, limits, and features for each package.</p>
              </div>
              
              <div className={styles.packageGrid}>
                {packages.map(pkg => (
                  <div key={pkg.id} className={styles.packageCard}>
                    <div className={styles.packageHeader}>
                      <input 
                        className={styles.input} 
                        style={{ fontSize: "1.125rem", fontWeight: "700", padding: "8px", width: "160px" }}
                        value={pkg.name}
                        onChange={(e) => handleUpdatePackage(pkg.id, { name: e.target.value })}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ color: "#64748b" }}>₹</span>
                        <input 
                          className={styles.input} 
                          type="number"
                          style={{ width: "80px", padding: "8px", textAlign: "right", fontWeight: "700" }}
                          value={pkg.price_inr}
                          onChange={(e) => handleUpdatePackage(pkg.id, { price_inr: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup} style={{ marginBottom: "24px" }}>
                      <label className={styles.label}>Monthly Assessment Limit</label>
                      <input 
                        className={styles.input} 
                        type="number" 
                        placeholder="Unlimited if empty"
                        value={pkg.assessment_limit || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdatePackage(pkg.id, { assessment_limit: val === "" ? null : parseInt(val) });
                        }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <label className={styles.label}>Features</label>
                      <ul className={styles.packageFeatureList}>
                        {(pkg.features || []).map((feature, idx) => (
                          <li key={idx} className={styles.featureRow}>
                            <Check size={16} color="#10b981" />
                            <span style={{ flex: 1, fontSize: "0.875rem" }}>{feature}</span>
                            <button type="button" onClick={() => removeFeature(pkg.id, idx)}>
                              <Trash2 size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className={styles.addFeatureRow}>
                        <input 
                          className={styles.input} 
                          style={{ padding: "8px" }}
                          placeholder="Add new feature..." 
                          value={newFeatureText[pkg.id] || ""}
                          onChange={(e) => setNewFeatureText({ ...newFeatureText, [pkg.id]: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(pkg.id); } }}
                        />
                        <button type="button" className={styles.btnSecondary} onClick={() => addFeature(pkg.id)}>Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2><Settings size={20}/> Platform Settings</h2>
              <button className={styles.closeBtn} onClick={() => setSettingsOpen(false)}><X size={20} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <form onSubmit={updatePassword}>
                <h3 className={styles.sectionTitle}>Superadmin Security</h3>
                <div style={{display: 'flex', gap: '12px'}}>
                  <input 
                    className={styles.input}
                    type="password" 
                    placeholder="Enter new master password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button className={styles.btnPrimary} style={{whiteSpace: 'nowrap'}} type="submit">Update</button>
                </div>
                {settingsMessage && <p style={{marginTop: '8px', fontSize: '0.875rem', color: '#16a34a'}}>{settingsMessage}</p>}
              </form>

              <div className={styles.divider}></div>

              <form onSubmit={updateLimits}>
                <h3 className={styles.sectionTitle}>Global Configuration</h3>

                <div className={styles.infoBox}>
                  <h3>Widget Host URL</h3>
                  <input className={styles.input} style={{marginTop: '12px'}} type="url" placeholder="https://app.sorafertility.com" value={widgetHostUrl} onChange={(e) => setWidgetHostUrl(e.target.value)} required />
                  <p style={{marginTop: '8px'}}>Used to generate the embed codes for clinics. Must be the domain where this app is running.</p>
                </div>

                <button className={styles.btnPrimary} style={{width: '100%', justifyContent: 'center'}} type="submit">Save Settings</button>
                {limitsMessage && <p style={{marginTop: '12px', textAlign: 'center', fontSize: '0.875rem', color: '#16a34a'}}>{limitsMessage}</p>}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
