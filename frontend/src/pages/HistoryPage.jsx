// ============================================================
// FILE:   frontend/src/pages/HistoryPage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useState } from "react";
import toast from "react-hot-toast";
import { Download, History } from "lucide-react";

import api, { getBlobErrorMessage } from "../api/client.js";
import usePagedQuery from "../hooks/usePagedQuery.js";
import { useI18n } from "../i18n/LanguageContext.jsx";
import { ASSET_TYPES } from "../constants.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import SearchInput from "../components/ui/SearchInput.jsx";
import Badge from "../components/ui/Badge.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Pagination from "../components/ui/Pagination.jsx";

const LIMIT = 10;

export default function HistoryPage() {
  const { t, tType, fmt } = useI18n();
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    type: "",
    from: "",
    to: "",
  });
  const [exporting, setExporting] = useState(false);
  const { items, meta, loading, page, setPage } = usePagedQuery(
    "/gate/history",
    filters,
    LIMIT,
  );

  const set = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }));

  const exportCsv = async () => {
    setExporting(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v),
      );
      const blob = await api.get("/gate/history/export", {
        params,
        responseType: "blob",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gate-history-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(await getBlobErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("history.title")}
        subtitle={t("history.subtitle")}
        actions={
          <button
            className="btn btn-outline"
            onClick={exportCsv}
            disabled={exporting}
          >
            <Download size={16} />{" "}
            {exporting ? t("common.preparing") : t("history.export")}
          </button>
        }
      />

      <div className="card">
        <div className="toolbar toolbar--wrap">
          <SearchInput
            value={filters.q}
            onChange={(v) => setFilters((f) => ({ ...f, q: v }))}
            placeholder={t("history.search")}
          />
          <select
            className="select"
            value={filters.status}
            onChange={set("status")}
            aria-label={t("table.status")}
          >
            <option value="">{t("history.allStatuses")}</option>
            <option value="OUT">{t("badge.outside")}</option>
            <option value="RETURNED">{t("badge.returned")}</option>
          </select>
          <select
            className="select"
            value={filters.type}
            onChange={set("type")}
            aria-label={t("assets.fieldType")}
          >
            <option value="">{t("common.allTypes")}</option>
            {ASSET_TYPES.map((type) => (
              <option key={type} value={type}>
                {tType(type)}
              </option>
            ))}
          </select>
          <label className="date-field">
            <span>{t("history.from")}</span>
            <input
              type="date"
              className="input"
              value={filters.from}
              onChange={set("from")}
              max={filters.to || undefined}
            />
          </label>
          <label className="date-field">
            <span>{t("history.to")}</span>
            <input
              type="date"
              className="input"
              value={filters.to}
              onChange={set("to")}
              min={filters.from || undefined}
            />
          </label>
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState
            icon={History}
            title={t("history.emptyTitle")}
            text={t("history.emptyText")}
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("table.employee")}</th>
                  <th>{t("table.asset")}</th>
                  <th>{t("table.serial")}</th>
                  <th>{t("table.out")}</th>
                  <th>{t("table.returned")}</th>
                  <th>{t("table.duration")}</th>
                  <th>{t("table.status")}</th>
                  <th>{t("history.releasedReceived")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((log) => (
                  <tr key={log._id}>
                    <td data-label={t("table.employee")}>
                      <div className="cell-main">
                        {log.employeeSnapshot.fullName}
                      </div>
                      <div className="cell-sub">
                        {log.employeeSnapshot.employeeId}
                      </div>
                    </td>
                    <td data-label={t("table.asset")}>
                      {[log.assetSnapshot.brand, log.assetSnapshot.model]
                        .filter(Boolean)
                        .join(" ") || tType(log.assetSnapshot.type)}
                    </td>
                    <td data-label={t("table.serial")}>
                      <code>{log.assetSnapshot.serialNumber}</code>
                    </td>
                    <td data-label={t("table.out")}>
                      {fmt.dateTime(log.checkOutAt)}
                    </td>
                    <td data-label={t("table.returned")}>
                      {fmt.dateTime(log.checkInAt)}
                    </td>
                    <td data-label={t("table.duration")}>
                      {fmt.hours(log.hoursOut)}
                    </td>
                    <td data-label={t("table.status")}>
                      {log.status === "OUT" ? (
                        <Badge tone={log.isOverdue ? "danger" : "warning"}>
                          {log.isOverdue
                            ? t("badge.overdue")
                            : t("badge.outside")}
                        </Badge>
                      ) : (
                        <Badge tone="success">{t("badge.returned")}</Badge>
                      )}
                    </td>
                    <td data-label={t("history.by")}>
                      <div className="cell-sub">
                        {t("history.outBy", {
                          name: log.checkOutBy?.fullName || "—",
                        })}
                      </div>
                      <div className="cell-sub">
                        {t("history.inBy", {
                          name: log.checkInBy?.fullName || "—",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          pages={meta.pages}
          total={meta.total}
          limit={LIMIT}
          onChange={setPage}
        />
      </div>
    </>
  );
}
