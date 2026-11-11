/**
 * KoreVane™ - System Settings & Diagnostics View
 * Clean layout with Tenant Organization Profile management & Session Diagnostics
 */
import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { API, TOUR_KEY } from '../../services/api';

export function SettingsView({ user, onReplayTour, showToast }) {
  const [orgData, setOrgData] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [savingOrg, setSavingOrg] = useState(false);

  useEffect(() => {
    if (user && user.role !== "ROLE_PLATFORM_ADMIN") {
      API.getMyOrganization()
        .then((data) => {
          if (data) {
            setOrgData(data);
            setOrgName(data.name || "");
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleClearTourHistory = () => {
    localStorage.removeItem(TOUR_KEY);
    showToast("Onboarding tour reset. It will display on next launch.", "info");
  };

  const handleUpdateOrgName = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) {
      showToast("Organization name cannot be empty.", "error");
      return;
    }
    setSavingOrg(true);
    try {
      const updated = await API.updateMyOrganization(orgName.trim());
      setOrgData(updated);
      showToast(`Organization name updated to "${orgName.trim()}".`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update organization name.", "error");
    } finally {
      setSavingOrg(false);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">System Settings</h2>
          <p className="view-subtitle">Platform configuration, guidance tour, and active session diagnostics</p>
        </div>
      </div>

      {/* Tenant Organization Profile (if Tenant Admin) */}
      {user && user.role !== "ROLE_PLATFORM_ADMIN" && orgData && (
        <div className="settings-section-card mb-4">
          <div className="settings-card-header">
            <Icons.Building />
            <div>
              <h3>Tenant Organization Profile</h3>
              <p className="text-secondary text-sm">Manage your organization's legal name and namespace identity</p>
            </div>
          </div>
          <form onSubmit={handleUpdateOrgName} className="mt-3">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Organization Slug (Fixed Namespace)</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={orgData.slug || ""}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Organization Display Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter organization name"
                  required
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button type="submit" className="btn btn-primary btn-sm" disabled={savingOrg}>
                {savingOrg ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

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
            <span className="info-key">Session Status:</span>
            <span className="info-val font-semibold text-xs text-success">
              {user && user.token ? "Active & Authenticated" : "Signed Out"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
