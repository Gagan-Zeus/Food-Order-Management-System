import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import { assets } from "../../assets/assets.js";
import { getCartItemCount } from "../../util/cartUtils.js";
import "./Menubar.css";

const Menubar = () => {
  const { quantities, token, setToken, setQuantities, user, foodList } =
    useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const closeProfile = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", closeProfile);
    return () => {
      document.removeEventListener("mousedown", closeProfile);
      window.clearTimeout(logoutTimerRef.current);
    };
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const logout = () => {
    if (isLoggingOut) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setQuantities({});
    setProfileOpen(false);
    setIsLoggingOut(true);

    const finishLogout = () => {
      // Menubar stays mounted across route changes, so explicitly close the
      // transition before navigating back to the public home screen.
      setIsLoggingOut(false);
      setToken("");
      navigate("/");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishLogout();
    } else {
      logoutTimerRef.current = window.setTimeout(finishLogout, 420);
    }
  };

  const cartItems = (foodList || []).filter(
    (food) => (Number(quantities[food.id]) || 0) > 0
  );
  const itemCount = getCartItemCount(cartItems, quantities);

  const navItems = [
    ["Home", "/"],
    ["Explore", "/explore"],
    ["Contact", "/contact"],
  ];

  return (
    <header className="site-header">
      <div className="page-shell navbar-inner">
        <Link to="/" className="brand" aria-label="MasalaBox home">
          <span className="brand-mark">
            <img src={assets.logo} alt="" />
          </span>
          <span>MasalaBox</span>
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} />
        </button>

        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`}>
          {navItems.map(([label, path]) => (
            <Link
              key={path}
              className={location.pathname === path ? "nav-link active" : "nav-link"}
              to={path}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/explore" className="header-search" aria-label="Search food">
            <i className="bi bi-search" />
          </Link>
          <Link to="/cart" className="cart-link" aria-label="Open cart">
            <i className="bi bi-bag" />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
          {token ? (
            <div className="profile-menu" ref={profileRef}>
              <button
                className="profile-trigger"
                type="button"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
              >
                <img src={assets.profile} alt="Your profile" />
                <span className="profile-name">{user?.name || "Account"}</span>
                <i className={`bi bi-chevron-${profileOpen ? "up" : "down"}`} />
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <span className="profile-email">{user?.email}</span>
                  <Link to="/myorders">My orders</Link>
                  <button type="button" onClick={logout} disabled={isLoggingOut}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-link">Log in</Link>
          )}
          <Link to={token ? "/explore" : "/register"} className="nav-cta">
            {token ? "Order now" : "Get started"}
          </Link>
        </div>
      </div>
      {isLoggingOut && (
        <div className="logout-transition" role="status" aria-live="polite">
          <div className="logout-transition-card">
            <span className="logout-transition-icon"><i className="bi bi-heart-fill" /></span>
            <strong>See you soon</strong>
            <span>Your table will be waiting.</span>
            <span className="logout-transition-dots" aria-hidden="true"><i /><i /><i /></span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Menubar;
