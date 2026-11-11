/**
 * KoreVane™ - System Settings & Diagnostics View
 * Clean layout without redundant theme toggle (handled in top navbar)
 */
import React from 'react';
import { Icons } from '../../components/Icons';
import { TOUR_KEY } from '../../services/api';

export function SettingsView({ user, onReplayTour, showToast }) {
  const handleClearTourHistory = () => {
    localStorage.removeItem(TOUR_KEY);
    showToast("Onboarding tour reset. It will display on next launch.", "info");
  };

  return (
    <div className="view-container">
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">System Settings</h2>
          <p className="view-subtitle">Platform configuration, guidance tour, and active session diagnostics</p>
        </div>
      </div>

      {/* Onboarding Tour Replay */}
      <div className="settings-section-card mb-4">
        <div className="settings-card-header">
          <Icons.BookOpen />
          <div>
            <h3>Onboarding & Walkthrough</h3>
            <p className="text-secondary text-sm">Re-launch the interactive product tour or reset first-time flags</p>
          </div>
        </div>
        <div className="settings-action-row mt-3 flex items-center gap-2">
          <button className="btn btn-secondary" onClick={onReplayTour}>
            <Icons.Sparkles /> Replay Walkthrough Tour
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
            <span className="info-key">Organization:</span>
            <span className="info-val font-mono">{user ? user.organizationSlug || "Control Plane" : "None"}</span>
          </div>
          <div className="session-info-row">
            <span className="info-key">JWT Access Token:</span>
            <span className="info-val font-mono text-xs token-truncate">
              {user && user.token ? `${user.token.substring(0, 32)}...` : "None"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
