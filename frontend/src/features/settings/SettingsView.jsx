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
  const userRole = user && user.role ? (user.role.startsWith("ROLE_") ? user.role : `ROLE_${user.role}`) : "";

  useEffect(() => {
    if (userRole === "ROLE_TENANT_ADMIN") {
      API.getMyOrganization()
        .then((data) => {
          if (data) {
            setOrgData(data);
            setOrgName(data.name || "");
          }
        })
        .catch(() => {});
    }
  }, [userRole]);

  const handleCopySupportEmail = () => {
    navigator.clipboard.writeText("support0912@gmail.com");
    showToast("Support email (support0912@gmail.com) copied to clipboard!", "success");
  };

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
      {userRole === "ROLE_TENANT_ADMIN" && orgData && (
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

      {/* Contact & Support Section */}
      <div className="settings-section-card mb-4">
        <div className="settings-card-header">
          <Icons.Mail />
          <div>
            <h3>Contact & Developer Support</h3>
            <p className="text-secondary text-sm">Direct technical assistance, incident response, and developer inquiries</p>
          </div>
        </div>

        <div className="support-card-container mt-3">
          <div className="support-info-box">
            <div className="support-email-group">
              <span className="support-label">Engineering Desk</span>
              <div className="support-email-badge">
                <span className="font-mono font-semibold">support0912@gmail.com</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-icon-only"
                  onClick={handleCopySupportEmail}
                  title="Copy email to clipboard"
                >
                  <Icons.Copy />
                </button>
              </div>
            </div>
            <div className="support-meta-tags">
              <span className="support-tag-pill">
                <span className="status-dot online"></span> 24/7 Monitoring
              </span>
              <span className="support-tag-pill">
                SLA: &lt; 2 Hours
              </span>
            </div>
          </div>
          <div className="support-action-box">
            <a
              href="mailto:support0912@gmail.com?subject=KoreVane%20Platform%20Support"
              className="btn btn-primary"
            >
              <Icons.Mail /> Send Email
            </a>
          </div>
        </div>
      </div>

      {/* Privacy & Governance Policy Section */}
      <div className="settings-section-card mb-4">
        <div className="settings-card-header">
          <Icons.Shield />
          <div>
            <h3>Privacy & Data Governance Policy</h3>
            <p className="text-secondary text-sm">Enterprise security standards, credential safety, and data isolation</p>
          </div>
        </div>

        <div className="policy-cards-grid mt-3">
          <div className="policy-item-card">
            <div className="policy-item-title">
              <span className="policy-bullet-num">01</span>
              Zero-Retention Credentials
            </div>
            <p className="policy-item-text">
              JWT tokens and user sessions are held exclusively in browser memory (sessionStorage). No credentials or authentication keys are persisted on third-party tracking disks.
            </p>
          </div>

          <div className="policy-item-card">
            <div className="policy-item-title">
              <span className="policy-bullet-num">02</span>
              Strict Multi-Tenant Isolation
            </div>
            <p className="policy-item-text">
              Each tenant organization operates inside a cryptographically isolated namespace. Cross-tenant route dispatching and configuration inspection are blocked by database constraints.
            </p>
          </div>

          <div className="policy-item-card">
            <div className="policy-item-title">
              <span className="policy-bullet-num">03</span>
              Immutable Audit Records
            </div>
            <p className="policy-item-text">
              All route provisioning, policy toggles, status changes, and administrator lifecycle actions produce tamper-evident audit records with nanosecond timestamps.
            </p>
          </div>

          <div className="policy-item-card">
            <div className="policy-item-title">
              <span className="policy-bullet-num">04</span>
              Zero-Trust Traffic Ingress
            </div>
            <p className="policy-item-text">
              Proxy requests passing through Smart Gateway workers are continuously verified against Ant-path matching, token signatures, and distributed Redis rate-limiting rules.
            </p>
          </div>
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
