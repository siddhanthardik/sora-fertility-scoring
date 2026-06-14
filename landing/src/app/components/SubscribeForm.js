"use client";

import { useState } from "react";
import styles from "../page.module.css";

export default function SubscribeForm({ source = "blog" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        setIsError(true);
        setMessage(data.message || "Failed to subscribe.");
      }
    } catch (err) {
      setIsError(true);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Subscribe</h3>
      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '16px' }}>Get the latest insights and updates.</p>
      <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', outline: 'none' }} 
          required 
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            padding: '12px', 
            background: '#f43f5e', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            fontWeight: '600', 
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s ease'
          }}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
        {message && (
          <p style={{ color: isError ? '#ef4444' : '#10b981', fontSize: '0.85rem', margin: 0, marginTop: '4px' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
