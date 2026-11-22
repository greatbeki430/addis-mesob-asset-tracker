// ============================================================
// FILE:   frontend/src/utils/format.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const TZ = "Africa/Addis_Ababa";
const LOCALES = { en: "en-GB", am: "am-ET" };

/**
 * Date / time / duration formatters for the active language.
 * Dates use the Gregorian calendar (matching the date pickers and the exported CSV),
 * with Amharic month and day names when the language is Amharic. Times are 24-hour.
 * `t` is the translate function of the language context (used for "5h 30m" units).
 */
export const createFormatters = (lang, t) => {
  const locale = LOCALES[lang] || LOCALES.en;
  const make = (options) =>
    new Intl.DateTimeFormat(locale, { timeZone: TZ, ...options });

  const dateTimeFmt = make({
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const fullDateTimeFmt = make({
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const timeFmt = make({ hour: "2-digit", minute: "2-digit", hour12: false });
  const longDateFmt = make({
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    dateTime: (v) => (v ? dateTimeFmt.format(new Date(v)) : "—"),
    fullDateTime: (v) => (v ? fullDateTimeFmt.format(new Date(v)) : "—"),
    time: (v) => (v ? timeFmt.format(new Date(v)) : "—"),
    longDate: (v = new Date()) => longDateFmt.format(new Date(v)),

    // 5.5 -> "5h 30m" / "5 ሰዓት 30 ደቂቃ",  30 -> "1d 6h" / "1 ቀን 6 ሰዓት"
    hours: (hours) => {
      if (hours === null || hours === undefined) return "—";
      const totalMinutes = Math.max(Math.round(hours * 60), 0);
      const d = Math.floor(totalMinutes / 1440);
      const h = Math.floor((totalMinutes % 1440) / 60);
      const m = totalMinutes % 60;
      if (d > 0) return t("time.dayHour", { d, h });
      if (h > 0) return t("time.hourMinute", { h, m });
      return t("time.minute", { m });
    },
  };
};

export const hoursSince = (date) =>
  (Date.now() - new Date(date).getTime()) / 36e5;

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0].toUpperCase())
    .join("");

// Translation key of the greeting that fits the current hour in Addis Ababa
export const greetingKey = () => {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: TZ,
    }).format(new Date()),
  );
  if (hour < 12) return "greeting.morning";
  if (hour < 17) return "greeting.afternoon";
  return "greeting.evening";
};
