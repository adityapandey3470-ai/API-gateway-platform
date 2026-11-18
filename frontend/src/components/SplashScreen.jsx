import React, { useState, useEffect } from 'react';

export function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1400);

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div id="korevane-splash" className={fading ? "splash-fade-out" : ""}>
      <div className="splash-logo-container">
        <svg className="splash-logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8"/>
              <stop offset="50%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect x="8" y="8" width="84" height="84" rx="24" stroke="url(#splashGrad)" strokeWidth="4" fill="rgba(99, 102, 241, 0.08)" />
          <rect x="28" y="24" width="10" height="52" rx="5" fill="url(#splashGrad)" filter="url(#glowFilter)" />
          <path d="M42 46 L64 26 C66.5 23.5 71 25.5 71 29 L71 34 C71 36.5 69.5 38.5 67.5 40 L52 52 Z" fill="#8b5cf6" />
          <path d="M42 54 L68 74 C70 75.5 71 77.5 71 80 L71 85 C71 88.5 66.5 90.5 64 88 L42 68 Z" fill="#38bdf8" />
          <circle cx="48" cy="50" r="5" fill="#ffffff" filter="drop-shadow(0 0 8px #8b5cf6)" />
        </svg>
        <div className="splash-brand-text">KoreVane™</div>
        <div className="splash-tagline">Intelligent Microservices Gateway & Control Plane</div>
        <div className="splash-loader-bar">
          <div className="splash-loader-indicator"></div>
        </div>
      </div>
    </div>
  );
}
