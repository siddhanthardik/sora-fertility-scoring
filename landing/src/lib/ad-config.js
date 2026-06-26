// src/lib/ad-config.js

// Place your Adsterra keys here as you get them from the dashboard.
// Leave as empty string '' if you don't have the key yet.

export const ADSTERRA_KEYS = {
  // Desktop Sidebar
  '160x300': '64d2088d08bf5c930a7efa35e9b9b424',
  
  // Desktop Inline Banner
  '468x60': 'a4a3b6b4af26ff6e5d6d0989ece51798',
  
  // Desktop/Tablet Leaderboard (below results)
  '728x90': 'c274125f4a64e7be95c3e608b3507966',
  
  // Mobile Inline Banner
  '320x50': '', // UPDATE WITH ACTUAL KEY WHEN ACQUIRED FROM DASHBOARD. '29796552' is the Ad Unit ID from the screenshot, but we need the hash key. For now we will leave it as placeholder and it won't render or will error gracefully if Adsterra component handles it. Wait, the screenshot shows 29796552 as ID, not key. Let's just leave empty.
  
  // Desktop Tall Sidebar
  '160x600': '',
  
  // High CTR Results Box (Mobile/Desktop)
  '300x250': 'c67813f01ad8c87b201c67dea48a2694',
  
  // Native Banner
  'native': ''
};

export const getAdKey = (size) => {
    return ADSTERRA_KEYS[size] || null;
};
