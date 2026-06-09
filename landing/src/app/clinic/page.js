"use client";

import { useState, useEffect } from "react";
import { Download, Search, Activity, Users, Clock } from "lucide-react";
import styles from "./clinic.module.css";

export default function ClinicDashboardPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [firstName, setFirstName] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, settingsRes] = await Promise.all([
        fetch("/api/clinic/leads"),
        fetch("/api/clinic/settings")
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        let fullName = data.settings?.owner_name || data.settings?.name || "";
        if (fullName) {
          const parts = fullName.trim().split(" ");
          let displayName = parts[0];
          if ((displayName.toLowerCase() === "dr." || displayName.toLowerCase() === "dr") && parts.length > 1) {
            displayName = `${parts[0]} ${parts[1]}`;
          }
          setFirstName(displayName);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (assessmentId, status) => {
    try {
      await fetch("/api/clinic/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, status })
      });
      // Just re-fetch leads instead of full data to avoid unnecessary network calls
      const res = await fetch("/api/clinic/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredLeads = leads.filter(lead => 
    lead.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.patient_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Welcome{firstName ? ` ${firstName}` : ""}</h1>
        <p>Manage your incoming patient assessments and leads.</p>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
            <Users size={24} />
          </div>
          <p className={styles.kpiLabel}>Total Leads</p>
          <h3 className={styles.kpiValue}>{leads.length}</h3>
        </div>
        
        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.iconAmber}`}>
            <Clock size={24} />
          </div>
          <p className={styles.kpiLabel}>New / Uncontacted</p>
          <h3 className={styles.kpiValue}>{leads.filter(l => l.status === 'new').length}</h3>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.iconWrapper} ${styles.iconRed}`}>
            <Activity size={24} />
          </div>
          <p className={styles.kpiLabel}>High Risk Patients</p>
          <h3 className={styles.kpiValue}>{leads.filter(l => l.risk_band === 'high').length}</h3>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Risk Band</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>Loading leads...</td>
                </tr>
              ) : paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>No leads found.</td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className={styles.patientName}>{lead.patient_name}</div>
                      <div className={styles.patientContact}>{lead.patient_email}</div>
                      <div className={styles.patientContact}>{lead.patient_phone}</div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${
                        lead.risk_band === 'high' ? styles.badgeHigh : 
                        lead.risk_band === 'medium' ? styles.badgeMedium : 
                        styles.badgeLow
                      }`}>
                        {lead.risk_band}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={lead.status} 
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="consultation_booked">Consultation Booked</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {lead.pdf_url ? (
                        <a 
                          href={lead.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.actionBtn}
                        >
                          <Download size={16} /> PDF Report
                        </a>
                      ) : (
                        <span className={styles.noPdf}>No PDF</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && filteredLeads.length > 0 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> to <span>{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span>{filteredLeads.length}</span> leads
            </div>
            <div className={styles.paginationControls}>
              <button 
                className={styles.pageBtn}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {/* Simple page numbers */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                // Only show a few pages around current to avoid crowding
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button 
                      key={page}
                      className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 || 
                  page === currentPage + 2
                ) {
                  return <span key={page} style={{ padding: '0.375rem', color: '#94a3b8' }}>...</span>;
                }
                return null;
              })}

              <button 
                className={styles.pageBtn}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
