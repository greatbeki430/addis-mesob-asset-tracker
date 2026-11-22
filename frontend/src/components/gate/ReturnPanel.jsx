// ============================================================
// FILE:   frontend/src/components/gate/ReturnPanel.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Info,
  ScanLine,
  Search,
} from "lucide-react";

import api, { getErrorMessage } from "../../api/client.js";
import { useI18n } from "../../i18n/LanguageContext.jsx";
import { hoursSince } from "../../utils/format.js";
import { AssetCard, EmployeeCard } from "./Cards.jsx";

export default function ReturnPanel() {
  const { t, tType, fmt } = useI18n();
  const serialRef = useRef(null);
  const [serial, setSerial] = useState("");
  const [asset, setAsset] = useState(null);
  const [openLog, setOpenLog] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const reset = () => {
    setSerial("");
    setAsset(null);
    setOpenLog(null);
    setError("");
    setNote("");
    setTimeout(() => serialRef.current?.focus(), 50);
  };

  const lookup = async () => {
    const code = serial.trim();
    if (!code) return;
    setBusy(true);
    setError("");
    setReceipt(null);
    try {
      const res = await api.get(`/assets/lookup/${encodeURIComponent(code)}`);
      setAsset(res.data.asset);
      setOpenLog(res.data.openLog);
    } catch (err) {
      setAsset(null);
      setOpenLog(null);
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/gate/check-in", {
        assetId: asset._id,
        note,
      });
      toast.success(t("return.toast"));
      setReceipt(res.data);
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gate-grid">
      <section className="card step-card">
        <div className="step-card__head">
          <span className="step-no step-no--green">1</span>
          <div>
            <h3>{t("return.assetTitle")}</h3>
            <p>{t("gate.scanHint")}</p>
          </div>
        </div>

        <div className="input-action">
          <div className="input-icon">
            <ScanLine size={18} />
            <input
              ref={serialRef}
              className="input input--lg"
              placeholder={t("gate.serialPlaceholder")}
              aria-label={t("gate.serialPlaceholder")}
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), lookup())
              }
              autoFocus
              autoCapitalize="characters"
              autoComplete="off"
            />
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={lookup}
            disabled={busy || !serial.trim()}
          >
            <Search size={18} /> {busy ? "…" : t("common.find")}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {asset && <AssetCard asset={asset} />}

        {asset && !openLog && (
          <div className="alert alert-info">
            <Info size={18} />
            <div>{t("return.alreadyInOffice")}</div>
          </div>
        )}
      </section>

      <section
        className={`card step-card ${!openLog ? "step-card--disabled" : ""}`}
      >
        <div className="step-card__head">
          <span className="step-no step-no--green">2</span>
          <div>
            <h3>{t("return.confirmTitle")}</h3>
            <p>{t("return.confirmHint")}</p>
          </div>
        </div>

        {openLog ? (
          <>
            <EmployeeCard snapshot={openLog.employeeSnapshot} />
            <div className="detail-list">
              <div>
                <span>{t("return.takenOut")}</span>
                <b>{fmt.fullDateTime(openLog.checkOutAt)}</b>
              </div>
              <div>
                <span>{t("return.releasedBy")}</span>
                <b>{openLog.checkOutBy?.fullName || "—"}</b>
              </div>
              <div>
                <span>{t("return.timeOutside")}</span>
                <b>
                  <Clock size={14} />{" "}
                  {fmt.hours(hoursSince(openLog.checkOutAt))}
                </b>
              </div>
              {openLog.checkOutNote && (
                <div>
                  <span>{t("common.note")}</span>
                  <b>{openLog.checkOutNote}</b>
                </div>
              )}
            </div>
            <div className="field">
              <label htmlFor="ci-note">{t("return.conditionNote")}</label>
              <input
                id="ci-note"
                className="input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("return.notePlaceholder")}
                maxLength={300}
              />
            </div>
            <button
              className="btn btn-success btn-lg btn-block"
              onClick={submit}
              disabled={submitting}
            >
              <ArrowDownLeft size={20} />{" "}
              {submitting ? t("common.recording") : t("return.confirm")}
            </button>
          </>
        ) : (
          <p className="muted">{t("return.findFirst")}</p>
        )}
      </section>

      {receipt && (
        <section className="card receipt receipt--in">
          <CheckCircle2 size={22} />
          <div>
            <strong>
              {t("return.receiptTitle", {
                serial: receipt.assetSnapshot.serialNumber,
                name: receipt.employeeSnapshot.fullName,
              })}
            </strong>
            <span>
              {t("return.receiptText", {
                type: tType(receipt.assetSnapshot.type),
                time: fmt.dateTime(receipt.checkInAt),
              })}
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
