/**
 * KoreVane™ - Route Revision History & Snapshot Modal
 */
(function(window) {
  'use strict';

  function RouteVersionsModal({ route, onClose, showToast }) {
    const [versions, setVersions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedVersion, setSelectedVersion] = React.useState(null);

    const Icons = window.KoreVaneIcons;
    const API = window.KoreVaneAPI;

    React.useEffect(() => {
      if (!route) return;
      const loadVersions = async () => {
        try {
          setLoading(true);
          const data = await API.getRouteVersions(route.routeId);
          setVersions(data || []);
          if (data && data.length > 0) {
            setSelectedVersion(data[0]);
          }
        } catch (err) {
          showToast(err.message || "Failed to load route revisions.", "error");
        } finally {
          setLoading(false);
        }
      };
      loadVersions();
    }, [route]);

    if (!route) return null;

    return (
      <div className="modal-backdrop">
        <div className="modal-card modal-card-lg">
          <div className="modal-header">
            <div>
              <h3>Revision History: {route.routeId}</h3>
              <p className="modal-subtitle">Immutable audit snapshots of all route configuration changes</p>
            </div>
            <button className="modal-close" onClick={onClose}>
              <Icons.X />
            </button>
          </div>

          <div className="modal-body modal-scrollable">
            {loading ? (
              <div className="table-loading-state">
                <div className="spinner-glow"></div>
                <span>Fetching version tree...</span>
              </div>
            ) : versions.length === 0 ? (
              <div className="table-empty-state">
                <Icons.History />
                <p>No historical revisions found for this route yet.</p>
              </div>
            ) : (
              <div className="versions-split-layout">
                {/* Left: Version Timeline List */}
                <div className="versions-timeline-col">
                  {versions.map((ver) => (
                    <div
                      key={ver.id}
                      className={`version-timeline-card ${
                        selectedVersion && selectedVersion.id === ver.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedVersion(ver)}
                    >
                      <div className="version-card-top">
                        <span className="version-number-tag">v{ver.versionNumber}</span>
                        <span className={`version-type-pill type-${(ver.changeType || "").toLowerCase()}`}>
                          {ver.changeType || "UPDATED"}
                        </span>
                      </div>
                      <div className="version-timestamp">
                        {ver.createdAt ? new Date(ver.createdAt).toLocaleString() : "Just now"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Selected Snapshot Inspector */}
                <div className="version-snapshot-col">
                  {selectedVersion ? (
                    <div>
                      <div className="snapshot-header-row">
                        <span className="font-semibold text-primary">
                          Configuration Snapshot (v{selectedVersion.versionNumber})
                        </span>
                        <span className="text-xs text-muted">
                          Change Type: {selectedVersion.changeType}
                        </span>
                      </div>
                      <div className="snapshot-code-box">
                        <pre>
                          {(() => {
                            try {
                              return JSON.stringify(
                                JSON.parse(selectedVersion.configurationSnapshot),
                                null,
                                2
                              );
                            } catch (e) {
                              return selectedVersion.configurationSnapshot || "{}";
                            }
                          })()}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-sub-card">
                      <span>Select a version from the timeline to inspect the JSON configuration snapshot.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close History
            </button>
          </div>
        </div>
      </div>
    );
  }

  window.KoreVaneRouteVersionsModal = RouteVersionsModal;
})(window);
