/**
 * KoreVane™ - Tenant API Routes View
 */
(function(window) {
  'use strict';

  function RoutesView({ showToast, onEditRoute, onCreateRoute, onViewVersions }) {
    const [routes, setRoutes] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    const Icons = window.KoreVaneIcons;
    const API = window.KoreVaneAPI;

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

    React.useEffect(() => {
      loadRoutes();
    }, []);

    const handleToggleStatus = async (route) => {
      const nextStatus = !route.enabled;
      try {
        await API.changeRouteStatus(route.id, nextStatus);
        showToast(`Route "${route.routeId}" is now ${nextStatus ? "Enabled" : "Disabled"}.`, "success");
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
        (r.pathPattern && r.pathPattern.toLowerCase().includes(search.toLowerCase())) ||
        (r.targetUri && r.targetUri.toLowerCase().includes(search.toLowerCase()))
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
            <button className="btn btn-primary btn-shine" onClick={onCreateRoute}>
              <Icons.Plus /> New API Route
            </button>
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
              Active: {routes.filter((r) => r.enabled).length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="data-table-card">
          {loading ? (
            <div className="table-loading-state">
              <div className="spinner-glow"></div>
              <span>Synchronizing routes from control plane...</span>
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
                    <th>Upstream Target URI</th>
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
                        <div className="text-xs text-muted">v{route.version || 1}</div>
                      </td>
                      <td>
                        <span className="path-pattern-pill">{route.pathPattern}</span>
                      </td>
                      <td className="font-mono text-xs text-secondary">{route.targetUri}</td>
                      <td>
                        <div className="methods-chip-list">
                          {route.httpMethods && route.httpMethods.length > 0 ? (
                            route.httpMethods.map((m) => (
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
                          {route.rateLimitReplenishRate ? `${route.rateLimitReplenishRate} req/s` : "Off"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`switch-toggle-btn ${route.enabled ? "switch-on" : "switch-off"}`}
                          onClick={() => handleToggleStatus(route)}
                          title={route.enabled ? "Disable route" : "Enable route"}
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

  window.KoreVaneRoutesView = RoutesView;
})(window);
