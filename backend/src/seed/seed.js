/**
 * Seed script - creates the first admin + security accounts and some sample data.
 *   npm run seed          -> add missing records (safe to run repeatedly)
 *   npm run seed:reset    -> WIPE all collections first, then seed
 */
const mongoose = require("mongoose");
const env = require("../config/env");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Asset = require("../models/Asset");
const GateLog = require("../models/GateLog");

const employees = [
  {
    employeeId: "AK-001",
    fullName: "Yared Hailu",
    department: "Building Permit",
    phone: "+251 92 324 7742",
  },
  {
    employeeId: "AK-002",
    fullName: "Efa Kusa",
    department: "Building Permit",
    phone: "+251 92 110 0522",
  },
  {
    employeeId: "AK-003",
    fullName: "Gezagn Bekele",
    department: "Cybersecurity Analyst",
    phone: "0961305788",
  },
  {
    employeeId: "AK-004",
    fullName: "Bayisa Bekele",
    department: "Cybersecurity Analyst",
    phone: "+251 92 207 8341",
  },
  {
    employeeId: "AK-005",
    fullName: "Biya Kumilachew",
    department: "Network Engineer",
    phone: "+251 90 235 2728",
  },
  {
    employeeId: "AK-006",
    fullName: "Daniel Elias",
    department: "Software Administrator",
    phone: "0930322071",
  },
];

const assets = [
  {
    serialNumber: "PF3K2L91",
    assetTag: "AK-LT-0001",
    type: "Laptop",
    brand: "Lenovo",
    model: "ThinkPad E14",
  },
  {
    serialNumber: "CND9341XYZ",
    assetTag: "AK-LT-0002",
    type: "Laptop",
    brand: "HP",
    model: "ProBook 450 G9",
  },
  {
    serialNumber: "R9LM44QP",
    assetTag: "AK-LT-0003",
    type: "Laptop",
    brand: "Dell",
    model: "Latitude 5420",
  },
  {
    serialNumber: "DMPX7H2Q",
    assetTag: "AK-TB-0001",
    type: "Tablet",
    brand: "Apple",
    model: "iPad 9th Gen",
  },
  {
    serialNumber: "RF8N30ABCD",
    assetTag: "AK-TB-0002",
    type: "Tablet",
    brand: "Samsung",
    model: "Galaxy Tab A8",
  },
  {
    serialNumber: "MJ0A55TT",
    assetTag: "AK-PR-0001",
    type: "Projector",
    brand: "Epson",
    model: "EB-X06",
  },
];

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

  for (const emp of employees) {
    await Employee.updateOne(
      { employeeId: emp.employeeId },
      { $setOnInsert: emp },
      { upsert: true },
    );
  }
  for (const asset of assets) {
    await Asset.updateOne(
      { serialNumber: asset.serialNumber },
      { $setOnInsert: asset },
      { upsert: true },
    );
  }
  console.log(
    `[seed] employees: ${await Employee.countDocuments()}, assets: ${await Asset.countDocuments()}`,
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
