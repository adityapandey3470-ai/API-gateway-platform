/**
 * KoreVane™ - System Settings & Diagnostics View
 * Modular section layout with essential, normal controls
 */
import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { API, TOUR_KEY } from '../../services/api';

const SUPPORT_EMAIL = "support0912@gmail.com";

export function SettingsView({ user, onReplayTour, showToast }) {
  const userRole = user && user.role ? (user.role.startsWith("ROLE_") ? user.role : `ROLE_${user.role}`) : "";
  const isTenantAdmin = userRole === "ROLE_TENANT_ADMIN";

  // Active section
  const [activeSection, setActiveSection] = useState(isTenantAdmin ? "profile" : "report-bug");

  // Organization profile
  const [orgData, setOrgData] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [savingOrg, setSavingOrg] = useState(false);

  // Normal, simple bug report state
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");

  useEffect(() => {
    if (isTenantAdmin) {
      API.getMyOrganization()
        .then((data) => {
          if (data) {
            setOrgData(data);
            setOrgName(data.name || "");
          }
        })
        .catch(() => {});
    }
  }, [isTenantAdmin]);

  const handleCopySupportEmail = () => {
    navigator.clipboard?.writeText(SUPPORT_EMAIL);
    showToast(`Support email (${SUPPORT_EMAIL}) copied!`, "success");
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

  // Normal simple bug send via Gmail
  const handleSendBugViaGmail = (e) => {
    e.preventDefault();
    if (!bugTitle.trim()) {
      showToast("Please enter a bug title/subject.", "error");
      return;
    }
    if (!bugDescription.trim()) {
      showToast("Please enter a description.", "error");
      return;
    }

    const subject = `[Bug Report] ${bugTitle.trim()}`;
    const body = `Bug Title: ${bugTitle.trim()}\n\nUser: ${user?.username || "User"} (${userRole || "Admin"})\nOrganization: ${user?.organizationSlug || orgData?.slug || "Control Plane"}\n\nDescription:\n${bugDescription.trim()}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const opened = window.open(gmailUrl, "_blank", "noopener,noreferrer");

    if (!opened) {
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    showToast(`Opening Gmail for ${SUPPORT_EMAIL}...`, "success");
  };

  const navSections = [
    ...(isTenantAdmin ? [{
      id: "profile",
      label: "Organization Profile",
      icon: <Icons.Building />
    }] : [{
      id: "profile",
      label: "Account Identity",
      icon: <Icons.Users />
    }]),
    {
      id: "report-bug",
      label: "Report a Bug",
      icon: <Icons.Bug />
    },
    {
      id: "support",
      label: "Contact & Support",
      icon: <Icons.Mail />
    },
    {
      id: "tour",
      label: "Onboarding Tour",
      icon: <Icons.BookOpen />
    },
    {
      id: "policy",
      label: "Privacy Policy",
      icon: <Icons.Shield />
    },
    {
      id: "diagnostics",
      label: "Session Diagnostics",
      icon: <Icons.Activity />
    }
  ];

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">Settings</h2>
          <p className="view-subtitle">Manage preferences, support, and account details</p>
        </div>
      </div>

      {/* Modular Settings Layout */}
      <div className="settings-modular-layout">
        {/* Navigation Tabs */}
        <nav className="settings-nav-sidebar">
          <div className="settings-nav-list">
            {navSections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                className={`settings-nav-tab ${activeSection === sec.id ? "active" : ""}`}
                onClick={() => setActiveSection(sec.id)}
              >
                <span className="settings-tab-icon">{sec.icon}</span>
                <span className="settings-tab-title">{sec.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Selected Section Content Panel */}
        <div className="settings-content-panel">
          {/* Organization Profile */}
          {activeSection === "profile" && (
            <div className="settings-section-card">
              <div className="settings-card-header">
                {isTenantAdmin ? <Icons.Building /> : <Icons.Users />}
                <div>
                  <h3>{isTenantAdmin ? "Tenant Organization Profile" : "Account Identity"}</h3>
                  <p className="text-secondary text-sm">
                    {isTenantAdmin ? "Update your organization display name" : "Your current account credentials"}
                  </p>
                </div>
              </div>

              {isTenantAdmin && orgData ? (
                <form onSubmit={handleUpdateOrgName} className="mt-4">
                  <div className="form-group mb-3">
                    <label className="form-label">Organization Slug</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      value={orgData.slug || ""}
                      disabled
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Organization Name"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={savingOrg}>
                      {savingOrg ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="session-info-table mt-4">
                  <div className="session-info-row">
                    <span className="info-key">Username:</span>
                    <span className="info-val font-semibold">{user?.username || "Administrator"}</span>
                  </div>
                  <div className="session-info-row">
                    <span className="info-key">Role:</span>
                    <span className="info-val font-mono">{userRole || "Platform Admin"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Report a Bug (Clean, Normal, Simple) */}
          {activeSection === "report-bug" && (
            <div className="settings-section-card">
              <div className="settings-card-header">
                <Icons.Bug />
                <div>
                  <h3>Report a Bug</h3>
                  <p className="text-secondary text-sm">
                    Submit bugs directly to <strong>{SUPPORT_EMAIL}</strong>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendBugViaGmail} className="mt-4">
                <div className="form-group mb-3">
                  <label className="form-label">Issue Title / Subject *</label>
                  <input
                    type="text"
                    className="form-input bug-input-rect"
                    placeholder="e.g. Route not saving properly"
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Description *</label>
                  <div className="bug-description-card">
                    <textarea
                      className="bug-textarea"
                      rows="6"
                      placeholder="Describe what happened or what error occurred..."
                      value={bugDescription}
                      onChange={(e) => setBugDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-muted">
                    Opens Gmail with pre-filled details to <strong>{SUPPORT_EMAIL}</strong>
                  </span>
                  <button type="submit" className="btn btn-primary">
                    <Icons.Mail /> Send via Gmail
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Contact & Support */}
          {activeSection === "support" && (
            <div className="settings-section-card">
              <div className="settings-card-header">
                <Icons.Mail />
                <div>
                  <h3>Contact & Developer Support</h3>
                  <p className="text-secondary text-sm">Direct email support and technical assistance</p>
                </div>
              </div>

              <div className="support-card-container mt-4">
                <div className="support-info-box">
                  <div className="support-email-group">
                    <span className="support-label">Support Email</span>
                    <div className="support-email-badge">
                      <span className="font-mono font-semibold">{SUPPORT_EMAIL}</span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-icon-only"
                        onClick={handleCopySupportEmail}
                        title="Copy email"
                      >
                        <Icons.Copy />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="support-action-box">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=KoreVane%20Support`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    <Icons.Mail /> Open in Gmail
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Onboarding Tour */}
          {activeSection === "tour" && (
            <div className="settings-section-card">
              <div className="settings-card-header">
                <Icons.BookOpen />
                <div>
                  <h3>Onboarding Tour</h3>
                  <p className="text-secondary text-sm">Replay the introductory walkthrough tour</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button className="btn btn-secondary" onClick={onReplayTour}>
                  <Icons.Sparkles /> Replay Tour
                </button>
                <button className="btn btn-ghost" onClick={handleClearTourHistory}>
                  Reset Tour Flag
                </button>
              </div>
            </div>
          )}

          {/* Privacy Policy */}
          {activeSection === "policy" && (
            <div className="settings-section-card">
              <div className="settings-card-header">
                <Icons.Shield />
                <div>
                  <h3>Privacy & Security</h3>
                  <p className="text-secondary text-sm">Core platform security and isolation policies</p>
                </div>
              </div>

              <div className="policy-cards-grid mt-4">
                <div className="policy-item-card">
                  <div className="policy-item-title">Zero-Retention Credentials</div>
                  <p className="policy-item-text">Tokens are kept in browser memory and cleared on sign-out.</p>
                </div>
                <div className="policy-item-card">
                  <div className="policy-item-title">Tenant Isolation</div>
                  <p className="policy-item-text">Organizations operate strictly in isolated namespaces.</p>
                </div>
                <div className="policy-item-card">
                  <div className="policy-item-title">Audit Records</div>
                  <p className="policy-item-text">All modifications produce tamper-evident audit logs.</p>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostics */}
          {activeSection === "diagnostics" && (
            <div className="settings-section-card">
              <div className="settings-card-header">
                <Icons.Activity />
                <div>
                  <h3>Session Diagnostics</h3>
                  <p className="text-secondary text-sm">Current session details</p>
                </div>
              </div>

              <div className="session-info-table mt-4">
                <div className="session-info-row">
                  <span className="info-key">User Principal:</span>
                  <span className="info-val font-semibold">{user?.username || "Anonymous"}</span>
                </div>
                <div className="session-info-row">
                  <span className="info-key">Granted Authority:</span>
                  <span className="info-val font-mono">{user?.role || "None"}</span>
                </div>
                <div className="session-info-row">
                  <span className="info-key">Organization:</span>
                  <span className="info-val font-mono">{user?.organizationSlug || "Control Plane"}</span>
                </div>
                <div className="session-info-row">
                  <span className="info-key">Support Email:</span>
                  <span className="info-val font-mono">{SUPPORT_EMAIL}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
