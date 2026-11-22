// ============================================================
// FILE:   backend/src/middleware/notFound.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const ApiError = require("../utils/ApiError");

module.exports = (req, _res, next) =>
  next(
    new ApiError(404, "common.routeNotFound", {
      method: req.method,
      url: req.originalUrl,
    }),
  );
