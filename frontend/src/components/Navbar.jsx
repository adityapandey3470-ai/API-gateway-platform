/**
 * KoreVane™ - Top Navigation Header Bar
 */
import React from 'react';
import { Icons } from './Icons';

export function Navbar({ user, theme, onToggleTheme, onLogout, healthStatus }) {
  return (
    <header className="navbar-header">
      <div className="navbar-brand">
        <Icons.Logo size={32} />
        <div className="navbar-brand-info">
          <span className="navbar-brand-title">KoreVane<span className="brand-dot">.</span></span>
          <span className="navbar-brand-subtitle">Control Plane</span>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Health Indicator */}
        <div className="health-badge-pill" title="Gateway Health Status">
          <span className={`health-dot ${healthStatus === "UP" ? "dot-online" : "dot-offline"}`}></span>
          <span className="health-label">{healthStatus === "UP" ? "System Optimal" : "Degraded"}</span>
        </div>

        {/* Theme Mode Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
        </button>

        {/* User Profile & Sign Out */}
        {user && (
          <div className="navbar-user-block">
            <div className="user-avatar-badge">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-details-mini">
              <span className="user-name-text">{user.username}</span>
              <span className="user-role-text">{user.role}</span>
            </div>
            <button
              className="btn btn-ghost btn-icon-only logout-btn"
              onClick={onLogout}
              title="Sign out of KoreVane"
            >
              <Icons.LogOut />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
