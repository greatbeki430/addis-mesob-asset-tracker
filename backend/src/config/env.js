// ============================================================
// FILE:   backend/src/config/env.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `[config] Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

const nodeEnv = process.env.NODE_ENV || "development";

module.exports = {
  nodeEnv,
  isProd: nodeEnv === "production",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "12h",
  clientUrls: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, "")) // "https://x.vercel.app/" -> "https://x.vercel.app" (browsers send no trailing slash)
    .filter(Boolean),
  branchName: process.env.BRANCH_NAME || "Addis Ketema Branch",
  tzOffsetMinutes: Number(process.env.TZ_OFFSET_MINUTES ?? 180),
  overdueHours: Number(process.env.OVERDUE_HOURS) || 24,
};
