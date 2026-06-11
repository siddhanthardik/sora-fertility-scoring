"use client";

import { useState, useEffect } from "react";
import { Users, Search, RefreshCcw, Activity } from "lucide-react";

export default function SuperadminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/superadmin/leads");
      const json = await res.json();
      if (json.success) {
        setLeads(json.data || []);
      } else {
        console.error("Failed to fetch leads:", json.message);
        setLeads([]);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l => 
    (l.name && l.name.toLowerCase().includes(search.toLowerCase())) ||
    (l.email && l.email.toLowerCase().includes(search.toLowerCase())) ||
    (l.phone && l.phone.includes(search))
  );

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
            <Users size={28} color="#ec4899" /> Superadmin Leads Dashboard
          </h1>
          <button 
            onClick={fetchLeads} 
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "6px", backgroundColor: "white", border: "1px solid #d1d5db", cursor: "pointer" }}
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 16px", width: "100%", maxWidth: "400px" }}>
          <Search size={18} color="#9ca3af" style={{ marginRight: "8px" }} />
          <input 
            type="text" 
            placeholder="Search leads by name, email, or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", width: "100%", fontSize: "15px" }}
          />
        </div>

        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}>
              <tr>
                <th style={{ padding: "16px", fontWeight: "600", color: "#374151" }}>Name</th>
                <th style={{ padding: "16px", fontWeight: "600", color: "#374151" }}>Contact</th>
                <th style={{ padding: "16px", fontWeight: "600", color: "#374151" }}>Triage Tier</th>
                <th style={{ padding: "16px", fontWeight: "600", color: "#374151" }}>Captured Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>Loading leads...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>No leads found.</td></tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "16px", color: "#111827", fontWeight: "500" }}>{lead.name}</td>
                    <td style={{ padding: "16px", color: "#4b5563" }}>
                      <div>{lead.email}</div>
                      <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>{lead.phone}</div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      {lead.triage_tier ? (
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "999px", 
                          fontSize: "12px", 
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          backgroundColor: lead.triage_tier === 'high' ? '#fee2e2' : lead.triage_tier === 'medium' ? '#fef3c7' : '#dcfce3',
                          color: lead.triage_tier === 'high' ? '#b91c1c' : lead.triage_tier === 'medium' ? '#b45309' : '#15803d'
                        }}>
                          {lead.triage_tier}
                        </span>
                      ) : <span style={{ color: "#9ca3af" }}>Pending</span>}
                    </td>
                    <td style={{ padding: "16px", color: "#4b5563" }}>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
