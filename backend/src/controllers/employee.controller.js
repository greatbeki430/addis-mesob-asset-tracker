// ============================================================
// FILE:   backend/src/controllers/employee.controller.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const Employee = require("../models/Employee");
const GateLog = require("../models/GateLog");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { escapeRegex, parsePagination, buildMeta } = require("../utils/helpers");

// GET /api/employees
exports.listEmployees = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};

  if (req.query.isActive === "true") filter.isActive = true;
  if (req.query.isActive === "false") filter.isActive = false;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).trim()), "i");
    filter.$or = [{ fullName: rx }, { employeeId: rx }, { department: rx }];
  }

  const [items, total] = await Promise.all([
    Employee.find(filter).sort({ fullName: 1 }).skip(skip).limit(limit),
    Employee.countDocuments(filter),
  ]);

  res.json({ success: true, data: items, meta: buildMeta(total, page, limit) });
});

// GET /api/employees/lookup/:employeeId  (used by the gate desk)
exports.lookupEmployee = asyncHandler(async (req, res) => {
  const code = String(req.params.employeeId).trim().toUpperCase();
  const employee = await Employee.findOne({ employeeId: code });
  if (!employee) throw new ApiError(404, "employee.notFoundId", { code });
  if (!employee.isActive)
    throw new ApiError(403, "employee.inactive", { name: employee.fullName });

  const itemsOut = await GateLog.countDocuments({
    employee: employee._id,
    status: "OUT",
  });
  res.json({ success: true, data: { employee, itemsOut } });
});

// POST /api/employees
exports.createEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(201).json({ success: true, data: employee });
});

// PATCH /api/employees/:id
exports.updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new ApiError(404, "employee.notFound");

  if (req.body.isActive === false) {
    const open = await GateLog.countDocuments({
      employee: employee._id,
      status: "OUT",
    });
    if (open > 0) throw new ApiError(409, "employee.hasItemsOut");
  }

  Object.assign(employee, req.body);
  await employee.save();
  res.json({ success: true, data: employee });
});

// DELETE /api/employees/:id  (soft delete - history must be preserved)
exports.deactivateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new ApiError(404, "employee.notFound");

  const open = await GateLog.countDocuments({
    employee: employee._id,
    status: "OUT",
  });
  if (open > 0) throw new ApiError(409, "employee.hasItemsOut");

  employee.isActive = false;
  await employee.save();
  res.json({
    success: true,
    data: employee,
    message: req.t("employee.deactivated"),
  });
});
