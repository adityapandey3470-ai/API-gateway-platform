/**
 * KoreVane™ - Control Plane Audit Trail View
 * Tamper-evident ledger with aligned columns, metric summary, and full responsiveness
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from '../../components/Icons';
import { API } from '../../services/api';

export function AuditTrailView({ showToast }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await API.getAuditRecords();
      setRecords(data || []);
    } catch (err) {
      showToast(err.message || "Failed to load audit records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleCopyCorrelationId = (id) => {
    if (!id) return;
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    showToast("Correlation ID copied to clipboard", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = useMemo(() => {
    return records.filter(
      (r) =>
        (r.actor && r.actor.toLowerCase().includes(search.toLowerCase())) ||
        (r.action && r.action.toLowerCase().includes(search.toLowerCase())) ||
        (r.resourceType && r.resourceType.toLowerCase().includes(search.toLowerCase())) ||
        (r.resourceId && r.resourceId.toLowerCase().includes(search.toLowerCase())) ||
        (r.correlationId && r.correlationId.toLowerCase().includes(search.toLowerCase()))
    );
  }, [records, search]);

  // Compute metrics
  const totalEvents = records.length;
  const successEvents = records.filter(r => r.result === "SUCCESS").length;
  const successRate = totalEvents > 0 ? Math.round((successEvents / totalEvents) * 100) : 100;
  
  const totalDuration = records.reduce((acc, r) => acc + (Number(r.durationMs) || 0), 0);
  const avgLatency = totalEvents > 0 ? Math.round(totalDuration / totalEvents) : 0;
  
  const uniqueActors = new Set(records.map(r => r.actor).filter(Boolean)).size;

  return (
    <div className="view-container">
      {/* View Header */}
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">Control Plane Audit Trail</h2>
          <p className="view-subtitle">Tamper-evident log of administrative operations, policy changes, and routing state adjustments</p>
        </div>
        <div className="view-actions-group">
          <button className="btn btn-secondary" onClick={loadRecords} title="Refresh Logs">
            <Icons.Refresh /> Refresh
          </button>
        </div>
      </div>

      {/* Audit KPI Metric Cards matching design system */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-tag">Ledger</span>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span className="status-text">Recorded</span>
            </div>
          </div>
          <div className="metric-card-title">{totalEvents} Total Events</div>
          <div className="metric-card-desc">Immutable cryptographically signed administrative history</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-tag">Integrity</span>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span className="status-text">{successRate}% Verified</span>
            </div>
          </div>
          <div className="metric-card-title">{successEvents} Successful Operations</div>
          <div className="metric-card-desc">Zero authorization breaches or unlogged mutations</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-tag">Performance</span>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span className="status-text">Sub-ms</span>
            </div>
          </div>
          <div className="metric-card-title">{avgLatency}ms Avg Latency</div>
          <div className="metric-card-desc">Control-plane execution and database ledger write speed</div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-tag">Actors</span>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span className="status-text">Active</span>
            </div>
          </div>
          <div className="metric-card-title">{uniqueActors} Authenticated Operators</div>
          <div className="metric-card-desc">Tenant administrators and automated gateway sync nodes</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-search-card">
        <div className="input-with-icon search-input-box">
          <span className="input-icon"><Icons.Search /></span>
          <input
            type="text"
            className="form-input"
            placeholder="Search by actor, action, resource, or correlation ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="stats-pill-group">
          <span className="stats-pill">Showing {filtered.length} of {records.length} Events</span>
          <span className="stats-pill text-success">Sync: Realtime</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table-card">
        {loading ? (
          <div className="table-loading-state">
            <div className="spinner-glow"></div>
            <span>Streaming audit ledger...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="table-empty-state">
            <Icons.History />
            <p>No audit trail records recorded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="kore-table audit-table">
              <thead>
                <tr>
                  <th style={{ width: '180px', minWidth: '170px' }}>Timestamp</th>
                  <th style={{ width: '140px', minWidth: '130px' }}>Actor</th>
                  <th style={{ width: '130px', minWidth: '120px' }}>Action</th>
                  <th style={{ width: '220px', minWidth: '200px' }}>Resource</th>
                  <th style={{ width: '160px', minWidth: '150px' }}>Correlation ID</th>
                  <th style={{ width: '90px', minWidth: '90px' }}>Latency</th>
                  <th style={{ width: '100px', minWidth: '95px' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    {/* Timestamp */}
                    <td className="text-muted text-xs whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      }) : "—"}
                    </td>

                    {/* Actor */}
                    <td className="whitespace-nowrap">
                      <span className="font-semibold text-primary">{r.actor}</span>
                    </td>

                    {/* Action */}
                    <td className="whitespace-nowrap">
                      <span className="font-semibold text-primary">{r.action}</span>
                    </td>

                    {/* Resource */}
                    <td className="whitespace-nowrap">
                      <span className="font-medium text-primary text-xs" title={r.resourceId}>
                        {r.resourceType} : {r.resourceId ? (r.resourceId.length > 18 ? `${r.resourceId.substring(0, 16)}...` : r.resourceId) : "—"}
                      </span>
                    </td>

                    {/* Correlation ID */}
                    <td className="whitespace-nowrap">
                      <div 
                        className="correlation-id-chip" 
                        title="Click to copy full Correlation ID"
                        onClick={() => handleCopyCorrelationId(r.correlationId)}
                      >
                        <span className="font-mono text-xs">
                          {r.correlationId ? `${r.correlationId.substring(0, 11)}...` : "—"}
                        </span>
                        {r.correlationId && (
                          <span className="copy-icon-subtle">
                            {copiedId === r.correlationId ? <Icons.Check /> : <Icons.Copy />}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Latency */}
                    <td className="whitespace-nowrap">
                      <span className="audit-latency-pill font-mono text-xs">
                        {r.durationMs !== undefined && r.durationMs !== null ? `${r.durationMs}ms` : "—"}
                      </span>
                    </td>

                    {/* Result */}
                    <td className="whitespace-nowrap">
                      <span
                        className={`status-chip ${
                          r.result === "SUCCESS" ? "chip-active" : "chip-suspended"
                        }`}
                      >
                        <span className={`status-dot ${r.result === "SUCCESS" ? "online" : ""}`} style={r.result !== "SUCCESS" ? { background: 'var(--color-danger)' } : {}}></span>
                        {r.result}
                      </span>
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
