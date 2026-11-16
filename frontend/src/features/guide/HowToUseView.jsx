import React from 'react';
import { Icons } from '../../components/Icons';

export function HowToUseView() {
  return (
    <div className="view-container">
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">User Guide</h2>
          <p className="view-subtitle">A quick guide to setting up your organization, routes, and traffic rules</p>
        </div>
      </div>

      <div className="guide-architecture-grid">
        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Building /></div>
          <h3>1. Organization Hierarchy</h3>
          <p>
            Platform Administrators create and manage tenant organizations. Each organization gets its own
            space with a unique slug, keeping teams and their data completely separate.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Route /></div>
          <h3>2. Route Management</h3>
          <p>
            Tenant Administrators can add API routes by specifying the incoming path, the backend URL to
            forward requests to, which HTTP methods are allowed, and an optional timeout.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Shield /></div>
          <h3>3. Traffic Policies & Protection</h3>
          <p>
            Set a request rate limit per route to prevent overload. You can also enable duplicate
            request blocking and add custom headers to outgoing requests.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.History /></div>
          <h3>4. Version History & Audit Trail</h3>
          <p>
            Every time a route is updated, the old settings are saved as a version. You can browse past
            versions and check who made what changes in the Audit Trail.
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
