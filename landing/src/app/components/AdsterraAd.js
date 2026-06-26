"use client";

import React, { useEffect, useRef } from 'react';
import { getAdKey } from '../../lib/ad-config';

export default function AdsterraAd({ size, className = '' }) {
  const containerRef = useRef(null);
  const key = getAdKey(size);

  useEffect(() => {
    if (!key || !containerRef.current) return;

    // Clear previous contents just in case
    containerRef.current.innerHTML = '';

    // Determine dimensions from size string e.g., "160x300"
    let width = 0;
    let height = 0;
    if (size.includes('x')) {
        const parts = size.split('x');
        width = parseInt(parts[0], 10);
        height = parseInt(parts[1], 10);
    }

    // 1. Create the configuration script
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    const confString = `
      atOptions = {
        'key' : '${key}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    confScript.text = confString;
    containerRef.current.appendChild(confScript);

    // 2. Create the invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
    containerRef.current.appendChild(invokeScript);

  }, [key, size]);

  if (!key) {
    return null;
  }

  return (
    <div className={`ad-slot ${className}`} style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <div ref={containerRef}></div>
    </div>
  );
}
