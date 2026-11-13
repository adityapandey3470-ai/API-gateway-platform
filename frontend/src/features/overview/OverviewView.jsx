import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { API } from '../../services/api';

export function OverviewView({ user, setTab, onCreateRoute, onOpenNewOrg, showToast }) {
  const rawRole = user?.role || "";
  const role = rawRole.startsWith("ROLE_") ? rawRole : `ROLE_${rawRole}`;

  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState("UP");
  const [organizations, setOrganizations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [auditRecords, setAuditRecords] = useState([]);
  const [gatewayRoutes, setGatewayRoutes] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const h = await API.getHealth().catch(() => ({ status: "UP" }));
      if (h?.status) setHealthStatus(h.status);

      if (role === "ROLE_PLATFORM_ADMIN") {
        const orgs = await API.getOrganizations().catch(() => []);
        setOrganizations(orgs || []);
      } else if (role === "ROLE_TENANT_ADMIN") {
        const [rData, aData] = await Promise.all([
          API.getRoutes().catch(() => []),
          API.getAuditRecords().catch(() => [])
        ]);
        setRoutes(rData || []);
        setAuditRecords(aData || []);
      } else if (role === "ROLE_GATEWAY_SERVICE") {
        const gwData = await API.getGatewayActiveRoutes().catch(() => []);
        setGatewayRoutes(gwData || []);
      }
    } catch {
      if (showToast) showToast("Failed to refresh overview data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [role]);

  return (
    <div className="view-container">
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">Overview</h2>
          <p className="view-subtitle">
            {role === "ROLE_PLATFORM_ADMIN" && "Platform organizations and infrastructure health summary"}
            {role === "ROLE_TENANT_ADMIN" && "API routes, recent activity, and gateway status"}
            {role === "ROLE_GATEWAY_SERVICE" && "Active routing tables and cluster health"}
          </p>
        </div>
        <div className="view-actions-group">
          <button className="btn btn-secondary" onClick={loadData} title="Refresh">
            <Icons.Refresh /> Refresh
          </button>
          {role === "ROLE_PLATFORM_ADMIN" && (
            <button className="btn btn-primary" onClick={onOpenNewOrg || (() => setTab("organizations"))}>
              <Icons.Plus /> New Organization
            </button>
          )}
          {role === "ROLE_TENANT_ADMIN" && (
            <button className="btn btn-primary" onClick={onCreateRoute || (() => setTab("routes"))}>
              <Icons.Plus /> New API Route
            </button>
          )}
        </div>
      </div>

      <div className="metrics-grid">
        {role === "ROLE_PLATFORM_ADMIN" && (
          <>
            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-tag">Organizations</span>
                <div className="status-indicator">
                  <span className="status-dot online"></span>
                  <span className="status-text">Active</span>
                </div>
              </div>
              <div className="metric-card-title">{organizations.length} Total Organizations</div>
              <div className="metric-card-desc">
                {organizations.filter((o) => o.status === "ACTIVE").length} active tenant namespaces
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-tag">Gateway Cluster</span>
                <div className="status-indicator">
                  <span className={`status-dot ${healthStatus === "UP" ? "online" : ""}`}></span>
                  <span className="status-text">{healthStatus}</span>
                </div>
              </div>
              <div className="metric-card-title">System Status: {healthStatus}</div>
              <div className="metric-card-desc">Smart Gateway control plane is healthy and running</div>
            </div>
          </>
        )}

        {role === "ROLE_TENANT_ADMIN" && (
          <>
            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-tag">API Routes</span>
                <div className="status-indicator">
                  <span className="status-dot online"></span>
                  <span className="status-text">{routes.filter((r) => r.active).length} Active</span>
                </div>
              </div>
              <div className="metric-card-title">{routes.length} Managed Routes</div>
              <div className="metric-card-desc">Total configured routing paths in this tenant</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-tag">Audit Trail</span>
                <div className="status-indicator">
                  <span className="status-dot online"></span>
                  <span className="status-text">Logged</span>
                </div>
              </div>
              <div className="metric-card-title">{auditRecords.length} Audit Events</div>
              <div className="metric-card-desc">Administrative actions and policy modifications recorded</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-tag">Gateway Status</span>
                <div className="status-indicator">
                  <span className={`status-dot ${healthStatus === "UP" ? "online" : ""}`}></span>
                  <span className="status-text">{healthStatus}</span>
                </div>
              </div>
              <div className="metric-card-title">Cluster Health: {healthStatus}</div>
              <div className="metric-card-desc">Traffic dispatching engine is synchronized</div>
            </div>
          </>
        )}

        {role === "ROLE_GATEWAY_SERVICE" && (
          <>
            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-tag">Active Routes</span>
                <div className="status-indicator">
                  <span className="status-dot online"></span>
                  <span className="status-text">Live</span>
                </div>
              </div>
              <div className="metric-card-title">{gatewayRoutes.length} Compiled Routes</div>
              <div className="metric-card-desc">Routes currently loaded into memory</div>
            </div>

            <div className="metric-card">
              <div className="metric-card-header">
                <span className="metric-tag">Gateway Cluster</span>
                <div className="status-indicator">
                  <span className={`status-dot ${healthStatus === "UP" ? "online" : ""}`}></span>
                  <span className="status-text">{healthStatus}</span>
                </div>
              </div>
              <div className="metric-card-title">Cluster Health: {healthStatus}</div>
              <div className="metric-card-desc">Worker node operational and accepting traffic</div>
            </div>
          </>
        )}
      </div>

      <div className="data-table-card mt-4">
        {loading ? (
          <div className="table-loading-state">
            <div className="spinner-glow"></div>
            <span>Loading overview...</span>
          </div>
        ) : (
          <>
            {role === "ROLE_PLATFORM_ADMIN" && (
              <>
                <div className="overview-panel-header">
                  <div>
                    <h3 className="overview-panel-title">Organizations</h3>
                    <p className="overview-panel-subtitle">Recently created tenant organizations</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab("organizations")}>
                    View All <Icons.ChevronRight />
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="kore-table">
                    <thead>
                      <tr>
                        <th style={{ width: '32%', minWidth: '170px' }}>Organization Name</th>
                        <th style={{ width: '28%', minWidth: '140px' }}>Slug</th>
                        <th style={{ width: '22%', minWidth: '120px' }}>Status</th>
                        <th className="text-right" style={{ width: '18%', minWidth: '90px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.slice(0, 6).map((org) => (
                        <tr key={org.id}>
                          <td className="font-semibold text-primary whitespace-nowrap">{org.name}</td>
                          <td className="whitespace-nowrap">
                            <span className="domain-slug-badge">/{org.slug}</span>
                          </td>
                          <td className="whitespace-nowrap">
                            <span className={`status-chip ${org.status === "ACTIVE" ? "chip-active" : "chip-suspended"}`}>
                              <span
                                className={`status-dot ${org.status === "ACTIVE" ? "online" : ""}`}
                                style={org.status !== "ACTIVE" ? { background: 'var(--color-danger)' } : {}}
                              ></span>
                              {org.status}
                            </span>
                          </td>
                          <td className="text-right whitespace-nowrap">
                            <div className="table-action-row">
                              <button className="btn btn-ghost btn-sm" onClick={() => setTab("organizations")}>
                                Manage
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {organizations.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted" style={{ padding: "24px" }}>
                            No organizations found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {role === "ROLE_TENANT_ADMIN" && (
              <>
                <div className="overview-panel-header">
                  <div>
                    <h3 className="overview-panel-title">Recent API Routes</h3>
                    <p className="overview-panel-subtitle">Active path dispatching rules for your services</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab("routes")}>
                    View All <Icons.ChevronRight />
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="kore-table">
                    <thead>
                      <tr>
                        <th style={{ width: '25%', minWidth: '140px' }}>Route ID</th>
                        <th style={{ width: '30%', minWidth: '160px' }}>Path Pattern</th>
                        <th style={{ width: '30%', minWidth: '180px' }}>Target URL</th>
                        <th style={{ width: '15%', minWidth: '110px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.slice(0, 6).map((r) => (
                        <tr key={r.id}>
                          <td className="font-semibold text-primary whitespace-nowrap">{r.routeId}</td>
                          <td className="whitespace-nowrap">
                            <span className="path-pattern-pill">{r.pathPattern}</span>
                          </td>
                          <td className="font-mono text-xs text-muted whitespace-nowrap">{r.targetBaseUrl}</td>
                          <td className="whitespace-nowrap">
                            <span className={`status-chip ${r.active ? "chip-active" : "chip-suspended"}`}>
                              <span className={`status-dot ${r.active ? "online" : ""}`}></span>
                              {r.active ? "Active" : "Disabled"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {routes.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted" style={{ padding: "24px" }}>
                            No API routes configured yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {role === "ROLE_GATEWAY_SERVICE" && (
              <>
                <div className="overview-panel-header">
                  <div>
                    <h3 className="overview-panel-title">Active Gateway Routes</h3>
                    <p className="overview-panel-subtitle">Routes compiled into gateway memory</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab("gateway-routes")}>
                    View All <Icons.ChevronRight />
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="kore-table">
                    <thead>
                      <tr>
                        <th style={{ width: '25%', minWidth: '140px' }}>Route ID</th>
                        <th style={{ width: '30%', minWidth: '160px' }}>Path Pattern</th>
                        <th style={{ width: '30%', minWidth: '180px' }}>Target Base URL</th>
                        <th style={{ width: '15%', minWidth: '110px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gatewayRoutes.slice(0, 6).map((r) => (
                        <tr key={r.id}>
                          <td className="font-semibold text-primary whitespace-nowrap">{r.routeId}</td>
                          <td className="whitespace-nowrap">
                            <span className="path-pattern-pill">{r.pathPattern}</span>
                          </td>
                          <td className="font-mono text-xs text-muted whitespace-nowrap">{r.targetBaseUrl}</td>
                          <td className="whitespace-nowrap">
                            <span className="status-chip chip-active">
                              <span className="status-dot online"></span>
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                      {gatewayRoutes.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted" style={{ padding: "24px" }}>
                            No active routes compiled into edge memory.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
