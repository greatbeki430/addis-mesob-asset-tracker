// ============================================================
// FILE:   backend/src/middleware/errorHandler.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const env = require("../config/env");
const { translate, has } = require("../i18n");

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, _next) => {
  const t = (key, params) => translate(req.lang, key, params);
  const fieldLabel = (field) =>
    has(`fields.${field}`) ? t(`fields.${field}`) : field;

  let status = err.statusCode || err.status || 500;
  let message;
  let details = err.details;

  if (err.name === "ApiError") {
    message = t(err.key, err.params);
  } else if (err.name === "ValidationError" && err.errors) {
    // Mongoose schema validation
    status = 422;
    details = Object.values(err.errors).map((e) => {
      const field = fieldLabel(e.path);
      let text;
      if (has(e.message)) text = t(e.message);
      else if (e.kind === "required")
        text = t("validation.requiredField", { field });
      else if (e.kind === "minlength")
        text = t("validation.tooShort", { field });
      else if (e.kind === "maxlength")
        text = t("validation.tooLong", { field });
      else if (e.kind === "enum")
        text = t("validation.invalidChoice", { field });
      else text = t("validation.invalid", { field });
      return { field: e.path, message: text };
    });
    message = details[0]?.message || t("common.validationFailed");
  } else if (err.name === "CastError") {
    status = 400;
    message = t("common.invalidValue", { field: fieldLabel(err.path) });
  } else if (err.code === 11000) {
    // Duplicate key
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "value";
    message = has(`duplicate.${field}`)
      ? t(`duplicate.${field}`)
      : t("duplicate.generic", { field: fieldLabel(field) });
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = t("common.badJson");
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = t("common.payloadTooLarge");
  } else if (status >= 500) {
    message = env.isProd
      ? t("common.internal")
      : err.message || t("common.somethingWrong");
  } else {
    message = err.message || t("common.somethingWrong");
  }

  if (status >= 500) {
    console.error("[error]", err);
    if (env.isProd) message = t("common.internal");
  }

  res.status(status).json({
    success: false,
    message,
    ...(err.key ? { code: err.key } : {}),
    ...(details ? { details } : {}),
    ...(!env.isProd && status >= 500 ? { stack: err.stack } : {}),
  });
};
