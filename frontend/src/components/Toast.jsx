import React, { useEffect } from 'react';
import { Icons } from './Icons';

export function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-container toast-${type || "info"}`}>
      <div className="toast-icon-wrapper">
        {type === "success" && <Icons.Check />}
        {type === "error" && <Icons.X />}
        {(!type || type === "info") && <Icons.Sparkles />}
      </div>
      <div className="toast-content-wrapper">
        <div className="toast-title-text">{type === "error" ? "Action Failed" : type === "success" ? "Success" : "Notification"}</div>
        <div className="toast-message-text">{message}</div>
      </div>
      <button className="toast-dismiss-btn" onClick={onClose} aria-label="Close notification">
        <Icons.X />
      </button>
    </div>
  );
}
