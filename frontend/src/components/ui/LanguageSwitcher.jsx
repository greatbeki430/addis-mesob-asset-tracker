// ============================================================
// FILE:   frontend/src/components/ui/LanguageSwitcher.jsx
// STATUS: NEW file - create it at this path
// ============================================================
import { Globe } from "lucide-react";
import { LANGUAGES } from "../../constants.js";
import { useI18n } from "../../i18n/LanguageContext.jsx";

// variant: "default" (full names) | "compact" (EN / አማ) | "sidebar" (for the dark sidebar)
export default function LanguageSwitcher({ variant = "default" }) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      className={`lang-switch lang-switch--${variant}`}
      role="group"
      aria-label={t("language.label")}
    >
      <Globe size={16} aria-hidden="true" />
      {LANGUAGES.map((item) => (
        <button
          key={item.code}
          type="button"
          lang={item.code}
          className={lang === item.code ? "active" : ""}
          aria-pressed={lang === item.code}
          onClick={() => setLang(item.code)}
        >
          {variant === "compact" ? item.short : item.label}
        </button>
      ))}
    </div>
  );
}
