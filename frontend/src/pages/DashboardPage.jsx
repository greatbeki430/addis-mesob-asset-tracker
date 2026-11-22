// ============================================================
// FILE:   frontend/src/pages/DashboardPage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  DoorOpen,
  Laptop,
  LogOut as OutIcon,
  RefreshCw,
} from "lucide-react";

import api, { getErrorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useI18n } from "../i18n/LanguageContext.jsx";
import { greetingKey } from "../utils/format.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { AssetIcon } from "../components/gate/Cards.jsx";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, rich, tType, fmt } = useI18n();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60000); // keep the screen fresh at the gate
    return () => clearInterval(timer);
  }, [load]);

  if (loading) return <Loader />;
  if (!stats) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title={t("dashboard.loadError")}
        action={
          <button className="btn btn-primary" onClick={load}>
            {t("common.tryAgain")}
          </button>
        }
      />
    );
  }

  const { totals, outsideByType, recentActivity, overdueHours } = stats;
  const maxType = Math.max(...outsideByType.map((row) => row.count), 1);

  return (
    <>
      <PageHeader
        title={t(greetingKey(), { name: user.fullName.split(" ")[0] })}
        subtitle={fmt.longDate()}
        actions={
          <>
            <button className="btn btn-outline" onClick={load}>
              <RefreshCw size={16} /> {t("common.refresh")}
            </button>
            <Link to="/gate" className="btn btn-primary">
              <DoorOpen size={18} /> {t("dashboard.openGate")}
            </Link>
          </>
        }
      />

      <div className="stat-grid">
        <StatCard
          icon={OutIcon}
          tone="warning"
          label={t("dashboard.statOutside")}
          value={totals.outside}
          hint={t("dashboard.statOutsideHint")}
        />
        <StatCard
          icon={AlertTriangle}
          tone={totals.overdue ? "danger" : "success"}
          label={t("dashboard.statOverdue")}
          value={totals.overdue}
          hint={t("dashboard.statOverdueHint", { hours: overdueHours })}
        />
        <StatCard
          icon={ArrowUpRight}
          tone="primary"
          label={t("dashboard.statOutToday")}
          value={totals.outToday}
        />
        <StatCard
          icon={ArrowDownLeft}
          tone="success"
          label={t("dashboard.statReturnedToday")}
          value={totals.returnedToday}
        />
        <StatCard
          icon={Laptop}
          tone="primary"
          label={t("dashboard.statAssets")}
          value={totals.totalAssets}
        />
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card__header">
            <h3>{t("dashboard.byType")}</h3>
            <Link to="/outside" className="link">
              {t("dashboard.viewList")}
            </Link>
          </div>
          <div className="card__body">
            {outsideByType.length === 0 ? (
              <p className="muted">{t("dashboard.allInOffice")}</p>
            ) : (
              <ul className="bars">
                {outsideByType.map((row) => (
                  <li key={row.type}>
                    <div className="bars__label">
                      <AssetIcon type={row.type} size={16} /> {tType(row.type)}
                      <b>{row.count}</b>
                    </div>
                    <div className="bars__track">
                      <div
                        className="bars__fill"
                        style={{ width: `${(row.count / maxType) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="card">
          <div className="card__header">
            <h3>{t("dashboard.recent")}</h3>
            <Link to="/history" className="link">
              {t("dashboard.fullHistory")}
            </Link>
          </div>
          <div className="card__body card__body--flush">
            {recentActivity.length === 0 ? (
              <p className="muted pad">{t("dashboard.noMovements")}</p>
            ) : (
              <ul className="activity">
                {recentActivity.map((item) => (
                  <li key={`${item._id}-${item.event}`}>
                    <span
                      className={`activity__dot activity__dot--${item.event}`}
                    >
                      {item.event === "return" ? (
                        <ArrowDownLeft size={14} />
                      ) : (
                        <ArrowUpRight size={14} />
                      )}
                    </span>
                    <div className="activity__text">
                      {rich(
                        item.event === "return"
                          ? "dashboard.activityReturn"
                          : "dashboard.activityOut",
                        {
                          name: <strong>{item.employee.fullName}</strong>,
                          type: tType(item.asset.type).toLowerCase(),
                          serial: <code>{item.asset.serialNumber}</code>,
                        },
                      )}
                      <small>
                        {fmt.dateTime(item.at)}
                        {item.by ? ` · ${item.by}` : ""}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
