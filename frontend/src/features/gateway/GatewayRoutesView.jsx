/**
 * KoreVane™ - Gateway Cluster Live Routes View
 */
import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { API } from '../../services/api';

export function GatewayRoutesView({ showToast }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGatewayRoutes = async () => {
    try {
      setLoading(true);
      const data = await API.getGatewayActiveRoutes();
      setRoutes(data || []);
    } catch (err) {
      showToast(err.message || "Failed to load active gateway configuration.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGatewayRoutes();
  }, []);

  return (
    <div className="view-container">
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">Active Gateway Cluster Routes</h2>
          <p className="view-subtitle">Live routing tables distributed to smart gateway worker instances via Kafka/Redis</p>
        </div>
        <div className="view-actions-group">
          <button className="btn btn-secondary" onClick={loadGatewayRoutes} title="Refresh Live Routes">
            <Icons.Refresh /> Refresh
          </button>
        </div>
      </div>

      <div className="stats-pill-group mb-4">
        <span className="stats-pill">Total Active Routes: {routes.length}</span>
        <span className="stats-pill text-cyan">Cluster Sync: OK</span>
      </div>

      <div className="data-table-card">
        {loading ? (
          <div className="table-loading-state">
            <div className="spinner-glow"></div>
            <span>Querying gateway route registry...</span>
          </div>
        ) : routes.length === 0 ? (
          <div className="table-empty-state">
            <Icons.Activity />
            <p>No active routes currently deployed to the gateway plane.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="kore-table">
              <thead>
                <tr>
                  <th>Route ID</th>
                  <th>Path Pattern</th>
                  <th>Target Upstream</th>
                  <th>Timeout</th>
                  <th>Rate Limit</th>
                  <th>Version</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold text-primary">{r.routeId}</td>
                    <td>
                      <span className="path-pattern-pill">{r.pathPattern}</span>
                    </td>
                    <td className="font-mono text-xs text-secondary">
                      {r.targetBaseUrl}{r.targetPathPrefix}
                    </td>
                    <td className="font-mono text-xs">{r.responseTimeoutMs} ms</td>
                    <td className="font-mono text-xs">
                      {r.requestsPerMinute ? `${r.requestsPerMinute} / min` : "Unlimited"}
                    </td>
                    <td>
                      <span className="version-number-tag">v{r.configurationVersion || 1}</span>
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
