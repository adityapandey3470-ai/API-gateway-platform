import React from 'react';
import { Icons } from './Icons';

export function Sidebar({ currentTab, setTab, user, mobileOpen, onCloseMobile }) {
  const rawRole = user ? user.role : null;
  const role = rawRole && rawRole.startsWith("ROLE_") ? rawRole : `ROLE_${rawRole}`;

  let navItems = [];
  if (role === "ROLE_PLATFORM_ADMIN") {
    navItems = [
      { id: "overview", label: "Overview", icon: <Icons.Dashboard /> },
      { id: "organizations", label: "Organizations", icon: <Icons.Building /> },
      { id: "guide", label: "User Guide", icon: <Icons.BookOpen /> },
      { id: "settings", label: "Settings", icon: <Icons.Settings /> }
    ];
  } else if (role === "ROLE_TENANT_ADMIN") {
    navItems = [
      { id: "overview", label: "Overview", icon: <Icons.Dashboard /> },
      { id: "routes", label: "API Routes", icon: <Icons.Route /> },
      { id: "audit", label: "Audit Trail", icon: <Icons.History /> },
      { id: "guide", label: "User Guide", icon: <Icons.BookOpen /> },
      { id: "settings", label: "Settings", icon: <Icons.Settings /> }
    ];
  } else if (role === "ROLE_GATEWAY_SERVICE") {
    navItems = [
      { id: "overview", label: "Overview", icon: <Icons.Dashboard /> },
      { id: "gateway-routes", label: "Gateway Live", icon: <Icons.Activity /> },
      { id: "guide", label: "User Guide", icon: <Icons.BookOpen /> },
      { id: "settings", label: "Settings", icon: <Icons.Settings /> }
    ];
  } else {
    navItems = [
      { id: "overview", label: "Overview", icon: <Icons.Dashboard /> },
      { id: "guide", label: "User Guide", icon: <Icons.BookOpen /> },
      { id: "settings", label: "Settings", icon: <Icons.Settings /> }
    ];
  }

  const handleSelectTab = (id) => {
    setTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop-mobile" onClick={onCloseMobile}></div>
      )}
      <aside className={`sidebar-container ${mobileOpen ? "mobile-drawer-open" : ""}`}>
        <div>
          <div className="sidebar-group-label">Navigation</div>
          <nav className="sidebar-nav-list">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-nav-item ${currentTab === item.id ? "active" : ""}`}
                onClick={() => handleSelectTab(item.id)}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
                {currentTab === item.id && <span className="sidebar-item-pill"></span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer-info">
          <div className="sidebar-footer-badge">
            <span className="badge-tag">v2.4.0</span>
            <span className="badge-env">Production</span>
          </div>
        </div>
      </aside>
    </>
  );
}
