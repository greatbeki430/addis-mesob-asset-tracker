// ============================================================
// FILE:   frontend/src/pages/GatePage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { useI18n } from "../i18n/LanguageContext.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import CheckOutPanel from "../components/gate/CheckOutPanel.jsx";
import ReturnPanel from "../components/gate/ReturnPanel.jsx";

export default function GatePage() {
  const { t } = useI18n();
  const [mode, setMode] = useState("out");

  return (
    <>
      <PageHeader title={t("gate.title")} subtitle={t("gate.subtitle")} />

      <div className="segmented" role="tablist">
        <button
          role="tab"
          aria-selected={mode === "out"}
          className={mode === "out" ? "active" : ""}
          onClick={() => setMode("out")}
        >
          <ArrowUpRight size={18} /> {t("gate.tabCheckout")}
        </button>
        <button
          role="tab"
          aria-selected={mode === "in"}
          className={mode === "in" ? "active active--green" : ""}
          onClick={() => setMode("in")}
        >
          <ArrowDownLeft size={18} /> {t("gate.tabReturn")}
        </button>
      </div>

      {mode === "out" ? <CheckOutPanel /> : <ReturnPanel />}
    </>
  );
}
