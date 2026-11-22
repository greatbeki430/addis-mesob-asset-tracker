// ============================================================
// FILE:   backend/src/i18n/index.js
// STATUS: NEW file - create it at this path
// ============================================================
const en = require("./messages.en");
const am = require("./messages.am");

const dictionaries = { en, am };
const SUPPORTED = Object.keys(dictionaries);
const DEFAULT_LANG = "en";

const has = (key) => Object.prototype.hasOwnProperty.call(en, key);

/**
 * translate('am', 'employee.inactive', { name: 'Abebe' })
 * - falls back to English when a key is missing in the chosen language
 * - when the key is unknown at all, the key itself is returned. That lets code pass
 *   already-translated text (or a raw library message) through the same function.
 */
const translate = (lang, key, params = {}) => {
  const dict = dictionaries[lang] || en;
  const template = dict[key] ?? en[key];
  if (template === undefined) return key;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    params[name] !== undefined ? String(params[name]) : match,
  );
};

// "am-ET,am;q=0.9,en;q=0.8"  ->  "am"
const pickLanguage = (header = "") => {
  const tags = String(header)
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return {
        code: tag.toLowerCase().split("-")[0],
        q: q === undefined ? 1 : Number(q) || 0,
      };
    })
    .sort((a, b) => b.q - a.q);
  const match = tags.find((tag) => SUPPORTED.includes(tag.code));
  return match ? match.code : DEFAULT_LANG;
};

module.exports = {
  translate,
  pickLanguage,
  has,
  SUPPORTED,
  DEFAULT_LANG,
  dictionaries,
};
