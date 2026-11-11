/**
 * KoreVane™ - Interactive "How to Use" Architectural Guide
 */
import React from 'react';
import { Icons } from '../../components/Icons';

export function HowToUseView() {
  return (
    <div className="view-container">
      <div className="view-header-bar">
        <div>
          <h2 className="view-title">How KoreVane Works</h2>
          <p className="view-subtitle">Architectural design, traffic orchestration, and workflow best practices</p>
        </div>
      </div>

      {/* High-Level Architecture Cards */}
      <div className="guide-architecture-grid">
        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Building /></div>
          <h3>1. Multi-Tenant Organizations</h3>
          <p>
            Platform Administrators create isolated tenant organizations with unique slug domains.
            Each organization is assigned dedicated tenant admins who manage their own microservice routes.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Route /></div>
          <h3>2. Dynamic Route Rules</h3>
          <p>
            Tenant Admins register upstream microservices with custom path patterns, allowed HTTP methods,
            rate limits (token bucket), and response timeouts.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Cpu /></div>
          <h3>3. Distributed Synchrony</h3>
          <p>
            Control plane state changes publish real-time change events via <strong>Apache Kafka</strong>.
            Smart Gateway instances subscribe to topic events and update their local Redis route cache with zero downtime.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-card-icon"><Icons.Shield /></div>
          <h3>4. Zero-Trust & Auditability</h3>
          <p>
            Inbound calls undergo token verification and header injection before upstream forwarding.
            Every control-plane modification is preserved in immutable version snapshots and audit ledgers.
          </p>
        </div>
      </div>

      {/* End-to-End Traffic Flow */}
      <div className="data-table-card p-6 mt-6">
        <h3 className="section-title mb-3">End-to-End Traffic Pipeline</h3>
        <div className="pipeline-steps-container">
          <div className="pipeline-step">
            <span className="step-num">01</span>
            <h4>Client Request</h4>
            <p>Client sends HTTP request to <code>http://gateway:8080/&lt;tenant-slug&gt;/&lt;path&gt;</code></p>
          </div>
          <div className="pipeline-step">
            <span className="step-num">02</span>
            <h4>Route Resolution</h4>
            <p>Smart Gateway matches inbound pattern against in-memory route registry</p>
          </div>
          <div className="pipeline-step">
            <span className="step-num">03</span>
            <h4>Policy Enforcement</h4>
            <p>Rate limiter checks token bucket; header rules transform request headers</p>
          </div>
          <div className="pipeline-step">
            <span className="step-num">04</span>
            <h4>Upstream Dispatch</h4>
            <p>Proxies call to destination microservice and streams response back to client</p>
          </div>
        </div>
      </div>

      {/* Sample cURL commands */}
      <div className="data-table-card p-6 mt-6">
        <h3 className="section-title mb-2">Verification via cURL</h3>
        <p className="text-secondary text-sm mb-4">
          Test routing through the KoreVane Gateway using the command line:
        </p>

        <div className="code-block-wrapper mb-3">
          <div className="code-block-header">
            <span>Authentication (Control Plane)</span>
          </div>
          <pre className="code-pre">
{`curl -X POST http://localhost:8081/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"platform-admin","password":"platform123"}'`}
          </pre>
        </div>

        <div className="code-block-wrapper mb-3">
          <div className="code-block-header">
            <span>Tenant Route Query</span>
          </div>
          <pre className="code-pre">
{`curl -X GET http://localhost:8081/api/tenant/routes \\
  -H "Authorization: Bearer <TOKEN>"`}
          </pre>
        </div>

        <div className="code-block-wrapper">
          <div className="code-block-header">
            <span>Inbound Gateway Proxy Request</span>
          </div>
          <pre className="code-pre">
{`curl -X GET http://localhost:8080/foodfast/orders/123 \\
  -H "X-Correlation-Id: test-trace-99"`}
          </pre>
        </div>
      </div>
    </div>
  );
}
