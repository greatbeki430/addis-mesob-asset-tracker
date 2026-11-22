// ============================================================
// FILE:   frontend/src/i18n/am.js
// STATUS: NEW file - create it at this path
// ============================================================
/**
 * የአማርኛ ጽሑፎች (Amharic texts).
 * Keys and {placeholders} must match en.js exactly  ->  run `npm run i18n:check`.
 * "key_one" / "key_other" are used automatically when a { count } parameter is passed.
 */
export default {
  // ---------- Brand ----------
  "brand.organization": "አዲስ መሶብ",
  "brand.branch": "አዲስ ከተማ ቅርንጫፍ",
  "brand.product": "የበር ንብረት ቁጥጥር",

  // ---------- Language ----------
  "language.label": "ቋንቋ",

  // ---------- Common ----------
  "common.loading": "በመጫን ላይ…",
  "common.cancel": "ይቅር",
  "common.close": "ዝጋ",
  "common.save": "አስቀምጥ",
  "common.saving": "በማስቀመጥ ላይ…",
  "common.edit": "አርትእ",
  "common.deactivate": "አቦዝን",
  "common.refresh": "አድስ",
  "common.all": "ሁሉም",
  "common.allTypes": "ሁሉም ዓይነቶች",
  "common.confirm": "አረጋግጥ",
  "common.tryAgain": "እንደገና ሞክር",
  "common.pleaseWait": "እባክዎ ይጠብቁ…",
  "common.recording": "በመመዝገብ ላይ…",
  "common.preparing": "በማዘጋጀት ላይ…",
  "common.find": "ፈልግ",
  "common.note": "ማስታወሻ",
  "common.noteOptional": "ማስታወሻ (አማራጭ)",

  // ---------- Navigation & layout ----------
  "nav.dashboard": "ዳሽቦርድ",
  "nav.gate": "የበር መቆጣጠሪያ",
  "nav.outside": "አሁን ከግቢ ውጭ ያሉ",
  "nav.history": "የእንቅስቃሴ ታሪክ",
  "nav.employees": "ሠራተኞች",
  "nav.assets": "ንብረቶች",
  "nav.users": "የሲስተም ተጠቃሚዎች",
  "nav.administration": "አስተዳደር",
  "layout.closeMenu": "ምናሌውን ዝጋ",
  "layout.openMenu": "ምናሌውን ክፈት",
  "layout.password": "የይለፍ ቃል",
  "layout.signOut": "ውጣ",

  // ---------- Roles ----------
  "roles.admin": "አስተዳዳሪ",
  "roles.security": "የጥበቃ ሠራተኛ",

  // ---------- Badges ----------
  "badge.active": "ንቁ",
  "badge.inactive": "ንቁ ያልሆነ",
  "badge.disabled": "የታገደ",
  "badge.outside": "ከግቢ ውጭ",
  "badge.inOffice": "በቢሮ ውስጥ",
  "badge.overdue": "ጊዜው ያለፈበት",
  "badge.returned": "ተመልሷል",

  // ---------- Info cards ----------
  "card.serial": "ሲሪያል ቁ.:",
  "card.tag": "መለያ:",
  "card.id": "መታወቂያ:",

  // ---------- Asset types (stored in English, shown translated) ----------
  "assetTypes.Laptop": "ላፕቶፕ",
  "assetTypes.Tablet": "ታብሌት",
  "assetTypes.Desktop PC": "ዴስክቶፕ ኮምፒውተር",
  "assetTypes.Mobile Phone": "ሞባይል ስልክ",
  "assetTypes.Monitor": "ሞኒተር",
  "assetTypes.Projector": "ፕሮጀክተር",
  "assetTypes.Printer": "ፕሪንተር",
  "assetTypes.Other": "ሌላ",

  // ---------- Table headings ----------
  "table.employee": "ሠራተኛ",
  "table.asset": "ንብረት",
  "table.serial": "ሲሪያል ቁጥር",
  "table.takenOut": "የወጣበት",
  "table.duration": "የቆየበት ጊዜ",
  "table.releasedBy": "ያስወጣው",
  "table.out": "ወጪ",
  "table.returned": "ተመላሽ",
  "table.status": "ሁኔታ",
  "table.tag": "መለያ",
  "table.location": "የሚገኝበት",

  // ---------- Time ----------
  "time.dayHour": "{d} ቀን {h} ሰዓት",
  "time.hourMinute": "{h} ሰዓት {m} ደቂቃ",
  "time.minute": "{m} ደቂቃ",
  "greeting.morning": "እንደምን አደሩ፣ {name}",
  "greeting.afternoon": "እንደምን ዋሉ፣ {name}",
  "greeting.evening": "እንደምን አመሹ፣ {name}",

  // ---------- Errors ----------
  "errors.timeout": "ሰርቨሩ ምላሽ ለመስጠት በጣም ዘግይቷል።",
  "errors.network": "ሰርቨሩን ማግኘት አልተቻለም። የኔትወርክ ግንኙነትዎን ያረጋግጡ።",
  "errors.generic": "የሆነ ችግር ተፈጥሯል",

  // ---------- Pagination ----------
  "pagination.prev": "ቀዳሚ",
  "pagination.next": "ቀጣይ",
  "pagination.range": "{from}–{to} ከ{total}",

  // ---------- Change password ----------
  "password.title": "የይለፍ ቃል ቀይር",
  "password.current": "አሁን ያለው የይለፍ ቃል",
  "password.new": "አዲስ የይለፍ ቃል",
  "password.confirm": "አዲሱን የይለፍ ቃል አረጋግጥ",
  "password.hint": "ቢያንስ 8 ቁምፊዎች፣ አንድ ፊደል እና አንድ ቁጥር መያዝ አለበት።",
  "password.submit": "የይለፍ ቃል አድስ",
  "password.mismatch": "አዲሶቹ የይለፍ ቃላት አይመሳሰሉም",
  "password.updated": "የይለፍ ቃሉ ተቀይሯል",

  // ---------- Not found ----------
  "notFound.title": "ገጹ አልተገኘም",
  "notFound.text": "የፈለጉት ገጽ የለም።",
  "notFound.back": "ወደ ዳሽቦርድ ተመለስ",

  // ---------- Login ----------
  "login.feature1": "ሲሪያል ቁጥር በመቃኘት ወይም በመጻፍ ንብረትን በሰከንዶች ውስጥ ይመዝግቡ",
  "login.feature2": "የትኞቹ ላፕቶፖችና ታብሌቶች ከግቢ ውጭ እንደሆኑ ሁልጊዜ ይወቁ",
  "login.feature3": "ቋሚ የዲጂታል መዝገብ — ምንም ነገር አይጠፋም",
  "login.welcome": "እንኳን ደህና መጡ",
  "login.subtitle": "ለመቀጠል ይግቡ",
  "login.username": "የተጠቃሚ ስም",
  "login.password": "የይለፍ ቃል",
  "login.showPassword": "የይለፍ ቃሉን አሳይ",
  "login.hidePassword": "የይለፍ ቃሉን ደብቅ",
  "login.submit": "ግባ",
  "login.signingIn": "በመግባት ላይ…",

  // ---------- Dashboard ----------
  "dashboard.openGate": "የበር መቆጣጠሪያን ክፈት",
  "dashboard.loadError": "ዳሽቦርዱን መጫን አልተቻለም",
  "dashboard.statOutside": "አሁን ከግቢ ውጭ ያሉ",
  "dashboard.statOutsideHint": "ገና ያልተመለሱ ንብረቶች",
  "dashboard.statOverdue": "ጊዜያቸው ያለፈ",
  "dashboard.statOverdueHint": "ከ{hours} ሰዓት በላይ ከግቢ ውጭ የቆዩ",
  "dashboard.statOutToday": "ዛሬ የወጡ",
  "dashboard.statReturnedToday": "ዛሬ የተመለሱ",
  "dashboard.statAssets": "የተመዘገቡ ንብረቶች",
  "dashboard.byType": "ከግቢ ውጭ ያሉ በንብረት ዓይነት",
  "dashboard.viewList": "ዝርዝሩን ተመልከት",
  "dashboard.allInOffice": "ሁሉም ንብረት በቢሮ ውስጥ ነው። 🎉",
  "dashboard.recent": "የቅርብ ጊዜ እንቅስቃሴ",
  "dashboard.fullHistory": "ሙሉ ታሪክ",
  "dashboard.noMovements": "እስካሁን የተመዘገበ እንቅስቃሴ የለም።",
  "dashboard.activityOut": "{name} {type} {serial} ይዘው ወጥተዋል",
  "dashboard.activityReturn": "{name} {type} {serial} መልሰዋል",

  // ---------- Gate desk (shared) ----------
  "gate.title": "የበር መቆጣጠሪያ",
  "gate.subtitle": "በበሩ የሚወጡና የሚመለሱ ንብረቶችን ይመዝግቡ",
  "gate.tabCheckout": "ወጪ",
  "gate.tabReturn": "ተመላሽ",
  "gate.scanHint": "ሲሪያል ቁጥሩን ወይም የንብረት መለያውን ይቃኙ ወይም ይጻፉ",
  "gate.serialPlaceholder": "ሲሪያል ቁጥር ወይም መለያ",

  // ---------- Check-out ----------
  "checkout.assetTitle": "ንብረት",
  "checkout.assetDeactivated": "ይህ ንብረት ተቦዝኗል፤ ከግቢ ሊወጣ አይችልም።",
  "checkout.alreadyOutside":
    "ይህ ንብረት ከ{date} ጀምሮ ከ{name} ጋር ከግቢ ውጭ ነው። ሲመለስ «{tab}» የሚለውን ትር ይጠቀሙ።",
  "checkout.employeeTitle": "ሠራተኛ",
  "checkout.employeeHint": "ንብረቱን የሚወስደውን ሠራተኛ መታወቂያ ቁጥር ያስገቡ",
  "checkout.employeePlaceholder": "የሠራተኛ መታወቂያ ቁጥር (ለምሳሌ AK-001)",
  "checkout.holding_one": "በአሁኑ ጊዜ ሌላ {count} ንብረት ይዘዋል",
  "checkout.holding_other": "በአሁኑ ጊዜ ሌሎች {count} ንብረቶች ይዘዋል",
  "checkout.notePlaceholder": "ለምሳሌ ከቻርጀርና ከቦርሳ ጋር",
  "checkout.confirm": "ወጪውን አረጋግጥ",
  "checkout.toast": "ወጪው ተመዝግቧል",
  "checkout.receiptTitle": "ተመዝግቧል፦ {serial} → {name}",
  "checkout.receiptText": "{type} በ{time} ከግቢ ወጥቷል",

  // ---------- Return ----------
  "return.assetTitle": "የሚመለስ ንብረት",
  "return.alreadyInOffice": "ይህ ንብረት አስቀድሞ በቢሮ ውስጥ ነው — የሚቀበሉት ነገር የለም።",
  "return.confirmTitle": "ተመላሹን አረጋግጥ",
  "return.confirmHint": "ዝርዝሩን ያረጋግጡ፣ ከዚያም ንብረቱን ይቀበሉ",
  "return.takenOut": "የወጣበት",
  "return.releasedBy": "ያስወጣው",
  "return.timeOutside": "ከግቢ ውጭ የቆየበት ጊዜ",
  "return.conditionNote": "የንብረቱ ሁኔታ / ማስታወሻ (አማራጭ)",
  "return.notePlaceholder": "ለምሳሌ ከቻርጀር ጋር ተመልሷል",
  "return.findFirst": "ለመቀጠል አሁን ከግቢ ውጭ ያለ ንብረት ይፈልጉ።",
  "return.confirm": "ተመላሹን አረጋግጥ",
  "return.toast": "ተመላሹ ተመዝግቧል",
  "return.receiptTitle": "ተቀብለዋል፦ {serial} ከ{name}",
  "return.receiptText": "{type} በ{time} ወደ ቢሮ ተመልሷል",

  // ---------- Currently outside ----------
  "outside.title": "አሁን ከግቢ ውጭ ያሉ",
  "outside.subtitle": "ከግቢ የወጡና ገና ያልተመለሱ ንብረቶች ወቅታዊ ዝርዝር",
  "outside.countOutside": "{count} ከግቢ ውጭ",
  "outside.countOverdue": "{count} ጊዜያቸው ያለፈ (ከ{hours} ሰዓት በላይ)",
  "outside.search": "ሠራተኛ፣ ሲሪያል ቁጥር፣ ክፍል ይፈልጉ…",
  "outside.emptyTitle": "ከግቢ ውጭ ምንም የለም",
  "outside.emptyText": "ሁሉም የተመዘገቡ ንብረቶች ወደ ቢሮ ተመልሰዋል።",
  "outside.receive": "ተቀበል",
  "outside.received": "{serial} ተቀብለዋል",
  "outside.confirmTitle": "ንብረት ተቀበል",
  "outside.confirmMessage": "{name} {type} {serial} መመለሳቸውን ያረጋግጣሉ?",

  // ---------- History ----------
  "history.title": "የእንቅስቃሴ ታሪክ",
  "history.subtitle": "በበሩ ያለፉ ሁሉም ንብረቶች ቋሚ መዝገብ",
  "history.export": "CSV አውርድ",
  "history.search": "ሠራተኛ፣ ሲሪያል ቁጥር፣ ክፍል ይፈልጉ…",
  "history.allStatuses": "ሁሉም ሁኔታዎች",
  "history.from": "ከ",
  "history.to": "እስከ",
  "history.emptyTitle": "ምንም መዝገብ አልተገኘም",
  "history.emptyText": "ማጣሪያዎቹን ለመቀየር ይሞክሩ።",
  "history.releasedReceived": "ያስወጣው / የተቀበለው",
  "history.by": "በ",
  "history.outBy": "ያስወጣው፦ {name}",
  "history.inBy": "የተቀበለው፦ {name}",

  // ---------- Employees ----------
  "employees.title": "ሠራተኞች",
  "employees.subtitle": "የድርጅቱን ንብረት ወደ ቤት ይዘው እንዲሄዱ የተፈቀደላቸው ሰዎች",
  "employees.add": "ሠራተኛ ጨምር",
  "employees.search": "ስም፣ መታወቂያ፣ ክፍል ይፈልጉ…",
  "employees.emptyTitle": "ምንም ሠራተኛ አልተገኘም",
  "employees.emptyText": "ለመጀመር የመጀመሪያውን ሠራተኛ ይጨምሩ።",
  "employees.fieldId": "የሠራተኛ መታወቂያ ቁጥር",
  "employees.fieldName": "ሙሉ ስም",
  "employees.fieldDepartment": "የሥራ ክፍል",
  "employees.fieldPhone": "ስልክ",
  "employees.editTitle": "ሠራተኛ አርትእ",
  "employees.addTitle": "ሠራተኛ ጨምር",
  "employees.activeCheck": "ንቁ ሠራተኛ",
  "employees.updated": "ሠራተኛው ተስተካክሏል",
  "employees.added": "ሠራተኛው ተጨምሯል",
  "employees.deactivated": "ሠራተኛው ተቦዝኗል",
  "employees.deactivateTitle": "ሠራተኛን አቦዝን",
  "employees.deactivateMessage":
    "{name} ከዚህ በኋላ ንብረት ይዘው መውጣት አይችሉም። የእንቅስቃሴ ታሪካቸው ይቀመጣል።",

  // ---------- Assets ----------
  "assets.title": "ንብረቶች",
  "assets.subtitle": "ከግቢ ሊወጡ የሚችሉ ላፕቶፖች፣ ታብሌቶችና ሌሎች መሣሪያዎች",
  "assets.register": "ንብረት መዝግብ",
  "assets.search": "ሲሪያል ቁጥር፣ መለያ፣ ሞዴል ይፈልጉ…",
  "assets.anyLocation": "ማንኛውም ቦታ",
  "assets.activeAndInactive": "ንቁና ንቁ ያልሆኑ",
  "assets.activeOnly": "ንቁ ብቻ",
  "assets.inactiveOnly": "ንቁ ያልሆኑ ብቻ",
  "assets.emptyTitle": "ምንም ንብረት አልተገኘም",
  "assets.emptyText": "በበሩ እንዲከታተሏቸው ንብረቶችን ይመዝግቡ።",
  "assets.editTitle": "ንብረት አርትእ",
  "assets.registerTitle": "ንብረት መዝግብ",
  "assets.fieldSerial": "ሲሪያል ቁጥር",
  "assets.fieldTag": "የንብረት መለያ",
  "assets.fieldType": "ዓይነት",
  "assets.fieldBrand": "ብራንድ",
  "assets.fieldModel": "ሞዴል",
  "assets.fieldNotes": "ማስታወሻ",
  "assets.activeCheck": "ንቁ ንብረት",
  "assets.updated": "ንብረቱ ተስተካክሏል",
  "assets.registered": "ንብረቱ ተመዝግቧል",
  "assets.deactivated": "ንብረቱ ተቦዝኗል",
  "assets.deactivateTitle": "ንብረትን አቦዝን",
  "assets.deactivateMessage":
    "{serial} ከዚህ በኋላ ከግቢ ሊወጣ አይችልም። የእንቅስቃሴ ታሪኩ ይቀመጣል።",

  // ---------- System users ----------
  "users.title": "የሲስተም ተጠቃሚዎች",
  "users.subtitle": "ወደ ሲስተሙ መግባት የሚችሉ የጥበቃ ሠራተኞችና አስተዳዳሪዎች",
  "users.add": "ተጠቃሚ ጨምር",
  "users.search": "ስም ወይም የተጠቃሚ ስም ይፈልጉ…",
  "users.allRoles": "ሁሉም ሚናዎች",
  "users.emptyTitle": "ምንም ተጠቃሚ አልተገኘም",
  "users.colName": "ስም",
  "users.fieldUsername": "የተጠቃሚ ስም",
  "users.fieldRole": "ሚና",
  "users.fieldPassword": "የይለፍ ቃል",
  "users.lastSignIn": "መጨረሻ የገቡበት",
  "users.you": "(እርስዎ)",
  "users.editTitle": "ተጠቃሚ አርትእ",
  "users.addTitle": "ተጠቃሚ ጨምር",
  "users.resetPassword": "የይለፍ ቃል ዳግም አስጀምር (አማራጭ)",
  "users.enabledCheck": "መለያው ንቁ ነው",
  "users.updated": "ተጠቃሚው ተስተካክሏል",
  "users.created": "ተጠቃሚው ተፈጥሯል",
};
