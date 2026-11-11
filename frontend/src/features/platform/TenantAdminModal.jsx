/**
 * KoreVane™ - Tenant Admin Management Modal
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
    if (!username) {
      showToast("Username is required.", "error");
      return;
    }
    if (!admin && !password) {
      showToast("Password is required for new admin.", "error");
      return;
    }

    setSaving(true);
    try {
      if (admin) {
        await API.updateTenantAdmin(org.id, username, password || undefined);
        showToast(`Tenant admin "${username}" updated successfully.`, "success");
      } else {
        await API.createTenantAdmin(org.id, username, password);
        showToast(`Tenant admin "${username}" created for ${org.name}.`, "success");
      }
      loadAdmin();
    } catch (err) {
      showToast(err.message || "Failed to save tenant admin.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove the admin for ${org.name}?`)) return;
    setSaving(true);
    try {
      await API.deleteTenantAdmin(org.id);
      showToast(`Tenant admin removed for ${org.name}.`, "success");
      setAdmin(null);
      setUsername("");
      setPassword("");
    } catch (err) {
      showToast(err.message || "Failed to delete tenant admin.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!org) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3>Tenant Admin Manager</h3>
            <p className="modal-subtitle">Scoped administrator for: <strong>{org.name}</strong></p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="table-loading-state">
              <div className="spinner-glow"></div>
              <span>Fetching tenant administrator...</span>
            </div>
          ) : (
            <div>
              {admin ? (
                <div className="admin-status-box mb-4">
                  <div className="admin-status-header">
                    <div className="user-avatar-badge">{admin.username.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="admin-name font-medium">{admin.username}</div>
                      <div className="admin-role text-muted text-xs">Role: {admin.role}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger-ghost btn-sm"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    <Icons.Trash /> Remove
                  </button>
                </div>
              ) : (
                <div className="info-notice-card mb-4">
                  <Icons.Sparkles />
                  <span>No administrator has been assigned to this organization yet.</span>
                </div>
              )}

              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">{admin ? "Update Username" : "Assign Username"}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. acme-admin"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {admin ? "New Password (leave empty to keep current)" : "Initial Password"}
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.Key /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="••••••••••••"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!admin}
                    />
                    <button
                      type="button"
                      className="input-action-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </div>

                <div className="modal-footer px-0 pb-0">
                  <button type="button" className="btn btn-ghost" onClick={onClose}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : admin ? "Update Admin" : "Create Admin User"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
