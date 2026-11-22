// ============================================================
// FILE:   backend/src/utils/ApiError.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
/**
 * Throw with a message KEY (see src/i18n/messages.*.js) so the error handler can
 * answer in the user's language:
 *   throw new ApiError(404, 'employee.notFoundId', { code });
 */
class ApiError extends Error {
  constructor(statusCode, key, params = {}, details) {
    super(key);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.key = key;
    this.params = params;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

module.exports = ApiError;
