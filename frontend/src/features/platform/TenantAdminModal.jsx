/**
 * KoreVane™ - Tenant Admin Management Modal
 * Responsive, clean UI matching design system with zero unstyled artifacts
 */
import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { API } from '../../services/api';

export function TenantAdminModal({ org, onClose, showToast }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAdmin = async () => {
    try {
      setLoading(true);
      const data = await API.getTenantAdmin(org.id);
      setAdmin(data);
      if (data) {
        setUsername(data.username);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (org) loadAdmin();
  }, [org]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast("Username is required.", "error");
      return;
    }
    if (!admin && !password) {
      showToast("Password is required for new administrator.", "error");
      return;
    }

    setSaving(true);
    try {
      if (admin) {
        await API.updateTenantAdmin(org.id, username.trim(), password || undefined);
        showToast(`Tenant admin "${username.trim()}" updated successfully.`, "success");
      } else {
        await API.createTenantAdmin(org.id, username.trim(), password);
        showToast(`Tenant admin "${username.trim()}" created for ${org.name}.`, "success");
      }
      setPassword("");
      loadAdmin();
    } catch (err) {
      showToast(err.message || "Failed to save tenant administrator.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove the administrator for ${org.name}?`)) return;
    setSaving(true);
    try {
      await API.deleteTenantAdmin(org.id);
      showToast(`Tenant administrator removed for ${org.name}.`, "success");
      setAdmin(null);
      setUsername("");
      setPassword("");
    } catch (err) {
      showToast(err.message || "Failed to delete tenant administrator.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!org) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card tenant-admin-modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className="modal-category-tag">Access Control</span>
            <h3 className="modal-title">Tenant Admin Manager</h3>
            <p className="modal-subtitle">
              Scoped administrator for: <span className="tenant-org-pill">{org.name}</span>
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <Icons.X />
          </button>
        </div>

        {/* Modal Body & Form */}
        <form onSubmit={handleSave} className="modal-form-layout">
          <div className="modal-body">
            {loading ? (
              <div className="table-loading-state py-8">
                <div className="spinner-glow"></div>
                <span>Checking organization administrator...</span>
              </div>
            ) : (
              <>
                {/* Active Admin Card or Empty Notice (No Big Star) */}
                {admin ? (
                  <div className="tenant-admin-current-card">
                    <div className="tenant-admin-meta-row">
                      <div className="user-avatar-badge" title={admin.username}>
                        {admin.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="tenant-admin-profile">
                        <div className="tenant-admin-name">{admin.username}</div>
                        <div className="tenant-admin-role-tags">
                          <span className="tenant-role-badge">{admin.role || "TENANT_ADMIN"}</span>
                          <span className="tenant-status-dot"></span>
                          <span className="tenant-status-text">Active</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger-ghost btn-sm remove-admin-btn"
                      onClick={handleDelete}
                      disabled={saving}
                      title="Remove this administrator"
                    >
                      <Icons.Trash />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <div className="tenant-notice-banner">
                    <div className="tenant-notice-icon">
                      <Icons.Shield />
                    </div>
                    <div className="tenant-notice-body">
                      <span className="tenant-notice-title">No administrator assigned yet</span>
                      <span className="tenant-notice-desc">
                        Create an admin credential to grant this tenant access to route management and audit trails.
                      </span>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="form-group">
                  <label className="form-label">
                    {admin ? "Update Username" : "Assign Username"}
                    <span className="form-label-required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.Users /></span>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="e.g. acme-admin"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {admin ? "New Password" : "Initial Password"}
                    {!admin && <span className="form-label-required">*</span>}
                    {admin && <span className="form-label-hint">(leave blank to keep current)</span>}
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.Key /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder={admin ? "•••••••••••• (unchanged)" : "••••••••••••"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!admin}
                    />
                    <button
                      type="button"
                      className="input-action-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                  <span className="form-helper-text">
                    {admin
                      ? "Only fill this if you want to reset the admin password."
                      : "Used by the tenant to sign into their dedicated control plane."}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          {!loading && (
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
                Close
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : admin ? "Update Admin Credentials" : "Create Admin User"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
