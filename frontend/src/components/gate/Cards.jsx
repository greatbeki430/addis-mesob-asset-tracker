// ============================================================
// FILE:   frontend/src/components/gate/Cards.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import {
  Laptop,
  Monitor,
  Printer,
  Projector,
  Smartphone,
  Tablet,
  HardDrive,
  Package,
} from "lucide-react";
import Badge from "../ui/Badge.jsx";
import { useI18n } from "../../i18n/LanguageContext.jsx";
import { initials } from "../../utils/format.js";

const TYPE_ICONS = {
  Laptop,
  Tablet,
  "Desktop PC": HardDrive,
  "Mobile Phone": Smartphone,
  Monitor,
  Projector,
  Printer,
  Other: Package,
};

export const AssetIcon = ({ type, size = 22 }) => {
  const Icon = TYPE_ICONS[type] || Package;
  return <Icon size={size} />;
};

export function AssetCard({ asset, snapshot, extra }) {
  const { t, tType } = useI18n();
  const a = asset || snapshot;
  return (
    <div className="info-card">
      <div className="info-card__icon">
        <AssetIcon type={a.type} />
      </div>
      <div className="info-card__body">
        <div className="info-card__title">
          {[a.brand, a.model].filter(Boolean).join(" ") || tType(a.type)}
          {asset && (
            <>
              {" "}
              {!asset.isActive ? (
                <Badge tone="neutral">{t("badge.inactive")}</Badge>
              ) : asset.status === "checked_out" ? (
                <Badge tone="warning">{t("badge.outside")}</Badge>
              ) : (
                <Badge tone="success">{t("badge.inOffice")}</Badge>
              )}
            </>
          )}
        </div>
        <div className="info-card__meta">
          <span>
            {t("card.serial")} <b>{a.serialNumber}</b>
          </span>
          {a.assetTag && (
            <span>
              {t("card.tag")} <b>{a.assetTag}</b>
            </span>
          )}
          <span>{tType(a.type)}</span>
        </div>
        {extra}
      </div>
    </div>
  );
}

export function EmployeeCard({ employee, snapshot, extra }) {
  const { t } = useI18n();
  const e = employee || snapshot;
  return (
    <div className="info-card">
      <div className="avatar avatar--lg">{initials(e.fullName)}</div>
      <div className="info-card__body">
        <div className="info-card__title">{e.fullName}</div>
        <div className="info-card__meta">
          <span>
            {t("card.id")} <b>{e.employeeId}</b>
          </span>
          {e.department && <span>{e.department}</span>}
        </div>
        {extra}
      </div>
    </div>
  );
}
