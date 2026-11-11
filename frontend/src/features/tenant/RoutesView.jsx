/**
 * KoreVane™ - Tenant API Routes View
 * Clean, consistent metric cards matching the rest of the UI
 */
import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { API } from '../../services/api';

export function RoutesView({ showToast, onEditRoute, onCreateRoute, onViewVersions }) {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await API.getRoutes();
      setRoutes(data || []);
    } catch (err) {
      showToast(err.message || "Failed to load routes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleToggleStatus = async (route) => {
    const nextStatus = !route.active;
    try {
      await API.changeRouteStatus(route.id, nextStatus);
      showToast(`Route "${route.routeId}" is now ${nextStatus ? "Active" : "Inactive"}.`, "success");
      loadRoutes();
    } catch (err) {
      showToast(err.message || "Failed to update route status.", "error");
    }
  };

  const handleDelete = async (route) => {
    if (!confirm(`Are you sure you want to delete route "${route.routeId}"?`)) return;
    try {
      await API.deleteRoute(route.id);
      showToast(`Route "${route.routeId}" deleted.`, "success");
      loadRoutes();
    } catch (err) {
      showToast(err.message || "Failed to delete route.", "error");
    }
  };

  const filtered = routes.filter(
    (r) =>
      (r.routeId && r.routeId.toLowerCase().includes(search.toLowerCase())) ||
      (r.name && r.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.pathPattern && r.pathPattern.toLowerCase().includes(search.toLowerCase())) ||
      (r.targetBaseUrl && r.targetBaseUrl.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">Dynamic API Routes</h2>
          <p className="view-subtitle">Sub-millisecond traffic dispatching, policy injection, and security rules</p>
        </div>
        <div className="view-actions-group">
          <button className="btn btn-secondary" onClick={loadRoutes} title="Refresh Routes">
            <Icons.Refresh /> Refresh
          </button>
          <button className="btn btn-primary" onClick={onCreateRoute}>
            <Icons.Plus /> New API Route
          </button>
        </div>
      </div>

      {/* Clean White Metric Cards matching the rest of the application */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-tag">Zero-Trust</span>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span className="status-text">Active</span>
            </div>
          </div>
          <div className="metric-card-title">Token Verification</div>
          <div className="metric-card-desc">Inbound JWT validation with automated key rotation</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-tag">Performance</span>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span className="status-text">Sub-ms</span>
            </div>
          </div>
          <div className="metric-card-title">Routing Engine</div>
          <div className="metric-card-desc">Ant-path dispatching cache active across gateway instances</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-tag">Messaging</span>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span className="status-text">Connected</span>
            </div>
          </div>
          <div className="metric-card-title">Cluster Event Pipeline</div>
          <div className="metric-card-desc">Real-time configuration broadcasting via Apache Kafka</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-search-card">
        <div className="input-with-icon search-input-box">
          <span className="input-icon"><Icons.Search /></span>
          <input
            type="text"
            className="form-input"
            placeholder="Filter by route ID, pattern, or upstream target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="stats-pill-group">
          <span className="stats-pill">Total: {routes.length}</span>
          <span className="stats-pill text-success">
            Active: {routes.filter((r) => r.active).length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-card">
        {loading ? (
          <div className="table-loading-state">
            <div className="spinner-glow"></div>
            <span>Synchronizing routes...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="table-empty-state">
            <Icons.Route />
            <p>No routes configured yet. Click "New API Route" to get started.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="kore-table">
              <thead>
                <tr>
                  <th>Route ID</th>
                  <th>Inbound Pattern</th>
                  <th>Upstream Target</th>
                  <th>Methods</th>
                  <th>Rate Limit</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((route) => (
                  <tr key={route.id}>
                    <td>
                      <div className="font-semibold text-primary">{route.routeId}</div>
                      <div className="text-xs text-muted">v{route.configurationVersion || 1} • {route.name}</div>
                    </td>
                    <td>
                      <span className="path-pattern-pill">{route.pathPattern}</span>
                    </td>
                    <td className="font-mono text-xs text-secondary">
                      {route.targetBaseUrl}{route.targetPathPrefix}
                    </td>
                    <td>
                      <div className="methods-chip-list">
                        {route.allowedMethods && route.allowedMethods.length > 0 ? (
                          route.allowedMethods.map((m) => (
                            <span key={m} className={`method-badge method-${m.toLowerCase()}`}>
                              {m}
                            </span>
                          ))
                        ) : (
                          <span className="method-badge method-all">ALL</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="rate-limit-badge">
                        {route.requestsPerMinute ? `${route.requestsPerMinute} req/min` : "Off"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`switch-toggle-btn ${route.active ? "switch-on" : "switch-off"}`}
                        onClick={() => handleToggleStatus(route)}
                        title={route.active ? "Disable route" : "Enable route"}
                      >
                        <span className="switch-handle"></span>
                      </button>
                    </td>
                    <td className="text-right">
                      <div className="table-action-row">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => onViewVersions(route)}
                          title="View Revision History"
                        >
                          <Icons.History />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => onEditRoute(route)}
                          title="Edit Route"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger-ghost btn-sm"
                          onClick={() => handleDelete(route)}
                          title="Delete Route"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
