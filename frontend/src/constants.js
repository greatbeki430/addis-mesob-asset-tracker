// ============================================================
// FILE:   frontend/src/constants.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
// ---------------- Languages ----------------
// To change the language people see the first time they open the system, set DEFAULT_LANG to 'am'.
export const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "am", label: "አማርኛ", short: "አማ" },
];
export const DEFAULT_LANG = "en";
export const LANG_KEY = "mesob_gate_lang";

// Keep in sync with backend/src/constants.js
// These are the values stored in the database - they are translated only when displayed
// (see "assetTypes.*" in src/i18n/en.js and am.js).
export const ASSET_TYPES = [
  "Laptop",
  "Tablet",
  "Desktop PC",
  "Mobile Phone",
  "Monitor",
  "Projector",
  "Printer",
  "Other",
];

export const ROLES = [
  { value: "security", labelKey: "roles.security" },
  { value: "admin", labelKey: "roles.admin" },
];

export const TOKEN_KEY = "mesob_gate_token";
