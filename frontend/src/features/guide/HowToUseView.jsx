import React from 'react';
import { Icons } from '../../components/Icons';

export function HowToUseView() {
  return (
    <div className="view-container">
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">User Guide</h2>
          <p className="view-subtitle">Understanding platform workflows, routing policies, and configuration management</p>
        </div>
      </div>

      <div className="guide-architecture-grid">
        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Building /></div>
          <h3>1. Organization Hierarchy</h3>
          <p>
            Platform Administrators manage tenant organizations. Each organization receives an isolated
            namespace ensuring clean boundaries across microservices and dedicated administrative control.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Route /></div>
          <h3>2. Route Management</h3>
          <p>
            Tenant Administrators can register API routes, specifying inbound path patterns, upstream target URLs,
            allowed HTTP methods, and custom timeouts.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Shield /></div>
          <h3>3. Traffic Policies & Protection</h3>
          <p>
            Configure rate limits per route using requests-per-minute thresholds. Enable idempotency
            to prevent duplicate transactions, and apply custom header injection rules.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.History /></div>
          <h3>4. Version History & Audit Trail</h3>
          <p>
            Every routing update creates an immutable version snapshot. Inspect historical configurations
            and review audit records to track changes made by platform and tenant users.
          </p>
        </div>
      </div>

      <div className="data-table-card p-6">
        <h3 className="section-title mb-3">Typical Setup Workflow</h3>
        <div className="pipeline-steps-container">
          <div className="pipeline-step">
            <span className="step-num">Step 1</span>
            <h4>Create Organization</h4>
            <p>Platform Admin sets up the tenant with a unique slug and assigns an administrator.</p>
          </div>
          <div className="pipeline-step">
            <span className="step-num">Step 2</span>
            <h4>Configure Routes</h4>
            <p>Tenant Admin adds service routes specifying path patterns and upstream destinations.</p>
          </div>
          <div className="pipeline-step">
            <span className="step-num">Step 3</span>
            <h4>Apply Throttling</h4>
            <p>Set appropriate rate limits and response timeouts to safeguard downstream services.</p>
          </div>
          <div className="pipeline-step">
            <span className="step-num">Step 4</span>
            <h4>Monitor & Audit</h4>
            <p>Verify live routing status in Gateway Live view and track modifications in Audit Trail.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
