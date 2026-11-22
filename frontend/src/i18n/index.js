// ============================================================
// FILE:   frontend/src/i18n/index.js
// STATUS: NEW file - create it at this path
// ============================================================
import en from "./en.js";
import am from "./am.js";
import { DEFAULT_LANG, LANG_KEY } from "../constants.js";

const dictionaries = { en, am };

export const isSupported = (code) =>
  Object.prototype.hasOwnProperty.call(dictionaries, code);

export const getStoredLang = () => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return isSupported(saved) ? saved : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};

export const storeLang = (code) => {
  try {
    localStorage.setItem(LANG_KEY, code);
  } catch {
    /* storage unavailable - the choice just won't be remembered */
  }
};

/**
 * translate('am', 'checkout.holding', { count: 2 })
 *  - {name} style placeholders are replaced from `params`
 *  - when params.count is a number, "key_one" / "key_other" is used if it exists
 *  - a missing key falls back to English, and finally to the key itself
 */
export function translate(lang, key, params) {
  const dict = dictionaries[lang] || dictionaries[DEFAULT_LANG];
  let template;

  if (params && typeof params.count === "number") {
    const suffix = params.count === 1 ? "_one" : "_other";
    template = dict[key + suffix] ?? en[key + suffix];
  }
  template = template ?? dict[key] ?? en[key];

  if (template === undefined) {
    if (import.meta.env?.DEV)
      console.warn(`[i18n] Missing translation key: ${key}`);
    return key;
  }
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    params[name] !== undefined ? String(params[name]) : match,
  );
}
