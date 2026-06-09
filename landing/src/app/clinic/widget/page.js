"use client";

import { useState, useEffect } from "react";
import { Copy, Save, Code, CheckCircle } from "lucide-react";
import styles from "./widget.module.css";

export default function WidgetEmbedPage() {
  const [widget, setWidget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({ primaryColor: "#000000", buttonText: "Start Assessment" });
  const [domains, setDomains] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchWidgetInfo();
  }, []);

  const fetchWidgetInfo = async () => {
    try {
      const res = await fetch("/api/clinic/widget");
      if (res.ok) {
        const data = await res.json();
        setWidget(data.widget);
        if (data.widget?.widget_config) setConfig(data.widget.widget_config);
        if (data.widget?.allowed_domains) setDomains(data.widget.allowed_domains.join(", "));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const allowed_domains = domains.split(",").map(d => d.trim()).filter(Boolean);
      await fetch("/api/clinic/widget", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widget_config: config, allowed_domains })
      });
      alert("Saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const hostUrl = typeof window !== "undefined" ? window.location.origin : "";
  const embedCode = `<script src="${hostUrl}/embed.js" data-sora-token="${widget?.widget_token || 'YOUR_TOKEN'}"></script>\n<div data-sora-fertility-widget></div>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className={styles.container}>Loading widget data...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Widget Embed Center</h1>
        <p>Customize your patient assessment widget and copy the code.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}><Code size={20} /> Your Embed Snippet</h2>
          <p className={styles.cardDesc}>Paste this code anywhere on your website where you want the assessment button to appear.</p>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.codeWrapper}>
            <pre>{embedCode}</pre>
            <button 
              onClick={copyToClipboard}
              className={styles.copyBtn}
              aria-label="Copy to clipboard"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />} 
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", margin: "0 0 0.5rem 0", color: "#0f172a" }}>Using WordPress?</h3>
            <p style={{ fontSize: "0.875rem", margin: "0", color: "#475569", lineHeight: "1.5" }}>
              It works seamlessly with WordPress! Simply use a <strong>Custom HTML</strong> block if you're using the Gutenberg Editor or Elementor, and paste the code above directly into the block. Alternatively, you can use an "Insert Headers and Footers" plugin to add the script tag to your site's header, and place the `&lt;div&gt;` wherever you want the button to show.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Customization & Security</h2>
        </div>
        <div className={styles.cardBody}>
          <form onSubmit={handleSave}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Primary Brand Color</label>
              <div className={styles.colorPickerWrapper}>
                <input 
                  type="color" 
                  value={config.primaryColor}
                  onChange={e => setConfig({...config, primaryColor: e.target.value})}
                  className={styles.colorPicker}
                />
                <input 
                  type="text" 
                  value={config.primaryColor}
                  onChange={e => setConfig({...config, primaryColor: e.target.value})}
                  className={`${styles.input} ${styles.colorInput}`}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Button Text</label>
              <input 
                type="text" 
                value={config.buttonText}
                onChange={e => setConfig({...config, buttonText: e.target.value})}
                className={styles.input}
                placeholder="Start Fertility Assessment"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Allowed Domains (CORS)</label>
              <span className={styles.hint}>Only these domains will be permitted to load your widget. Separate by commas.</span>
              <input 
                type="text" 
                value={domains}
                onChange={e => setDomains(e.target.value)}
                className={styles.input}
                placeholder="www.yourclinic.com, app.yourclinic.com"
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className={styles.saveBtn}
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
