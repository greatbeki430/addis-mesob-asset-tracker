// ============================================================
// FILE:   frontend/src/components/ui/Pagination.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "../../i18n/LanguageContext.jsx";

export default function Pagination({
  page,
  pages,
  total,
  limit = 8,
  onChange,
}) {
  const { t } = useI18n();
  if (!total) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <span className="pagination__info">
        {t("pagination.range", { from, to, total })}
      </span>
      <div className="pagination__controls">
        <button
          className="btn btn-outline btn-sm"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={16} /> {t("pagination.prev")}
        </button>
        <span className="pagination__page">
          {page} / {pages}
        </span>
        <button
          className="btn btn-outline btn-sm"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          {t("pagination.next")} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
