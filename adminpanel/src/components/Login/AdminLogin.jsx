import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/authService";
import { toast } from "react-toastify";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((current) => ({ ...current, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await adminLogin(data);
      if (response.status === 201 || response.status === 200) {
        navigate("/");
        window.location.reload();
      } else toast.error("Admin login failed. Check credentials.");
    } catch (error) {
      console.log("ADMIN LOGIN ERROR:", error.response || error);
      toast.error("Invalid Admin Credentials or server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page--login">
      <div className="auth-visual"><div className="auth-visual-overlay" /><div className="auth-visual-content"><span className="auth-quote-mark">“</span><blockquote>Good food brings people together. Good teams make it happen.</blockquote><span className="auth-caption">THE MASALABOX WORKSPACE</span></div></div>
       <div className="auth-form-side"><div className="auth-mobile-brand"><span className="brand-mark"><i className="bi bi-basket2-fill" aria-hidden="true" /></span>masalabox<span className="brand-dot">.</span></div><div className="auth-form-wrap"><p className="eyebrow">Welcome back</p><h1>Let’s make<br /><em>something delicious.</em></h1><p className="auth-intro">Sign in to keep your menu fresh and your orders moving.</p><form onSubmit={onSubmitHandler} className="auth-form"><div className="auth-field"><label htmlFor="floatingInput">Email address</label><div className="auth-input-wrap"><i className="bi bi-envelope" aria-hidden="true" /><input type="email" id="floatingInput" placeholder="you@restaurant.com" name="email" onChange={onChangeHandler} value={data.email} required /></div></div><div className="auth-field"><label htmlFor="floatingPassword">Password</label><div className="auth-input-wrap"><i className="bi bi-lock" aria-hidden="true" /><input type="password" id="floatingPassword" placeholder="Enter your password" name="password" onChange={onChangeHandler} value={data.password} required /></div></div><button className="admin-button button-red auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? <><span className="auth-spinner" aria-hidden="true" /> Signing in…</> : <>Sign in to workspace <i className="bi bi-arrow-up-right" aria-hidden="true" /></>}</button><button className="auth-reset" type="reset" onClick={() => setData({ email: "", password: "" })} disabled={isSubmitting}>Clear fields</button></form><p className="auth-switch">New to Masalabox? <Link to="/admin/register">Create an admin account <i className="bi bi-arrow-right" aria-hidden="true" /></Link></p></div><div className="auth-footer">© {new Date().getFullYear()} Masalabox <span>•</span> Made for good food.</div></div>
    </div>
  );
};
export default AdminLogin;
