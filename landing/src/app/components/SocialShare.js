"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

// Fallback SVGs since lucide-react is missing these in the current version
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function SocialShare({ title }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only access window.location on the client
    setUrl(window.location.href);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid #cbd5e1',
    background: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const activeStyle = {
    ...buttonStyle,
    background: '#f1f5f9',
    color: '#0f172a',
    borderColor: '#94a3b8'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', marginBottom: '12px' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>Share:</span>
      
      <a 
        href={fbShareUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={buttonStyle}
        onMouseOver={(e) => { e.currentTarget.style.color = '#1877f2'; e.currentTarget.style.borderColor = '#1877f2'; e.currentTarget.style.background = '#e7f0fd'; }}
        onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; }}
        title="Share on Facebook"
      >
        <FacebookIcon />
      </a>

      <a 
        href={twitterShareUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={buttonStyle}
        onMouseOver={(e) => { e.currentTarget.style.color = '#000000'; e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.background = '#f1f5f9'; }}
        onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; }}
        title="Share on X (Twitter)"
      >
        <TwitterIcon />
      </a>

      <a 
        href={linkedinShareUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={buttonStyle}
        onMouseOver={(e) => { e.currentTarget.style.color = '#0a66c2'; e.currentTarget.style.borderColor = '#0a66c2'; e.currentTarget.style.background = '#e6f0f9'; }}
        onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; }}
        title="Share on LinkedIn"
      >
        <LinkedinIcon />
      </a>

      <button 
        onClick={handleCopyLink} 
        style={copied ? activeStyle : buttonStyle}
        onMouseOver={(e) => { if(!copied) { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f1f5f9'; } }}
        onMouseOut={(e) => { if(!copied) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; } }}
        title="Copy Link"
      >
        {copied ? <Check size={18} color="#10b981" /> : <LinkIcon size={18} />}
      </button>
    </div>
  );
}
