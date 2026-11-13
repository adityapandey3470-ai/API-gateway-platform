export const SESSION_KEY = "korevane_auth_session";
export const TOUR_KEY = "korevane_tour_completed";
export const THEME_KEY = "korevane_theme_mode";

function decodeJwtUsername(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || "User";
  } catch {
    return "User";
  }
}

function normalizeSession(data) {
  if (data.role && !data.role.startsWith("ROLE_")) {
    data.role = `ROLE_${data.role}`;
  }
  if (!data.username && data.token) {
    data.username = decodeJwtUsername(data.token);
  }
  return data;
}

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
      return normalizeSession(data);
    } catch {
      return null;
    }
  },

  setSession: (sessionData) => {
    if (sessionData) normalizeSession(sessionData);
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

  login: (username, password) =>
    API.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),

  getHealth: () => API.request("/health"),

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

  getMyOrganization: () => API.request("/api/tenant/organization"),
  updateMyOrganization: (name, slug) =>
    API.request("/api/tenant/organization", {
      method: "PUT",
      body: JSON.stringify({ name, slug })
    }),

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

  getRouteVersions: (routeId) =>
    API.request(`/api/tenant/route-versions/${routeId}`),

  getAuditRecords: () => API.request("/api/tenant/audit-records"),

  getGatewayActiveRoutes: () => API.request("/api/gateway/routes")
};
