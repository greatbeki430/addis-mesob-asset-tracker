// ============================================================
// FILE:   frontend/scripts/check-i18n.mjs
// STATUS: NEW file - create it at this path
// ============================================================
/**
 * Verifies the translations are complete and consistent:
 *   - English and Amharic have exactly the same keys
 *   - {placeholders} match between the two languages
 *   - no Amharic text is empty
 *   - every key used in the source code exists (including asset types and roles)
 *   - no key is defined but never used (reported as a warning only)
 * Run:  npm run i18n:check
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import en from "../src/i18n/en.js";
import am from "../src/i18n/am.js";
import { ASSET_TYPES, ROLES } from "../src/constants.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(here, "../src");
const problems = [];
const warnings = [];

const placeholders = (text) =>
  (String(text).match(/\{\w+\}/g) || []).sort().join(",");

for (const key of Object.keys(en)) {
  if (!(key in am)) problems.push(`Missing in Amharic: ${key}`);
  else {
    if (!String(am[key]).trim()) problems.push(`Empty Amharic text: ${key}`);
    if (placeholders(en[key]) !== placeholders(am[key]))
      problems.push(`Placeholder mismatch: ${key}`);
  }
}
for (const key of Object.keys(am))
  if (!(key in en)) problems.push(`Missing in English: ${key}`);

// ---- collect the keys used by the code ----
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "i18n" ? [] : walk(full);
    return /\.(jsx?|mjs)$/.test(entry.name) ? [full] : [];
  });

const used = new Set();
const patterns = [
  /\b(?:t|rich)\(\s*['"]([\w.]+)['"]/g,
  /translate\(\s*\w+\s*,\s*['"]([\w.]+)['"]/g,
  /(?:labelKey|sectionKey):\s*['"]([\w.]+)['"]/g,
  /['"]((?:greeting)\.[a-zA-Z]+)['"]/g,
];
for (const file of walk(srcDir)) {
  const source = fs.readFileSync(file, "utf8");
  for (const rx of patterns)
    for (const match of source.matchAll(rx)) used.add(match[1]);
}
for (const type of ASSET_TYPES) used.add(`assetTypes.${type}`);
for (const role of ROLES) used.add(role.labelKey);

const defined = (key) =>
  key in en || `${key}_one` in en || `${key}_other` in en;
for (const key of used)
  if (!defined(key)) problems.push(`Used in code but not defined: ${key}`);

const unused = Object.keys(en).filter((key) => {
  const base = key.replace(/_(one|other)$/, "");
  return !used.has(key) && !used.has(base);
});
// activity texts are chosen with a conditional, so they are referenced as strings too
const conditional = new Set([
  "dashboard.activityOut",
  "dashboard.activityReturn",
]);
for (const key of unused)
  if (!conditional.has(key)) warnings.push(`Defined but not used: ${key}`);

if (warnings.length) console.warn(`Warnings:\n - ${warnings.join("\n - ")}\n`);
if (problems.length) {
  console.error(
    `${problems.length} translation problem(s):\n - ${problems.join("\n - ")}\n`,
  );
  process.exit(1);
}
console.log(
  `Frontend translations OK: ${Object.keys(en).length} keys in English and Amharic, ${used.size} keys referenced in code.`,
);
