/**
 * KoreVane™ - Control Plane Audit Trail View
 */
(function(window) {
  'use strict';

  function AuditTrailView({ showToast }) {
    const [records, setRecords] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    const Icons = window.KoreVaneIcons;
    const API = window.KoreVaneAPI;

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

    React.useEffect(() => {
      loadRecords();
    }, []);

    const filtered = records.filter(
      (r) =>
        (r.actor && r.actor.toLowerCase().includes(search.toLowerCase())) ||
        (r.action && r.action.toLowerCase().includes(search.toLowerCase())) ||
        (r.resourceType && r.resourceType.toLowerCase().includes(search.toLowerCase())) ||
        (r.resourceId && r.resourceId.toLowerCase().includes(search.toLowerCase())) ||
        (r.correlationId && r.correlationId.toLowerCase().includes(search.toLowerCase()))
    );

    return (
      <div className="view-container">
        <div className="view-header-bar">
          <div>
            <h2 className="view-title">Control Plane Audit Trail</h2>
            <p className="view-subtitle">Tamper-evident log of administrative operations and policy adjustments</p>
          </div>
          <div className="view-actions-group">
            <button className="btn btn-secondary" onClick={loadRecords} title="Refresh Logs">
              <Icons.Refresh /> Refresh
            </button>
          </div>
        </div>

        {/* Filter */}
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
            <span className="stats-pill">Total Events: {records.length}</span>
          </div>
        </div>

        {/* Table */}
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
              <table className="kore-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>Correlation ID</th>
                    <th>Latency</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td className="text-muted text-xs whitespace-nowrap">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="font-medium text-primary">{r.actor}</td>
                      <td>
                        <span className="audit-action-chip">{r.action}</span>
                      </td>
                      <td>
                        <span className="text-xs font-mono">
                          {r.resourceType} : {r.resourceId}
                        </span>
                      </td>
                      <td className="font-mono text-xs text-muted">
                        {r.correlationId ? r.correlationId.substring(0, 12) + "..." : "—"}
                      </td>
                      <td className="font-mono text-xs text-muted">
                        {r.durationMs ? `${r.durationMs}ms` : "—"}
                      </td>
                      <td>
                        <span
                          className={`status-chip ${
                            r.result === "SUCCESS" ? "chip-active" : "chip-suspended"
                          }`}
                        >
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

  window.KoreVaneAuditTrailView = AuditTrailView;
})(window);
