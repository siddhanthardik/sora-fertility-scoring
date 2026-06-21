"use client";

import { X } from "lucide-react";

export default function LeadDetailsModal({ lead, onClose }) {
  if (!lead) return null;

  const raw = lead.raw_data || {};

  const getReadableValue = (key, value) => {
    if (value === undefined || value === null || value === "") return "Not entered";
    
    const mapping = {
      tryingStatus: { active: "Actively trying now", planning: "Planning a future pregnancy", awareness: "Checking fertility awareness" },
      prevBirth: { yes: "Yes", no: "No" },
      tryDuration: { notTrying: "Not currently trying", under6: "Less than 6 months", sixToEleven: "6-11 months", over12: "12 months or longer" },
      intercourseTiming: { notTrying: "Not currently trying", wellTimed: "Regular intercourse during the fertile window", infrequent: "Intercourse may be too infrequent", uncertain: "Fertile-window timing is uncertain" },
      partnerSperm: { no: "No known issue", yes: "Yes, known sperm factor", unknown: "Unknown / not tested" },
      cycleReg: { regular: "Yes, regular", irregular: "No, irregular or absent" },
      cycleLength: { short: "Less than 21 days", normal: "21-35 days", long: "More than 35 days", absent: "Absent periods", notSure: "Not sure" },
      pcos: { yes: "Yes", no: "No", notSure: "Not sure" },
      thyroid: { no: "No", treated: "Yes, treated", untreated: "Yes, untreated / uncontrolled", notSure: "Not sure" },
      diabetes: { no: "No", controlled: "Yes, well controlled", uncontrolled: "Yes, not well controlled", notSure: "Not sure" },
      familyEarlyMenopause: { no: "No", yes: "Yes", notSure: "Not sure" },
      pregnancyLosses: { none: "None", one: "One", twoPlus: "Two or more" },
      ectopicPregnancy: { yes: "Yes", no: "No", notSure: "Not sure" },
      endo: { yes: "Yes", no: "No", notSure: "Not sure" },
      pelvicPain: { none: "No significant pain", mild: "Yes, mild/moderate pain", severe: "Yes, severe or deep pain" },
      uterineHistory: { no: "No", yes: "Yes", notSure: "Not sure" },
      pelvicSurgery: { no: "No", yes: "Yes", notSure: "Not sure" },
      stiHistory: { no: "No", yes: "Yes", notSure: "Not sure" },
      tbHistory: { no: "No", pulmonary: "Yes, pulmonary / lung TB", pelvic: "Yes, pelvic / genital TB", notSure: "Not sure" },
      tbTreatment: { no: "No", completed: "Yes, completed treatment", current: "Yes, currently on treatment", notSure: "Not sure" },
      cancerTreatment: { no: "No", yes: "Yes", notSure: "Not sure" },
      smoking: { no: "No", occasional: "Yes, occasionally", daily: "Yes, daily" },
      caffeine: { low: "Low: 0-100 mg/day", moderate: "Moderate: 100-200 mg/day", high: "High: more than 200 mg/day", notSure: "Not sure" },
      alcohol: { no: "No", yes: "Yes", notSure: "Not sure" },
      recreationalDrugs: { no: "No", occasional: "Yes, occasionally", regular: "Yes, regularly" }
    };

    return mapping[key]?.[value] ?? String(value);
  };

  const DataRow = ({ label, value }) => (
    <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", padding: "12px 0" }}>
      <div style={{ width: "40%", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>{label}</div>
      <div style={{ width: "60%", color: "#111827", fontSize: "14px", fontWeight: "600" }}>{value}</div>
    </div>
  );

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
    }}>
      <div style={{
        background: "white", borderRadius: "12px", width: "100%", maxWidth: "800px", maxHeight: "90vh",
        display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Lead Details: {lead.name}</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280" }}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1, backgroundColor: "#f9fafb" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            
            {/* Contact Info */}
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#374151" }}>Contact Information</h3>
              <DataRow label="Full Name" value={lead.name} />
              <DataRow label="Email" value={lead.email} />
              <DataRow label="Phone" value={lead.phone} />
              <DataRow label="Captured Date" value={new Date(lead.created_at).toLocaleString()} />
              <DataRow label="Source" value={lead.source} />
            </div>

            {/* Consultation Request */}
            {lead.consultation_request && (
              <div style={{ background: "#fff7ea", padding: "20px", borderRadius: "8px", border: "1px solid #DFBA89" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#b45309" }}>Priority Consultation Request</h3>
                <DataRow label="Preferred Date" value={lead.preferred_date || "Not specified"} />
                <DataRow label="Preferred Time" value={lead.preferred_time || "Not specified"} />
                {lead.consultation_notes && (
                  <div style={{ marginTop: "12px", borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
                    <div style={{ color: "#6b7280", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Notes</div>
                    <div style={{ color: "#111827", fontSize: "14px" }}>{lead.consultation_notes}</div>
                  </div>
                )}
              </div>
            )}

            {/* FertiSTAT Assessment Scores */}
            {lead.triage_tier && (
              <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#374151" }}>FertiSTAT Assessment</h3>
                <DataRow label="Triage Tier" value={(lead.triage_tier || "Pending").toUpperCase()} />
                <DataRow label="Referral Urgency" value={lead.urgency || "Pending"} />
                <DataRow label="Basic Score" value={lead.basic_score} />
                <DataRow label="Enhanced Score" value={lead.enhanced_score} />
              </div>
            )}

            {/* PCOS Assessment Scores */}
            {(lead.pcos_risk_level || lead.pcos_assessment_score !== null) && (
              <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#374151" }}>PCOS Assessment</h3>
                <DataRow label="Risk Level" value={(lead.pcos_risk_level || "Pending").toUpperCase()} />
                <DataRow label="Score" value={lead.pcos_assessment_score} />
                <DataRow label="Pattern Insights" value={lead.pcos_pattern || "None"} />
                <DataRow label="Lead Priority" value={lead.lead_priority || "NORMAL"} />
              </div>
            )}
            
            {/* Biometrics & Goal */}
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#374151" }}>Personal & Goal</h3>
              <DataRow label="Age" value={lead.age ? `${lead.age} Years` : "Not entered"} />
              <DataRow label="Height" value={lead.height ? `${lead.height} cm` : "Not entered"} />
              <DataRow label="Weight" value={lead.weight ? `${lead.weight} kg` : "Not entered"} />
              <DataRow label="BMI" value={lead.bmi} />
              <DataRow label="Goal Focus" value={getReadableValue("tryingStatus", raw.tryingStatus)} />
              <DataRow label="Try Duration" value={getReadableValue("tryDuration", raw.tryDuration)} />
              <DataRow label="Prior Births" value={getReadableValue("prevBirth", raw.prevBirth)} />
            </div>

            {/* Medical Context */}
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#374151" }}>Clinical History</h3>
              <DataRow label="Cycle Reg." value={getReadableValue("cycleReg", raw.cycleReg)} />
              <DataRow label="Cycle Length" value={getReadableValue("cycleLength", raw.cycleLength)} />
              <DataRow label="PCOS" value={getReadableValue("pcos", raw.pcos)} />
              <DataRow label="Endometriosis" value={getReadableValue("endo", raw.endo)} />
              <DataRow label="Thyroid" value={getReadableValue("thyroid", raw.thyroid)} />
              <DataRow label="Pregnancy Losses" value={getReadableValue("pregnancyLosses", raw.pregnancyLosses)} />
              <DataRow label="Pelvic Pain" value={getReadableValue("pelvicPain", raw.pelvicPain)} />
            </div>

          </div>

          {/* Flagged Markers */}
          {lead.flagged_markers && (
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "24px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#b91c1c" }}>Flagged Risk Markers</h3>
              {(() => {
                try {
                  const flags = JSON.parse(lead.flagged_markers);
                  return flags.map((f, i) => (
                    <div key={i} style={{ borderLeft: `3px solid ${f.level === "red" ? "#b91c1c" : "#b45309"}`, paddingLeft: "12px", marginBottom: "12px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#111827" }}>{f.title}</div>
                      <div style={{ fontSize: "13px", color: "#6b7280" }}>{f.label}</div>
                    </div>
                  ));
                } catch {
                  return <div>Error parsing flags</div>;
                }
              })()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
