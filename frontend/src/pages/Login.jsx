import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import api from "../api/api";
import { Leaf, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/login", { email, pass: password });
      const { token, user } = response.data;
      dispatch(loginSuccess({ token, user }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container animate-fade-in">
      {/* Left decorative panel */}
      <div className="auth-deco-panel">
        <div className="auth-deco-inner">
          <div className="auth-deco-logo">
            <Leaf size={36} />
          </div>
          <h2 className="auth-deco-title">Welcome back to<br /><span>Plant IQ</span></h2>
          <p className="auth-deco-text">
            Your AI-powered botanical companion for plant health diagnostics.
          </p>
          <div className="auth-deco-features">
            {["Instant Disease Detection", "Species Identification", "PDF Care Reports", "Scan History"].map((f) => (
              <div className="auth-deco-feature" key={f}>
                <span className="auth-deco-check">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="logo-container">
            <Leaf className="auth-logo-icon animate-bounce-slow" />
          </div>
          <h2>Sign In</h2>
          <p className="auth-subtitle">Log in to your Plant IQ account</p>

          {error && (
            <div className="error-alert animate-shake">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <Mail className="input-icon" size={19} />
              <input
                id="login-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={19} />
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ paddingRight: "50px" }}
              />
              <button
                type="button"
                className="input-eye-toggle"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <button id="login-submit" type="submit" disabled={loading} className="btn-auth-submit">
              {loading ? (
                <><span className="spinner-small" /> Signing in…</>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>New to Plant IQ?</span></div>

          <Link to="/register" className="btn-auth-secondary">
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
