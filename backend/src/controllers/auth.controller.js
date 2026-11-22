// ============================================================
// FILE:   backend/src/controllers/auth.controller.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username.toLowerCase() }).select(
    "+password",
  );
  // Same message for unknown user / wrong password to avoid user enumeration
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "auth.invalidCredentials");
  }
  if (!user.isActive) {
    throw new ApiError(403, "auth.accountDisabled");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    data: { token: signToken(user), user, branch: env.branchName },
  });
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user, branch: env.branchName } });
});

// PATCH /api/auth/password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, "auth.currentPasswordWrong");
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: req.t("auth.passwordUpdated") });
});
