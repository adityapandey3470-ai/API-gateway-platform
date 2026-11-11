/**
 * KoreVane™ - Top Navigation Header Bar
 * Clean, unified palette, consistent typography & mobile menu toggle
 */
import React from 'react';
import { Icons } from './Icons';

export function Navbar({ user, theme, onToggleTheme, onLogout, healthStatus, onToggleMobileMenu }) {
  return (
    <header className="navbar-header">
      <div className="navbar-left">
        {onToggleMobileMenu && (
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle Navigation"
          >
            <Icons.Filter />
          </button>
        )}
        <div className="navbar-brand">
          <Icons.Logo size={28} />
          <div className="navbar-brand-info">
            <span className="navbar-brand-title">KoreVane<span className="brand-dot">.</span></span>
            <span className="navbar-brand-subtitle">Control Plane</span>
          </div>
        </div>
      </div>

      <div className="navbar-actions">
        {/* System Health Indicator */}
        <div className="health-badge-pill" title="Gateway Health Status">
          <span className={`health-dot ${healthStatus === "UP" ? "dot-online" : "dot-offline"}`}></span>
          <span className="health-label">{healthStatus === "UP" ? "System Optimal" : "Degraded"}</span>
        </div>

        {/* Theme Mode Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle theme"
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
              <span className="user-role-badge">
                {user.role ? user.role.replace("ROLE_", "") : "USER"}
              </span>
            </div>
            <button
              className="logout-action-btn"
              onClick={onLogout}
              title="Sign out"
              aria-label="Sign out"
            >
              <Icons.LogOut />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
