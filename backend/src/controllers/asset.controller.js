// ============================================================
// FILE:   backend/src/controllers/asset.controller.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const Asset = require("../models/Asset");
const GateLog = require("../models/GateLog");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { escapeRegex, parsePagination, buildMeta } = require("../utils/helpers");

// GET /api/assets
exports.listAssets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = String(req.query.status);
  if (req.query.type) filter.type = String(req.query.type);
  if (req.query.isActive === "true") filter.isActive = true;
  if (req.query.isActive === "false") filter.isActive = false;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).trim()), "i");
    filter.$or = [
      { serialNumber: rx },
      { assetTag: rx },
      { brand: rx },
      { model: rx },
    ];
  }

  const [items, total] = await Promise.all([
    Asset.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Asset.countDocuments(filter),
  ]);

  res.json({ success: true, data: items, meta: buildMeta(total, page, limit) });
});

// GET /api/assets/lookup/:code  (serial number or asset tag - used by the gate desk)
exports.lookupAsset = asyncHandler(async (req, res) => {
  const code = String(req.params.code).trim().toUpperCase();
  const asset = await Asset.findOne({
    $or: [{ serialNumber: code }, { assetTag: code }],
  });
  if (!asset) throw new ApiError(404, "asset.notFoundCode", { code });

  let openLog = null;
  if (asset.status === "checked_out") {
    openLog = await GateLog.findOne({
      asset: asset._id,
      status: "OUT",
    }).populate("checkOutBy", "fullName");
  }

  res.json({ success: true, data: { asset, openLog } });
});

// POST /api/assets
exports.createAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.create(req.body);
  res.status(201).json({ success: true, data: asset });
});

// PATCH /api/assets/:id
exports.updateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) throw new ApiError(404, "asset.notFound");

  if (req.body.isActive === false && asset.status === "checked_out") {
    throw new ApiError(409, "asset.isOutside");
  }

  Object.assign(asset, req.body);
  await asset.save();
  res.json({ success: true, data: asset });
});

// DELETE /api/assets/:id  (soft delete - history must be preserved)
exports.deactivateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) throw new ApiError(404, "asset.notFound");
  if (asset.status === "checked_out") {
    throw new ApiError(409, "asset.isOutside");
  }

  asset.isActive = false;
  await asset.save();
  res.json({ success: true, data: asset, message: req.t("asset.deactivated") });
});
