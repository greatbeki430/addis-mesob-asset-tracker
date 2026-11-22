// ============================================================
// FILE:   backend/src/validators/schemas.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const { z } = require("zod");
const { ROLES, ASSET_TYPES } = require("../constants");

// NOTE: every message below is a translation KEY (see src/i18n/messages.*.js).
// middleware/validate.js turns it into the user's language.

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "validation.invalidId");

const passwordRule = z
  .string({ required_error: "validation.passwordRequired" })
  .min(8, "validation.passwordMin")
  .max(72, "validation.passwordMax")
  .regex(/[A-Za-z]/, "validation.passwordLetter")
  .regex(/\d/, "validation.passwordNumber");

const optionalText = (max) => z.string().trim().max(max).optional().default("");

// ---------- Auth ----------
const loginSchema = z.object({
  username: z
    .string({ required_error: "validation.usernameRequired" })
    .trim()
    .min(1, "validation.usernameRequired"),
  password: z
    .string({ required_error: "validation.passwordRequired" })
    .min(1, "validation.passwordRequired"),
});

const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "validation.currentPasswordRequired" })
    .min(1, "validation.currentPasswordRequired"),
  newPassword: passwordRule,
});

// ---------- Users ----------
const userCreateSchema = z.object({
  fullName: z.string().trim().min(2, "validation.fullNameRequired").max(100),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "validation.usernameMin")
    .max(30)
    .regex(/^[a-z0-9._-]+$/, "validation.usernameChars"),
  password: passwordRule,
  role: z.enum(ROLES, {
    errorMap: () => ({ message: "validation.invalidRole" }),
  }),
});

const userUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "validation.fullNameRequired")
    .max(100)
    .optional(),
  role: z
    .enum(ROLES, { errorMap: () => ({ message: "validation.invalidRole" }) })
    .optional(),
  isActive: z.boolean().optional(),
  password: passwordRule.optional(),
});

// ---------- Employees ----------
const employeeCreateSchema = z.object({
  employeeId: z.string().trim().min(1, "validation.employeeIdRequired").max(30),
  fullName: z.string().trim().min(2, "validation.fullNameRequired").max(100),
  department: optionalText(100),
  phone: optionalText(30),
});

const employeeUpdateSchema = employeeCreateSchema
  .partial()
  .extend({ isActive: z.boolean().optional() });

// ---------- Assets ----------
const assetCreateSchema = z.object({
  serialNumber: z.string().trim().min(2, "validation.serialRequired").max(60),
  assetTag: optionalText(40),
  type: z.enum(ASSET_TYPES, {
    errorMap: () => ({ message: "validation.selectAssetType" }),
  }),
  brand: optionalText(60),
  model: optionalText(80),
  notes: optionalText(300),
});

const assetUpdateSchema = assetCreateSchema
  .partial()
  .extend({ isActive: z.boolean().optional() });

// ---------- Gate ----------
const checkOutSchema = z.object({
  assetId: objectId,
  employeeId: objectId,
  note: optionalText(300),
});

const checkInSchema = z.object({
  assetId: objectId,
  note: optionalText(300),
});

module.exports = {
  loginSchema,
  changePasswordSchema,
  userCreateSchema,
  userUpdateSchema,
  employeeCreateSchema,
  employeeUpdateSchema,
  assetCreateSchema,
  assetUpdateSchema,
  checkOutSchema,
  checkInSchema,
};
