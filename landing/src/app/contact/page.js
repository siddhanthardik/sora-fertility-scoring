"use client";

import { useState } from "react";
import { Send, Check, Loader2, Mail, Phone, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./page.module.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    clinicName: "",
    reason: "",
    message: ""
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch('/api/contact', {
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
    <div className={styles.container}>
      <Navbar hideCta={false} />

      <section className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div className={styles.contactInfo}>
            <div className={styles.badge}>GET IN TOUCH</div>
            <h1 className={styles.title}>Let's talk about the future of your clinic.</h1>
            <p className={styles.desc}>
              Whether you're looking to streamline operations with Sora CRM or drive higher conversions with our Patient Assessment tools, our team is here to help.
            </p>

            <div className={styles.infoBlocks}>
              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}><Mail size={20} /></div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@sorafertility.com</p>
                </div>
              </div>
              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}><Phone size={20} /></div>
                <div>
                  <h4>Call Us</h4>
                  <p>+917838033664</p>
                </div>
              </div>
              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}><MapPin size={20} /></div>
                <div>
                  <h4>Headquarters</h4>
                  <p>D-89, Chhatarpur Enclave, Phase II, Chhatarpur, New Delhi - 110068</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactFormWrapper}>
            {status === "success" ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <Check size={40} />
                </div>
                <h3 className={styles.successTitle}>Message Sent!</h3>
                <p className={styles.successDesc}>
                  Thank you for reaching out to us, {formData.firstName}. We have received your message and our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>First Name *</label>
                    <input required type="text" id="firstName" name="firstName" className={styles.input} value={formData.firstName} onChange={handleChange} placeholder="Jane" />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                    <input required type="text" id="lastName" name="lastName" className={styles.input} value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Work Email *</label>
                    <input required type="email" id="email" name="email" className={styles.input} value={formData.email} onChange={handleChange} placeholder="jane@clinic.com" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>Phone Number</label>
                    <input type="tel" id="phone" name="phone" className={styles.input} value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="clinicName" className={styles.label}>Clinic / Company Name *</label>
                    <input required type="text" id="clinicName" name="clinicName" className={styles.input} value={formData.clinicName} onChange={handleChange} placeholder="Genesis Fertility Center" />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="reason" className={styles.label}>What can we help you with? *</label>
                    <select required id="reason" name="reason" className={styles.select} value={formData.reason} onChange={handleChange}>
                      <option value="" disabled>Select a topic...</option>
                      <option value="Sora CRM">Sora CRM</option>
                      <option value="Fertility Assessment Tool">Fertility Assessment Tool</option>
                      <option value="Partnerships">Partnerships</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="message" className={styles.label}>Message *</label>
                    <textarea required id="message" name="message" className={styles.textarea} value={formData.message} onChange={handleChange} placeholder="Tell us more about your inquiry..." />
                  </div>
                </div>

                {status === "error" && (
                  <div className={styles.errorMsg}>
                    {errorMessage}
                  </div>
                )}

                <button type="submit" className={styles.btnSubmit} disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>Sending <Loader2 size={18} className="spin" /></>
                  ) : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
