/**
 * KoreVane™ - Interactive Onboarding Walkthrough Tour
 * Inspired by Figma "ghost." stepper layout & clean aesthetics
 */
import React, { useState } from 'react';
import { Icons } from './Icons';

const TOUR_SLIDES = [
  {
    step: "01",
    title: "Isolate Your Tenants.",
    tagline: "Multi-Tenant Architecture & Governance",
    desc: "Decouple distinct organizations under a unified control plane. Assign dedicated Tenant Admins with scoped permissions over their routing domains.",
    badge: "■ MULTI-TENANCY CORE"
  },
  {
    step: "02",
    title: "Dynamic Smart Routing.",
    tagline: "Sub-Millisecond Traffic Orchestration",
    desc: "Define upstream targets, rate limits, HTTP method filters, and dynamic Header Rules. Instant reload across gateway clusters without restart.",
    badge: "■ ZERO DOWNTIME"
  },
  {
    step: "03",
    title: "Distributed Synchrony.",
    tagline: "Apache Kafka & Redis Route Mesh",
    desc: "Control-plane modifications broadcast instantaneously to Smart Gateway worker pods. Hot caches remain warmed with sub-millisecond route resolution.",
    badge: "■ EVENT MESH"
  },
  {
    step: "04",
    title: "Audit & Version Vault.",
    tagline: "Immutable Route Snapshots & Telemetry",
    desc: "Every routing modification creates an immutable snapshot version with instant rollbacks and tamper-evident audit logs.",
    badge: "■ COMPLIANCE VAULT"
  }
];

export function OnboardingTour({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const slide = TOUR_SLIDES[currentStep];
  const total = TOUR_SLIDES.length;
  const isLast = currentStep === total - 1;
  const isFirst = currentStep === 0;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="tour-modal-backdrop">
      <div className="tour-modal-card">
        <button className="tour-close-btn" onClick={onClose} title="Skip Tour">
          <Icons.X />
        </button>

        <div className="tour-illustration-zone">
          <div className="tour-orb-glow"></div>
          <div className="tour-badge">{slide.badge}</div>
          <div className="tour-icon-display">
            <Icons.Logo size={64} />
          </div>
        </div>

        <div className="tour-body-zone">
          <h2 className="tour-title">{slide.title}</h2>
          <div className="tour-tagline">{slide.tagline}</div>
          <p className="tour-desc">{slide.desc}</p>

          {/* Stepper navigation bar inspired by Figma Image 2 */}
          <div className="tour-stepper-dots">
            {TOUR_SLIDES.map((_, idx) => (
              <button
                key={idx}
                className={`tour-dot ${idx === currentStep ? "active" : ""}`}
                onClick={() => setCurrentStep(idx)}
              />
            ))}
          </div>

          <div className="tour-action-row">
            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={handlePrev}
                disabled={isFirst}
                title="Previous step"
              >
                ←
              </button>
              <span className="font-mono text-xs font-bold text-muted">
                {slide.step} . 0{total}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleNext}
                disabled={isLast}
                title="Next step"
              >
                →
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-sm" onClick={onClose}>
                Skip
              </button>
              <button className="btn btn-primary btn-shine" onClick={handleNext}>
                {isLast ? "Explore Platform" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
