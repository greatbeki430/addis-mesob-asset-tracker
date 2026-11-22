// ============================================================
// FILE:   frontend/src/pages/EmployeesPage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, UserX, Users } from "lucide-react";

import api, { getErrorMessage } from "../api/client.js";
import usePagedQuery from "../hooks/usePagedQuery.js";
import { useI18n } from "../i18n/LanguageContext.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import SearchInput from "../components/ui/SearchInput.jsx";
import Badge from "../components/ui/Badge.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";

const LIMIT = 8;
const EMPTY = {
  employeeId: "",
  fullName: "",
  department: "",
  phone: "",
  isActive: true,
};

export default function EmployeesPage() {
  const { t, rich } = useI18n();
  const [filters, setFilters] = useState({ q: "", isActive: "" });
  const { items, meta, loading, page, setPage, reload } = usePagedQuery(
    "/employees",
    filters,
    LIMIT,
  );

  const [editing, setEditing] = useState(null); // null = closed, {} = new, {_id} = edit
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toDeactivate, setToDeactivate] = useState(null);

  const openNew = () => {
    setForm(EMPTY);
    setFormError("");
    setEditing({});
  };
  const openEdit = (emp) => {
    setForm({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      department: emp.department,
      phone: emp.phone,
      isActive: emp.isActive,
    });
    setFormError("");
    setEditing(emp);
  };
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editing._id) await api.patch(`/employees/${editing._id}`, form);
      else await api.post("/employees", form);
      toast.success(
        editing._id ? t("employees.updated") : t("employees.added"),
      );
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async () => {
    setSaving(true);
    try {
      await api.delete(`/employees/${toDeactivate._id}`);
      toast.success(t("employees.deactivated"));
      setToDeactivate(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setToDeactivate(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("employees.title")}
        subtitle={t("employees.subtitle")}
        actions={
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={18} /> {t("employees.add")}
          </button>
        }
      />

      <div className="card">
        <div className="toolbar">
          <SearchInput
            value={filters.q}
            onChange={(v) => setFilters((f) => ({ ...f, q: v }))}
            placeholder={t("employees.search")}
          />
          <select
            className="select"
            value={filters.isActive}
            onChange={(e) =>
              setFilters((f) => ({ ...f, isActive: e.target.value }))
            }
            aria-label={t("table.status")}
          >
            <option value="">{t("common.all")}</option>
            <option value="true">{t("badge.active")}</option>
            <option value="false">{t("badge.inactive")}</option>
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t("employees.emptyTitle")}
            text={t("employees.emptyText")}
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("employees.fieldId")}</th>
                  <th>{t("employees.fieldName")}</th>
                  <th>{t("employees.fieldDepartment")}</th>
                  <th>{t("employees.fieldPhone")}</th>
                  <th>{t("table.status")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((emp) => (
                  <tr key={emp._id}>
                    <td data-label={t("employees.fieldId")}>
                      <code>{emp.employeeId}</code>
                    </td>
                    <td data-label={t("employees.fieldName")}>
                      <div className="cell-main">{emp.fullName}</div>
                    </td>
                    <td data-label={t("employees.fieldDepartment")}>
                      {emp.department || "—"}
                    </td>
                    <td data-label={t("employees.fieldPhone")}>
                      {emp.phone || "—"}
                    </td>
                    <td data-label={t("table.status")}>
                      {emp.isActive ? (
                        <Badge tone="success">{t("badge.active")}</Badge>
                      ) : (
                        <Badge tone="neutral">{t("badge.inactive")}</Badge>
                      )}
                    </td>
                    <td data-label="" className="actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openEdit(emp)}
                      >
                        <Pencil size={14} /> {t("common.edit")}
                      </button>
                      {emp.isActive && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setToDeactivate(emp)}
                        >
                          <UserX size={14} /> {t("common.deactivate")}
                        </button>
                      )}
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
        title={
          editing?._id ? t("employees.editTitle") : t("employees.addTitle")
        }
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
              form="employee-form"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </>
        }
      >
        <form id="employee-form" onSubmit={save} className="form-grid">
          {formError && <div className="alert alert-danger">{formError}</div>}
          <div className="field">
            <label htmlFor="emp-id">{t("employees.fieldId")} *</label>
            <input
              id="emp-id"
              className="input"
              value={form.employeeId}
              onChange={set("employeeId")}
              required
              maxLength={30}
              placeholder="AK-001"
            />
          </div>
          <div className="field">
            <label htmlFor="emp-name">{t("employees.fieldName")} *</label>
            <input
              id="emp-name"
              className="input"
              value={form.fullName}
              onChange={set("fullName")}
              required
              maxLength={100}
            />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="emp-dept">{t("employees.fieldDepartment")}</label>
              <input
                id="emp-dept"
                className="input"
                value={form.department}
                onChange={set("department")}
                maxLength={100}
              />
            </div>
            <div className="field">
              <label htmlFor="emp-phone">{t("employees.fieldPhone")}</label>
              <input
                id="emp-phone"
                className="input"
                value={form.phone}
                onChange={set("phone")}
                maxLength={30}
                inputMode="tel"
              />
            </div>
          </div>
          {editing?._id && (
            <label className="check">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              {t("employees.activeCheck")}
            </label>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDeactivate)}
        title={t("employees.deactivateTitle")}
        tone="danger"
        confirmLabel={t("common.deactivate")}
        busy={saving}
        onConfirm={deactivate}
        onCancel={() => setToDeactivate(null)}
        message={
          toDeactivate && (
            <p>
              {rich("employees.deactivateMessage", {
                name: <b>{toDeactivate.fullName}</b>,
              })}
            </p>
          )
        }
      />
    </>
  );
}
