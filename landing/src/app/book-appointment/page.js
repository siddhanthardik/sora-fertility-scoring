"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";

const COUNTRIES = [
  { code: "AF", name: "Afghanistan", dial: "+93" },
  { code: "AL", name: "Albania", dial: "+355" },
  { code: "DZ", name: "Algeria", dial: "+213" },
  { code: "AS", name: "American Samoa", dial: "+1-684" },
  { code: "AD", name: "Andorra", dial: "+376" },
  { code: "AO", name: "Angola", dial: "+244" },
  { code: "AI", name: "Anguilla", dial: "+1-264" },
  { code: "AQ", name: "Antarctica", dial: "+672" },
  { code: "AG", name: "Antigua and Barbuda", dial: "+1-268" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "AM", name: "Armenia", dial: "+374" },
  { code: "AW", name: "Aruba", dial: "+297" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "AT", name: "Austria", dial: "+43" },
  { code: "AZ", name: "Azerbaijan", dial: "+994" },
  { code: "BS", name: "Bahamas", dial: "+1-242" },
  { code: "BH", name: "Bahrain", dial: "+973" },
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "BB", name: "Barbados", dial: "+1-246" },
  { code: "BY", name: "Belarus", dial: "+375" },
  { code: "BE", name: "Belgium", dial: "+32" },
  { code: "BZ", name: "Belize", dial: "+501" },
  { code: "BJ", name: "Benin", dial: "+229" },
  { code: "BM", name: "Bermuda", dial: "+1-441" },
  { code: "BT", name: "Bhutan", dial: "+975" },
  { code: "BO", name: "Bolivia", dial: "+591" },
  { code: "BA", name: "Bosnia and Herzegovina", dial: "+387" },
  { code: "BW", name: "Botswana", dial: "+267" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "IO", name: "British Indian Ocean Territory", dial: "+246" },
  { code: "VG", name: "British Virgin Islands", dial: "+1-284" },
  { code: "BN", name: "Brunei", dial: "+673" },
  { code: "BG", name: "Bulgaria", dial: "+359" },
  { code: "BF", name: "Burkina Faso", dial: "+226" },
  { code: "BI", name: "Burundi", dial: "+257" },
  { code: "KH", name: "Cambodia", dial: "+855" },
  { code: "CM", name: "Cameroon", dial: "+237" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "CV", name: "Cape Verde", dial: "+238" },
  { code: "KY", name: "Cayman Islands", dial: "+1-345" },
  { code: "CF", name: "Central African Republic", dial: "+236" },
  { code: "TD", name: "Chad", dial: "+235" },
  { code: "CL", name: "Chile", dial: "+56" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "CX", name: "Christmas Island", dial: "+61" },
  { code: "CC", name: "Cocos Islands", dial: "+61" },
  { code: "CO", name: "Colombia", dial: "+57" },
  { code: "KM", name: "Comoros", dial: "+269" },
  { code: "CK", name: "Cook Islands", dial: "+682" },
  { code: "CR", name: "Costa Rica", dial: "+506" },
  { code: "HR", name: "Croatia", dial: "+385" },
  { code: "CU", name: "Cuba", dial: "+53" },
  { code: "CW", name: "Curacao", dial: "+599" },
  { code: "CY", name: "Cyprus", dial: "+357" },
  { code: "CZ", name: "Czech Republic", dial: "+420" },
  { code: "CD", name: "Democratic Republic of the Congo", dial: "+243" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "DJ", name: "Djibouti", dial: "+253" },
  { code: "DM", name: "Dominica", dial: "+1-767" },
  { code: "DO", name: "Dominican Republic", dial: "+1-809, 1-829, 1-849" },
  { code: "TL", name: "East Timor", dial: "+670" },
  { code: "EC", name: "Ecuador", dial: "+593" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "SV", name: "El Salvador", dial: "+503" },
  { code: "GQ", name: "Equatorial Guinea", dial: "+240" },
  { code: "ER", name: "Eritrea", dial: "+291" },
  { code: "EE", name: "Estonia", dial: "+372" },
  { code: "ET", name: "Ethiopia", dial: "+251" },
  { code: "FK", name: "Falkland Islands", dial: "+500" },
  { code: "FO", name: "Faroe Islands", dial: "+298" },
  { code: "FJ", name: "Fiji", dial: "+679" },
  { code: "FI", name: "Finland", dial: "+358" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "PF", name: "French Polynesia", dial: "+689" },
  { code: "GA", name: "Gabon", dial: "+241" },
  { code: "GM", name: "Gambia", dial: "+220" },
  { code: "GE", name: "Georgia", dial: "+995" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "GH", name: "Ghana", dial: "+233" },
  { code: "GI", name: "Gibraltar", dial: "+350" },
  { code: "GR", name: "Greece", dial: "+30" },
  { code: "GL", name: "Greenland", dial: "+299" },
  { code: "GD", name: "Grenada", dial: "+1-473" },
  { code: "GU", name: "Guam", dial: "+1-671" },
  { code: "GT", name: "Guatemala", dial: "+502" },
  { code: "GG", name: "Guernsey", dial: "+44-1481" },
  { code: "GN", name: "Guinea", dial: "+224" },
  { code: "GW", name: "Guinea-Bissau", dial: "+245" },
  { code: "GY", name: "Guyana", dial: "+592" },
  { code: "HT", name: "Haiti", dial: "+509" },
  { code: "HN", name: "Honduras", dial: "+504" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "HU", name: "Hungary", dial: "+36" },
  { code: "IS", name: "Iceland", dial: "+354" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "IR", name: "Iran", dial: "+98" },
  { code: "IQ", name: "Iraq", dial: "+964" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "IM", name: "Isle of Man", dial: "+44-1624" },
  { code: "IL", name: "Israel", dial: "+972" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "CI", name: "Ivory Coast", dial: "+225" },
  { code: "JM", name: "Jamaica", dial: "+1-876" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "JE", name: "Jersey", dial: "+44-1534" },
  { code: "JO", name: "Jordan", dial: "+962" },
  { code: "KZ", name: "Kazakhstan", dial: "+7" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "KI", name: "Kiribati", dial: "+686" },
  { code: "XK", name: "Kosovo", dial: "+383" },
  { code: "KW", name: "Kuwait", dial: "+965" },
  { code: "KG", name: "Kyrgyzstan", dial: "+996" },
  { code: "LA", name: "Laos", dial: "+856" },
  { code: "LV", name: "Latvia", dial: "+371" },
  { code: "LB", name: "Lebanon", dial: "+961" },
  { code: "LS", name: "Lesotho", dial: "+266" },
  { code: "LR", name: "Liberia", dial: "+231" },
  { code: "LY", name: "Libya", dial: "+218" },
  { code: "LI", name: "Liechtenstein", dial: "+423" },
  { code: "LT", name: "Lithuania", dial: "+370" },
  { code: "LU", name: "Luxembourg", dial: "+352" },
  { code: "MO", name: "Macau", dial: "+853" },
  { code: "MK", name: "Macedonia", dial: "+389" },
  { code: "MG", name: "Madagascar", dial: "+261" },
  { code: "MW", name: "Malawi", dial: "+265" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "MV", name: "Maldives", dial: "+960" },
  { code: "ML", name: "Mali", dial: "+223" },
  { code: "MT", name: "Malta", dial: "+356" },
  { code: "MH", name: "Marshall Islands", dial: "+692" },
  { code: "MR", name: "Mauritania", dial: "+222" },
  { code: "MU", name: "Mauritius", dial: "+230" },
  { code: "YT", name: "Mayotte", dial: "+262" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "FM", name: "Micronesia", dial: "+691" },
  { code: "MD", name: "Moldova", dial: "+373" },
  { code: "MC", name: "Monaco", dial: "+377" },
  { code: "MN", name: "Mongolia", dial: "+976" },
  { code: "ME", name: "Montenegro", dial: "+382" },
  { code: "MS", name: "Montserrat", dial: "+1-664" },
  { code: "MA", name: "Morocco", dial: "+212" },
  { code: "MZ", name: "Mozambique", dial: "+258" },
  { code: "MM", name: "Myanmar", dial: "+95" },
  { code: "NA", name: "Namibia", dial: "+264" },
  { code: "NR", name: "Nauru", dial: "+674" },
  { code: "NP", name: "Nepal", dial: "+977" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "AN", name: "Netherlands Antilles", dial: "+599" },
  { code: "NC", name: "New Caledonia", dial: "+687" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "NI", name: "Nicaragua", dial: "+505" },
  { code: "NE", name: "Niger", dial: "+227" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "NU", name: "Niue", dial: "+683" },
  { code: "KP", name: "North Korea", dial: "+850" },
  { code: "MP", name: "Northern Mariana Islands", dial: "+1-670" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "OM", name: "Oman", dial: "+968" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "PW", name: "Palau", dial: "+680" },
  { code: "PS", name: "Palestine", dial: "+970" },
  { code: "PA", name: "Panama", dial: "+507" },
  { code: "PG", name: "Papua New Guinea", dial: "+675" },
  { code: "PY", name: "Paraguay", dial: "+595" },
  { code: "PE", name: "Peru", dial: "+51" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "PN", name: "Pitcairn", dial: "+64" },
  { code: "PL", name: "Poland", dial: "+48" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "PR", name: "Puerto Rico", dial: "+1-787, 1-939" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "CG", name: "Republic of the Congo", dial: "+242" },
  { code: "RE", name: "Reunion", dial: "+262" },
  { code: "RO", name: "Romania", dial: "+40" },
  { code: "RU", name: "Russia", dial: "+7" },
  { code: "RW", name: "Rwanda", dial: "+250" },
  { code: "BL", name: "Saint Barthelemy", dial: "+590" },
  { code: "SH", name: "Saint Helena", dial: "+290" },
  { code: "KN", name: "Saint Kitts and Nevis", dial: "+1-869" },
  { code: "LC", name: "Saint Lucia", dial: "+1-758" },
  { code: "MF", name: "Saint Martin", dial: "+590" },
  { code: "PM", name: "Saint Pierre and Miquelon", dial: "+508" },
  { code: "VC", name: "Saint Vincent and the Grenadines", dial: "+1-784" },
  { code: "WS", name: "Samoa", dial: "+685" },
  { code: "SM", name: "San Marino", dial: "+378" },
  { code: "ST", name: "Sao Tome and Principe", dial: "+239" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "SN", name: "Senegal", dial: "+221" },
  { code: "RS", name: "Serbia", dial: "+381" },
  { code: "SC", name: "Seychelles", dial: "+248" },
  { code: "SL", name: "Sierra Leone", dial: "+232" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "SX", name: "Sint Maarten", dial: "+1-721" },
  { code: "SK", name: "Slovakia", dial: "+421" },
  { code: "SI", name: "Slovenia", dial: "+386" },
  { code: "SB", name: "Solomon Islands", dial: "+677" },
  { code: "SO", name: "Somalia", dial: "+252" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "SS", name: "South Sudan", dial: "+211" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "SD", name: "Sudan", dial: "+249" },
  { code: "SR", name: "Suriname", dial: "+597" },
  { code: "SJ", name: "Svalbard and Jan Mayen", dial: "+47" },
  { code: "SZ", name: "Swaziland", dial: "+268" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "SY", name: "Syria", dial: "+963" },
  { code: "TW", name: "Taiwan", dial: "+886" },
  { code: "TJ", name: "Tajikistan", dial: "+992" },
  { code: "TZ", name: "Tanzania", dial: "+255" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "TG", name: "Togo", dial: "+228" },
  { code: "TK", name: "Tokelau", dial: "+690" },
  { code: "TO", name: "Tonga", dial: "+676" },
  { code: "TT", name: "Trinidad and Tobago", dial: "+1-868" },
  { code: "TN", name: "Tunisia", dial: "+216" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "TM", name: "Turkmenistan", dial: "+993" },
  { code: "TC", name: "Turks and Caicos Islands", dial: "+1-649" },
  { code: "TV", name: "Tuvalu", dial: "+688" },
  { code: "VI", name: "U.S. Virgin Islands", dial: "+1-340" },
  { code: "UG", name: "Uganda", dial: "+256" },
  { code: "UA", name: "Ukraine", dial: "+380" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "UY", name: "Uruguay", dial: "+598" },
  { code: "UZ", name: "Uzbekistan", dial: "+998" },
  { code: "VU", name: "Vanuatu", dial: "+678" },
  { code: "VA", name: "Vatican", dial: "+379" },
  { code: "VE", name: "Venezuela", dial: "+58" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "WF", name: "Wallis and Futuna", dial: "+681" },
  { code: "EH", name: "Western Sahara", dial: "+212" },
  { code: "YE", name: "Yemen", dial: "+967" },
  { code: "ZM", name: "Zambia", dial: "+260" },
  { code: "ZW", name: "Zimbabwe", dial: "+263" }
];

function BookingForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const nameParam = searchParams.get("name") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country_code: "US",
    preferred_date: "",
    preferred_time: "",
    consultation_notes: "",
    accept_terms: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: nameParam,
      email: emailParam
    }));
  }, [nameParam, emailParam]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to book appointment.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <CheckCircle size={64} color="#5F7D67" style={{ margin: "0 auto 20px" }} />
        <h2 style={{ color: "#1F2B22", fontSize: "24px", marginBottom: "16px" }}>Consultation Requested!</h2>
        <p style={{ color: "#63716b", fontSize: "16px", maxWidth: "400px", margin: "0 auto" }}>
          Thank you, {formData.name || "for reaching out"}. Your consultation request has been securely submitted. A clinical matching expert from Sora Fertility will contact you shortly to confirm your appointment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {error && (
        <div style={{ padding: "12px", background: "#fef2f2", color: "#b91c1c", borderRadius: "8px", fontSize: "14px", border: "1px solid #f87171" }}>
          {error}
        </div>
      )}

      {/* Personal Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>Full Name</label>
          <div style={{ position: "relative" }}>
            <User size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "11px" }} />
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 10px 10px 38px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              placeholder="Jane Doe"
            />
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>Email Address</label>
          <div style={{ position: "relative" }}>
            <Mail size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "11px" }} />
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 10px 10px 38px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box", backgroundColor: emailParam ? "#f3f4f6" : "white" }}
              placeholder="jane@example.com"
              readOnly={!!emailParam}
            />
          </div>
        </div>
      </div>

      {/* Phone and Country Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>Country</label>
          <div style={{ position: "relative" }}>
            <select 
              required
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 10px 10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box", appearance: "none", backgroundColor: "white" }}
            >
              <option value="" disabled>Select Country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.dial})
                </option>
              ))}
            </select>
            {/* simple arrow down */}
            <div style={{ position: "absolute", right: "12px", top: "14px", pointerEvents: "none" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>Phone Number</label>
          <div style={{ position: "relative" }}>
            <Phone size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "11px" }} />
            <input 
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 10px 10px 38px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "#e5e7eb", margin: "10px 0" }}></div>

      {/* Booking Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>Preferred Date</label>
          <div style={{ position: "relative" }}>
            <Calendar size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "11px" }} />
            <input 
              required
              type="date"
              name="preferred_date"
              value={formData.preferred_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: "100%", padding: "10px 10px 10px 38px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>Preferred Time</label>
          <div style={{ position: "relative" }}>
            <Clock size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "11px" }} />
            <select 
              required
              name="preferred_time"
              value={formData.preferred_time}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 10px 10px 38px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box", appearance: "none", backgroundColor: "white" }}
            >
              <option value="" disabled>Select a time</option>
              <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
              <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
              <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>Anything specific you'd like to discuss?</label>
        <div style={{ position: "relative" }}>
          <MessageSquare size={18} color="#9ca3af" style={{ position: "absolute", left: "12px", top: "14px" }} />
          <textarea 
            name="consultation_notes"
            value={formData.consultation_notes}
            onChange={handleChange}
            rows={4}
            style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }}
            placeholder="I have questions about my FertiSTAT score..."
          />
        </div>
      </div>

      {/* Terms and Conditions Checkbox */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginTop: "10px" }}>
        <input 
          type="checkbox" 
          id="accept_terms"
          name="accept_terms"
          checked={formData.accept_terms}
          onChange={handleChange}
          required
          style={{ width: "18px", height: "18px", accentColor: "#5F7D67", cursor: "pointer", marginTop: "2px" }}
        />
        <label htmlFor="accept_terms" style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.5", cursor: "pointer" }}>
          I accept the Terms & Conditions and consent to being contacted by a clinical matching expert from Sora Fertility.
        </label>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          marginTop: "10px",
          width: "100%", 
          padding: "14px", 
          background: loading ? "#9ca3af" : "#5F7D67", 
          color: "white", 
          border: "none", 
          borderRadius: "8px", 
          fontSize: "16px", 
          fontWeight: "600", 
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s"
        }}
      >
        {loading ? "Submitting..." : "Confirm Consultation Request"}
      </button>
      
      <p style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", margin: "0" }}>
        Your information is securely encrypted and confidentially stored.
      </p>
    </form>
  );
}

export default function BookAppointmentPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F6", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px", maxWidth: "600px", width: "100%" }}>
        <img src="/sora-logo.png" alt="Sora Fertility" style={{ height: "48px", marginBottom: "16px", display: "block", margin: "0 auto 16px" }} />
        <h1 style={{ color: "#1F2B22", fontSize: "32px", margin: "0 0 12px", fontWeight: "700" }}>Priority Consultation</h1>
        <p style={{ color: "#5F7D67", fontSize: "16px", margin: "0", lineHeight: "1.5" }}>
          Discuss your clinical report with a matching fertility expert.
        </p>
      </div>

      {/* Main Card */}
      <div style={{ background: "white", width: "100%", maxWidth: "600px", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)", padding: "30px", border: "1px solid #e5e7eb" }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Loading booking form...</div>}>
          <BookingForm />
        </Suspense>
      </div>
      
    </div>
  );
}
