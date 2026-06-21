import { Link } from "react-router-dom";
import { Leaf, Code, Globe, Mail, Heart, Scan, History, User, LogIn, Shield, BookOpen } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C240,10 480,55 720,30 C960,5 1200,50 1440,20 L1440,60 L0,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="footer-body">
        <div className="footer-container">

          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <Leaf size={22} />
              <span>Plant IQ</span>
            </Link>
            <p className="footer-tagline">
              AI-powered botanical diagnostics for healthy, thriving plants. Identify species, detect diseases, and get expert care plans in seconds.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">
                <span className="footer-badge-dot"></span>
                AI Powered
              </span>
              <span className="footer-badge">
                <Shield size={11} />
                Secure
              </span>
              <span className="footer-badge">
                <BookOpen size={11} />
                Expert Verified
              </span>
            </div>
          </div>


          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/" className="footer-link">
                  <Scan size={14} />
                  <span>Plant Scanner</span>
                </Link>
              </li>
              <li>
                <Link to="/history" className="footer-link">
                  <History size={14} />
                  <span>Scan History</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">
                  <User size={14} />
                  <span>My Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  <LogIn size={14} />
                  <span>Login</span>
                </Link>
              </li>
            </ul>
          </div>


          <div className="footer-links-col">
            <h4 className="footer-col-title">Features</h4>
            <ul className="footer-link-list">
              <li><span className="footer-feature-item">🔬 Disease Detection</span></li>
              <li><span className="footer-feature-item">🌿 Species Identification</span></li>
              <li><span className="footer-feature-item">💧 Care Recommendations</span></li>
              <li><span className="footer-feature-item">📄 PDF Reports</span></li>
              <li><span className="footer-feature-item">📋 Scan History</span></li>
              <li><span className="footer-feature-item">🤖 Gemini AI Analysis</span></li>
            </ul>
          </div>

        </div>
      </div>


      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">
          <p className="footer-copyright" style={{ width: "100%", textAlign: "center" }}>
            © {year} <strong>Plant IQ</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
