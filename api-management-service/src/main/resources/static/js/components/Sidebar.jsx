/**
 * KoreVane™ - Role-Based Navigation Sidebar
 */
(function(window) {
  'use strict';

  function Sidebar({ currentTab, setTab, user }) {
    const Icons = window.KoreVaneIcons;
    const isPlatformAdmin = user && user.role === "ROLE_PLATFORM_ADMIN";

    const navItems = isPlatformAdmin
      ? [
          { id: "organizations", label: "Organizations", icon: <Icons.Building /> },
          { id: "gateway-routes", label: "Gateway Live", icon: <Icons.Activity /> },
          { id: "guide", label: "How to Use", icon: <Icons.BookOpen /> },
          { id: "settings", label: "Settings", icon: <Icons.Settings /> }
        ]
      : [
          { id: "routes", label: "API Routes", icon: <Icons.Route /> },
          { id: "audit", label: "Audit Trail", icon: <Icons.History /> },
          { id: "gateway-routes", label: "Gateway Live", icon: <Icons.Activity /> },
          { id: "guide", label: "How to Use", icon: <Icons.BookOpen /> },
          { id: "settings", label: "Settings", icon: <Icons.Settings /> }
        ];

    return (
      <aside className="sidebar-container">
        <div className="sidebar-group-label">Navigation</div>
        <nav className="sidebar-nav-list">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${currentTab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
              {currentTab === item.id && <span className="sidebar-item-pill"></span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer-info">
          <div className="sidebar-footer-badge">
            <span className="badge-tag">v2.4.0</span>
            <span className="badge-env">Production Core</span>
          </div>
          <div className="sidebar-tenant-label">
            {user && user.organizationSlug ? `@${user.organizationSlug}` : "@control-plane"}
          </div>
        </div>
      </aside>
    );
  }

  window.KoreVaneSidebar = Sidebar;
})(window);
