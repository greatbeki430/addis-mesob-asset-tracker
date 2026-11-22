// ============================================================
// FILE:   frontend/src/api/client.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import axios from "axios";
import { TOKEN_KEY } from "../constants.js";
import { getStoredLang, translate } from "../i18n/index.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // The server answers (error messages, CSV headers...) in the language the user selected
  config.headers["Accept-Language"] = getStoredLang();
  return config;
});

// Unwrap the payload ({ success, data, meta }) and handle expired sessions globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isLogin = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error) => {
  const lang = getStoredLang();
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED") return translate(lang, "errors.timeout");
  if (error.message === "Network Error")
    return translate(lang, "errors.network");
  return error.message || translate(lang, "errors.generic");
};

// For requests made with responseType "blob" (CSV export): the error body arrives as a Blob
export const getBlobErrorMessage = async (error) => {
  const fallback = getErrorMessage(error);
  const data = error.response?.data;
  if (data instanceof Blob) {
    try {
      return JSON.parse(await data.text()).message || fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export default api;
