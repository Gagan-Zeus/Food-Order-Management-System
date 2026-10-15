import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Orders from "./pages/Orders/Orders";
import AddFood from "./pages/AddFood/AddFood";
import ListFood from "./pages/ListFood/ListFood";
import Sidebar from "./components/Sidebar/Sidebar";
import Menubar from "./components/Menubar/Menubar";
import { ToastContainer } from "react-toastify";

import AdminLogin from "./components/Login/AdminLogin";
import AdminRegister from "./components/Register/AdminRegister";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("adminToken");

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(() =>
    window.matchMedia("(min-width: 992px)").matches
  );

  const toggleSidebar = () => {
    setSidebarVisible((visible) => !visible);
  };

  const closeMobileSidebar = () => {
    if (window.matchMedia("(max-width: 991px)").matches) {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSidebarVisible(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isAuthenticated = !!localStorage.getItem("adminToken");
  return (
    <div className={`admin-app ${isAuthenticated ? "" : "admin-app--public"}`} id="wrapper">
      <a className="skip-link" href="#main-content">Skip to content</a>
      {isAuthenticated && <Sidebar sidebarVisible={sidebarVisible} onNavigate={closeMobileSidebar} onClose={() => setSidebarVisible(false)} />}
      {isAuthenticated && sidebarVisible && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarVisible(false)} />}
      <div id="page-content-wrapper">
        {isAuthenticated && <Menubar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />}
        <ToastContainer position="top-right" theme="light" ariaLabel="Notifications" />
        <main id="main-content" className={isAuthenticated ? "admin-content" : "admin-public-content"} tabIndex={-1}>
          <div className="route-transition" key={`${location.pathname}${location.search}`}>
            <Routes location={location}>
              {/* -------------------- PUBLIC ADMIN ROUTES -------------------- */}
              <Route
                path="/admin/login"
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <AdminLogin />
                }
              />
              <Route
                path="/admin/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <AdminRegister />
                  )
                }
              />

              {/* -------------------- PROTECTED ADMIN ROUTES -------------------- */}

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <ListFood />
                  </PrivateRoute>
                }
              />

              {/* -------------------- Food Management Routes -------------------- */}
              <Route
                path="/add"
                element={
                  <PrivateRoute>
                    <AddFood />
                  </PrivateRoute>
                }
              />
              <Route
                path="/list"
                element={
                  <PrivateRoute>
                    <ListFood />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />

              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? "/" : "/admin/login"} replace />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
