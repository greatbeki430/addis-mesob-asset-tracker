// ============================================================
// FILE:   backend/src/middleware/language.js
// STATUS: NEW file - create it at this path
// ============================================================
const { translate, pickLanguage } = require("../i18n");

// Reads the Accept-Language header sent by the web app and attaches:
//   req.lang -> 'en' | 'am'
//   req.t(key, params) -> translated text in that language
module.exports = (req, _res, next) => {
  req.lang = pickLanguage(req.headers["accept-language"]);
  req.t = (key, params) => translate(req.lang, key, params);
  next();
};
