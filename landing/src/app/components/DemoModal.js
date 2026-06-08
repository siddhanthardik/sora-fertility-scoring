"use client";

import { useState } from "react";
import { X, Send, Check, Loader2 } from "lucide-react";
import styles from "./DemoModal.module.css";

export default function DemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    clinicName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    painPoint: ""
  });
  
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send request. Please try again.');
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button type="button" className={styles.modalClose} onClick={onClose}>
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <Check size={40} />
            </div>
            <h3 className={styles.successTitle}>Request Sent!</h3>
            <p className={styles.successDesc}>
              Thank you for reaching out, {formData.name.split(' ')[0]}. Our team will contact you shortly to schedule your personalized demo of SORA CRM.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Book a Free Demo</h2>
              <p className={styles.modalDesc}>See how SORA can streamline your IVF clinic operations.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Full Name *</label>
                    <input required type="text" id="name" name="name" className={styles.input} value={formData.name} onChange={handleChange} placeholder="Dr. Jane Doe" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="clinicName" className={styles.label}>Clinic Name *</label>
                    <input required type="text" id="clinicName" name="clinicName" className={styles.input} value={formData.clinicName} onChange={handleChange} placeholder="Genesis Fertility" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Work Email *</label>
                    <input required type="email" id="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} placeholder="jane@clinic.com" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>WhatsApp / Phone *</label>
                    <input required type="tel" id="phone" name="phone" className={styles.input} value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.label}>City</label>
                    <input type="text" id="city" name="city" className={styles.input} value={formData.city} onChange={handleChange} placeholder="London" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="country" className={styles.label}>Country</label>
                    <input type="text" id="country" name="country" className={styles.input} value={formData.country} onChange={handleChange} placeholder="United Kingdom" />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="painPoint" className={styles.label}>What is your biggest clinic challenge? (Optional)</label>
                    <textarea id="painPoint" name="painPoint" className={styles.input} value={formData.painPoint} onChange={handleChange} placeholder="e.g. Lead tracking is messy, paper consents are slowing us down..." />
                  </div>
                </div>

                {status === "error" && (
                  <div style={{ color: "red", fontSize: "0.9rem", marginTop: "16px", textAlign: "center" }}>
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.btnSubmit} disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>Sending Request <Loader2 size={18} className="spin" /></>
                  ) : (
                    <>Request Demo <Send size={18} /></>
                  )}
                </button>
                <div style={{ textAlign: "center", marginTop: "12px", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                  By requesting a demo, you agree to our Privacy Policy.
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
