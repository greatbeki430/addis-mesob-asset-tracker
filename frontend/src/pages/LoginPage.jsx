// ============================================================
// FILE:   frontend/src/pages/LoginPage.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  History,
  ScanLine,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import { useI18n } from "../i18n/LanguageContext.jsx";
import { getErrorMessage } from "../api/client.js";
import Logo from "../components/ui/Logo.jsx";
import Loader from "../components/ui/Loader.jsx";
import LanguageSwitcher from "../components/ui/LanguageSwitcher.jsx";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <Loader fullscreen />;
  if (user)
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.username.trim(), form.password);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login">
      <aside className="login__brand">
        <div className="login__brand-inner">
          <Logo size={64} />
          <h1>{t("brand.product")}</h1>
          <p className="login__org">
            {t("brand.organization")} · {t("brand.branch")}
          </p>
          <ul className="login__features">
            <li>
              <ScanLine size={20} /> {t("login.feature1")}
            </li>
            <li>
              <ShieldCheck size={20} /> {t("login.feature2")}
            </li>
            <li>
              <History size={20} /> {t("login.feature3")}
            </li>
          </ul>
        </div>
      </aside>

      <main className="login__panel">
        <div className="login__lang">
          <LanguageSwitcher />
        </div>

        <form className="login__form" onSubmit={submit}>
          <div className="login__mobile-logo">
            <Logo size={52} />
            <strong>{t("brand.product")}</strong>
            <span>
              {t("brand.organization")} · {t("brand.branch")}
            </span>
          </div>

          <h2>{t("login.welcome")}</h2>
          <p className="muted">{t("login.subtitle")}</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="field">
            <label htmlFor="username">{t("login.username")}</label>
            <input
              id="username"
              className="input input--lg"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
              autoCapitalize="none"
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">{t("login.password")}</label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input input--lg"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={
                  showPassword
                    ? t("login.hidePassword")
                    : t("login.showPassword")
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
            <LogIn size={18} />{" "}
            {busy ? t("login.signingIn") : t("login.submit")}
          </button>
        </form>
      </main>
    </div>
  );
}
