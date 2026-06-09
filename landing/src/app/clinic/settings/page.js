"use client";

import { useState, useEffect } from "react";
import { Save, User, Lock, Mail } from "lucide-react";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: "",
    owner_name: "",
    owner_email: "",
    notification_email: "",
    password: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/clinic/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({ ...data.settings, password: "" });
        }
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
      const res = await fetch("/api/clinic/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("Settings saved successfully.");
        setSettings(s => ({ ...s, password: "" })); // Clear password field
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Clinic Settings</h1>
        <p>Manage your clinic profile and security.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardBody}>
          <form onSubmit={handleSave}>
            
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <User size={18} /> General Profile
              </h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Clinic Name</label>
                  <input 
                    type="text" 
                    value={settings.name}
                    onChange={e => setSettings({...settings, name: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Owner Name</label>
                  <input 
                    type="text" 
                    value={settings.owner_name}
                    onChange={e => setSettings({...settings, owner_name: e.target.value})}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Mail size={18} /> Notifications & Contact
              </h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Login Email (Read-only)</label>
                  <input 
                    type="email" 
                    value={settings.owner_email}
                    disabled
                    className={styles.input}
                  />
                  <span className={styles.hint}>Contact support to change login email.</span>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Lead Notification Email</label>
                  <input 
                    type="email" 
                    value={settings.notification_email || ""}
                    onChange={e => setSettings({...settings, notification_email: e.target.value})}
                    className={styles.input}
                    placeholder="Where should we email new leads?"
                  />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Lock size={18} /> Security
              </h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>New Password</label>
                  <input 
                    type="password" 
                    value={settings.password}
                    onChange={e => setSettings({...settings, password: e.target.value})}
                    className={styles.input}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button 
                type="submit" 
                disabled={saving}
                className={styles.saveBtn}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
