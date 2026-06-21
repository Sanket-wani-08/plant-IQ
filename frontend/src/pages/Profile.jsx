import React from "react";
import { Link } from "react-router-dom";
import { useUserProfile, useScanHistory } from "../hooks/queries";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  User, Mail, Calendar, Hash, BarChart2,
  Scan, ChevronRight, Leaf, Clock, Shield, TrendingUp,
} from "lucide-react";

const Profile = () => {
  const { data: user, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { data: history, isLoading: historyLoading } = useScanHistory();

  if (profileLoading || historyLoading) return (
    <div className="container py-5">
      <LoadingSpinner message="Retrieving your profile..." />
    </div>
  );

  if (profileError || !user) return (
    <div className="container py-5">
      <div className="error-card animate-shake">
        <h3>Failed to load profile</h3>
        <p className="mt-2">{profileError?.message || "Session could not be verified."}</p>
      </div>
    </div>
  );

  const totalScans = history?.length || 0;
  const lastScan = totalScans > 0
    ? new Date(history[0].createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "No scans yet";

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="animate-fade-in">

      <div className="profile-hero-bar">
        <div className="container">
          <div className="profile-hero-inner">
            <div className="profile-avatar-large">{initials}</div>
            <div className="profile-hero-info">
              <div className="page-badge">
                <Shield size={12} />
                <span>Verified Account</span>
              </div>
              <h1 className="profile-hero-name">{user.name}</h1>
              <p className="profile-hero-email">
                <Mail size={14} />
                {user.email}
              </p>
            </div>
            <Link to="/" className="btn btn-primary profile-scan-cta">
              <Scan size={17} />
              New Scan
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl py-5">


        <div className="profile-stats-row">
          <div className="stat-card-premium">
            <div className="stat-premium-icon">
              <BarChart2 size={22} />
            </div>
            <div className="stat-premium-num">{totalScans}</div>
            <div className="stat-premium-label">Total Scans</div>
            <div className="stat-premium-sub">
              <TrendingUp size={12} /> lifetime analyses
            </div>
          </div>

          <div className="stat-card-premium">
            <div className="stat-premium-icon">
              <Clock size={22} />
            </div>
            <div className="stat-premium-num stat-small">{lastScan}</div>
            <div className="stat-premium-label">Last Scan</div>
            <div className="stat-premium-sub">
              <Leaf size={12} /> most recent analysis
            </div>
          </div>

          <div className="stat-card-premium">
            <div className="stat-premium-icon">
              <Calendar size={22} />
            </div>
            <div className="stat-premium-num stat-small">{joinDate.split(",")[0]}</div>
            <div className="stat-premium-label">Member Since</div>
            <div className="stat-premium-sub">
              <Shield size={12} /> account created
            </div>
          </div>
        </div>


        <div className="profile-info-card">
          <div className="profile-info-header">
            <h3>Account Details</h3>
          </div>

          <div className="profile-info-body">
            <div className="profile-info-row">
              <div className="profile-info-left">
                <div className="profile-info-icon"><User size={16} /></div>
                <div>
                  <span className="profile-info-label">Full Name</span>
                  <span className="profile-info-value">{user.name}</span>
                </div>
              </div>
            </div>

            <div className="profile-info-row">
              <div className="profile-info-left">
                <div className="profile-info-icon"><Mail size={16} /></div>
                <div>
                  <span className="profile-info-label">Email Address</span>
                  <span className="profile-info-value">{user.email}</span>
                </div>
              </div>
            </div>


            <div className="profile-info-row" style={{ borderBottom: "none" }}>
              <div className="profile-info-left">
                <div className="profile-info-icon"><Calendar size={16} /></div>
                <div>
                  <span className="profile-info-label">Joined</span>
                  <span className="profile-info-value">{joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {totalScans > 0 && (
          <Link to="/history" className="profile-action-banner">
            <div className="profile-action-left">
              <div className="profile-action-icon"><BarChart2 size={20} /></div>
              <div>
                <div className="profile-action-title">View Scan History</div>
                <div className="profile-action-sub">Browse and download your {totalScans} diagnostic records</div>
              </div>
            </div>
            <ChevronRight size={20} className="profile-action-arrow" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Profile;
