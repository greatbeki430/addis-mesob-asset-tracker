// ============================================================
// FILE:   frontend/src/components/ui/ConfirmDialog.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import Modal from "./Modal.jsx";
import { useI18n } from "../../i18n/LanguageContext.jsx";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  tone = "primary",
  busy = false,
  onConfirm,
  onCancel,
}) {
  const { t } = useI18n();

  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={busy}
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className={`btn btn-${tone}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy
              ? t("common.pleaseWait")
              : (confirmLabel ?? t("common.confirm"))}
          </button>
        </>
      }
    >
      <div className="confirm-text">{message}</div>
    </Modal>
  );
}
