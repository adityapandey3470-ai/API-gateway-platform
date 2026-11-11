/**
 * KoreVane™ - Main Application Root Component (Vite React SPA)
 */
import React, { useState, useEffect } from 'react';
import { API, TOUR_KEY, THEME_KEY } from './services/api';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingTour } from './components/OnboardingTour';
import { Toast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './features/auth/LoginView';
import { OrganizationsView } from './features/platform/OrganizationsView';
import { TenantAdminModal } from './features/platform/TenantAdminModal';
import { RoutesView } from './features/tenant/RoutesView';
import { RouteModal } from './features/tenant/RouteModal';
import { RouteVersionsModal } from './features/tenant/RouteVersionsModal';
import { AuditTrailView } from './features/tenant/AuditTrailView';
import { GatewayRoutesView } from './features/gateway/GatewayRoutesView';
import { HowToUseView } from './features/guide/HowToUseView';
import { SettingsView } from './features/settings/SettingsView';

function getDefaultTabForRole(role) {
  if (role === "ROLE_PLATFORM_ADMIN") return "organizations";
  if (role === "ROLE_TENANT_ADMIN") return "routes";
  if (role === "ROLE_GATEWAY_SERVICE") return "gateway-routes";
  return "guide";
}

export default function App() {
  const [splashActive, setSplashActive] = useState(true);

  // Theme auto-detects system preference with manual override
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  });

  const [tourOpen, setTourOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => API.getSession());
  const [currentTab, setCurrentTab] = useState(() => {
    const session = API.getSession();
    return getDefaultTabForRole(session ? session.role : null);
  });

  const [healthStatus, setHealthStatus] = useState("UP");
  const [selectedOrgForAdmin, setSelectedOrgForAdmin] = useState(null);
  const [routeModalData, setRouteModalData] = useState(null);
  const [selectedRouteForVersions, setSelectedRouteForVersions] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? "light" : "dark");
      }
    };
    if (media.addEventListener) {
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, []);

  // Guard currentTab against unauthorized access for the active role
  useEffect(() => {
    if (user) {
      const allowedTabsForRole = {
        ROLE_PLATFORM_ADMIN: ["organizations", "guide", "settings"],
        ROLE_TENANT_ADMIN: ["routes", "audit", "guide", "settings"],
        ROLE_GATEWAY_SERVICE: ["gateway-routes", "guide", "settings"]
      };
      const allowed = allowedTabsForRole[user.role] || ["guide", "settings"];
      if (!allowed.includes(currentTab)) {
        setCurrentTab(getDefaultTabForRole(user.role));
      }
    }
  }, [user, currentTab]);

  useEffect(() => {
    API.getHealth()
      .then((res) => {
        if (res && res.status) setHealthStatus(res.status);
      })
      .catch(() => setHealthStatus("DEGRADED"));
  }, []);

  const handleSplashFinished = () => {
    setSplashActive(false);
    const hasCompletedTour = localStorage.getItem(TOUR_KEY);
    if (!hasCompletedTour) {
      setTourOpen(true);
    }
  };

  const handleTourClose = () => {
    setTourOpen(false);
    localStorage.setItem(TOUR_KEY, "true");
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLoginSuccess = (sessionData) => {
    setUser(sessionData);
    setCurrentTab(getDefaultTabForRole(sessionData ? sessionData.role : null));
  };

  const handleLogout = () => {
    API.clearSession();
    setUser(null);
    showToast("Signed out successfully.", "info");
  };

  if (splashActive) {
    return <SplashScreen onFinish={handleSplashFinished} />;
  }

  if (!user) {
    return (
      <div className="app-shell">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <Navbar
          user={null}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onLogout={handleLogout}
          healthStatus={healthStatus}
        />
        <LoginView onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        <OnboardingTour isOpen={tourOpen} onClose={handleTourClose} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Navbar
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        healthStatus={healthStatus}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="workspace-layout">
        <Sidebar
          currentTab={currentTab}
          setTab={setCurrentTab}
          user={user}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="main-content-area">
          {currentTab === "organizations" && user.role === "ROLE_PLATFORM_ADMIN" && (
            <OrganizationsView
              showToast={showToast}
              onManageAdmin={(org) => setSelectedOrgForAdmin(org)}
            />
          )}

          {currentTab === "routes" && user.role === "ROLE_TENANT_ADMIN" && (
            <RoutesView
              showToast={showToast}
              onCreateRoute={() => setRouteModalData({})}
              onEditRoute={(r) => setRouteModalData(r)}
              onViewVersions={(r) => setSelectedRouteForVersions(r)}
            />
          )}

          {currentTab === "audit" && user.role === "ROLE_TENANT_ADMIN" && (
            <AuditTrailView showToast={showToast} />
          )}

          {currentTab === "gateway-routes" && user.role === "ROLE_GATEWAY_SERVICE" && (
            <GatewayRoutesView showToast={showToast} />
          )}

          {currentTab === "guide" && <HowToUseView />}

          {currentTab === "settings" && (
            <SettingsView
              user={user}
              onReplayTour={() => setTourOpen(true)}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      <OnboardingTour isOpen={tourOpen} onClose={handleTourClose} />

      {selectedOrgForAdmin && (
        <TenantAdminModal
          org={selectedOrgForAdmin}
          onClose={() => setSelectedOrgForAdmin(null)}
          showToast={showToast}
        />
      )}

      {routeModalData && (
        <RouteModal
          route={routeModalData.id ? routeModalData : null}
          onClose={() => setRouteModalData(null)}
          onSaved={() => {
            setRouteModalData(null);
            setCurrentTab((prev) => (prev === "routes" ? "routes" : "routes"));
          }}
          showToast={showToast}
        />
      )}

      {selectedRouteForVersions && (
        <RouteVersionsModal
          route={selectedRouteForVersions}
          onClose={() => setSelectedRouteForVersions(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
