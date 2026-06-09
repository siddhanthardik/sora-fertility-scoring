"use client";

import { useState, useEffect } from "react";
import { Check, Zap } from "lucide-react";
import styles from "./billing.module.css";

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("starter");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, packagesRes] = await Promise.all([
        fetch("/api/clinic/settings"),
        fetch("/api/packages")
      ]);
      
      if (settingsRes.ok) {
        setCurrentPlan("starter"); 
      }
      
      if (packagesRes.ok) {
        const pData = await packagesRes.json();
        setPackages(pData.packages || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    setProcessing(true);
    try {
      const res = await fetch("/api/billing/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      
      if (data.success && data.order) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          amount: data.order.amount,
          currency: data.order.currency,
          name: "SORA Fertility",
          description: `Upgrade to ${plan.toUpperCase()} Plan`,
          order_id: data.order.id,
          handler: function (response) {
            alert("Payment successful! Your plan will be updated shortly.");
            setCurrentPlan(plan);
          },
          theme: {
            color: "#2563eb"
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (data.success && !data.order) {
        alert(data.message);
        setCurrentPlan(plan);
      } else {
        alert("Failed to initiate payment.");
      }
    } catch (error) {
      console.error(error);
      alert("Payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading plans...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Upgrade Your Plan</h1>
        <p>Get more out of SORA Fertility with our premium features.</p>
      </div>

      <div className={styles.grid}>
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`${styles.card} ${pkg.id === 'growth' ? styles.cardPopular : ''}`}
          >
            {pkg.id === 'growth' && (
              <div className={styles.popularBadge}>
                <Zap size={14} /> Most Popular
              </div>
            )}
            <h3 className={styles.cardTitle}>{pkg.name}</h3>
            <div className={styles.priceContainer}>
              <span className={styles.price}>{pkg.price_inr === 0 ? 'Free' : `₹${pkg.price_inr}`}</span>
              {pkg.price_inr > 0 && <span className={styles.period}>/mo</span>}
            </div>
            <ul className={styles.featureList}>
              {(pkg.features || []).map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <Check className={styles.checkIcon} size={18} /> 
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              disabled={currentPlan === pkg.id || processing}
              onClick={() => handleUpgrade(pkg.id)}
              className={`${styles.btn} ${
                currentPlan === pkg.id 
                  ? styles.btnCurrent
                  : pkg.id === 'growth' 
                    ? styles.btnPrimary
                    : pkg.id === 'enterprise' 
                      ? styles.btnDark
                      : styles.btnOutline
              }`}
            >
              {currentPlan === pkg.id ? 'Current Plan' : `Upgrade to ${pkg.name}`}
            </button>
          </div>
        ))}
      </div>
      
      {/* Include Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
    </div>
  );
}
