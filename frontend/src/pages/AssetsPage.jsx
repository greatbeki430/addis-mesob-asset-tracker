// ============================================================
// FILE:   frontend/src/pages/AssetsPage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useState } from "react";
import toast from "react-hot-toast";
import { Laptop, Pencil, Plus, Trash2 } from "lucide-react";

import api, { getErrorMessage } from "../api/client.js";
import usePagedQuery from "../hooks/usePagedQuery.js";
import { useI18n } from "../i18n/LanguageContext.jsx";
import { ASSET_TYPES } from "../constants.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import SearchInput from "../components/ui/SearchInput.jsx";
import Badge from "../components/ui/Badge.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { AssetIcon } from "../components/gate/Cards.jsx";

const LIMIT = 10;
const EMPTY = {
  serialNumber: "",
  assetTag: "",
  type: "Laptop",
  brand: "",
  model: "",
  notes: "",
  isActive: true,
};

export default function AssetsPage() {
  const { t, rich, tType } = useI18n();
  const [filters, setFilters] = useState({
    q: "",
    type: "",
    status: "",
    isActive: "",
  });
  const { items, meta, loading, page, setPage, reload } = usePagedQuery(
    "/assets",
    filters,
    LIMIT,
  );

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toDeactivate, setToDeactivate] = useState(null);

  const setFilter = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openNew = () => {
    setForm(EMPTY);
    setFormError("");
    setEditing({});
  };
  const openEdit = (asset) => {
    setForm({
      serialNumber: asset.serialNumber,
      assetTag: asset.assetTag || "",
      type: asset.type,
      brand: asset.brand || "",
      model: asset.model || "",
      notes: asset.notes || "",
      isActive: asset.isActive,
    });
    setFormError("");
    setEditing(asset);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editing._id) await api.patch(`/assets/${editing._id}`, form);
      else await api.post("/assets", form);
      toast.success(editing._id ? t("assets.updated") : t("assets.registered"));
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
      await api.delete(`/assets/${toDeactivate._id}`);
      toast.success(t("assets.deactivated"));
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setToDeactivate(null);
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("assets.title")}
        subtitle={t("assets.subtitle")}
        actions={
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={18} /> {t("assets.register")}
          </button>
        }
      />

      <div className="card">
        <div className="toolbar toolbar--wrap">
          <SearchInput
            value={filters.q}
            onChange={(v) => setFilters((f) => ({ ...f, q: v }))}
            placeholder={t("assets.search")}
          />
          <select
            className="select"
            value={filters.type}
            onChange={setFilter("type")}
            aria-label={t("assets.fieldType")}
          >
            <option value="">{t("common.allTypes")}</option>
            {ASSET_TYPES.map((type) => (
              <option key={type} value={type}>
                {tType(type)}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={filters.status}
            onChange={setFilter("status")}
            aria-label={t("table.location")}
          >
            <option value="">{t("assets.anyLocation")}</option>
            <option value="in_office">{t("badge.inOffice")}</option>
            <option value="checked_out">{t("badge.outside")}</option>
          </select>
          <select
            className="select"
            value={filters.isActive}
            onChange={setFilter("isActive")}
            aria-label={t("table.status")}
          >
            <option value="">{t("assets.activeAndInactive")}</option>
            <option value="true">{t("assets.activeOnly")}</option>
            <option value="false">{t("assets.inactiveOnly")}</option>
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Laptop}
            title={t("assets.emptyTitle")}
            text={t("assets.emptyText")}
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("table.asset")}</th>
                  <th>{t("table.serial")}</th>
                  <th>{t("table.tag")}</th>
                  <th>{t("table.location")}</th>
                  <th>{t("table.status")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((asset) => (
                  <tr key={asset._id}>
                    <td data-label={t("table.asset")}>
                      <span className="cell-icon">
                        <AssetIcon type={asset.type} size={18} />
                        <span>
                          <div className="cell-main">
                            {[asset.brand, asset.model]
                              .filter(Boolean)
                              .join(" ") || tType(asset.type)}
                          </div>
                          <div className="cell-sub">{tType(asset.type)}</div>
                        </span>
                      </span>
                    </td>
                    <td data-label={t("table.serial")}>
                      <code>{asset.serialNumber}</code>
                    </td>
                    <td data-label={t("table.tag")}>{asset.assetTag || "—"}</td>
                    <td data-label={t("table.location")}>
                      {asset.status === "checked_out" ? (
                        <Badge tone="warning">{t("badge.outside")}</Badge>
                      ) : (
                        <Badge tone="success">{t("badge.inOffice")}</Badge>
                      )}
                    </td>
                    <td data-label={t("table.status")}>
                      {asset.isActive ? (
                        <Badge tone="info">{t("badge.active")}</Badge>
                      ) : (
                        <Badge tone="neutral">{t("badge.inactive")}</Badge>
                      )}
                    </td>
                    <td data-label="" className="actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openEdit(asset)}
                      >
                        <Pencil size={14} /> {t("common.edit")}
                      </button>
                      {asset.isActive && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setToDeactivate(asset)}
                        >
                          <Trash2 size={14} /> {t("common.deactivate")}
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
        title={editing?._id ? t("assets.editTitle") : t("assets.registerTitle")}
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
              form="asset-form"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </>
        }
      >
        <form id="asset-form" onSubmit={save} className="form-grid">
          {formError && <div className="alert alert-danger">{formError}</div>}
          <div className="form-row">
            <div className="field">
              <label htmlFor="as-serial">{t("assets.fieldSerial")} *</label>
              <input
                id="as-serial"
                className="input"
                value={form.serialNumber}
                onChange={set("serialNumber")}
                required
                maxLength={60}
                autoCapitalize="characters"
              />
            </div>
            <div className="field">
              <label htmlFor="as-tag">{t("assets.fieldTag")}</label>
              <input
                id="as-tag"
                className="input"
                value={form.assetTag}
                onChange={set("assetTag")}
                maxLength={40}
                placeholder="AK-LT-0001"
                autoCapitalize="characters"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="as-type">{t("assets.fieldType")} *</label>
            <select
              id="as-type"
              className="select"
              value={form.type}
              onChange={set("type")}
              required
            >
              {ASSET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {tType(type)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="as-brand">{t("assets.fieldBrand")}</label>
              <input
                id="as-brand"
                className="input"
                value={form.brand}
                onChange={set("brand")}
                maxLength={60}
              />
            </div>
            <div className="field">
              <label htmlFor="as-model">{t("assets.fieldModel")}</label>
              <input
                id="as-model"
                className="input"
                value={form.model}
                onChange={set("model")}
                maxLength={80}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="as-notes">{t("assets.fieldNotes")}</label>
            <textarea
              id="as-notes"
              className="input"
              rows={2}
              value={form.notes}
              onChange={set("notes")}
              maxLength={300}
            />
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
              {t("assets.activeCheck")}
            </label>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDeactivate)}
        title={t("assets.deactivateTitle")}
        tone="danger"
        confirmLabel={t("common.deactivate")}
        busy={saving}
        onConfirm={deactivate}
        onCancel={() => setToDeactivate(null)}
        message={
          toDeactivate && (
            <p>
              {rich("assets.deactivateMessage", {
                serial: <b>{toDeactivate.serialNumber}</b>,
              })}
            </p>
          )
        }
      />
    </>
  );
}
