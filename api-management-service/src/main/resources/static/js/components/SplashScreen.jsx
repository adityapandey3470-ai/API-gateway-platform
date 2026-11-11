/**
 * KoreVane™ - Instagram-style App Launch Splash Screen
 */
(function(window) {
  'use strict';

  function SplashScreen({ onFinish }) {
    const [fading, setFading] = React.useState(false);

    React.useEffect(() => {
      // Allow the launch animation to play smoothly (1.4 seconds) then fade out
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
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#06b6d4"/>
              </linearGradient>
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* KoreVane Outer Hex Shield */}
            <polygon points="50,6 90,26 90,74 50,94 10,74 10,26" stroke="url(#splashGrad)" strokeWidth="4" fill="rgba(99, 102, 241, 0.08)" />
            {/* Directional Vanes */}
            <path d="M26 34 L50 50 L50 78 L26 62 Z" fill="url(#splashGrad)" filter="url(#glowFilter)" />
            <path d="M74 34 L50 50 L50 78 L74 62 Z" fill="url(#splashGrad)" opacity="0.8" />
            {/* Radiant Central Core */}
            <circle cx="50" cy="50" r="9" fill="#ffffff" filter="drop-shadow(0 0 8px #06b6d4)" />
            <circle cx="50" cy="50" r="4" fill="#6366f1" />
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

  window.KoreVaneSplashScreen = SplashScreen;
})(window);
