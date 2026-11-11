/**
 * KoreVane™ - Interactive Onboarding Walkthrough Tour
 */
import React, { useState } from 'react';
import { Icons } from './Icons';

const TOUR_SLIDES = [
  {
    title: "Welcome to KoreVane™",
    tagline: "Next-Generation Smart API Gateway & Traffic Orchestration",
    desc: "KoreVane decouples your microservices with sub-millisecond dynamic routing, zero-trust token verification, and unified rate limiting.",
    badge: "Architecture"
  },
  {
    title: "Multi-Tenant Architecture",
    tagline: "Isolated Environments & Delegated Administration",
    desc: "Manage multiple organizations under a single control plane. Assign dedicated Tenant Admins with scoped permissions over their routing domains.",
    badge: "Multi-Tenancy"
  },
  {
    title: "Dynamic Smart Routing",
    tagline: "Zero-Downtime Rule Updates via Kafka & Redis",
    desc: "Define upstream targets, rate limits, HTTP method filters, and dynamic Header Rules. Instant reload across gateway clusters without restart.",
    badge: "Real-time"
  },
  {
    title: "Version Control & Auditability",
    tagline: "Immutable Route Snapshots & Full Telemetry",
    desc: "Every routing modification creates an immutable snapshot version with instant rollbacks and tamper-evident audit logs.",
    badge: "Compliance"
  }
];

export function OnboardingTour({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const slide = TOUR_SLIDES[currentStep];
  const isLast = currentStep === TOUR_SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="tour-modal-backdrop">
      <div className="tour-modal-card">
        <button className="tour-close-btn" onClick={handleSkip} title="Skip Tour">
          <Icons.X />
        </button>

        <div className="tour-illustration-zone">
          <div className="tour-orb-glow"></div>
          <div className="tour-badge">{slide.badge}</div>
          <div className="tour-icon-display">
            <Icons.Logo size={56} />
          </div>
        </div>

        <div className="tour-body-zone">
          <div className="tour-step-counter">
            Step {currentStep + 1} of {TOUR_SLIDES.length}
          </div>
          <h2 className="tour-title">{slide.title}</h2>
          <div className="tour-tagline">{slide.tagline}</div>
          <p className="tour-desc">{slide.desc}</p>

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
            <button className="btn btn-ghost" onClick={handleSkip}>
              Skip Tour
            </button>
            <button className="btn btn-primary btn-shine" onClick={handleNext}>
              {isLast ? "Get Started" : "Next"}
              <Icons.ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
