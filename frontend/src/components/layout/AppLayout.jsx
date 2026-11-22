// ============================================================
// FILE:   frontend/src/components/layout/AppLayout.jsx
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  DoorOpen,
  History,
  KeyRound,
  Laptop,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { useI18n } from "../../i18n/LanguageContext.jsx";
import { ROLES } from "../../constants.js";
import { initials } from "../../utils/format.js";
import Logo from "../ui/Logo.jsx";
import LanguageSwitcher from "../ui/LanguageSwitcher.jsx";
import ChangePasswordModal from "../ChangePasswordModal.jsx";

const NAV = [
  { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard, end: true },
  { to: "/gate", labelKey: "nav.gate", icon: DoorOpen },
  { to: "/outside", labelKey: "nav.outside", icon: ClipboardList },
  { to: "/history", labelKey: "nav.history", icon: History },
  {
    to: "/employees",
    labelKey: "nav.employees",
    icon: Users,
    roles: ["admin"],
    sectionKey: "nav.administration",
  },
  {
    to: "/assets",
    labelKey: "nav.assets",
    icon: Laptop,
    roles: ["admin"],
    sectionKey: "nav.administration",
  },
  {
    to: "/users",
    labelKey: "nav.users",
    icon: UserCog,
    roles: ["admin"],
    sectionKey: "nav.administration",
  },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  // Close the mobile drawer after navigating
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const items = NAV.filter(
    (item) => !item.roles || item.roles.includes(user.role),
  );
  const roleKey = ROLES.find((r) => r.value === user.role)?.labelKey;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  let lastSection = null;

  return (
    <div className="app-shell">
      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={`sidebar ${drawerOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__brand">
          <Logo size={42} />
          <div>
            <strong>{t("brand.organization")}</strong>
            <span>{t("brand.branch")}</span>
          </div>
          <button
            className="icon-btn sidebar__close"
            onClick={() => setDrawerOpen(false)}
            aria-label={t("layout.closeMenu")}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {items.map((item) => {
            const header =
              item.sectionKey && item.sectionKey !== lastSection
                ? item.sectionKey
                : null;
            lastSection = item.sectionKey || lastSection;
            return (
              <div key={item.to}>
                {header && <div className="sidebar__section">{t(header)}</div>}
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <item.icon size={19} />
                  <span>{t(item.labelKey)}</span>
                </NavLink>
              </div>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <LanguageSwitcher variant="sidebar" />
          <div className="user-chip">
            <div className="avatar">{initials(user.fullName)}</div>
            <div className="user-chip__meta">
              <strong>{user.fullName}</strong>
              <span>{roleKey ? t(roleKey) : user.role}</span>
            </div>
          </div>
          <div className="sidebar__actions">
            <button
              className="btn btn-sidebar"
              onClick={() => setPasswordOpen(true)}
            >
              <KeyRound size={16} /> {t("layout.password")}
            </button>
            <button className="btn btn-sidebar" onClick={handleLogout}>
              <LogOut size={16} /> {t("layout.signOut")}
            </button>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            className="icon-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label={t("layout.openMenu")}
          >
            <Menu size={22} />
          </button>
          <div className="topbar__brand">
            <Logo size={30} />
            <strong>{t("brand.product")}</strong>
          </div>
          <LanguageSwitcher variant="compact" />
          <div className="avatar avatar--sm">{initials(user.fullName)}</div>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <footer className="app-footer">
          © {new Date().getFullYear()} {t("brand.organization")} ·{" "}
          {t("brand.branch")}
        </footer>
      </div>

      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  );
}
