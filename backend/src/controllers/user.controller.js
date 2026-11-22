// ============================================================
// FILE:   backend/src/controllers/user.controller.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { escapeRegex, parsePagination, buildMeta } = require("../utils/helpers");

// GET /api/users
exports.listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};

  if (req.query.role) filter.role = String(req.query.role);
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).trim()), "i");
    filter.$or = [{ fullName: rx }, { username: rx }];
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, data: items, meta: buildMeta(total, page, limit) });
});

// POST /api/users
exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// PATCH /api/users/:id
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "user.notFound");

  const isSelf = user._id.equals(req.user._id);
  if (
    isSelf &&
    (req.body.isActive === false ||
      (req.body.role && req.body.role !== "admin"))
  ) {
    throw new ApiError(400, "user.selfProtect");
  }

  Object.assign(user, req.body);
  await user.save();

  res.json({ success: true, data: user });
});
