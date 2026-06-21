import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Leaf, History, User, LogOut, LogIn, Menu, X } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <Leaf className="logo-icon animate-bounce-slow" />
          <span>Plant IQ</span>
        </Link>

        {/* Mobile menu toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links */}
        <div className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/history" 
                className={`nav-link ${isActive("/history") ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <History size={16} className="mr-1" /> History
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link user-profile-link ${isActive("/profile") ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} className="mr-1" /> Hi, {user}
              </Link>
              <button className="btn-logout" onClick={handleLogout}>
                <LogOut size={16} className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive("/login") ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn size={16} className="mr-1" /> Login
              </Link>
              <Link 
                to="/register" 
                className="btn-register-nav"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
