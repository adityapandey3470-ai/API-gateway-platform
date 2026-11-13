import React, { useState } from 'react';
import { Icons } from './Icons';

const TOUR_SLIDES = [
  {
    step: "01",
    title: "Organization Management",
    tagline: "Multi-tenant workspace setup",
    desc: "Manage multiple organizations under one control plane. Assign dedicated Tenant Admins to manage their own routes independently.",
    badge: "Organizations"
  },
  {
    step: "02",
    title: "Dynamic Route Setup",
    tagline: "Routing rules & policies",
    desc: "Define upstream targets, rate limits, HTTP methods, and header rules. Changes take effect immediately without restarting services.",
    badge: "API Routing"
  },
  {
    step: "03",
    title: "Real-time Synchronization",
    tagline: "Instant gateway propagation",
    desc: "Route changes broadcast automatically to all running Smart Gateway instances, keeping live traffic policies up to date.",
    badge: "Gateway Sync"
  },
  {
    step: "04",
    title: "Version History & Audits",
    tagline: "Track changes and audit trail",
    desc: "Every route update creates a version snapshot for tracking changes, accompanied by an audit trail for compliance and safety.",
    badge: "History & Logs"
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
