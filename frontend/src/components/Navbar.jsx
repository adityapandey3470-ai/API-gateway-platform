/**
 * KoreVane™ - Top Navigation Header Bar
 * Clean, unified palette, consistent typography & mobile menu toggle
 */
import React from 'react';
import { Icons } from './Icons';

function getAvatarGradient(name = "") {
  const gradients = [
    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", // indigo-violet
    "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)", // sky-blue
    "linear-gradient(135deg, #10b981 0%, #059669 100%)", // emerald
    "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)", // pink-rose
    "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", // amber-orange
    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"  // purple-violet
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function Navbar({ user, theme, onToggleTheme, onLogout, healthStatus, onToggleMobileMenu }) {
  const username = user && user.username ? user.username : "User";
  const initial = username.charAt(0).toUpperCase();

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
            <div
              className="user-avatar-badge"
              style={{ background: getAvatarGradient(username) }}
              title={username}
            >
              {initial}
            </div>
            <div className="user-details-mini">
              <span className="user-name-text">{username}</span>
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
