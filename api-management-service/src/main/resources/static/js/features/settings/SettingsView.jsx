/**
 * KoreVane™ - System Settings & Diagnostics View
 */
(function(window) {
  'use strict';

  function SettingsView({ user, theme, setTheme, onReplayTour, showToast }) {
    const Icons = window.KoreVaneIcons;
    const API = window.KoreVaneAPI;

    const handleClearTourHistory = () => {
      localStorage.removeItem(API.TOUR_KEY);
      showToast("Onboarding tour reset. It will display on next launch.", "info");
    };

    return (
      <div className="view-container">
        <div className="view-header-bar">
          <div>
            <h2 className="view-title">System Settings & Preferences</h2>
            <p className="view-subtitle">Appearance, active credentials session, and control plane diagnostics</p>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="settings-section-card mb-4">
          <div className="settings-card-header">
            <Icons.Sun />
            <div>
              <h3>Display Theme Mode</h3>
              <p className="text-secondary text-sm">Customize dark or light aesthetic mode</p>
            </div>
          </div>
          <div className="theme-options-grid mt-3">
            <button
              className={`theme-selector-box ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              <div className="theme-preview-dark"></div>
              <span>Dark Theme (Night Matrix)</span>
            </button>

            <button
              className={`theme-selector-box ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
            >
              <div className="theme-preview-light"></div>
              <span>Light Theme (Solar Clean)</span>
            </button>
          </div>
        </div>

        {/* Onboarding Tour Replay */}
        <div className="settings-section-card mb-4">
          <div className="settings-card-header">
            <Icons.BookOpen />
            <div>
              <h3>Onboarding & Guidance</h3>
              <p className="text-secondary text-sm">Re-launch the product tour or reset first-time flags</p>
            </div>
          </div>
          <div className="settings-action-row mt-3">
            <button className="btn btn-secondary" onClick={onReplayTour}>
              <Icons.Sparkles /> Replay Interactive Tour
            </button>
            <button className="btn btn-ghost" onClick={handleClearTourHistory}>
              Reset Tour Status
            </button>
          </div>
        </div>

        {/* Active Session Diagnostics */}
        <div className="settings-section-card">
          <div className="settings-card-header">
            <Icons.Shield />
            <div>
              <h3>Active Session Credentials</h3>
              <p className="text-secondary text-sm">Current authenticated context in sessionStorage</p>
            </div>
          </div>
          <div className="session-info-table mt-3">
            <div className="session-info-row">
              <span className="info-key">User Principal:</span>
              <span className="info-val font-semibold">{user ? user.username : "Anonymous"}</span>
            </div>
            <div className="session-info-row">
              <span className="info-key">Granted Authority:</span>
              <span className="info-val font-mono">{user ? user.role : "None"}</span>
            </div>
            <div className="session-info-row">
              <span className="info-key">Organization Slug:</span>
              <span className="info-val font-mono">{user ? user.organizationSlug || "N/A" : "N/A"}</span>
            </div>
            <div className="session-info-row">
              <span className="info-key">JWT Access Token:</span>
              <span className="info-val font-mono text-xs token-truncate">
                {user && user.token ? `${user.token.substring(0, 36)}...` : "None"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.KoreVaneSettingsView = SettingsView;
})(window);
