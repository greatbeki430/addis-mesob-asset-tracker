// ============================================================
// FILE:   backend/src/controllers/gate.controller.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const Asset = require("../models/Asset");
const Employee = require("../models/Employee");
const GateLog = require("../models/GateLog");
const env = require("../config/env");
const { has } = require("../i18n");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  HOUR_MS,
  DAY_MS,
  escapeRegex,
  parsePagination,
  buildMeta,
  isDateString,
  localDayStart,
} = require("../utils/helpers");

const POPULATE_USERS = [
  { path: "checkOutBy", select: "fullName" },
  { path: "checkInBy", select: "fullName" },
];

const withDuration = (log) => {
  const end = log.checkInAt ? new Date(log.checkInAt).getTime() : Date.now();
  const hoursOut = (end - new Date(log.checkOutAt).getTime()) / HOUR_MS;
  return {
    ...log,
    hoursOut: Math.round(hoursOut * 10) / 10,
    isOverdue: log.status === "OUT" && hoursOut >= env.overdueHours,
  };
};

const buildFilter = (query, forcedStatus) => {
  const filter = {};
  const status = forcedStatus || query.status;
  if (["OUT", "RETURNED"].includes(status)) filter.status = status;
  if (query.type) filter["assetSnapshot.type"] = String(query.type);

  const range = {};
  if (isDateString(query.from)) range.$gte = localDayStart(query.from);
  if (isDateString(query.to))
    range.$lt = new Date(localDayStart(query.to).getTime() + DAY_MS);
  if (Object.keys(range).length) filter.checkOutAt = range;

  if (query.q) {
    const rx = new RegExp(escapeRegex(String(query.q).trim()), "i");
    filter.$or = [
      { "assetSnapshot.serialNumber": rx },
      { "assetSnapshot.assetTag": rx },
      { "assetSnapshot.brand": rx },
      { "employeeSnapshot.fullName": rx },
      { "employeeSnapshot.employeeId": rx },
      { "employeeSnapshot.department": rx },
    ];
  }
  return filter;
};

// POST /api/gate/check-out  - employee takes an asset out of the building
exports.checkOut = asyncHandler(async (req, res) => {
  const { assetId, employeeId, note } = req.body;

  const employee = await Employee.findOne({ _id: employeeId, isActive: true });
  if (!employee) throw new ApiError(404, "employee.inactiveOrMissing");

  // Atomic status flip: only succeeds if the asset is active AND currently in the office
  const asset = await Asset.findOneAndUpdate(
    { _id: assetId, isActive: true, status: "in_office" },
    { status: "checked_out" },
    { new: true },
  );
  if (!asset) {
    const existing = await Asset.findById(assetId);
    if (!existing) throw new ApiError(404, "asset.notFound");
    if (!existing.isActive) throw new ApiError(409, "asset.inactiveNoCheckout");
    throw new ApiError(409, "gate.alreadyOut");
  }

  try {
    const log = await GateLog.create({
      asset: asset._id,
      employee: employee._id,
      assetSnapshot: {
        serialNumber: asset.serialNumber,
        assetTag: asset.assetTag,
        type: asset.type,
        brand: asset.brand,
        model: asset.model,
      },
      employeeSnapshot: {
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        department: employee.department,
      },
      checkOutBy: req.user._id,
      checkOutNote: note,
    });

    res
      .status(201)
      .json({ success: true, message: req.t("gate.checkedOut"), data: log });
  } catch (err) {
    // Roll back the asset status if the log could not be written
    await Asset.updateOne({ _id: asset._id }, { status: "in_office" });
    throw err;
  }
});

// POST /api/gate/check-in  - asset comes back into the building
exports.checkIn = asyncHandler(async (req, res) => {
  const { assetId, note } = req.body;

  const log = await GateLog.findOneAndUpdate(
    { asset: assetId, status: "OUT" },
    {
      status: "RETURNED",
      checkInAt: new Date(),
      checkInBy: req.user._id,
      checkInNote: note,
    },
    { new: true },
  );
  if (!log) throw new ApiError(404, "gate.noOpenLog");

  await Asset.updateOne({ _id: assetId }, { status: "in_office" });

  res.json({ success: true, message: req.t("gate.returned"), data: log });
});

// GET /api/gate/outside  - everything currently outside (replaces the paper list)
exports.listOutside = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query, "OUT");
  const logs = await GateLog.find(filter)
    .sort({ checkOutAt: 1 })
    .populate(POPULATE_USERS)
    .lean();

  const data = logs.map(withDuration);
  res.json({
    success: true,
    data,
    meta: {
      total: data.length,
      overdue: data.filter((l) => l.isOverdue).length,
      overdueHours: env.overdueHours,
    },
  });
});

// GET /api/gate/history
exports.listHistory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildFilter(req.query);

  const [logs, total] = await Promise.all([
    GateLog.find(filter)
      .sort({ checkOutAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(POPULATE_USERS)
      .lean(),
    GateLog.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: logs.map(withDuration),
    meta: buildMeta(total, page, limit),
  });
});

// GET /api/gate/history/export  - CSV download (opens in Excel)
exports.exportHistory = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);
  const logs = await GateLog.find(filter)
    .sort({ checkOutAt: -1 })
    .limit(10000)
    .populate(POPULATE_USERS)
    .lean();

  const fmt = (d) =>
    d
      ? new Date(new Date(d).getTime() + env.tzOffsetMinutes * 60000)
          .toISOString()
          .replace("T", " ")
          .slice(0, 16)
      : "";
  // Prevent spreadsheet formula injection and escape quotes
  const cell = (value) => {
    let s = String(value ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };

  // Headers, status and asset type are written in the language of the person exporting
  const typeLabel = (type) =>
    has(`assetTypes.${type}`) ? req.t(`assetTypes.${type}`) : type;

  const header = [
    "csv.employeeId",
    "csv.employee",
    "csv.department",
    "csv.assetType",
    "csv.brand",
    "csv.model",
    "csv.serialNumber",
    "csv.assetTag",
    "csv.status",
    "csv.out",
    "csv.releasedBy",
    "csv.returned",
    "csv.receivedBy",
    "csv.note",
  ].map((key) => req.t(key));

  const rows = logs.map((l) => [
    l.employeeSnapshot.employeeId,
    l.employeeSnapshot.fullName,
    l.employeeSnapshot.department,
    typeLabel(l.assetSnapshot.type),
    l.assetSnapshot.brand,
    l.assetSnapshot.model,
    l.assetSnapshot.serialNumber,
    l.assetSnapshot.assetTag,
    l.status === "OUT"
      ? req.t("csv.statusOutside")
      : req.t("csv.statusReturned"),
    fmt(l.checkOutAt),
    l.checkOutBy?.fullName,
    fmt(l.checkInAt),
    l.checkInBy?.fullName,
    [l.checkOutNote, l.checkInNote].filter(Boolean).join(" | "),
  ]);

  const csv =
    "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="gate-history-${new Date().toISOString().slice(0, 10)}.csv"`,
  );
  res.send(csv);
});
