// ============================================================
// FILE:   frontend/src/components/ui/Loader.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useI18n } from "../../i18n/LanguageContext.jsx";

export default function Loader({ fullscreen = false, label }) {
  const { t } = useI18n();
  return (
    <div
      className={fullscreen ? "loader loader--fullscreen" : "loader"}
      role="status"
      aria-live="polite"
    >
      <span className="spinner" />
      <span className="loader__label">{label ?? t("common.loading")}</span>
    </div>
  );
}
