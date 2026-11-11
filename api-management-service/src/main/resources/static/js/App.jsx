/**
 * KoreVane™ - Main Application Root Component
 */
(function(window) {
  'use strict';

  const { useState, useEffect } = React;

  function App() {
    const API = window.KoreVaneAPI;
    const Icons = window.KoreVaneIcons;
    const SplashScreen = window.KoreVaneSplashScreen;
    const OnboardingTour = window.KoreVaneOnboardingTour;
    const Toast = window.KoreVaneToast;
    const Navbar = window.KoreVaneNavbar;
    const Sidebar = window.KoreVaneSidebar;
    const LoginView = window.KoreVaneLoginView;
    const OrganizationsView = window.KoreVaneOrganizationsView;
    const TenantAdminModal = window.KoreVaneTenantAdminModal;
    const RoutesView = window.KoreVaneRoutesView;
    const RouteModal = window.KoreVaneRouteModal;
    const RouteVersionsModal = window.KoreVaneRouteVersionsModal;
    const AuditTrailView = window.KoreVaneAuditTrailView;
    const GatewayRoutesView = window.KoreVaneGatewayRoutesView;
    const HowToUseView = window.KoreVaneHowToUseView;
    const SettingsView = window.KoreVaneSettingsView;

    // Splash State
    const [splashActive, setSplashActive] = useState(true);

    // Theme: system preference auto-detection + manual override
    const [theme, setTheme] = useState(() => {
      const savedTheme = localStorage.getItem(API.THEME_KEY);
      if (savedTheme) return savedTheme;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
      return "dark";
    });

    // Tour State: Show on first visit
    const [tourOpen, setTourOpen] = useState(false);

    // Auth & Navigation State
    const [user, setUser] = useState(() => API.getSession());
    const [currentTab, setCurrentTab] = useState(() => {
      const session = API.getSession();
      return session && session.role === "ROLE_PLATFORM_ADMIN" ? "organizations" : "routes";
    });

    // Health State
    const [healthStatus, setHealthStatus] = useState("UP");

    // Modal States
    const [selectedOrgForAdmin, setSelectedOrgForAdmin] = useState(null);
    const [routeModalData, setRouteModalData] = useState(null); // null = closed, {} = new, { ...route } = edit
    const [selectedRouteForVersions, setSelectedRouteForVersions] = useState(null);

    // Toast State
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "info") => {
      setToast({ message, type });
    };

    // Apply theme attribute to document
    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(API.THEME_KEY, theme);
    }, [theme]);

    // Check system preference listener
    useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
      const handleChange = (e) => {
        if (!localStorage.getItem(API.THEME_KEY)) {
          setTheme(e.matches ? "light" : "dark");
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
    }, []);

    // Check health status on mount
    useEffect(() => {
      API.getHealth()
        .then((res) => {
          if (res && res.status) setHealthStatus(res.status);
        })
        .catch(() => setHealthStatus("DEGRADED"));
    }, []);

    // Check first-time tour
    const handleSplashFinished = () => {
      setSplashActive(false);
      // Remove inline static splash element if present in DOM
      const initialSplash = document.getElementById("korevane-splash");
      if (initialSplash && initialSplash.parentNode) {
        initialSplash.parentNode.removeChild(initialSplash);
      }

      const hasCompletedTour = localStorage.getItem(API.TOUR_KEY);
      if (!hasCompletedTour) {
        setTourOpen(true);
      }
    };

    const handleTourClose = () => {
      setTourOpen(false);
      localStorage.setItem(API.TOUR_KEY, "true");
    };

    const handleToggleTheme = () => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const handleLoginSuccess = (sessionData) => {
      setUser(sessionData);
      setCurrentTab(sessionData.role === "ROLE_PLATFORM_ADMIN" ? "organizations" : "routes");
    };

    const handleLogout = () => {
      API.clearSession();
      setUser(null);
      showToast("Signed out successfully.", "info");
    };

    // If still in splash phase
    if (splashActive) {
      return <SplashScreen onFinish={handleSplashFinished} />;
    }

    // If not authenticated, render Login View
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

    // Authenticated Main Workspace Layout
    return (
      <div className="app-shell">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Global Navigation Header */}
        <Navbar
          user={user}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onLogout={handleLogout}
          healthStatus={healthStatus}
        />

        {/* Workspace Body */}
        <div className="workspace-layout">
          <Sidebar currentTab={currentTab} setTab={setCurrentTab} user={user} />

          <main className="main-content-area">
            {/* Platform Admin Tabs */}
            {currentTab === "organizations" && user.role === "ROLE_PLATFORM_ADMIN" && (
              <OrganizationsView
                showToast={showToast}
                onManageAdmin={(org) => setSelectedOrgForAdmin(org)}
              />
            )}

            {/* Tenant Admin Tabs */}
            {currentTab === "routes" && (
              <RoutesView
                showToast={showToast}
                onCreateRoute={() => setRouteModalData({})}
                onEditRoute={(r) => setRouteModalData(r)}
                onViewVersions={(r) => setSelectedRouteForVersions(r)}
              />
            )}

            {currentTab === "audit" && <AuditTrailView showToast={showToast} />}

            {/* Shared Tabs */}
            {currentTab === "gateway-routes" && <GatewayRoutesView showToast={showToast} />}
            {currentTab === "guide" && <HowToUseView />}
            {currentTab === "settings" && (
              <SettingsView
                user={user}
                theme={theme}
                setTheme={setTheme}
                onReplayTour={() => setTourOpen(true)}
                showToast={showToast}
              />
            )}
          </main>
        </div>

        {/* Modals */}
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
              // Force tab refresh if needed
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

  // Mount Application to DOM root
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  }

  window.KoreVaneApp = App;
})(window);
