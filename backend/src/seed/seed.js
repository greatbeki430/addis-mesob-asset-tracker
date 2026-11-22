// ============================================================
// FILE:   backend/src/seed/seed.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
/**
 * Seed script - creates ONLY the first admin + security accounts (no sample data).
 * Employees and assets are added later from the web app (or the CSV/forms in the UI).
 *
 *   npm run seed          -> add the missing login accounts (safe to run repeatedly)
 *   npm run seed:reset    -> WIPE all collections (users, employees, assets, gate logs),
 *                            then create the login accounts again
 */
const mongoose = require("mongoose");
const env = require("../config/env");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Asset = require("../models/Asset");
const GateLog = require("../models/GateLog");

const run = async () => {
  await mongoose.connect(env.mongoUri);
  console.log(`[seed] connected to ${mongoose.connection.name}`);

  if (process.argv.includes("--reset")) {
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Asset.deleteMany({}),
      GateLog.deleteMany({}),
    ]);
    console.log("[seed] all collections cleared");
  }

  const accounts = [
    {
      fullName: "System Administrator",
      username: process.env.SEED_ADMIN_USERNAME || "admin",
      password: process.env.SEED_ADMIN_PASSWORD || "Admin@12345",
      role: "admin",
    },
    {
      fullName: "Gate Security Officer",
      username: process.env.SEED_SECURITY_USERNAME || "security1",
      password: process.env.SEED_SECURITY_PASSWORD || "Security@123",
      role: "security",
    },
  ];

  for (const account of accounts) {
    const exists = await User.findOne({ username: account.username });
    if (!exists) {
      await User.create(account);
      console.log(`[seed] created ${account.role}: ${account.username}`);
    }
  }

  console.log(
    `[seed] users: ${await User.countDocuments()}, employees: ${await Employee.countDocuments()}, assets: ${await Asset.countDocuments()}`,
  );

  console.log("\nSign-in credentials (change them after first login!):");
  accounts.forEach((a) =>
    console.log(`  ${a.role.padEnd(9)} ${a.username} / ${a.password}`),
  );

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("[seed] failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
