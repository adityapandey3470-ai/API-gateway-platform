/**
 * KoreVane™ - Create / Edit API Route Modal
 */
import React, { useState } from 'react';
import { Icons } from '../../components/Icons';
import { API } from '../../services/api';

const AVAILABLE_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];
const HEADER_ACTIONS = [
  { value: "ADD", label: "Add Header" },
  { value: "SET", label: "Set Header (Overwrite)" },
  { value: "REMOVE", label: "Remove Header" }
];

export function RouteModal({ route, onClose, onSaved, showToast }) {
  const [routeId, setRouteId] = useState(route ? route.routeId : "");
  const [name, setName] = useState(route ? route.name : "");
  const [pathPattern, setPathPattern] = useState(route ? route.pathPattern : "");
  const [targetBaseUrl, setTargetBaseUrl] = useState(route ? route.targetBaseUrl : "");
  const [targetPathPrefix, setTargetPathPrefix] = useState(route ? route.targetPathPrefix : "");
  const [requestsPerMinute, setRequestsPerMinute] = useState(route && route.requestsPerMinute ? route.requestsPerMinute : 60);
  const [responseTimeoutMs, setResponseTimeoutMs] = useState(route && route.responseTimeoutMs ? route.responseTimeoutMs : 5000);
  const [idempotencyEnabled, setIdempotencyEnabled] = useState(route ? !!route.idempotencyEnabled : false);
  const [active, setActive] = useState(route ? !!route.active : true);
  const [allowedMethods, setAllowedMethods] = useState(
    route && route.allowedMethods && route.allowedMethods.length > 0
      ? new Set(route.allowedMethods)
      : new Set(["GET", "POST"])
  );
  const [headerRules, setHeaderRules] = useState(
    route && route.headerRules
      ? route.headerRules.map((r) => ({
          direction: r.direction || "INBOUND",
          action: r.action || "ADD",
          headerName: r.headerName || "",
          headerValue: r.headerValue || ""
        }))
      : []
  );
  const [saving, setSaving] = useState(false);

  const toggleMethod = (method) => {
    const next = new Set(allowedMethods);
    if (next.has(method)) {
      if (next.size > 1) next.delete(method);
    } else {
      next.add(method);
    }
    setAllowedMethods(next);
  };

  const addHeaderRule = () => {
    setHeaderRules([
      ...headerRules,
      { direction: "INBOUND", action: "ADD", headerName: "", headerValue: "" }
    ]);
  };

  const updateHeaderRule = (index, field, value) => {
    const updated = [...headerRules];
    updated[index][field] = value;
    setHeaderRules(updated);
  };

  const removeHeaderRule = (index) => {
    setHeaderRules(headerRules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeId || !name || !pathPattern || !targetBaseUrl || !targetPathPrefix) {
      showToast("Please fill in all required route identification fields.", "error");
      return;
    }
    if (allowedMethods.size === 0) {
      showToast("Select at least one allowed HTTP method.", "error");
      return;
    }

    const payload = {
      routeId: routeId.trim(),
      name: name.trim(),
      pathPattern: pathPattern.trim(),
      targetBaseUrl: targetBaseUrl.trim(),
      targetPathPrefix: targetPathPrefix.trim(),
      requestsPerMinute: parseInt(requestsPerMinute, 10) || 60,
      responseTimeoutMs: parseInt(responseTimeoutMs, 10) || 5000,
      idempotencyEnabled,
      active,
      allowedMethods: Array.from(allowedMethods),
      headerRules: headerRules.filter((r) => r.headerName.trim().length > 0)
    };

    setSaving(true);
    try {
      if (route) {
        await API.updateRoute(route.id, payload);
        showToast(`Route "${routeId}" updated successfully.`, "success");
      } else {
        await API.createRoute(payload);
        showToast(`Route "${routeId}" created successfully.`, "success");
      }
      onSaved();
    } catch (err) {
      showToast(err.message || "Failed to save route configuration.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-card-lg">
        <div className="modal-header">
          <div>
            <h3>{route ? `Edit Route: ${route.routeId}` : "Configure New API Route"}</h3>
            <p className="modal-subtitle">Define path dispatching, security policies, and upstream destination</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body modal-scrollable">
            {/* Basic Route Metadata */}
            <div className="form-section-header">Route Identity</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Route Identifier (Unique)</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="e.g. order-service-v1"
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  disabled={!!route}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Orders Processing API"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Path & Target URL */}
            <div className="form-section-header mt-3">Gateway Path & Upstream Target</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Inbound Path Pattern</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="/orders/**"
                  value={pathPattern}
                  onChange={(e) => setPathPattern(e.target.value)}
                  required
                />
                <small className="form-hint">Ant-style matching pattern (e.g. /catalog/**)</small>
              </div>
              <div className="form-group">
                <label className="form-label">Target Base URL</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="http://catalog-service:8082"
                  value={targetBaseUrl}
                  onChange={(e) => setTargetBaseUrl(e.target.value)}
                  required
                />
                <small className="form-hint">Upstream microservice host and port</small>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Path Prefix</label>
              <input
                type="text"
                className="form-input font-mono"
                placeholder="/api/v1"
                value={targetPathPrefix}
                onChange={(e) => setTargetPathPrefix(e.target.value)}
                required
              />
            </div>

            {/* Allowed HTTP Methods */}
            <div className="form-section-header mt-3">Allowed HTTP Methods</div>
            <div className="methods-selector-row mb-3">
              {AVAILABLE_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`method-toggle-chip ${allowedMethods.has(m) ? "active" : ""}`}
                  onClick={() => toggleMethod(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Rate Limiting & Timeouts */}
            <div className="form-section-header mt-3">Throttling & Resilience</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Requests Per Minute (Rate Limit)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input font-mono"
                  value={requestsPerMinute}
                  onChange={(e) => setRequestsPerMinute(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Response Timeout (ms)</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  className="form-input font-mono"
                  value={responseTimeoutMs}
                  onChange={(e) => setResponseTimeoutMs(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Flags */}
            <div className="form-flags-row mb-3">
              <label className="checkbox-toggle-label">
                <input
                  type="checkbox"
                  checked={idempotencyEnabled}
                  onChange={(e) => setIdempotencyEnabled(e.target.checked)}
                />
                <span>Enable Idempotency Keys (Distributed Deduping)</span>
              </label>
              <label className="checkbox-toggle-label">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <span>Route Active & Serving Traffic</span>
              </label>
            </div>

            {/* Dynamic Header Rules */}
            <div className="header-rules-section mt-3">
              <div className="flex justify-between items-center mb-2">
                <div className="form-section-header m-0">Header Transformation Rules</div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addHeaderRule}>
                  <Icons.Plus /> Add Rule
                </button>
              </div>

              {headerRules.length === 0 ? (
                <div className="empty-sub-card">
                  <span>No header transformation rules defined. Headers will pass through unchanged.</span>
                </div>
              ) : (
                <div className="rules-builder-list">
                  {headerRules.map((rule, idx) => (
                    <div key={idx} className="rule-builder-row">
                      <select
                        className="form-select font-mono"
                        value={rule.direction}
                        onChange={(e) => updateHeaderRule(idx, "direction", e.target.value)}
                      >
                        <option value="INBOUND">Inbound (Req)</option>
                        <option value="OUTBOUND">Outbound (Res)</option>
                      </select>
                      <select
                        className="form-select"
                        value={rule.action}
                        onChange={(e) => updateHeaderRule(idx, "action", e.target.value)}
                      >
                        {HEADER_ACTIONS.map((a) => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="form-input font-mono"
                        placeholder="Header Name"
                        value={rule.headerName}
                        onChange={(e) => updateHeaderRule(idx, "headerName", e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-input font-mono"
                        placeholder="Value"
                        value={rule.headerValue}
                        onChange={(e) => updateHeaderRule(idx, "headerValue", e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-danger-ghost btn-icon-only"
                        onClick={() => removeHeaderRule(idx)}
                        title="Remove rule"
                      >
                        <Icons.X />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-shine" disabled={saving}>
              {saving ? "Saving Configuration..." : route ? "Update Route" : "Deploy Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
