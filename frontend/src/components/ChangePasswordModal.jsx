// ============================================================
// FILE:   frontend/src/components/ChangePasswordModal.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../api/client.js";
import { useI18n } from "../i18n/LanguageContext.jsx";
import Modal from "./ui/Modal.jsx";

const initial = { currentPassword: "", newPassword: "", confirm: "" };

export default function ChangePasswordModal({ open, onClose }) {
  const { t } = useI18n();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const close = () => {
    setForm(initial);
    setError("");
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirm)
      return setError(t("password.mismatch"));

    setBusy(true);
    try {
      await api.patch("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success(t("password.updated"));
      close();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      title={t("password.title")}
      onClose={close}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={close}>
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="change-password-form"
            className="btn btn-primary"
            disabled={busy}
          >
            {busy ? t("common.saving") : t("password.submit")}
          </button>
        </>
      }
    >
      <form id="change-password-form" onSubmit={submit} className="form-grid">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="field">
          <label htmlFor="cp-current">{t("password.current")}</label>
          <input
            id="cp-current"
            type="password"
            className="input"
            value={form.currentPassword}
            onChange={set("currentPassword")}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="field">
          <label htmlFor="cp-new">{t("password.new")}</label>
          <input
            id="cp-new"
            type="password"
            className="input"
            value={form.newPassword}
            onChange={set("newPassword")}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <small className="field__hint">{t("password.hint")}</small>
        </div>
        <div className="field">
          <label htmlFor="cp-confirm">{t("password.confirm")}</label>
          <input
            id="cp-confirm"
            type="password"
            className="input"
            value={form.confirm}
            onChange={set("confirm")}
            required
            autoComplete="new-password"
          />
        </div>
      </form>
    </Modal>
  );
}
