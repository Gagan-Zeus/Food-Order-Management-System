import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../service/authService";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success("Registration completed. Please login");
        navigate("/login");
      } else {
        toast.error("Unable to register. Please try again");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to register. Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page page-shell register-auth-page">
      <div className="auth-visual auth-visual-register"><div className="auth-visual-copy"><p className="eyebrow">A seat at the table</p><h1>More good food, more good days.</h1><p>Save your favourites, follow every order, and make every meal feel like a little occasion.</p></div><span className="auth-visual-sticker"><i className="bi bi-stars" /> Welcome in</span></div>
      <section className="auth-card">
        <div className="auth-card-header"><span className="auth-icon"><i className="bi bi-person-plus" /></span><p className="eyebrow">Join the table</p><h2>Create your account</h2><p>It takes less than a minute to get started.</p></div>
        <form onSubmit={onSubmitHandler}>
          <label>Full name<input type="text" name="name" value={data.name} onChange={(event) => setData((current) => ({ ...current, name: event.target.value }))} placeholder="Your name" required /></label>
          <label>Email address<input type="email" name="email" value={data.email} onChange={(event) => setData((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" value={data.password} onChange={(event) => setData((current) => ({ ...current, password: event.target.value }))} placeholder="Choose a password" required /></label>
          <button type="submit" className="primary-button auth-submit" disabled={submitting}>{submitting && <span className="button-spinner" aria-hidden="true" />}{submitting ? "Creating account..." : "Create account"}{!submitting && <i className="bi bi-arrow-right" />}</button>
        </form>
        <p className="auth-switch">Already a member? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
};

export default Register;
