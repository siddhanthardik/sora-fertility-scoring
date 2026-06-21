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
  Heading3,
  LineChart,
  Mail,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import RichTextEditor from "../components/RichTextEditor";
import SuperadminLeads from "../components/SuperadminLeads";

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
  const [dateRange, setDateRange] = useState("all");

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
  const [seoTab, setSeoTab] = useState("general");
  const [seoMessage, setSeoMessage] = useState("");

  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogMessage, setBlogMessage] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [analytics, setAnalytics] = useState(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const loadAnalytics = useCallback(async () => {
    const response = await fetch(`/api/superadmin/analytics?range=${dateRange}`);
    if (response.ok) {
      const result = await response.json();
      setAnalytics(result);
    }
  }, [dateRange]);

  useEffect(() => {
    if (authenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadAnalytics();
    }
  }, [authenticated, dateRange, loadAnalytics]);

  const loadSubscribers = useCallback(async () => {
    const response = await fetch("/api/superadmin/subscribers", {
      headers: { "Authorization": `Bearer ${password}` }
    });
    if (response.ok) {
      const result = await response.json();
      setSubscribers(result.subscribers || []);
    }
  }, [password]);

  const checkSession = useCallback(async () => {
    const response = await fetch("/api/superadmin/session");
    if (response.ok) {
      setAuthenticated(true);
      await loadClinics();
      await loadSettings();
      await loadPackages();
      await loadSeoSettings();
      await loadBlogs();
      await loadAnalytics();
      await loadSubscribers();
    }
    setLoading(false);
  }, [loadClinics, loadSettings, loadPackages, loadSeoSettings, loadBlogs, loadAnalytics, loadSubscribers]);

  useEffect(() => {
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
    await loadSettings();
    await loadPackages();
    await loadSeoSettings();
    await loadBlogs();
    await loadAnalytics();
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

  const exportSubscribersCsv = () => {
    if (!subscribers || subscribers.length === 0) return;
    const headers = ["Email", "Status", "Source", "Subscribed At"];
    const rows = subscribers.map(sub => [
      sub.email,
      sub.status,
      sub.source || "blog",
      new Date(sub.created_at).toLocaleString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sora_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            onClick={() => setActiveTab("leads")}
            className={`${styles.navItem} ${activeTab === "leads" ? styles.active : ""}`}
          >
            <Users size={20} />
            Leads Management
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
            onClick={() => setActiveTab("analytics")}
            className={`${styles.navItem} ${activeTab === "analytics" ? styles.active : ""}`}
          >
            <LineChart size={20} />
            Growth Intelligence
          </button>
          <button 
            onClick={() => setActiveTab("subscribers")}
            className={`${styles.navItem} ${activeTab === "subscribers" ? styles.active : ""}`}
          >
            <Mail size={20} />
            Subscribers
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`${styles.navItem} ${activeTab === "settings" ? styles.active : ""}`}
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
            {(() => {
              const tabHeaders = {
                clinics: { title: "Network Dashboard", desc: "Manage all SORA SaaS tenants and leads across the network." },
                leads: { title: "Leads Dashboard", desc: "View and manage incoming patient leads." },
                add_clinic: { title: "Register New Clinic", desc: "Create a new tenant in the SORA network." },
                packages: { title: "Package Manager", desc: "Manage subscription packages and features." },
                seo: { title: "SEO Management", desc: "Manage Meta Titles, Descriptions, and Keywords for public pages." },
                blogs: { title: "Blog Management", desc: "Write and publish articles for the public blog." },
                analytics: { title: "Growth Intelligence", desc: "Track platform usage and performance metrics." },
                subscribers: { title: "Newsletter Subscribers", desc: "Manage and export email subscribers." },
                settings: { title: "Platform Settings", desc: "Configure global platform settings." }
              };
              const currentHeader = tabHeaders[activeTab] || tabHeaders.clinics;
              return (
                <>
                  <h1>{currentHeader.title}</h1>
                  <p>{currentHeader.desc}</p>
                </>
              );
            })()}
          </div>
          <button onClick={() => { loadClinics(); loadPackages(); if(activeTab === "leads") window.location.reload(); }} className={styles.btnSecondary}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        <div className={styles.scrollArea}>
          
          {activeTab === "leads" && (
            <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", minHeight: "80vh" }}>
              <SuperadminLeads />
            </div>
          )}

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
              <div style={{ marginBottom: "24px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <button className={styles.btnPrimary} onClick={() => {
                  setEditingSeo({ 
                    page_route: "/", meta_title: "", meta_description: "", meta_keywords: "",
                    og_title: "", og_description: "", og_image: "",
                    twitter_card: "summary_large_image", twitter_title: "", twitter_description: "", twitter_image: "",
                    canonical_url: "", noindex: false, nofollow: false, structured_data: "",
                    ai_summary: "", target_entities: ""
                  });
                  setSeoTab("general");
                  setSeoMessage("");
                }}>
                  <Plus size={16} style={{marginRight: "8px"}} /> Add Page SEO
                </button>
              </div>
              
              {!editingSeo ? (
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
                        <button onClick={() => { setEditingSeo(seo); setSeoTab("general"); setSeoMessage(""); }} className={styles.btnIcon}>
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
              ) : (
              <div style={{ background: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
                    <Search size={20} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }}/> 
                    {editingSeo.page_route === '/' || seoSettings.some(s => s.page_route === editingSeo.page_route) ? `Editing: ${editingSeo.page_route}` : "New Page SEO"}
                  </h3>
                  <button className={styles.btnSecondary} onClick={() => setEditingSeo(null)}>
                    <X size={16} style={{marginRight: "4px"}} /> Cancel
                  </button>
                </div>
                
                <div style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                  <button type="button" onClick={() => setSeoTab("general")} style={{ background: "none", border: "none", fontWeight: seoTab === "general" ? "bold" : "normal", color: seoTab === "general" ? "#3b82f6" : "#64748b", cursor: "pointer", padding: "8px" }}>General</button>
                  <button type="button" onClick={() => setSeoTab("social")} style={{ background: "none", border: "none", fontWeight: seoTab === "social" ? "bold" : "normal", color: seoTab === "social" ? "#3b82f6" : "#64748b", cursor: "pointer", padding: "8px" }}>Social Media</button>
                  <button type="button" onClick={() => setSeoTab("advanced")} style={{ background: "none", border: "none", fontWeight: seoTab === "advanced" ? "bold" : "normal", color: seoTab === "advanced" ? "#3b82f6" : "#64748b", cursor: "pointer", padding: "8px" }}>Advanced Settings</button>
                  <button type="button" onClick={() => setSeoTab("aio")} style={{ background: "none", border: "none", fontWeight: seoTab === "aio" ? "bold" : "normal", color: seoTab === "aio" ? "#10b981" : "#64748b", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Sparkles size={14} /> AI Optimisation (AIO)
                  </button>
                </div>

                <form onSubmit={saveSeoSettings}>
                  {seoTab === "general" && (
                    <>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Page Route (e.g., / or /fertility-assessment)</label>
                        <input className={styles.input} type="text" value={editingSeo.page_route} onChange={(e) => setEditingSeo({...editingSeo, page_route: e.target.value})} required />
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Meta Title <span style={{fontWeight: "normal", color: "#94a3b8"}}>- {editingSeo.meta_title?.length || 0} / 60</span></label>
                        <input className={styles.input} type="text" value={editingSeo.meta_title} onChange={(e) => setEditingSeo({...editingSeo, meta_title: e.target.value})} required />
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Meta Description <span style={{fontWeight: "normal", color: "#94a3b8"}}>- {editingSeo.meta_description?.length || 0} / 160</span></label>
                        <textarea className={styles.input} rows="3" value={editingSeo.meta_description || ""} onChange={(e) => setEditingSeo({...editingSeo, meta_description: e.target.value})}></textarea>
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                        <label className={styles.label}>Meta Keywords</label>
                        <input className={styles.input} type="text" placeholder="fertility, IVF, testing" value={editingSeo.meta_keywords || ""} onChange={(e) => setEditingSeo({...editingSeo, meta_keywords: e.target.value})} />
                      </div>
                    </>
                  )}

                  {seoTab === "social" && (
                    <>
                      <h3 className={styles.sectionTitle}>Open Graph (Facebook/LinkedIn)</h3>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>OG Title</label>
                        <input className={styles.input} type="text" placeholder={editingSeo.meta_title || "Default Title"} value={editingSeo.og_title || ""} onChange={(e) => setEditingSeo({...editingSeo, og_title: e.target.value})} />
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>OG Description</label>
                        <textarea className={styles.input} rows="2" placeholder={editingSeo.meta_description || "Default Description"} value={editingSeo.og_description || ""} onChange={(e) => setEditingSeo({...editingSeo, og_description: e.target.value})}></textarea>
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                        <label className={styles.label}>OG Image URL</label>
                        <input className={styles.input} type="url" placeholder="https://example.com/image.jpg" value={editingSeo.og_image || ""} onChange={(e) => setEditingSeo({...editingSeo, og_image: e.target.value})} />
                      </div>

                      <h3 className={styles.sectionTitle}>Twitter Card</h3>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Card Type</label>
                        <select className={styles.input} value={editingSeo.twitter_card || "summary_large_image"} onChange={(e) => setEditingSeo({...editingSeo, twitter_card: e.target.value})}>
                          <option value="summary">Summary (Small Image)</option>
                          <option value="summary_large_image">Summary Large Image</option>
                        </select>
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Twitter Title</label>
                        <input className={styles.input} type="text" placeholder={editingSeo.og_title || editingSeo.meta_title || ""} value={editingSeo.twitter_title || ""} onChange={(e) => setEditingSeo({...editingSeo, twitter_title: e.target.value})} />
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Twitter Description</label>
                        <textarea className={styles.input} rows="2" placeholder={editingSeo.og_description || editingSeo.meta_description || ""} value={editingSeo.twitter_description || ""} onChange={(e) => setEditingSeo({...editingSeo, twitter_description: e.target.value})}></textarea>
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                        <label className={styles.label}>Twitter Image URL</label>
                        <input className={styles.input} type="url" placeholder={editingSeo.og_image || "https://example.com/image.jpg"} value={editingSeo.twitter_image || ""} onChange={(e) => setEditingSeo({...editingSeo, twitter_image: e.target.value})} />
                      </div>
                    </>
                  )}

                  {seoTab === "advanced" && (
                    <>
                      <h3 className={styles.sectionTitle}>Indexing & Links</h3>
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>Canonical URL</label>
                        <input className={styles.input} type="url" placeholder="https://sorafertility.com/..." value={editingSeo.canonical_url || ""} onChange={(e) => setEditingSeo({...editingSeo, canonical_url: e.target.value})} />
                      </div>
                      <div className={styles.formGroup} style={{ marginBottom: '16px', display: 'flex', gap: '24px' }}>
                        <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={editingSeo.noindex || false} onChange={(e) => setEditingSeo({...editingSeo, noindex: e.target.checked})} />
                          NoIndex
                        </label>
                        <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={editingSeo.nofollow || false} onChange={(e) => setEditingSeo({...editingSeo, nofollow: e.target.checked})} />
                          NoFollow
                        </label>
                      </div>

                      <h3 className={styles.sectionTitle}>Structured Data</h3>
                      <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                        <label className={styles.label}>Custom JSON-LD</label>
                        <textarea className={styles.input} rows="5" placeholder="{ '@context': 'https://schema.org', '@type': 'WebPage', ... }" value={editingSeo.structured_data || ""} onChange={(e) => setEditingSeo({...editingSeo, structured_data: e.target.value})} style={{ fontFamily: "monospace", fontSize: "0.875rem" }}></textarea>
                      </div>
                    </>
                  )}

                  {seoTab === "aio" && (
                    <>
                      <h3 className={styles.sectionTitle} style={{color: '#10b981'}}>AI Search Engine Optimization (AIO)</h3>
                      <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '24px'}}>Configure explicit metadata for Large Language Models (LLMs) like ChatGPT, Perplexity, and Google SGE.</p>
                      
                      <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                        <label className={styles.label}>AI Assistant Summary</label>
                        <textarea className={styles.input} rows="4" placeholder="Briefly summarize this page specifically for AI scrapers..." value={editingSeo.ai_summary || ""} onChange={(e) => setEditingSeo({...editingSeo, ai_summary: e.target.value})}></textarea>
                        <span className={styles.helpText}>This will be embedded as a special meta tag to guide AI agents summarizing your content.</span>
                      </div>

                      <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                        <label className={styles.label}>Target Entities (Keywords for AI)</label>
                        <input className={styles.input} type="text" placeholder="Fertility Assessment, IVF, PCOS..." value={editingSeo.target_entities || ""} onChange={(e) => setEditingSeo({...editingSeo, target_entities: e.target.value})} />
                        <span className={styles.helpText}>Comma-separated list of entities/concepts this page covers.</span>
                      </div>
                    </>
                  )}

                  {seoMessage && <p style={{color: 'red', marginBottom: '16px'}}>{seoMessage}</p>}
                  <button type="submit" className={styles.btnPrimary} style={{width: '200px'}}>Save Configuration</button>
                </form>
              </div>
              )}
            </div>
          )}

          {activeTab === "blogs" && (
            <div>
              <div style={{ marginBottom: "24px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <button className={styles.btnPrimary} onClick={() => {
                  setEditingBlog({ slug: "", title: "", excerpt: "", content: "", author_name: "SORA Team", cover_image: "", published: false, category: "Fertility", meta_title: "", meta_description: "", meta_keywords: "", related_tool: "", published_at: null, faqs: [] });
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

          {activeTab === "analytics" && analytics && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
                <select 
                  value={dateRange} 
                  onChange={(e) => setDateRange(e.target.value)}
                  className={styles.input}
                  style={{ width: "auto", margin: 0, padding: "8px 16px" }}
                >
                  <option value="all">All Time</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="this_month">This Month</option>
                </select>
                <button onClick={() => loadAnalytics()} className={styles.btnSecondary}>
                  <RefreshCw size={16} /> Refresh Analytics
                </button>
              </div>

              {/* KPI Cards */}
              <div className={styles.metricsGrid} style={{ marginBottom: "32px" }}>
                <div className={styles.metricCard}>
                  <span className={styles.metricCardTitle}>Total Visitors</span>
                  <h3 className={styles.metricCardValue}>{analytics.summary.totalVisitors || 0}</h3>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricCardTitle}>Today's Users</span>
                  <h3 className={styles.metricCardValue}>{analytics.summary.todayUsers || 0}</h3>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricCardTitle}>Assessments Completed</span>
                  <h3 className={styles.metricCardValue} style={{color: '#16a34a'}}>{analytics.summary.assessmentsCompleted || 0}</h3>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricCardTitle}>Reports Downloaded</span>
                  <h3 className={styles.metricCardValue} style={{color: '#3b82f6'}}>{analytics.summary.reportsDownloaded || 0}</h3>
                </div>
              </div>

              {/* Tools Analytics Table */}
              <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "32px", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>Tools Analytics</h3>
                  <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.875rem" }}>Engagement and drop-off rates across SORA public tools.</p>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tool Name</th>
                      <th>Views</th>
                      <th>Starts</th>
                      <th>Completes</th>
                      <th>Downloads</th>
                      <th>Paid Downloads</th>
                      <th>Completion %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.toolsAnalytics.map((tool, idx) => (
                      <tr key={idx}>
                        <td style={{fontWeight: 600, color: '#1e293b'}}>{tool.tool_name}</td>
                        <td>{tool.views}</td>
                        <td>{tool.starts}</td>
                        <td style={{color: '#16a34a', fontWeight: 'bold'}}>{tool.completes}</td>
                        <td style={{color: '#3b82f6', fontWeight: 600}}>{tool.downloads}</td>
                        <td style={{color: '#8b5cf6', fontWeight: 600}}>{tool.paid_downloads || 0}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${tool.completion_rate}%`, height: '100%', background: tool.completion_rate > 75 ? '#10b981' : tool.completion_rate > 50 ? '#f59e0b' : '#ef4444' }}></div>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{tool.completion_rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {analytics.toolsAnalytics.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '48px', color: '#94a3b8'}}>No tool data recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Traffic Sources */}
              <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "32px", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>Traffic Sources</h3>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Visitors</th>
                      <th>Assessments Started</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.trafficSources.map((source, idx) => (
                      <tr key={idx}>
                        <td style={{fontWeight: 600, color: '#1e293b'}}>{source.source}</td>
                        <td>{source.visitors}</td>
                        <td>{source.assessments}</td>
                      </tr>
                    ))}
                    {analytics.trafficSources.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{textAlign: 'center', padding: '48px', color: '#94a3b8'}}>No source data recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Subscribers Tab */}
          {activeTab === "subscribers" && (
            <div className={styles.tabContent}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '24px' }}>
                <button onClick={exportSubscribersCsv} className={styles.btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} />
                  Export to CSV
                </button>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Email Address</th>
                      <th>Status</th>
                      <th>Source</th>
                      <th>Date Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr key={idx}>
                        <td style={{fontWeight: 600, color: '#1e293b'}}>{sub.email}</td>
                        <td>
                          <span style={{
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.75rem', 
                            fontWeight: '600',
                            backgroundColor: sub.status === 'active' ? '#dcfce7' : '#f1f5f9',
                            color: sub.status === 'active' ? '#16a34a' : '#64748b'
                          }}>
                            {sub.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{color: '#64748b'}}>{sub.source || 'blog'}</td>
                        <td style={{color: '#64748b'}}>{new Date(sub.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {subscribers.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{textAlign: 'center', padding: '48px', color: '#94a3b8'}}>
                          No subscribers yet. They will appear here once they sign up.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Platform Settings Tab */}
          {activeTab === "settings" && (
            <div className={styles.tabContent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
              {/* Security Card */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', color: '#3b82f6' }}>
                    <Settings size={24} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Superadmin Security</h3>
                </div>
                <form onSubmit={updatePassword}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div>
                      <label className={styles.label}>Master Password</label>
                      <input 
                        className={styles.input}
                        type="password" 
                        placeholder="Enter new master password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>
                    <button className={styles.btnPrimary} style={{width: '100%', justifyContent: 'center'}} type="submit">Update Password</button>
                  </div>
                  {settingsMessage && <p style={{marginTop: '16px', fontSize: '0.875rem', color: '#16a34a', textAlign: 'center'}}>{settingsMessage}</p>}
                </form>
              </div>

              {/* Global Config Card */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', color: '#3b82f6' }}>
                    <Building2 size={24} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Global Configuration</h3>
                </div>
                <form onSubmit={updateLimits}>
                  <div className={styles.infoBox} style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Widget Host URL</h4>
                    <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: '#64748b' }}>Used to generate the embed codes for clinics. Must be the domain where this app is running.</p>
                    <input className={styles.input} type="url" placeholder="https://app.sorafertility.com" value={widgetHostUrl} onChange={(e) => setWidgetHostUrl(e.target.value)} required />
                  </div>
                  <button className={styles.btnPrimary} style={{width: '100%', justifyContent: 'center'}} type="submit">Save Configuration</button>
                  {limitsMessage && <p style={{marginTop: '16px', textAlign: 'center', fontSize: '0.875rem', color: '#16a34a'}}>{limitsMessage}</p>}
                </form>
              </div>
            </div>
          )}

        </div>
      </main>



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



      {/* Blog Edit Modal */}
      {editingBlog && (
        <div className={styles.modalOverlay} style={{ zIndex: 9999 }}>
          <div className={styles.modalContent} style={{ maxWidth: "100vw", width: "100vw", height: "100vh", maxHeight: "100vh", margin: 0, borderRadius: 0, display: "flex", flexDirection: "column", background: "#f8fafc" }}>
            <div className={styles.modalHeader} style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #e2e8f0" }}>
              <h2><FileText size={20}/> {editingBlog.id ? "Edit Blog Post" : "Create Blog Post"}</h2>
              <button className={styles.closeBtn} onClick={() => setEditingBlog(null)}><X size={24} /></button>
            </div>
            <div className={styles.modalBody} style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", justifyContent: "center" }}>
              <form onSubmit={saveBlogSettings} style={{ width: "100%", maxWidth: "900px", background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", display: "flex", flexDirection: "column" }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Title</label>
                    <input 
                      className={styles.input} 
                      type="text" 
                      value={editingBlog.title} 
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        if (!editingBlog.id) {
                          const newSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                          setEditingBlog({...editingBlog, title: newTitle, slug: newSlug});
                        } else {
                          setEditingBlog({...editingBlog, title: newTitle});
                        }
                      }} 
                      required 
                    />
                  </div>

                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label}>Excerpt (Short summary)</label>
                  <textarea className={styles.input} rows="2" value={editingBlog.excerpt || ""} onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}></textarea>
                </div>

                <div className={styles.formGroup} style={{ flex: 1, marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
                  <label className={styles.label}>Content</label>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <RichTextEditor 
                      value={editingBlog.content || ""} 
                      onChange={(content) => setEditingBlog({...editingBlog, content})} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Author Name</label>
                    <input className={styles.input} type="text" value={editingBlog.author_name || ""} onChange={(e) => setEditingBlog({...editingBlog, author_name: e.target.value})} />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Cover Image (Optional)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className={styles.input} type="text" placeholder="https://..." value={editingBlog.cover_image || ""} onChange={(e) => setEditingBlog({...editingBlog, cover_image: e.target.value})} style={{ flex: 1 }} />
                      <button type="button" className={styles.btnSecondary} onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append("file", file);
                          const res = await fetch("/api/superadmin/upload", { method: "POST", body: formData });
                          const data = await res.json();
                          if (data.success) {
                            setEditingBlog(prev => ({...prev, cover_image: data.url}));
                          } else {
                            alert("Upload failed: " + data.message);
                          }
                        };
                        input.click();
                      }}>Upload Image</button>
                    </div>
                  </div>
                </div>

                <div className={styles.divider}></div>
                <h3 className={styles.sectionTitle} style={{marginTop: '24px'}}>Frequently Asked Questions (FAQs)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {(editingBlog.faqs || []).map((faq, idx) => (
                    <div key={idx} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className={styles.label} style={{ margin: 0 }}>Question {idx + 1}</label>
                        <button type="button" onClick={() => {
                          const newFaqs = [...editingBlog.faqs];
                          newFaqs.splice(idx, 1);
                          setEditingBlog({...editingBlog, faqs: newFaqs});
                        }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 600 }}>
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                      <input className={styles.input} type="text" placeholder="Question..." value={faq.question} onChange={(e) => {
                        const newFaqs = [...editingBlog.faqs];
                        newFaqs[idx].question = e.target.value;
                        setEditingBlog({...editingBlog, faqs: newFaqs});
                      }} />
                      <textarea className={styles.input} rows="3" placeholder="Answer..." value={faq.answer} onChange={(e) => {
                        const newFaqs = [...editingBlog.faqs];
                        newFaqs[idx].answer = e.target.value;
                        setEditingBlog({...editingBlog, faqs: newFaqs});
                      }}></textarea>
                    </div>
                  ))}
                  <button type="button" className={styles.btnSecondary} onClick={() => setEditingBlog({...editingBlog, faqs: [...(editingBlog.faqs || []), { question: "", answer: "" }]})} style={{ alignSelf: 'flex-start' }}>
                    <Plus size={16} style={{marginRight: '8px'}} /> Add FAQ
                  </button>
                </div>

                <div className={styles.divider}></div>
                <h3 className={styles.sectionTitle} style={{marginTop: '24px'}}>SEO & Content Settings</h3>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Content Category</label>
                    <select className={styles.input} value={editingBlog.category || "Fertility"} onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}>
                      <option value="Fertility">Fertility</option>
                      <option value="PCOS">PCOS</option>
                      <option value="Pregnancy">Pregnancy</option>
                      <option value="Egg Freezing">Egg Freezing</option>
                    </select>
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Related Tool (CTA)</label>
                    <select className={styles.input} value={editingBlog.related_tool || ""} onChange={(e) => setEditingBlog({...editingBlog, related_tool: e.target.value})}>
                      <option value="">None</option>
                      <option value="egg-freezing-planner">Egg Freezing Planner</option>
                      <option value="fertility-assessment">Fertility Assessment</option>
                      <option value="pcos-assessment">PCOS Assessment</option>
                      <option value="due-date-calculator">Due Date Calculator</option>
                      <option value="ovulation-calculator">Ovulation Calculator</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label}>SEO Meta Title</label>
                  <input className={styles.input} type="text" value={editingBlog.meta_title || ""} onChange={(e) => setEditingBlog({...editingBlog, meta_title: e.target.value})} placeholder="Title for Search Engines..." />
                </div>
                
                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                  <label className={styles.label}>SEO Meta Description</label>
                  <textarea className={styles.input} rows="2" value={editingBlog.meta_description || ""} onChange={(e) => setEditingBlog({...editingBlog, meta_description: e.target.value})} placeholder="Optimized description..."></textarea>
                </div>
                
                <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                  <label className={styles.label}>SEO Meta Keywords</label>
                  <input className={styles.input} type="text" value={editingBlog.meta_keywords || ""} onChange={(e) => setEditingBlog({...editingBlog, meta_keywords: e.target.value})} placeholder="fertility, IVF, pcos symptoms" />
                </div>

                <div className={styles.formGroup} style={{ marginBottom: '24px', display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                    <input type="checkbox" checked={editingBlog.published} onChange={(e) => setEditingBlog({...editingBlog, published: e.target.checked})} />
                    Publish publicly
                  </label>

                  {editingBlog.published && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label className={styles.label} style={{ margin: 0 }}>Publish At (Schedule):</label>
                      <input 
                        className={styles.input} 
                        type="datetime-local" 
                        value={editingBlog.published_at ? new Date(new Date(editingBlog.published_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} 
                        onChange={(e) => setEditingBlog({...editingBlog, published_at: e.target.value ? new Date(e.target.value).toISOString() : null})} 
                      />
                      <span className={styles.helpText} style={{ margin: 0 }}>(Leave blank to publish immediately)</span>
                    </div>
                  )}
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
