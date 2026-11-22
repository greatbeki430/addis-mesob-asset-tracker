// ============================================================
// FILE:   frontend/src/pages/UsersPage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, UserCog } from "lucide-react";

import api, { getErrorMessage } from "../api/client.js";
import usePagedQuery from "../hooks/usePagedQuery.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useI18n } from "../i18n/LanguageContext.jsx";
import { ROLES } from "../constants.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import SearchInput from "../components/ui/SearchInput.jsx";
import Badge from "../components/ui/Badge.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import Modal from "../components/ui/Modal.jsx";

const LIMIT = 10;
const EMPTY = {
  fullName: "",
  username: "",
  password: "",
  role: "security",
  isActive: true,
};

export default function UsersPage() {
  const { user: me } = useAuth();
  const { t, fmt } = useI18n();
  const [filters, setFilters] = useState({ q: "", role: "" });
  const { items, meta, loading, page, setPage, reload } = usePagedQuery(
    "/users",
    filters,
    LIMIT,
  );

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openNew = () => {
    setForm(EMPTY);
    setFormError("");
    setEditing({});
  };
  const openEdit = (u) => {
    setForm({
      fullName: u.fullName,
      username: u.username,
      password: "",
      role: u.role,
      isActive: u.isActive,
    });
    setFormError("");
    setEditing(u);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editing._id) {
        const payload = {
          fullName: form.fullName,
          role: form.role,
          isActive: form.isActive,
        };
        if (form.password) payload.password = form.password; // optional password reset
        await api.patch(`/users/${editing._id}`, payload);
      } else {
        await api.post("/users", {
          fullName: form.fullName,
          username: form.username,
          password: form.password,
          role: form.role,
        });
      }
      toast.success(editing._id ? t("users.updated") : t("users.created"));
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const isSelf = editing?._id && editing._id === me._id;

  return (
    <>
      <PageHeader
        title={t("users.title")}
        subtitle={t("users.subtitle")}
        actions={
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={18} /> {t("users.add")}
          </button>
        }
      />

      <div className="card">
        <div className="toolbar">
          <SearchInput
            value={filters.q}
            onChange={(v) => setFilters((f) => ({ ...f, q: v }))}
            placeholder={t("users.search")}
          />
          <select
            className="select"
            value={filters.role}
            onChange={(e) =>
              setFilters((f) => ({ ...f, role: e.target.value }))
            }
            aria-label={t("users.fieldRole")}
          >
            <option value="">{t("users.allRoles")}</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {t(r.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState icon={UserCog} title={t("users.emptyTitle")} />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("users.colName")}</th>
                  <th>{t("users.fieldUsername")}</th>
                  <th>{t("users.fieldRole")}</th>
                  <th>{t("table.status")}</th>
                  <th>{t("users.lastSignIn")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u._id}>
                    <td data-label={t("users.colName")}>
                      <div className="cell-main">
                        {u.fullName}
                        {u._id === me._id && (
                          <span className="cell-sub"> {t("users.you")}</span>
                        )}
                      </div>
                    </td>
                    <td data-label={t("users.fieldUsername")}>
                      <code>{u.username}</code>
                    </td>
                    <td data-label={t("users.fieldRole")}>
                      {u.role === "admin" ? (
                        <Badge tone="info">{t("roles.admin")}</Badge>
                      ) : (
                        <Badge tone="neutral">{t("roles.security")}</Badge>
                      )}
                    </td>
                    <td data-label={t("table.status")}>
                      {u.isActive ? (
                        <Badge tone="success">{t("badge.active")}</Badge>
                      ) : (
                        <Badge tone="danger">{t("badge.disabled")}</Badge>
                      )}
                    </td>
                    <td data-label={t("users.lastSignIn")}>
                      {fmt.dateTime(u.lastLoginAt)}
                    </td>
                    <td data-label="" className="actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openEdit(u)}
                      >
                        <Pencil size={14} /> {t("common.edit")}
                      </button>
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

      <Modal
        open={Boolean(editing)}
        title={editing?._id ? t("users.editTitle") : t("users.addTitle")}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setEditing(null)}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              form="user-form"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </>
        }
      >
        <form id="user-form" onSubmit={save} className="form-grid">
          {formError && <div className="alert alert-danger">{formError}</div>}
          <div className="field">
            <label htmlFor="u-name">{t("employees.fieldName")} *</label>
            <input
              id="u-name"
              className="input"
              value={form.fullName}
              onChange={set("fullName")}
              required
              maxLength={100}
            />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="u-username">{t("users.fieldUsername")} *</label>
              <input
                id="u-username"
                className="input"
                value={form.username}
                onChange={set("username")}
                required
                disabled={Boolean(editing?._id)}
                autoCapitalize="none"
                maxLength={30}
              />
            </div>
            <div className="field">
              <label htmlFor="u-role">{t("users.fieldRole")} *</label>
              <select
                id="u-role"
                className="select"
                value={form.role}
                onChange={set("role")}
                disabled={isSelf}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {t(r.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="u-password">
              {editing?._id
                ? t("users.resetPassword")
                : `${t("users.fieldPassword")} *`}
            </label>
            <input
              id="u-password"
              type="password"
              className="input"
              value={form.password}
              onChange={set("password")}
              required={!editing?._id}
              minLength={8}
              autoComplete="new-password"
            />
            <small className="field__hint">{t("password.hint")}</small>
          </div>
          {editing?._id && (
            <label className="check">
              <input
                type="checkbox"
                checked={form.isActive}
                disabled={isSelf}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              {t("users.enabledCheck")}
            </label>
          )}
        </form>
      </Modal>
    </>
  );
}
