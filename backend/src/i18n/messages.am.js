// ============================================================
// FILE:   backend/src/i18n/messages.am.js
// STATUS: NEW file - create it at this path
// ============================================================
/**
 * የአማርኛ መልዕክቶች (Amharic messages).
 * Keys and {placeholders} must match messages.en.js exactly  ->  run `npm run i18n:check`.
 */
module.exports = {
  // ---------- Authentication & permissions ----------
  "auth.required": "ማረጋገጫ ያስፈልጋል። እባክዎ መጀመሪያ ይግቡ።",
  "auth.sessionExpired": "የመግቢያ ጊዜዎ አብቅቷል። እባክዎ እንደገና ይግቡ።",
  "auth.accountDisabledOrMissing": "መለያው አልተገኘም ወይም ታግዷል",
  "auth.forbidden": "ይህን ተግባር ለማከናወን ፈቃድ የለዎትም",
  "auth.invalidCredentials": "የተጠቃሚ ስም ወይም የይለፍ ቃል የተሳሳተ ነው",
  "auth.accountDisabled": "መለያዎ ታግዷል። እባክዎ አስተዳዳሪውን ያነጋግሩ።",
  "auth.currentPasswordWrong": "አሁን ያለው የይለፍ ቃል የተሳሳተ ነው",
  "auth.passwordUpdated": "የይለፍ ቃሉ በተሳካ ሁኔታ ተቀይሯል",
  "auth.tooManyAttempts":
    "በጣም ብዙ የመግቢያ ሙከራዎች ተደርገዋል። እባክዎ ከ15 ደቂቃ በኋላ እንደገና ይሞክሩ።",

  // ---------- Common / system ----------
  "common.tooManyRequests": "በጣም ብዙ ጥያቄዎች ቀርበዋል። እባክዎ ጥቂት ቆይተው እንደገና ይሞክሩ።",
  "common.routeNotFound": "ጥያቄው አልተገኘም፦ {method} {url}",
  "common.somethingWrong": "የሆነ ችግር ተፈጥሯል",
  "common.internal": "የሰርቨር ውስጣዊ ስህተት ተፈጥሯል",
  "common.validationFailed": "የገባው መረጃ ትክክል አይደለም",
  "common.invalidValue": "የ«{field}» ዋጋ ትክክል አይደለም",
  "common.badJson": "የጥያቄው ይዘት ትክክለኛ JSON አይደለም",
  "common.payloadTooLarge": "ጥያቄው በጣም ትልቅ ነው",

  // ---------- Duplicates (MongoDB unique index) ----------
  "duplicate.serialNumber": "ይህ ሲሪያል ቁጥር አስቀድሞ ተመዝግቧል",
  "duplicate.employeeId": "ይህ የሠራተኛ መታወቂያ ቁጥር አስቀድሞ ተመዝግቧል",
  "duplicate.username": "ይህ የተጠቃሚ ስም አስቀድሞ ተይዟል",
  "duplicate.asset": "ይህ ንብረት አስቀድሞ ከግቢ ወጥቷል",
  "duplicate.generic": "ይህ «{field}» አስቀድሞ ተመዝግቧል",

  // ---------- Users ----------
  "user.notFound": "ተጠቃሚው አልተገኘም",
  "user.selfProtect": "የራስዎን መለያ ማገድ ወይም ደረጃውን ዝቅ ማድረግ አይችሉም",

  // ---------- Employees ----------
  "employee.notFoundId": "የሠራተኛ መታወቂያ ቁጥር «{code}» ያለው ሠራተኛ አልተገኘም",
  "employee.inactive": "{name} ንቁ ያልሆነ ተብሎ ተመዝግቧል",
  "employee.notFound": "ሠራተኛው አልተገኘም",
  "employee.inactiveOrMissing": "ሠራተኛው አልተገኘም ወይም ንቁ አይደለም",
  "employee.hasItemsOut":
    "ይህ ሠራተኛ ገና ያልመለሳቸው ንብረቶች አሉት። እባክዎ መጀመሪያ ንብረቶቹን ተቀብለው ይመዝግቡ።",
  "employee.deactivated": "ሠራተኛው ተቦዝኗል",

  // ---------- Assets ----------
  "asset.notFoundCode": "በሲሪያል ቁጥር ወይም በመለያ «{code}» የተመዘገበ ንብረት የለም",
  "asset.notFound": "ንብረቱ አልተገኘም",
  "asset.isOutside": "ይህ ንብረት አሁን ከግቢ ውጭ ነው። ከማቦዘንዎ በፊት ተቀብለው ይመዝግቡት።",
  "asset.deactivated": "ንብረቱ ተቦዝኗል",
  "asset.inactiveNoCheckout": "ይህ ንብረት ተቦዝኗል፤ ከግቢ ማውጣት አይቻልም",

  // ---------- Gate ----------
  "gate.alreadyOut": "ይህ ንብረት አስቀድሞ ከግቢ ወጥቷል",
  "gate.checkedOut": "የንብረት ወጪ ተመዝግቧል",
  "gate.returned": "የንብረት ተመላሽ ተመዝግቧል",
  "gate.noOpenLog": "ለዚህ ንብረት ገና ያልተመለሰ የወጪ መዝገብ የለም",

  // ---------- Validation ----------
  "validation.requiredField": "«{field}» መሞላት አለበት",
  "validation.tooShort": "«{field}» በጣም አጭር ነው",
  "validation.tooLong": "«{field}» በጣም ረጅም ነው",
  "validation.invalid": "«{field}» ትክክል አይደለም",
  "validation.invalidChoice": "«{field}» ትክክለኛ ምርጫ አይደለም",
  "validation.invalidId": "መለያው ትክክል አይደለም",
  "validation.fullNameRequired": "ሙሉ ስም ያስፈልጋል",
  "validation.usernameRequired": "የተጠቃሚ ስም ያስፈልጋል",
  "validation.passwordRequired": "የይለፍ ቃል ያስፈልጋል",
  "validation.usernameMin": "የተጠቃሚ ስም ቢያንስ 3 ቁምፊዎች መሆን አለበት",
  "validation.usernameChars":
    "የተጠቃሚ ስም ፊደላትን፣ ቁጥሮችን፣ ነጥብን፣ ሰረዝን እና የታች ሰረዝን ብቻ መያዝ ይችላል",
  "validation.passwordMin": "የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት",
  "validation.passwordMax": "የይለፍ ቃሉ በጣም ረጅም ነው",
  "validation.passwordLetter": "የይለፍ ቃል ቢያንስ አንድ ፊደል መያዝ አለበት",
  "validation.passwordNumber": "የይለፍ ቃል ቢያንስ አንድ ቁጥር መያዝ አለበት",
  "validation.invalidRole": "ሚናው ትክክል አይደለም",
  "validation.employeeIdRequired": "የሠራተኛ መታወቂያ ቁጥር ያስፈልጋል",
  "validation.serialRequired": "ሲሪያል ቁጥር ያስፈልጋል",
  "validation.invalidAssetType": "የንብረት ዓይነቱ ትክክል አይደለም",
  "validation.assetTypeRequired": "የንብረት ዓይነት ያስፈልጋል",
  "validation.selectAssetType": "እባክዎ ትክክለኛ የንብረት ዓይነት ይምረጡ",
  "validation.currentPasswordRequired": "አሁን ያለው የይለፍ ቃል ያስፈልጋል",

  // ---------- Field labels (used inside validation messages) ----------
  "fields.employeeId": "የሠራተኛ መታወቂያ ቁጥር",
  "fields.fullName": "ሙሉ ስም",
  "fields.department": "የሥራ ክፍል",
  "fields.phone": "ስልክ",
  "fields.serialNumber": "ሲሪያል ቁጥር",
  "fields.assetTag": "የንብረት መለያ",
  "fields.type": "ዓይነት",
  "fields.brand": "ብራንድ",
  "fields.model": "ሞዴል",
  "fields.notes": "ማስታወሻ",
  "fields.note": "ማስታወሻ",
  "fields.username": "የተጠቃሚ ስም",
  "fields.password": "የይለፍ ቃል",
  "fields.role": "ሚና",
  "fields.isActive": "ሁኔታ",
  "fields.assetId": "ንብረት",
  "fields.currentPassword": "አሁን ያለው የይለፍ ቃል",
  "fields.newPassword": "አዲስ የይለፍ ቃል",

  // ---------- Asset types (CSV export) ----------
  "assetTypes.Laptop": "ላፕቶፕ",
  "assetTypes.Tablet": "ታብሌት",
  "assetTypes.Desktop PC": "ዴስክቶፕ ኮምፒውተር",
  "assetTypes.Mobile Phone": "ሞባይል ስልክ",
  "assetTypes.Monitor": "ሞኒተር",
  "assetTypes.Projector": "ፕሮጀክተር",
  "assetTypes.Printer": "ፕሪንተር",
  "assetTypes.Other": "ሌላ",

  // ---------- CSV export ----------
  "csv.employeeId": "የሠራተኛ መታወቂያ ቁጥር",
  "csv.employee": "ሠራተኛ",
  "csv.department": "የሥራ ክፍል",
  "csv.assetType": "የንብረት ዓይነት",
  "csv.brand": "ብራንድ",
  "csv.model": "ሞዴል",
  "csv.serialNumber": "ሲሪያል ቁጥር",
  "csv.assetTag": "የንብረት መለያ",
  "csv.status": "ሁኔታ",
  "csv.out": "የወጣበት (ቀን/ሰዓት)",
  "csv.releasedBy": "ያስወጣው",
  "csv.returned": "የተመለሰበት (ቀን/ሰዓት)",
  "csv.receivedBy": "የተቀበለው",
  "csv.note": "ማስታወሻ",
  "csv.statusOutside": "ከግቢ ውጭ",
  "csv.statusReturned": "ተመልሷል",
};
