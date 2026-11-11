/**
 * KoreVane™ - API Service & Storage Layer (Vite React Client)
 */

export const SESSION_KEY = "korevane_auth_session";
export const TOUR_KEY = "korevane_tour_completed";
export const THEME_KEY = "korevane_theme_mode";

export const API = {
  getToken: () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      return saved ? saved.token : null;
    } catch {
      return null;
    }
  },

  getSession: () => {
    try {
      const data = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (!data) return null;
      if (data.role && !data.role.startsWith("ROLE_")) {
        data.role = `ROLE_${data.role}`;
      }
      if (!data.username && data.token) {
        try {
          const payloadBase64 = data.token.split('.')[1];
          const payload = JSON.parse(atob(payloadBase64));
          data.username = payload.sub || "User";
        } catch {
          data.username = "User";
        }
      }
      return data;
    } catch {
      return null;
    }
  },

  setSession: (sessionData) => {
    if (sessionData) {
      if (sessionData.role && !sessionData.role.startsWith("ROLE_")) {
        sessionData.role = `ROLE_${sessionData.role}`;
      }
      if (!sessionData.username && sessionData.token) {
        try {
          const payloadBase64 = sessionData.token.split('.')[1];
          const payload = JSON.parse(atob(payloadBase64));
          sessionData.username = payload.sub || "User";
        } catch {
          sessionData.username = "User";
        }
      }
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  },

  clearSession: () => {
    sessionStorage.removeItem(SESSION_KEY);
  },

  request: async (path, options = {}) => {
    const token = API.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(path, { ...options, headers });
    if (res.status === 204) return null;

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(msg);
    }
    return data;
  },

  // Auth
  login: (username, password) =>
    API.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),

  // Health
  getHealth: () => API.request("/health"),

  // Platform Organizations
  getOrganizations: () => API.request("/api/platform/organizations"),
  getOrganizationById: (id) => API.request(`/api/platform/organizations/${id}`),
  createOrganization: (name, slug) =>
    API.request("/api/platform/organizations", {
      method: "POST",
      body: JSON.stringify({ name, slug })
    }),
  updateOrganization: (id, name, slug) =>
    API.request(`/api/platform/organizations/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, slug })
    }),
  changeOrgStatus: (id, status) =>
    API.request(`/api/platform/organizations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
  deleteOrganization: (id) =>
    API.request(`/api/platform/organizations/${id}`, { method: "DELETE" }),

  // Tenant Admins
  createTenantAdmin: (orgId, username, password) =>
    API.request(`/api/platform/organizations/${orgId}/tenant-admin`, {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),
  getTenantAdmin: (orgId) =>
    API.request(`/api/platform/organizations/${orgId}/tenant-admin`),
  updateTenantAdmin: (orgId, username, password) =>
    API.request(`/api/platform/organizations/${orgId}/tenant-admin`, {
      method: "PUT",
      body: JSON.stringify({ username, password })
    }),
  deleteTenantAdmin: (orgId) =>
    API.request(`/api/platform/organizations/${orgId}/tenant-admin`, {
      method: "DELETE"
    }),

  // Tenant Organization
  getMyOrganization: () => API.request("/api/tenant/organization"),
  updateMyOrganization: (name, slug) =>
    API.request("/api/tenant/organization", {
      method: "PUT",
      body: JSON.stringify({ name, slug })
    }),

  // Tenant Routes
  getRoutes: () => API.request("/api/tenant/routes"),
  getRouteById: (id) => API.request(`/api/tenant/routes/${id}`),
  createRoute: (payload) =>
    API.request("/api/tenant/routes", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateRoute: (id, payload) =>
    API.request(`/api/tenant/routes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  changeRouteStatus: (id, active) =>
    API.request(`/api/tenant/routes/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ active })
    }),
  deleteRoute: (id) =>
    API.request(`/api/tenant/routes/${id}`, { method: "DELETE" }),

  // Route Version History
  getRouteVersions: (routeId) =>
    API.request(`/api/tenant/route-versions/${routeId}`),

  // Audit Records
  getAuditRecords: () => API.request("/api/tenant/audit-records"),

  // Gateway Active Routes
  getGatewayActiveRoutes: () => API.request("/api/gateway/routes")
};
