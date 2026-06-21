import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Leaf, User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/register", { name, email, pass: password });
      setSuccess("Registration successful! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e"];

  return (
    <div className="auth-page-container animate-fade-in">

      <div className="auth-deco-panel">
        <div className="auth-deco-inner">
          <div className="auth-deco-logo">
            <Leaf size={36} />
          </div>
          <h2 className="auth-deco-title">Join<br /><span>Plant IQ</span></h2>
          <p className="auth-deco-text">
            Create your free account and start diagnosing your plants with the power of AI in seconds.
          </p>
          <div className="auth-deco-features">
            {["Free forever plan", "Unlimited plant scans", "Downloadable PDF reports", "Secure & private"].map((f) => (
              <div className="auth-deco-feature" key={f}>
                <span className="auth-deco-check">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="logo-container">
            <Leaf className="auth-logo-icon animate-bounce-slow" />
          </div>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join Plant IQ — it's completely free</p>

          {error && (
            <div className="error-alert animate-shake">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="success-alert">
              <CheckCircle size={18} className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="input-icon" size={19} />
              <input
                id="register-name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </div>

            <div className="input-group">
              <Mail className="input-icon" size={19} />
              <input
                id="register-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !!success}
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={19} />
              <input
                id="register-password"
                type={showPass ? "text" : "password"}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !!success}
                style={{ paddingRight: "50px" }}
              />
              <button
                type="button"
                className="input-eye-toggle"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>


            {password.length > 0 && (
              <div className="password-strength-wrapper">
                <div className="strength-bar-track">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="strength-bar-seg"
                      style={{ background: i <= strength ? strengthColor[strength] : undefined }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColor[strength] }}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}

            <button id="register-submit" type="submit" disabled={loading || !!success} className="btn-auth-submit">
              {loading ? (
                <><span className="spinner-small" /> Creating account…</>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>Already have an account?</span></div>

          <Link to="/login" className="btn-auth-secondary">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
