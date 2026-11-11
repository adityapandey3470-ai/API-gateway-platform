/**
 * KoreVane™ - Authentication & Demo Autofill View
 */
import React, { useState } from 'react';
import { Icons } from '../../components/Icons';
import { API } from '../../services/api';

export function LoginView({ onLoginSuccess, showToast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      showToast("Please enter both username and password.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await API.login(username, password);
      API.setSession(response);
      showToast(`Welcome back, ${response.username}!`, "success");
      onLoginSuccess(response);
    } catch (err) {
      showToast(err.message || "Invalid credentials. Please verify your password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card-container">
        <div className="login-brand-header">
          <div className="login-logo-orb">
            <Icons.Logo size={42} />
          </div>
          <h1 className="login-title">Sign in to KoreVane</h1>
          <p className="login-subtitle">Intelligent API Gateway Control Plane</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-with-icon">
              <span className="input-icon"><Icons.Users /></span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. platform-admin or tenant admin"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <span className="input-icon"><Icons.Key /></span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-shine" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Control Plane"}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="login-demo-shortcuts">
          <div className="demo-shortcuts-label">
            <Icons.Sparkles /> Quick Access Demo Accounts
          </div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="btn-demo-chip"
              onClick={() => handleQuickLogin("platform-admin", "platform123")}
            >
              <span className="demo-chip-role">Platform Admin</span>
              <span className="demo-chip-user">platform-admin / platform123</span>
            </button>

            <button
              type="button"
              className="btn-demo-chip"
              onClick={() => handleQuickLogin("foodfast-admin", "foodfast123")}
            >
              <span className="demo-chip-role">Tenant: FoodFast</span>
              <span className="demo-chip-user">foodfast-admin / foodfast123</span>
            </button>

            <button
              type="button"
              className="btn-demo-chip"
              onClick={() => handleQuickLogin("quickshop-admin", "quickshop123")}
            >
              <span className="demo-chip-role">Tenant: QuickShop</span>
              <span className="demo-chip-user">quickshop-admin / quickshop123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
