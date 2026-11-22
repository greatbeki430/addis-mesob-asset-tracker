// ============================================================
// FILE:   backend/src/middleware/validate.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const ApiError = require("../utils/ApiError");
const { translate, has } = require("../i18n");

// Validates (and strips unknown keys from) req.body with a zod schema.
// Messages written in the schemas are translation KEYS; zod's own generic
// messages are replaced by translated ones built from the issue type.
const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (result.success) {
    req.body = result.data;
    return next();
  }

  const t = (key, params) => translate(req.lang, key, params);

  const details = result.error.issues.map((issue) => {
    const field = issue.path.join(".");
    const label = has(`fields.${field}`) ? t(`fields.${field}`) : field;

    let message;
    if (has(issue.message)) message = t(issue.message);
    else if (!field) message = t("common.validationFailed");
    else if (issue.code === "invalid_type" && issue.received === "undefined")
      message = t("validation.requiredField", { field: label });
    else if (issue.code === "too_small")
      message = t("validation.tooShort", { field: label });
    else if (issue.code === "too_big")
      message = t("validation.tooLong", { field: label });
    else if (issue.code === "invalid_enum_value")
      message = t("validation.invalidChoice", { field: label });
    else message = t("validation.invalid", { field: label });

    return { field, message };
  });

  // The message is already translated; translate() returns unknown keys untouched.
  next(
    new ApiError(
      422,
      details[0]?.message || "common.validationFailed",
      {},
      details,
    ),
  );
};

module.exports = validate;
