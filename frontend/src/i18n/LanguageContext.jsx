// ============================================================
// FILE:   frontend/src/i18n/LanguageContext.jsx
// STATUS: NEW file - create it at this path
// ============================================================
import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getStoredLang, isSupported, storeLang, translate } from "./index.js";
import { createFormatters } from "../utils/format.js";

const LanguageContext = createContext(null);

// "Taken by {name} at {time}" + { name: <b>Abebe</b> } -> ['Taken by ', <b>Abebe</b>, ' at ', ...]
// Lets translated sentences contain bold text / <code> while the word order stays translatable.
const interpolateNodes = (template, params = {}) =>
  template.split(/(\{\w+\})/g).map((part, index) => {
    const match = part.match(/^\{(\w+)\}$/);
    if (!match) return part;
    return <Fragment key={index}>{params[match[1]] ?? part}</Fragment>;
  });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getStoredLang);

  const setLang = useCallback((code) => {
    if (!isSupported(code)) return;
    storeLang(code);
    setLangState(code);
  }, []);

  const t = useCallback((key, params) => translate(lang, key, params), [lang]);
  const rich = useCallback(
    (key, params) => interpolateNodes(translate(lang, key), params),
    [lang],
  );

  // Asset types are stored in English in the database and translated only for display
  const tType = useCallback(
    (type) => {
      const key = `assetTypes.${type}`;
      const label = translate(lang, key);
      return label === key ? type : label;
    },
    [lang],
  );

  const fmt = useMemo(() => createFormatters(lang, t), [lang, t]);

  // Keep <html lang> and the browser tab title in sync with the language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${t("brand.product")} | ${t("brand.organization")}`;
  }, [lang, t]);

  const value = useMemo(
    () => ({ lang, setLang, t, rich, tType, fmt }),
    [lang, setLang, t, rich, tType, fmt],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useI18n = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
};
