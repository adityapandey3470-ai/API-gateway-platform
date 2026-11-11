/**
 * KoreVane™ - Authentication View
 * Clean, production-grade login form
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
    if (!username.trim() || !password) {
      showToast("Please enter both username and password.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await API.login(username.trim(), password);
      API.setSession(response);
      showToast(`Welcome back, ${response.username}!`, "success");
      onLoginSuccess(response);
    } catch (err) {
      showToast(err.message || "Invalid credentials. Please verify your password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card-container">
        <div className="login-brand-header">
          <div className="login-logo-orb">
            <Icons.Logo size={44} />
          </div>
          <h1 className="login-title">Sign in to KoreVane</h1>
          <p className="login-subtitle">API Gateway & Control Plane Management</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username</label>
            <div className="input-with-icon">
              <span className="input-icon"><Icons.Users /></span>
              <input
                id="login-username"
                type="text"
                className="form-input"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <span className="input-icon"><Icons.Key /></span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
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
                tabIndex="-1"
              >
                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
