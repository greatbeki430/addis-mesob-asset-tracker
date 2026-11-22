// ============================================================
// FILE:   backend/src/middleware/auth.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

// Requires a valid Bearer token and loads the current user.
const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new ApiError(401, "auth.required");

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "auth.sessionExpired");
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive)
    throw new ApiError(401, "auth.accountDisabledOrMissing");

  req.user = user;
  next();
});

// Restricts a route to the given roles.
const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "auth.forbidden"));
    }
    next();
  };

module.exports = { protect, authorize };
