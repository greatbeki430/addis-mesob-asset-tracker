// ============================================================
// FILE:   frontend/src/components/gate/CheckOutPanel.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ScanLine,
  Search,
  UserSearch,
} from "lucide-react";

import api, { getErrorMessage } from "../../api/client.js";
import { useI18n } from "../../i18n/LanguageContext.jsx";
import { AssetCard, EmployeeCard } from "./Cards.jsx";

export default function CheckOutPanel() {
  const { t, rich, tType, fmt } = useI18n();
  const serialRef = useRef(null);
  const employeeRef = useRef(null);

  const [serial, setSerial] = useState("");
  const [asset, setAsset] = useState(null);
  const [openLog, setOpenLog] = useState(null);
  const [assetError, setAssetError] = useState("");
  const [assetBusy, setAssetBusy] = useState(false);

  const [empCode, setEmpCode] = useState("");
  const [employee, setEmployee] = useState(null);
  const [itemsOut, setItemsOut] = useState(0);
  const [empError, setEmpError] = useState("");
  const [empBusy, setEmpBusy] = useState(false);

  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const resetAll = () => {
    setSerial("");
    setAsset(null);
    setOpenLog(null);
    setAssetError("");
    setEmpCode("");
    setEmployee(null);
    setItemsOut(0);
    setEmpError("");
    setNote("");
    setTimeout(() => serialRef.current?.focus(), 50);
  };

  const lookupAsset = async () => {
    const code = serial.trim();
    if (!code) return;
    setAssetBusy(true);
    setAssetError("");
    setReceipt(null);
    try {
      const res = await api.get(`/assets/lookup/${encodeURIComponent(code)}`);
      setAsset(res.data.asset);
      setOpenLog(res.data.openLog);
      if (res.data.asset.status === "in_office" && res.data.asset.isActive) {
        setTimeout(() => employeeRef.current?.focus(), 50);
      }
    } catch (err) {
      setAsset(null);
      setOpenLog(null);
      setAssetError(getErrorMessage(err));
    } finally {
      setAssetBusy(false);
    }
  };

  const lookupEmployee = async () => {
    const code = empCode.trim();
    if (!code) return;
    setEmpBusy(true);
    setEmpError("");
    try {
      const res = await api.get(
        `/employees/lookup/${encodeURIComponent(code)}`,
      );
      setEmployee(res.data.employee);
      setItemsOut(res.data.itemsOut);
    } catch (err) {
      setEmployee(null);
      setEmpError(getErrorMessage(err));
    } finally {
      setEmpBusy(false);
    }
  };

  const onEnter = (fn) => (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fn();
    }
  };

  const assetReady = asset && asset.isActive && asset.status === "in_office";
  const canSubmit = assetReady && employee && !submitting;

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/gate/check-out", {
        assetId: asset._id,
        employeeId: employee._id,
        note,
      });
      toast.success(t("checkout.toast"));
      setReceipt(res.data);
      resetAll();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gate-grid">
      {/* Step 1 - asset */}
      <section className="card step-card">
        <div className="step-card__head">
          <span className="step-no">1</span>
          <div>
            <h3>{t("checkout.assetTitle")}</h3>
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
              onKeyDown={onEnter(lookupAsset)}
              autoFocus
              autoCapitalize="characters"
              autoComplete="off"
            />
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={lookupAsset}
            disabled={assetBusy || !serial.trim()}
          >
            <Search size={18} /> {assetBusy ? "…" : t("common.find")}
          </button>
        </div>

        {assetError && <div className="alert alert-danger">{assetError}</div>}

        {asset && (
          <>
            <AssetCard asset={asset} />
            {!asset.isActive && (
              <div className="alert alert-danger">
                {t("checkout.assetDeactivated")}
              </div>
            )}
            {asset.status === "checked_out" && openLog && (
              <div className="alert alert-warning">
                <AlertTriangle size={18} />
                <div>
                  {rich("checkout.alreadyOutside", {
                    name: <b>{openLog.employeeSnapshot.fullName}</b>,
                    date: fmt.fullDateTime(openLog.checkOutAt),
                    tab: <b>{t("gate.tabReturn")}</b>,
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Step 2 - employee */}
      <section
        className={`card step-card ${!assetReady ? "step-card--disabled" : ""}`}
      >
        <div className="step-card__head">
          <span className="step-no">2</span>
          <div>
            <h3>{t("checkout.employeeTitle")}</h3>
            <p>{t("checkout.employeeHint")}</p>
          </div>
        </div>

        <div className="input-action">
          <div className="input-icon">
            <UserSearch size={18} />
            <input
              ref={employeeRef}
              className="input input--lg"
              placeholder={t("checkout.employeePlaceholder")}
              aria-label={t("checkout.employeePlaceholder")}
              value={empCode}
              onChange={(e) => setEmpCode(e.target.value)}
              onKeyDown={onEnter(lookupEmployee)}
              disabled={!assetReady}
              autoCapitalize="characters"
              autoComplete="off"
            />
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={lookupEmployee}
            disabled={!assetReady || empBusy || !empCode.trim()}
          >
            <Search size={18} /> {empBusy ? "…" : t("common.find")}
          </button>
        </div>

        {empError && <div className="alert alert-danger">{empError}</div>}
        {employee && (
          <EmployeeCard
            employee={employee}
            extra={
              itemsOut > 0 && (
                <div className="info-card__note">
                  {t("checkout.holding", { count: itemsOut })}
                </div>
              )
            }
          />
        )}

        <div className="field">
          <label htmlFor="co-note">{t("common.noteOptional")}</label>
          <input
            id="co-note"
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("checkout.notePlaceholder")}
            maxLength={300}
            disabled={!assetReady}
          />
        </div>

        <button
          className="btn btn-primary btn-lg btn-block"
          onClick={submit}
          disabled={!canSubmit}
        >
          <ArrowUpRight size={20} />{" "}
          {submitting ? t("common.recording") : t("checkout.confirm")}
        </button>
      </section>

      {/* Receipt of the last action */}
      {receipt && (
        <section className="card receipt receipt--out">
          <CheckCircle2 size={22} />
          <div>
            <strong>
              {t("checkout.receiptTitle", {
                serial: receipt.assetSnapshot.serialNumber,
                name: receipt.employeeSnapshot.fullName,
              })}
            </strong>
            <span>
              {t("checkout.receiptText", {
                type: tType(receipt.assetSnapshot.type),
                time: fmt.dateTime(receipt.checkOutAt),
              })}
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
