// ============================================================
// FILE:   frontend/src/i18n/en.js
// STATUS: NEW file - create it at this path
// ============================================================
/**
 * English texts (also the fallback language).
 * Flat "group.name" keys; {placeholders} are replaced at runtime.
 * "key_one" / "key_other" are used automatically when a { count } parameter is passed.
 * Every key here MUST also exist in am.js  ->  run `npm run i18n:check`.
 */
export default {
  // ---------- Brand ----------
  "brand.organization": "Addis MESOB",
  "brand.branch": "Addis Ketema Branch",
  "brand.product": "Gate Asset Control",

  // ---------- Language ----------
  "language.label": "Language",

  // ---------- Common ----------
  "common.loading": "Loading…",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.edit": "Edit",
  "common.deactivate": "Deactivate",
  "common.refresh": "Refresh",
  "common.all": "All",
  "common.allTypes": "All types",
  "common.confirm": "Confirm",
  "common.tryAgain": "Try again",
  "common.pleaseWait": "Please wait…",
  "common.recording": "Recording…",
  "common.preparing": "Preparing…",
  "common.find": "Find",
  "common.note": "Note",
  "common.noteOptional": "Note (optional)",

  // ---------- Navigation & layout ----------
  "nav.dashboard": "Dashboard",
  "nav.gate": "Gate Desk",
  "nav.outside": "Currently Outside",
  "nav.history": "History",
  "nav.employees": "Employees",
  "nav.assets": "Assets",
  "nav.users": "System Users",
  "nav.administration": "Administration",
  "layout.closeMenu": "Close menu",
  "layout.openMenu": "Open menu",
  "layout.password": "Password",
  "layout.signOut": "Sign out",

  // ---------- Roles ----------
  "roles.admin": "Administrator",
  "roles.security": "Security Officer",

  // ---------- Badges ----------
  "badge.active": "Active",
  "badge.inactive": "Inactive",
  "badge.disabled": "Disabled",
  "badge.outside": "Outside",
  "badge.inOffice": "In office",
  "badge.overdue": "Overdue",
  "badge.returned": "Returned",

  // ---------- Info cards ----------
  "card.serial": "S/N:",
  "card.tag": "Tag:",
  "card.id": "ID:",

  // ---------- Asset types (stored in English, shown translated) ----------
  "assetTypes.Laptop": "Laptop",
  "assetTypes.Tablet": "Tablet",
  "assetTypes.Desktop PC": "Desktop PC",
  "assetTypes.Mobile Phone": "Mobile Phone",
  "assetTypes.Monitor": "Monitor",
  "assetTypes.Projector": "Projector",
  "assetTypes.Printer": "Printer",
  "assetTypes.Other": "Other",

  // ---------- Table headings ----------
  "table.employee": "Employee",
  "table.asset": "Asset",
  "table.serial": "Serial number",
  "table.takenOut": "Taken out",
  "table.duration": "Duration",
  "table.releasedBy": "Released by",
  "table.out": "Out",
  "table.returned": "Returned",
  "table.status": "Status",
  "table.tag": "Tag",
  "table.location": "Location",

  // ---------- Time ----------
  "time.dayHour": "{d}d {h}h",
  "time.hourMinute": "{h}h {m}m",
  "time.minute": "{m}m",
  "greeting.morning": "Good morning, {name}",
  "greeting.afternoon": "Good afternoon, {name}",
  "greeting.evening": "Good evening, {name}",

  // ---------- Errors ----------
  "errors.timeout": "The server took too long to respond.",
  "errors.network": "Cannot reach the server. Check your connection.",
  "errors.generic": "Something went wrong",

  // ---------- Pagination ----------
  "pagination.prev": "Prev",
  "pagination.next": "Next",
  "pagination.range": "{from}–{to} of {total}",

  // ---------- Change password ----------
  "password.title": "Change password",
  "password.current": "Current password",
  "password.new": "New password",
  "password.confirm": "Confirm new password",
  "password.hint": "At least 8 characters, with a letter and a number.",
  "password.submit": "Update password",
  "password.mismatch": "New passwords do not match",
  "password.updated": "Password updated",

  // ---------- Not found ----------
  "notFound.title": "Page not found",
  "notFound.text": "The page you are looking for does not exist.",
  "notFound.back": "Back to dashboard",

  // ---------- Login ----------
  "login.feature1":
    "Scan or type a serial number to record an asset in seconds",
  "login.feature2":
    "Always know which laptops and tablets are outside the building",
  "login.feature3": "A permanent digital log — nothing is ever erased",
  "login.welcome": "Welcome back",
  "login.subtitle": "Sign in to continue",
  "login.username": "Username",
  "login.password": "Password",
  "login.showPassword": "Show password",
  "login.hidePassword": "Hide password",
  "login.submit": "Sign in",
  "login.signingIn": "Signing in…",

  // ---------- Dashboard ----------
  "dashboard.openGate": "Open Gate Desk",
  "dashboard.loadError": "Could not load the dashboard",
  "dashboard.statOutside": "Currently outside",
  "dashboard.statOutsideHint": "Assets not yet returned",
  "dashboard.statOverdue": "Overdue",
  "dashboard.statOverdueHint": "Outside more than {hours}h",
  "dashboard.statOutToday": "Taken out today",
  "dashboard.statReturnedToday": "Returned today",
  "dashboard.statAssets": "Registered assets",
  "dashboard.byType": "Outside by asset type",
  "dashboard.viewList": "View list",
  "dashboard.allInOffice": "Everything is in the office. 🎉",
  "dashboard.recent": "Recent activity",
  "dashboard.fullHistory": "Full history",
  "dashboard.noMovements": "No movements recorded yet.",
  "dashboard.activityOut": "{name} took {type} {serial}",
  "dashboard.activityReturn": "{name} returned {type} {serial}",

  // ---------- Gate desk (shared) ----------
  "gate.title": "Gate Desk",
  "gate.subtitle": "Record assets leaving and returning through the gate",
  "gate.tabCheckout": "Check-out",
  "gate.tabReturn": "Return",
  "gate.scanHint": "Scan or type the serial number / asset tag",
  "gate.serialPlaceholder": "Serial number or tag",

  // ---------- Check-out ----------
  "checkout.assetTitle": "Asset",
  "checkout.assetDeactivated":
    "This asset is deactivated and cannot leave the building.",
  "checkout.alreadyOutside":
    "Already outside with {name} since {date}. Use the {tab} tab when it comes back.",
  "checkout.employeeTitle": "Employee",
  "checkout.employeeHint": "Enter the employee ID taking the asset",
  "checkout.employeePlaceholder": "Employee ID (e.g. AK-001)",
  "checkout.holding_one": "Currently holding {count} other item",
  "checkout.holding_other": "Currently holding {count} other items",
  "checkout.notePlaceholder": "e.g. with charger and bag",
  "checkout.confirm": "Confirm check-out",
  "checkout.toast": "Check-out recorded",
  "checkout.receiptTitle": "Recorded: {serial} → {name}",
  "checkout.receiptText": "{type} left the building at {time}",

  // ---------- Return ----------
  "return.assetTitle": "Returning asset",
  "return.alreadyInOffice":
    "This asset is already in the office — there is nothing to receive.",
  "return.confirmTitle": "Confirm return",
  "return.confirmHint": "Check the details, then receive the asset",
  "return.takenOut": "Taken out",
  "return.releasedBy": "Released by",
  "return.timeOutside": "Time outside",
  "return.conditionNote": "Condition / note (optional)",
  "return.notePlaceholder": "e.g. returned with charger",
  "return.findFirst": "Find an asset that is currently outside to continue.",
  "return.confirm": "Confirm return",
  "return.toast": "Return recorded",
  "return.receiptTitle": "Received: {serial} from {name}",
  "return.receiptText": "{type} back in the office at {time}",

  // ---------- Currently outside ----------
  "outside.title": "Currently Outside",
  "outside.subtitle":
    "Live list of assets that have left the building and are not yet returned",
  "outside.countOutside": "{count} outside",
  "outside.countOverdue": "{count} overdue (> {hours}h)",
  "outside.search": "Search employee, serial number, department…",
  "outside.emptyTitle": "Nothing is outside",
  "outside.emptyText": "All registered assets are back in the office.",
  "outside.receive": "Receive",
  "outside.received": "{serial} received",
  "outside.confirmTitle": "Receive asset",
  "outside.confirmMessage":
    "Confirm that {name} has returned the {type} {serial}?",

  // ---------- History ----------
  "history.title": "Movement History",
  "history.subtitle":
    "Permanent record of every asset that passed through the gate",
  "history.export": "Export CSV",
  "history.search": "Search employee, serial, department…",
  "history.allStatuses": "All statuses",
  "history.from": "From",
  "history.to": "To",
  "history.emptyTitle": "No records found",
  "history.emptyText": "Try changing the filters.",
  "history.releasedReceived": "Released / received by",
  "history.by": "By",
  "history.outBy": "Out: {name}",
  "history.inBy": "In: {name}",

  // ---------- Employees ----------
  "employees.title": "Employees",
  "employees.subtitle": "People who are allowed to take company assets home",
  "employees.add": "Add employee",
  "employees.search": "Search name, ID, department…",
  "employees.emptyTitle": "No employees found",
  "employees.emptyText": "Add your first employee to get started.",
  "employees.fieldId": "Employee ID",
  "employees.fieldName": "Full name",
  "employees.fieldDepartment": "Department",
  "employees.fieldPhone": "Phone",
  "employees.editTitle": "Edit employee",
  "employees.addTitle": "Add employee",
  "employees.activeCheck": "Active employee",
  "employees.updated": "Employee updated",
  "employees.added": "Employee added",
  "employees.deactivated": "Employee deactivated",
  "employees.deactivateTitle": "Deactivate employee",
  "employees.deactivateMessage":
    "{name} will no longer be able to take assets out. Their history is kept.",

  // ---------- Assets ----------
  "assets.title": "Assets",
  "assets.subtitle":
    "Laptops, tablets and other equipment that can leave the building",
  "assets.register": "Register asset",
  "assets.search": "Search serial, tag, brand, model…",
  "assets.anyLocation": "Any location",
  "assets.activeAndInactive": "Active + inactive",
  "assets.activeOnly": "Active only",
  "assets.inactiveOnly": "Inactive only",
  "assets.emptyTitle": "No assets found",
  "assets.emptyText": "Register assets so the gate can track them.",
  "assets.editTitle": "Edit asset",
  "assets.registerTitle": "Register asset",
  "assets.fieldSerial": "Serial number",
  "assets.fieldTag": "Asset tag",
  "assets.fieldType": "Type",
  "assets.fieldBrand": "Brand",
  "assets.fieldModel": "Model",
  "assets.fieldNotes": "Notes",
  "assets.activeCheck": "Active asset",
  "assets.updated": "Asset updated",
  "assets.registered": "Asset registered",
  "assets.deactivated": "Asset deactivated",
  "assets.deactivateTitle": "Deactivate asset",
  "assets.deactivateMessage":
    "{serial} can no longer be checked out. Its history is kept.",

  // ---------- System users ----------
  "users.title": "System Users",
  "users.subtitle": "Security officers and administrators who can sign in",
  "users.add": "Add user",
  "users.search": "Search name or username…",
  "users.allRoles": "All roles",
  "users.emptyTitle": "No users found",
  "users.colName": "Name",
  "users.fieldUsername": "Username",
  "users.fieldRole": "Role",
  "users.fieldPassword": "Password",
  "users.lastSignIn": "Last sign-in",
  "users.you": "(you)",
  "users.editTitle": "Edit user",
  "users.addTitle": "Add user",
  "users.resetPassword": "Reset password (optional)",
  "users.enabledCheck": "Account enabled",
  "users.updated": "User updated",
  "users.created": "User created",
};
