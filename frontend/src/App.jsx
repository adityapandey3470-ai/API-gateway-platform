import React, { useState, useEffect } from 'react';
import { API, TOUR_KEY } from './services/api';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
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
import { OverviewView } from './features/overview/OverviewView';
import { HowToUseView } from './features/guide/HowToUseView';
import { SettingsView } from './features/settings/SettingsView';

function getDefaultTabForRole(rawRole) {
  if (rawRole) return "overview";
  return "guide";
}

export default function App() {
  const [splashActive, setSplashActive] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { user, userRole, setSessionData, logout } = useAuth();

  const [tourOpen, setTourOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState(() => {
    const session = API.getSession();
    return getDefaultTabForRole(session ? session.role : null);
  });

  const [healthStatus, setHealthStatus] = useState("UP");
  const [adminOrg, setAdminOrg] = useState(null);
  const [routeModalData, setRouteModalData] = useState(null);
  const [versionModal, setVersionModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (user) {
      const allowedTabsForRole = {
        ROLE_PLATFORM_ADMIN: ["overview", "organizations", "guide", "settings"],
        ROLE_TENANT_ADMIN: ["overview", "routes", "audit", "guide", "settings"],
        ROLE_GATEWAY_SERVICE: ["overview", "gateway-routes", "guide", "settings"]
      };
      const allowed = allowedTabsForRole[userRole] || ["guide", "settings"];
      if (!allowed.includes(currentTab)) {
        setCurrentTab(getDefaultTabForRole(userRole));
      }
    }
  }, [user, userRole, currentTab]);

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

  const handleLoginSuccess = (sessionData) => {
    setSessionData(sessionData);
    setCurrentTab(getDefaultTabForRole(sessionData ? sessionData.role : null));
  };

  const handleLogout = () => {
    logout();
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
          onToggleTheme={toggleTheme}
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
        onToggleTheme={toggleTheme}
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
          {currentTab === "overview" && (
            <OverviewView
              user={user}
              setTab={setCurrentTab}
              onCreateRoute={() => setRouteModalData({})}
              onOpenNewOrg={() => setCurrentTab("organizations")}
              showToast={showToast}
            />
          )}

          {currentTab === "organizations" && userRole === "ROLE_PLATFORM_ADMIN" && (
            <OrganizationsView
              showToast={showToast}
              onManageAdmin={(org) => setAdminOrg(org)}
            />
          )}

          {currentTab === "routes" && userRole === "ROLE_TENANT_ADMIN" && (
            <RoutesView
              showToast={showToast}
              onCreateRoute={() => setRouteModalData({})}
              onEditRoute={(r) => setRouteModalData(r)}
              onViewVersions={(r) => setVersionModal(r)}
            />
          )}

          {currentTab === "audit" && userRole === "ROLE_TENANT_ADMIN" && (
            <AuditTrailView showToast={showToast} />
          )}

          {currentTab === "gateway-routes" && userRole === "ROLE_GATEWAY_SERVICE" && (
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

      {adminOrg && (
        <TenantAdminModal
          org={adminOrg}
          onClose={() => setAdminOrg(null)}
          showToast={showToast}
        />
      )}

      {routeModalData && (
        <RouteModal
          route={routeModalData.id ? routeModalData : null}
          onClose={() => setRouteModalData(null)}
          onSaved={() => {
            setRouteModalData(null);
            setCurrentTab("routes");
          }}
          showToast={showToast}
        />
      )}

      {versionModal && (
        <RouteVersionsModal
          route={versionModal}
          onClose={() => setVersionModal(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
