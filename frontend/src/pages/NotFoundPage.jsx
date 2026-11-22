// ============================================================
// FILE:   frontend/src/pages/NotFoundPage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useI18n } from "../i18n/LanguageContext.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LanguageSwitcher from "../components/ui/LanguageSwitcher.jsx";

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="centered-page">
      <EmptyState
        icon={Compass}
        title={t("notFound.title")}
        text={t("notFound.text")}
        action={
          <>
            <Link to="/" className="btn btn-primary">
              {t("notFound.back")}
            </Link>
            <LanguageSwitcher />
          </>
        }
      />
    </div>
  );
}
