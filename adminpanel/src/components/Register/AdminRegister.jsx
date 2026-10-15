import React, { useState } from "react";
import "./AdminRegister.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerAdmin } from "../../services/authService";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", password: "" });
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
      const response = await registerAdmin(data);
      if (response.status === 201) {
        toast.success("Admin registration successful! Please log in.");
        navigate("/admin/login");
      } else toast.error("Unable to register admin. Please try again.");
    } catch (error) {
      console.error("ADMIN REGISTRATION ERROR:", error.response || error);
      toast.error("Registration failed. Email might already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page--register">
      <div className="auth-visual"><div className="auth-visual-overlay" /><div className="auth-visual-content"><span className="auth-quote-mark">✦</span><blockquote>A great menu is where a good day begins.</blockquote><span className="auth-caption">JOIN THE MASALABOX WORKSPACE</span></div></div>
       <div className="auth-form-side"><div className="auth-mobile-brand"><span className="brand-mark"><i className="bi bi-basket2-fill" aria-hidden="true" /></span>masalabox<span className="brand-dot">.</span></div><div className="auth-form-wrap"><p className="eyebrow">Get started</p><h1>Bring your<br /><em>menu to life.</em></h1><p className="auth-intro">Create an admin account and start serving your best work.</p><form onSubmit={onSubmitHandler} className="auth-form"><div className="auth-field"><label htmlFor="floatingName">Your name</label><div className="auth-input-wrap"><i className="bi bi-person" aria-hidden="true" /><input type="text" id="floatingName" placeholder="Your full name" name="name" onChange={onChangeHandler} value={data.name} required /></div></div><div className="auth-field"><label htmlFor="floatingInput">Email address</label><div className="auth-input-wrap"><i className="bi bi-envelope" aria-hidden="true" /><input type="email" id="floatingInput" placeholder="you@restaurant.com" name="email" onChange={onChangeHandler} value={data.email} required /></div></div><div className="auth-field"><label htmlFor="floatingPassword">Create a password</label><div className="auth-input-wrap"><i className="bi bi-lock" aria-hidden="true" /><input type="password" id="floatingPassword" placeholder="Choose a secure password" name="password" onChange={onChangeHandler} value={data.password} required /></div></div><button className="admin-button button-red auth-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? <><span className="auth-spinner" aria-hidden="true" /> Creating account…</> : <>Create admin account <i className="bi bi-arrow-up-right" aria-hidden="true" /></>}</button><button className="auth-reset" type="reset" onClick={() => setData({ name: "", email: "", password: "" })} disabled={isSubmitting}>Clear fields</button></form><p className="auth-switch">Already have an account? <Link to="/admin/login">Sign in instead <i className="bi bi-arrow-right" aria-hidden="true" /></Link></p></div><div className="auth-footer">© {new Date().getFullYear()} Masalabox <span>•</span> Made for good food.</div></div>
    </div>
  );
};
export default AdminRegister;
