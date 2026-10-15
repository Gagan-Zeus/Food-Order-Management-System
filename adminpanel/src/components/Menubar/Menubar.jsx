import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../services/authService";

const Menubar = ({ toggleSidebar, sidebarVisible }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logoutTimer = useRef(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const adminEmail = localStorage.getItem("adminEmail");
  const pageTitle = pathname === "/add" ? "Add Food" : pathname === "/orders" ? "Orders" : "List Food";

  useEffect(() => () => window.clearTimeout(logoutTimer.current), []);

  const handleLogout = () => {
    if (isSigningOut || !window.confirm("Are you sure you want to logout?")) return;

    setIsSigningOut(true);
    const transitionDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 760;
    logoutTimer.current = window.setTimeout(() => {
      logoutAdmin();
      navigate("/admin/login", { replace: true });
    }, transitionDelay);
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="topbar-left">
          <button
            className="icon-button menu-toggle"
            id="sidebarToggle"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
            aria-expanded={sidebarVisible}
            aria-controls="sidebar-wrapper"
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>
          <div className="topbar-breadcrumb"><span>Workspace</span><i className="bi bi-chevron-right" aria-hidden="true" /><strong>{pageTitle}</strong></div>
        </div>
        <div className="topbar-account">
          <span className="admin-avatar" aria-hidden="true">{adminEmail?.[0]?.toUpperCase() || "A"}</span>
          <div className="account-details"><strong>Restaurant admin</strong><span>{adminEmail || "Masalabox workspace"}</span></div>
          <button className="admin-button button-outline logout-button" onClick={handleLogout} disabled={isSigningOut} aria-busy={isSigningOut}>
            <i className={isSigningOut ? "bi bi-arrow-repeat" : "bi bi-box-arrow-right"} aria-hidden="true" />
            <span>{isSigningOut ? "Signing out…" : "Log out"}</span>
          </button>
        </div>
      </header>
      {isSigningOut && (
        <div className="signout-overlay" role="status" aria-live="polite">
          <div className="signout-card">
            <span className="signout-mark"><i className="bi bi-basket2-fill" aria-hidden="true" /></span>
            <p className="eyebrow">Masalabox workspace</p>
            <h2>See you soon<span>.</span></h2>
            <p>Your workspace is signing out securely.</p>
            <span className="signout-progress" aria-hidden="true" />
          </div>
        </div>
      )}
    </>
  );
};

export default Menubar;
