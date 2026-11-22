// ============================================================
// FILE:   backend/scripts/check-i18n.js
// STATUS: NEW file - create it at this path
// ============================================================
/**
 * Verifies the backend translations are complete:
 *   - both languages have exactly the same keys
 *   - {placeholders} match between languages
 *   - no Amharic text is empty
 *   - every message key used in the code exists
 * Run:  npm run i18n:check
 */
const fs = require("fs");
const path = require("path");
const en = require("../src/i18n/messages.en");
const am = require("../src/i18n/messages.am");

const problems = [];
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

// Collect keys used in source files
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "i18n" ? [] : walk(full);
    return e.name.endsWith(".js") ? [full] : [];
  });

const used = new Set();
const patterns = [
  /ApiError\(\s*\d+\s*,\s*'([\w.]+)'/g,
  /\bt\(\s*'([\w.]+)'/g,
  /req\.t\(\s*'([\w.]+)'/g,
  /'((?:validation|auth|common|duplicate|user|employee|asset|gate|csv)\.[A-Za-z]+)'/g,
];
for (const file of walk(path.join(__dirname, "../src"))) {
  const src = fs.readFileSync(file, "utf8");
  for (const rx of patterns) for (const m of src.matchAll(rx)) used.add(m[1]);
}
for (const key of used)
  if (!(key in en)) problems.push(`Used in code but not defined: ${key}`);

if (problems.length) {
  console.error(
    `\n${problems.length} translation problem(s):\n - ${problems.join("\n - ")}\n`,
  );
  process.exit(1);
}
console.log(
  `Backend translations OK: ${Object.keys(en).length} keys in English and Amharic, ${used.size} keys referenced in code.`,
);
