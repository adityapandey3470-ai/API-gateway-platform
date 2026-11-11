/**
 * KoreVane™ - Floating Feedback Notification Toasts
 */
(function(window) {
  'use strict';

  function Toast({ message, type, onClose }) {
    const Icons = window.KoreVaneIcons;

    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div className={`toast-banner toast-${type || "info"}`}>
        <div className="toast-icon">
          {type === "success" && <Icons.Check />}
          {type === "error" && <Icons.X />}
          {(!type || type === "info") && <Icons.Sparkles />}
        </div>
        <div className="toast-text">{message}</div>
        <button className="toast-close" onClick={onClose}>
          <Icons.X />
        </button>
      </div>
    );
  }

  window.KoreVaneToast = Toast;
})(window);
