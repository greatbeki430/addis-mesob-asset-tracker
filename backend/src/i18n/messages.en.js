// ============================================================
// FILE:   backend/src/i18n/messages.en.js
// STATUS: NEW file - create it at this path
// ============================================================
/**
 * English messages (also the fallback language).
 * Keys are flat "group.name" strings. {placeholders} are replaced at runtime.
 * Every key here MUST also exist in messages.am.js  ->  run `npm run i18n:check`.
 */
module.exports = {
  // ---------- Authentication & permissions ----------
  "auth.required": "Authentication required. Please sign in.",
  "auth.sessionExpired": "Session expired. Please sign in again.",
  "auth.accountDisabledOrMissing": "Account not found or disabled",
  "auth.forbidden": "You do not have permission to perform this action",
  "auth.invalidCredentials": "Invalid username or password",
  "auth.accountDisabled":
    "Your account is disabled. Please contact the administrator.",
  "auth.currentPasswordWrong": "Current password is incorrect",
  "auth.passwordUpdated": "Password updated successfully",
  "auth.tooManyAttempts":
    "Too many login attempts. Please try again in 15 minutes.",

  // ---------- Common / system ----------
  "common.tooManyRequests":
    "Too many requests. Please wait a moment and try again.",
  "common.routeNotFound": "Route not found: {method} {url}",
  "common.somethingWrong": "Something went wrong",
  "common.internal": "Internal server error",
  "common.validationFailed": "The submitted information is not valid",
  "common.invalidValue": 'Invalid value for "{field}"',
  "common.badJson": "The request body is not valid JSON",
  "common.payloadTooLarge": "The request is too large",

  // ---------- Duplicates (MongoDB unique index) ----------
  "duplicate.serialNumber": "This serial number already exists",
  "duplicate.employeeId": "This employee ID already exists",
  "duplicate.username": "This username is already taken",
  "duplicate.asset": "This asset is already checked out",
  "duplicate.generic": 'This "{field}" already exists',

  // ---------- Users ----------
  "user.notFound": "User not found",
  "user.selfProtect": "You cannot disable or demote your own account",

  // ---------- Employees ----------
  "employee.notFoundId": 'No employee found with ID "{code}"',
  "employee.inactive": "{name} is marked inactive",
  "employee.notFound": "Employee not found",
  "employee.inactiveOrMissing": "Employee not found or inactive",
  "employee.hasItemsOut":
    "This employee still has items outside. Receive them first.",
  "employee.deactivated": "Employee deactivated",

  // ---------- Assets ----------
  "asset.notFoundCode": 'No asset registered with serial / tag "{code}"',
  "asset.notFound": "Asset not found",
  "asset.isOutside":
    "This asset is currently outside. Receive it before deactivating.",
  "asset.deactivated": "Asset deactivated",
  "asset.inactiveNoCheckout":
    "This asset is deactivated and cannot be checked out",

  // ---------- Gate ----------
  "gate.alreadyOut": "This asset is already checked out",
  "gate.checkedOut": "Check-out recorded",
  "gate.returned": "Return recorded",
  "gate.noOpenLog": "This asset has no open check-out record",

  // ---------- Validation ----------
  "validation.requiredField": '"{field}" is required',
  "validation.tooShort": '"{field}" is too short',
  "validation.tooLong": '"{field}" is too long',
  "validation.invalid": '"{field}" is not valid',
  "validation.invalidChoice": '"{field}" is not a valid choice',
  "validation.invalidId": "Invalid identifier",
  "validation.fullNameRequired": "Full name is required",
  "validation.usernameRequired": "Username is required",
  "validation.passwordRequired": "Password is required",
  "validation.usernameMin": "Username must be at least 3 characters",
  "validation.usernameChars":
    "Username may only contain letters, numbers, dot, dash and underscore",
  "validation.passwordMin": "Password must be at least 8 characters",
  "validation.passwordMax": "Password is too long",
  "validation.passwordLetter": "Password must contain a letter",
  "validation.passwordNumber": "Password must contain a number",
  "validation.invalidRole": "Invalid role",
  "validation.employeeIdRequired": "Employee ID is required",
  "validation.serialRequired": "Serial number is required",
  "validation.invalidAssetType": "Invalid asset type",
  "validation.assetTypeRequired": "Asset type is required",
  "validation.selectAssetType": "Select a valid asset type",
  "validation.currentPasswordRequired": "Current password is required",

  // ---------- Field labels (used inside validation messages) ----------
  "fields.employeeId": "Employee ID",
  "fields.fullName": "Full name",
  "fields.department": "Department",
  "fields.phone": "Phone",
  "fields.serialNumber": "Serial number",
  "fields.assetTag": "Asset tag",
  "fields.type": "Type",
  "fields.brand": "Brand",
  "fields.model": "Model",
  "fields.notes": "Notes",
  "fields.note": "Note",
  "fields.username": "Username",
  "fields.password": "Password",
  "fields.role": "Role",
  "fields.isActive": "Status",
  "fields.assetId": "Asset",
  "fields.currentPassword": "Current password",
  "fields.newPassword": "New password",

  // ---------- Asset types (CSV export) ----------
  "assetTypes.Laptop": "Laptop",
  "assetTypes.Tablet": "Tablet",
  "assetTypes.Desktop PC": "Desktop PC",
  "assetTypes.Mobile Phone": "Mobile Phone",
  "assetTypes.Monitor": "Monitor",
  "assetTypes.Projector": "Projector",
  "assetTypes.Printer": "Printer",
  "assetTypes.Other": "Other",

  // ---------- CSV export ----------
  "csv.employeeId": "Employee ID",
  "csv.employee": "Employee",
  "csv.department": "Department",
  "csv.assetType": "Asset type",
  "csv.brand": "Brand",
  "csv.model": "Model",
  "csv.serialNumber": "Serial number",
  "csv.assetTag": "Asset tag",
  "csv.status": "Status",
  "csv.out": "Out (date/time)",
  "csv.releasedBy": "Released by",
  "csv.returned": "Returned (date/time)",
  "csv.receivedBy": "Received by",
  "csv.note": "Note",
  "csv.statusOutside": "Outside",
  "csv.statusReturned": "Returned",
};
