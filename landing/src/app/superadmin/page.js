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
  Trash2,
  FileText,
  Bold,
  Italic,
  Link2,
  List,
  Heading2,
  Heading3
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

  const [clinicSettingsOpen, setClinicSettingsOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState(null);
  const [reportSettings, setReportSettings] = useState({
    allowPremium: false,
    forceReportType: 'basic',
    whiteLabel: false,
    customLogoUrl: '',
    clinicName: ''
  });

  const [packages, setPackages] = useState([]);
  const [newFeatureText, setNewFeatureText] = useState({});

  const [seoSettings, setSeoSettings] = useState([]);
  const [editingSeo, setEditingSeo] = useState(null);
  const [seoMessage, setSeoMessage] = useState("");

  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogMessage, setBlogMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const loadSeoSettings = useCallback(async () => {
    const response = await fetch("/api/superadmin/seo");
    if (response.ok) {
      const result = await response.json();
      setSeoSettings(result.seoSettings || []);
    }
  }, []);

  const loadBlogs = useCallback(async () => {
    const response = await fetch("/api/superadmin/blogs");
    if (response.ok) {
      const result = await response.json();
      setBlogs(result.blogs || []);
    }
  }, []);

  const checkSession = useCallback(async () => {
    const response = await fetch("/api/superadmin/session");
    if (response.ok) {
      setAuthenticated(true);
      await loadClinics();
      await loadSettings();
      await loadPackages();
      await loadSeoSettings();
      await loadBlogs();
    }
    setLoading(false);
  }, [loadClinics, loadSettings, loadPackages, loadSeoSettings, loadBlogs]);

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
    await loadSeoSettings();
    await loadBlogs();
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

  function openClinicSettings(clinic) {
    setEditingClinic(clinic);
    setReportSettings({
      allowPremium: clinic.reportSettings?.allowPremium || false,
      forceReportType: clinic.reportSettings?.forceReportType || 'basic',
      whiteLabel: clinic.reportSettings?.whiteLabel || false,
      customLogoUrl: clinic.reportSettings?.customLogoUrl || '',
      clinicName: clinic.reportSettings?.clinicName || clinic.name || ''
    });
    setClinicSettingsOpen(true);
  }

  async function saveClinicSettings(e) {
    e.preventDefault();
    await updateClinic(editingClinic.clinicId, { reportSettings });
    setClinicSettingsOpen(false);
    setEditingClinic(null);
  }

  async function saveSeoSettings(e) {
    e.preventDefault();
    setSeoMessage("");
    const response = await fetch("/api/superadmin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingSeo),
    });
    const result = await response.json();
    if (response.ok) {
      await loadSeoSettings();
      setEditingSeo(null);
    } else {
      setSeoMessage(result.message || "Failed to save SEO settings");
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/superadmin/upload", {
      method: "POST",
      body: formData
    });
    
    const result = await res.json();
    setUploadingImage(false);

    if (result.success) {
      setEditingBlog(prev => ({
        ...prev,
        content: (prev.content || "") + `\n![image](${result.url})\n`
      }));
    } else {
      alert("Image upload failed: " + result.message);
    }
  }

  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = document.getElementById("blog-content-textarea");
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editingBlog.content || "";
    
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    
    setEditingBlog({...editingBlog, content: newText});
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  async function saveBlogSettings(e) {
    e.preventDefault();
    setBlogMessage("");
    const response = await fetch("/api/superadmin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBlog),
    });
    const result = await response.json();
    if (response.ok) {
      await loadBlogs();
      setEditingBlog(null);
    } else {
      setBlogMessage(result.message || "Failed to save blog");
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>Loading SORA Superadmin...</div>;
  }

  if (!authenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <Image src="/sora-logo.png" alt="SORA Logo" width={210} height={68} style={{ width: "auto", height: "auto", objectFit: "contain", marginBottom: "1rem" }} priority />
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
          <Image src="/sora-logo.png" alt="SORA Logo" width={180} height={53} style={{ width: "auto", height: "auto", objectFit: "contain" }} priority />
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
            onClick={() => setActiveTab("seo")}
            className={`${styles.navItem} ${activeTab === "seo" ? styles.active : ""}`}
          >
            <Search size={20} />
            SEO Management
          </button>
          <button 
            onClick={() => setActiveTab("blogs")}
            className={`${styles.navItem} ${activeTab === "blogs" ? styles.active : ""}`}
          >
            <FileText size={20} />
            Blog Management
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
                        <button onClick={() => openClinicSettings(clinic)} className={styles.btnIcon} style={{marginRight: '8px'}}>
                          <Settings size={16} /> Setup
                        </button>
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

          {activeTab === "seo" && (
            <div>
              <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", margin: 0 }}>SEO Management</h2>
                  <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Manage Meta Titles, Descriptions, and Keywords for public pages.</p>
                </div>
                <button className={styles.btnPrimary} onClick={() => {
                  setEditingSeo({ page_route: "/", meta_title: "", meta_description: "", meta_keywords: "" });
                  setSeoMessage("");
                }}>
                  <Plus size={16} style={{marginRight: "8px"}} /> Add Page SEO
                </button>
              </div>
              
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page Route</th>
                    <th>Meta Title</th>
                    <th style={{textAlign: 'right'}}>Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {seoSettings.map((seo) => (
                    <tr key={seo.page_route}>
                      <td style={{fontWeight: 600, color: '#1e293b'}}>{seo.page_route}</td>
                      <td>{seo.meta_title}</td>
                      <td style={{textAlign: 'right'}}>
                        <button onClick={() => { setEditingSeo(seo); setSeoMessage(""); }} className={styles.btnIcon}>
                          <Settings size={16} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {seoSettings.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{textAlign: 'center', padding: '48px', color: '#94a3b8'}}>
                        No custom SEO settings configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "blogs" && (
            <div>
              <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Blog Management</h2>
                  <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Write and publish articles for the public blog.</p>
                </div>
                <button className={styles.btnPrimary} onClick={() => {
                  setEditingBlog({ slug: "", title: "", excerpt: "", content: "", author_name: "SORA Team", cover_image: "", published: false });
                  setBlogMessage("");
                }}>
                  <Plus size={16} style={{marginRight: "8px"}} /> New Post
                </button>
              </div>
              
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title / Slug</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{textAlign: 'right'}}>Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <div style={{fontWeight: 600, color: '#1e293b'}}>{blog.title}</div>
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>{blog.slug}</div>
                      </td>
                      <td>
                        {blog.published ? <span style={{color: '#16a34a', fontWeight: 'bold'}}>Published</span> : <span style={{color: '#f59e0b', fontWeight: 'bold'}}>Draft</span>}
                      </td>
                      <td style={{fontSize: '0.875rem', color: '#64748b'}}>
                        {new Date(blog.created_at).toLocaleDateString()}
                      </td>
                      <td style={{textAlign: 'right'}}>
                        <button onClick={() => { setEditingBlog(blog); setBlogMessage(""); }} className={styles.btnIcon}>
                          <Settings size={16} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{textAlign: 'center', padding: '48px', color: '#94a3b8'}}>
                        No blog posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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

      {/* Clinic Report Settings Modal */}
      {clinicSettingsOpen && editingClinic && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2><Settings size={20}/> Report Settings - {editingClinic.name}</h2>
              <button className={styles.closeBtn} onClick={() => setClinicSettingsOpen(false)}><X size={20} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <form onSubmit={saveClinicSettings}>
                <h3 className={styles.sectionTitle}>Report Offering</h3>
                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={reportSettings.allowPremium} 
                      onChange={(e) => setReportSettings({...reportSettings, allowPremium: e.target.checked})} 
                    />
                    Enable Premium Report Upsell
                  </label>
                  <span className={styles.helpText}>If disabled, the widget will only provide the free basic report.</span>
                </div>
                
                {reportSettings.allowPremium && (
                  <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                    <label className={styles.label}>Default Displayed Option</label>
                    <select 
                      className={styles.input} 
                      value={reportSettings.forceReportType} 
                      onChange={(e) => setReportSettings({...reportSettings, forceReportType: e.target.value})}
                    >
                      <option value="basic">Give User Choice (Basic Free / Premium Paid)</option>
                      <option value="premium">Force Premium Checkout Only</option>
                    </select>
                  </div>
                )}

                <div className={styles.divider}></div>

                <h3 className={styles.sectionTitle}>White Labeling (Clinic Branding)</h3>
                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={reportSettings.whiteLabel} 
                      onChange={(e) => setReportSettings({...reportSettings, whiteLabel: e.target.checked})} 
                    />
                    Enable Clinic White Labeling
                  </label>
                  <span className={styles.helpText}>Removes SORA Fertility branding from the report headers and footers.</span>
                </div>

                {reportSettings.whiteLabel && (
                  <>
                    <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                      <label className={styles.label}>Clinic Name for Report</label>
                      <input 
                        className={styles.input} 
                        type="text" 
                        value={reportSettings.clinicName} 
                        onChange={(e) => setReportSettings({...reportSettings, clinicName: e.target.value})} 
                        placeholder={editingClinic.name}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                      <label className={styles.label}>Custom Logo URL</label>
                      <input 
                        className={styles.input} 
                        type="url" 
                        value={reportSettings.customLogoUrl} 
                        onChange={(e) => setReportSettings({...reportSettings, customLogoUrl: e.target.value})} 
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </>
                )}

                <button className={styles.btnPrimary} style={{width: '100%', justifyContent: 'center'}} type="submit">Save Report Settings</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SEO Edit Modal */}
      {editingSeo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2><Search size={20}/> {editingSeo.page_route === '/' || seoSettings.some(s => s.page_route === editingSeo.page_route) ? `Edit SEO: ${editingSeo.page_route}` : "New Page SEO"}</h2>
              <button className={styles.closeBtn} onClick={() => setEditingSeo(null)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <form onSubmit={saveSeoSettings}>
                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label}>Page Route (e.g., / or /fertility-assessment)</label>
                  <input className={styles.input} type="text" value={editingSeo.page_route} onChange={(e) => setEditingSeo({...editingSeo, page_route: e.target.value})} required />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label}>Meta Title</label>
                  <input className={styles.input} type="text" value={editingSeo.meta_title} onChange={(e) => setEditingSeo({...editingSeo, meta_title: e.target.value})} required />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label}>Meta Description</label>
                  <textarea className={styles.input} rows="3" value={editingSeo.meta_description || ""} onChange={(e) => setEditingSeo({...editingSeo, meta_description: e.target.value})}></textarea>
                </div>
                <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                  <label className={styles.label}>Meta Keywords</label>
                  <input className={styles.input} type="text" placeholder="fertility, IVF, testing" value={editingSeo.meta_keywords || ""} onChange={(e) => setEditingSeo({...editingSeo, meta_keywords: e.target.value})} />
                </div>
                {seoMessage && <p style={{color: 'red', marginBottom: '16px'}}>{seoMessage}</p>}
                <button type="submit" className={styles.btnPrimary} style={{width: '100%', justifyContent: 'center'}}>Save SEO Configuration</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Blog Edit Modal */}
      {editingBlog && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: "800px", width: "95%" }}>
            <div className={styles.modalHeader}>
              <h2><FileText size={20}/> {editingBlog.id ? "Edit Blog Post" : "Create Blog Post"}</h2>
              <button className={styles.closeBtn} onClick={() => setEditingBlog(null)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody} style={{ maxHeight: "75vh", overflowY: "auto" }}>
              <form onSubmit={saveBlogSettings}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Title</label>
                    <input className={styles.input} type="text" value={editingBlog.title} onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})} required />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>URL Slug</label>
                    <input className={styles.input} type="text" value={editingBlog.slug} onChange={(e) => setEditingBlog({...editingBlog, slug: e.target.value})} placeholder="e.g., my-first-post" required disabled={!!editingBlog.id} />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label}>Excerpt (Short summary)</label>
                  <textarea className={styles.input} rows="2" value={editingBlog.excerpt || ""} onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}></textarea>
                </div>

                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Content (Markdown format)</span>
                    <label style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.875rem", color: "#2563eb", fontWeight: "600" }}>
                      {uploadingImage ? "Uploading..." : "📎 Insert Local Image"}
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </label>
                  <div style={{ display: 'flex', gap: '8px', padding: '8px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderBottom: 'none', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
                    <button type="button" onClick={() => insertMarkdown("**", "**")} title="Bold" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}><Bold size={16} /></button>
                    <button type="button" onClick={() => insertMarkdown("*", "*")} title="Italic" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}><Italic size={16} /></button>
                    <button type="button" onClick={() => insertMarkdown("[", "](https://)")} title="Link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}><Link2 size={16} /></button>
                    <div style={{ width: '1px', backgroundColor: '#cbd5e1', margin: '0 4px' }}></div>
                    <button type="button" onClick={() => insertMarkdown("## ")} title="Heading 2" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}><Heading2 size={16} /></button>
                    <button type="button" onClick={() => insertMarkdown("### ")} title="Heading 3" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}><Heading3 size={16} /></button>
                    <button type="button" onClick={() => insertMarkdown("- ")} title="Bullet List" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}><List size={16} /></button>
                  </div>
                  <textarea 
                    id="blog-content-textarea"
                    className={styles.input} 
                    rows="15" 
                    style={{ fontFamily: 'monospace', lineHeight: 1.5, borderTopLeftRadius: '0', borderTopRightRadius: '0' }}
                    placeholder="# Title&#10;&#10;Write your post in markdown here..."
                    value={editingBlog.content || ""} 
                    onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Author Name</label>
                    <input className={styles.input} type="text" value={editingBlog.author_name || ""} onChange={(e) => setEditingBlog({...editingBlog, author_name: e.target.value})} />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Cover Image URL (Optional)</label>
                    <input className={styles.input} type="text" value={editingBlog.cover_image || ""} onChange={(e) => setEditingBlog({...editingBlog, cover_image: e.target.value})} />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                  <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editingBlog.published} onChange={(e) => setEditingBlog({...editingBlog, published: e.target.checked})} />
                    Publish publicly
                  </label>
                </div>

                {blogMessage && <p style={{color: 'red', marginBottom: '16px'}}>{blogMessage}</p>}
                <button type="submit" className={styles.btnPrimary} style={{width: '100%', justifyContent: 'center'}}>Save Blog Post</button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
