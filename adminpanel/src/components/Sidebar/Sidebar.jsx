import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../../assets/assests";

const Sidebar = ({ sidebarVisible, onNavigate, onClose }) => {
  const { pathname } = useLocation();
  return (
    <aside
      className={`admin-sidebar ${sidebarVisible ? "is-open" : ""}`}
      id="sidebar-wrapper"
    >
      <div className="sidebar-brand-row">
        <Link to="/" className="admin-brand" onClick={onNavigate} aria-label="Masalabox menu">
          <span className="brand-mark"><img src={assets.brandMark} alt="" /></span>
          <span>masalabox<span className="brand-dot">.</span></span>
        </Link>
        <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><i className="bi bi-x-lg" aria-hidden="true" /></button>
      </div>
      <div className="workspace-label"><span /> Restaurant workspace</div>
      <nav className="sidebar-navigation" aria-label="Main navigation">
        <p className="nav-section-label">MANAGE RESTAURANT</p>
        <NavLink to="/list" className={({ isActive }) => `sidebar-link ${isActive || pathname === "/" ? "active" : ""}`} onClick={onNavigate}>
          <i className="bi bi-grid" aria-hidden="true" /><span>List Food</span><i className="bi bi-chevron-right nav-chevron" aria-hidden="true" />
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onNavigate}>
          <i className="bi bi-plus-circle" aria-hidden="true" /><span>Add Food</span><i className="bi bi-chevron-right nav-chevron" aria-hidden="true" />
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onNavigate}>
          <i className="bi bi-bag" aria-hidden="true" /><span>Orders</span><i className="bi bi-chevron-right nav-chevron" aria-hidden="true" />
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="sidebar-note-icon"><i className="bi bi-heart" aria-hidden="true" /></span>
          <h3>A little care.<br />A lot of flavour.</h3>
          <p>Make every meal a reason to come back.</p>
          <Link to="/add" onClick={onNavigate}>Create something delicious <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>
        </div>
        <div className="sidebar-footer"><span className="mini-brand">m.</span><span>Made for good food.<small>Masalabox Admin</small></span></div>
      </div>
    </aside>
  );
};

export default Sidebar;
