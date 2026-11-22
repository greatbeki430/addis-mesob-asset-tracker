// ============================================================
// FILE:   frontend/src/pages/OutsidePage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ArrowDownLeft,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

import api, { getErrorMessage } from "../api/client.js";
import useDebounce from "../hooks/useDebounce.js";
import { useI18n } from "../i18n/LanguageContext.jsx";
import { hoursSince } from "../utils/format.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import SearchInput from "../components/ui/SearchInput.jsx";
import Badge from "../components/ui/Badge.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { AssetIcon } from "../components/gate/Cards.jsx";

export default function OutsidePage() {
  const { t, rich, tType, fmt } = useI18n();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q);
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, overdue: 0, overdueHours: 24 });
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get("/gate/outside", {
        params: { q: debouncedQ || undefined },
      });
      setLogs(res.data);
      setMeta(res.meta);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedQ]);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60000);
    return () => clearInterval(timer);
  }, [load]);

  const receive = async () => {
    setBusy(true);
    try {
      await api.post("/gate/check-in", { assetId: target.asset });
      toast.success(
        t("outside.received", { serial: target.assetSnapshot.serialNumber }),
      );
      setTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("outside.title")}
        subtitle={t("outside.subtitle")}
        actions={
          <button className="btn btn-outline" onClick={load}>
            <RefreshCw size={16} /> {t("common.refresh")}
          </button>
        }
      />

      <div className="summary-strip">
        <Badge tone="warning">
          {t("outside.countOutside", { count: meta.total })}
        </Badge>
        <Badge
          tone={meta.overdue ? "danger" : "success"}
          icon={meta.overdue ? AlertTriangle : CheckCircle2}
        >
          {t("outside.countOverdue", {
            count: meta.overdue,
            hours: meta.overdueHours,
          })}
        </Badge>
      </div>

      <div className="card">
        <div className="toolbar">
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder={t("outside.search")}
          />
        </div>

        {loading ? (
          <Loader />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={t("outside.emptyTitle")}
            text={t("outside.emptyText")}
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("table.employee")}</th>
                  <th>{t("table.asset")}</th>
                  <th>{t("table.serial")}</th>
                  <th>{t("table.takenOut")}</th>
                  <th>{t("table.duration")}</th>
                  <th>{t("table.releasedBy")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className={log.isOverdue ? "row--danger" : ""}
                  >
                    <td data-label={t("table.employee")}>
                      <div className="cell-main">
                        {log.employeeSnapshot.fullName}
                      </div>
                      <div className="cell-sub">
                        {log.employeeSnapshot.employeeId}
                        {log.employeeSnapshot.department
                          ? ` · ${log.employeeSnapshot.department}`
                          : ""}
                      </div>
                    </td>
                    <td data-label={t("table.asset")}>
                      <span className="cell-icon">
                        <AssetIcon type={log.assetSnapshot.type} size={16} />
                        {[log.assetSnapshot.brand, log.assetSnapshot.model]
                          .filter(Boolean)
                          .join(" ") || tType(log.assetSnapshot.type)}
                      </span>
                    </td>
                    <td data-label={t("table.serial")}>
                      <code>{log.assetSnapshot.serialNumber}</code>
                    </td>
                    <td data-label={t("table.takenOut")}>
                      {fmt.dateTime(log.checkOutAt)}
                    </td>
                    <td data-label={t("table.duration")}>
                      <Badge tone={log.isOverdue ? "danger" : "info"}>
                        {fmt.hours(hoursSince(log.checkOutAt))}
                      </Badge>
                    </td>
                    <td data-label={t("table.releasedBy")}>
                      {log.checkOutBy?.fullName || "—"}
                    </td>
                    <td data-label="" className="actions">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => setTarget(log)}
                      >
                        <ArrowDownLeft size={16} /> {t("outside.receive")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title={t("outside.confirmTitle")}
        tone="success"
        confirmLabel={t("return.confirm")}
        busy={busy}
        onConfirm={receive}
        onCancel={() => setTarget(null)}
        message={
          target && (
            <p>
              {rich("outside.confirmMessage", {
                name: <b>{target.employeeSnapshot.fullName}</b>,
                type: tType(target.assetSnapshot.type).toLowerCase(),
                serial: <code>{target.assetSnapshot.serialNumber}</code>,
              })}
            </p>
          )
        }
      />
    </>
  );
}
