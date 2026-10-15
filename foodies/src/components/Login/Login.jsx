import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Login = () => {
  const { setToken, loadCartData, setUser } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await login(data);
      if (response.status === 201 || response.status === 200) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        const nextUser = { email: response.data.email };
        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));
        await loadCartData(response.data.token);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        toast.error("Unable to login. Please try again");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid email or password. Please try again";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page page-shell">
      <div className="auth-visual auth-visual-login"><div className="auth-visual-copy"><p className="eyebrow">Welcome back</p><h1>Your table is waiting.</h1><p>Pick up where you left off and get something delicious on the way.</p></div><span className="auth-visual-sticker"><i className="bi bi-heart-fill" /> Made with love</span></div>
      <section className="auth-card">
        <div className="auth-card-header"><span className="auth-icon"><i className="bi bi-person-check" /></span><p className="eyebrow">Good to see you</p><h2>Log in to MasalaBox</h2><p>Use your account to view orders and check out faster.</p></div>
        <form onSubmit={onSubmitHandler}>
          <label>Email address<input type="email" name="email" value={data.email} onChange={(event) => setData((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" value={data.password} onChange={(event) => setData((current) => ({ ...current, password: event.target.value }))} placeholder="Your password" required /></label>
          <button type="submit" className="primary-button auth-submit" disabled={submitting}>{submitting && <span className="button-spinner" aria-hidden="true" />}{submitting ? "Signing in..." : "Sign in"}{!submitting && <i className="bi bi-arrow-right" />}</button>
        </form>
        <p className="auth-switch">New to MasalaBox? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
};

export default Login;
