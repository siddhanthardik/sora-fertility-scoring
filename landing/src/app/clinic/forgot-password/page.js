"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../login/login.module.css"; // Reuse login styles

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/clinics/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to request password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Image src="/sora-logo.png" alt="SORA Logo" width={240} height={75} style={{ width: "auto", height: "auto", objectFit: "contain" }} priority />
        </div>

        <div className={styles.cardHeader}>
          <h2>Reset Password</h2>
          <p>Enter your clinic email to receive a reset link.</p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ padding: '1rem', marginBottom: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Check your email!</p>
            <p>We've sent a password reset link to <strong>{email}</strong>.</p>
            <Link href="/clinic/login" style={{ display: 'inline-block', marginTop: '1rem', color: '#166534', textDecoration: 'underline', fontWeight: '500' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Work Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                placeholder="admin@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && (
          <div className={styles.loginLink}>
            Remember your password? <Link href="/clinic/login">Sign in here</Link>
          </div>
        )}
      </div>
    </div>
  );
}
