import { bridgeToMetaPixel } from "./meta-pixel.js";

export function getSoraSessionId() {
  if (typeof window === "undefined") return "server-side";
  
  let sid = localStorage.getItem("sora_sid");
  if (!sid) {
    // Generate a random session ID
    sid = "SRA_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    localStorage.setItem("sora_sid", sid);
  }
  return sid;
}

export async function trackEvent({ event, tool, metadata = {} }) {
  if (typeof window === "undefined") return;

  const sessionId = getSoraSessionId();
  
  const payload = {
    session_id: sessionId,
    event_name: event,
    tool_name: tool,
    url: window.location.href,
    metadata
  };

  // 1. Push to Google Tag Manager DataLayer if available
  if (window.dataLayer) {
    window.dataLayer.push({
      event: event,
      tool: tool,
      sora_sid: sessionId,
      ...metadata
    });
  } else {
    // Initialize dataLayer if it doesn't exist yet
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: event,
      tool: tool,
      sora_sid: sessionId,
      ...metadata
    });
  }

  // 2. Push to internal SORA API for Growth Intelligence Dashboard
  try {
    // Use keepalive or sendBeacon to ensure the event sends even if navigating away
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });
    }
  } catch (error) {
    console.error("Failed to track event:", error);
  }

  // 3. Bridge to Meta Pixel
  bridgeToMetaPixel(event, tool, metadata);
}
