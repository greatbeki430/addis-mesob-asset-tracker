// ============================================================
// FILE:   frontend/src/components/ui/Modal.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useEffect } from "react";
import { X } from "lucide-react";
import { useI18n } from "../../i18n/LanguageContext.jsx";

// Dialog on desktop, bottom sheet on phones (see .modal in theme.css)
export default function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
}) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal__header">
          <h2>{title}</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X size={18} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}
