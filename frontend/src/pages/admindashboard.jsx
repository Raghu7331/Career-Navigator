import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI, isAdminAuthenticated, getCurrentAdmin } from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [statsData, setStatsData] = useState({
    totalJobs: 0,
    totalUsers: 0,
    activeApplications: 0,
    messagesSent: 0,
  });

  // Check admin authentication and fetch data
  useEffect(() => {
    const initAdminDashboard = async () => {
      console.log("AdminDashboard component mounted"); 
      
      if (!isAdminAuthenticated()) {
        console.log("No valid admin auth found, redirecting to login...");
        navigate("/admin-login");
        return;
      }

      try {
        // Get current admin data
        const currentAdmin = getCurrentAdmin();
        if (currentAdmin) {
          setAdminData({
            name: currentAdmin.email || "Admin User",
            adminId: currentAdmin.id || "admin",
            loginTime: new Date().toLocaleString(),
          });
        }

        // Fetch dashboard statistics
        const response = await adminAPI.getDashboardStats();
        if (response.success) {
          setStatsData(response.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Use default stats on error but don't block the UI
      } finally {
        setLoading(false);
      }
    };

    initAdminDashboard();
  }, [navigate]);

  const handleSignOut = () => {
    adminAPI.logout();
  };

  const page = {
    fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    color: dark ? "#e6eef8" : "#0b1b2b",
    minHeight: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflowY: "auto",
  };

  const header = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 40px",
    backgroundColor: "#2563eb",
  };

  const brand = {
    fontWeight: 700,
    fontSize: "28px",
    color: "white",
  };

  const nav = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "18px",
    color: "white",
  };

  const container = {
    width: "100%",
    margin: "0",
    padding: "40px 5%",
    boxSizing: "border-box",
    flex: 1,
  };

  const welcomeSection = {
    background: dark ? "#07172a" : "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    marginBottom: "40px",
    boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.6)" : "0 10px 35px rgba(0,0,0,0.2)",
    textAlign: "center",
  };

  const statsGrid = {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "25px",
    marginBottom: "40px",
  };

  const statCard = {
    width: "280px",
    padding: "40px",
    borderRadius: "20px",
    background: dark ? "#07172a" : "#ffffff",
    boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.6)" : "0 10px 35px rgba(0,0,0,0.2)",
    textAlign: "center",
    minHeight: "180px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    flex: "1 1 280px",
  };

  const quickActionsGrid = {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "25px",
    marginBottom: "40px",
  };

  const actionCard = {
    width: "380px",
    padding: "40px",
    borderRadius: "20px",
    background: dark ? "#07172a" : "#ffffff",
    boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.6)" : "0 10px 35px rgba(0,0,0,0.2)",
    textAlign: "center",
    minHeight: "280px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    flex: "1 1 380px",
  };

  const actionButton = {
    padding: "16px 40px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "16px",
    background: "#f59e0b",
    color: "white",
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.3s ease",
    marginTop: "15px",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: "#2563eb",
    color: "white",
  };

  if (loading) {
    return (
      <div style={{...page, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <h2>Loading Admin Dashboard...</h2>
          <p>Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div style={{...page, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <h2>Authentication Required</h2>
          <p>Redirecting to admin login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <Link to="/" style={{ ...brand, textDecoration: "none" }}>Career Navigator Admin</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <span style={{ color: "white", textDecoration: "underline" }}>Dashboard</span>
            <button
              onClick={handleSignOut}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        minHeight: "300px",
        padding: "40px 0px",
        background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
        border: "none",
        outline: "none",
        boxShadow: "none",
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)"
      }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "20px", color: "white" }}>
          🛡️ Admin Dashboard
        </h1>
        <p style={{ maxWidth: "600px", marginTop: "10px", opacity: 0.9, fontSize: "1.3rem", lineHeight: "1.6", color: "white", textAlign: "center" }}>
          Welcome, {adminData.name}! Manage jobs, users, and platform content with powerful admin tools.
        </p>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", marginTop: "10px" }}>
          Last login: {adminData.loginTime}
        </p>
      </div>

      <div style={container}>

        {/* Statistics */}
        <div style={statsGrid}>
          <div style={statCard}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>💼</div>
            <h3 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "5px", color: "#dc2626" }}>
              {statsData.totalJobs}
            </h3>
            <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280" }}>Total Job Postings</p>
          </div>

          <div style={statCard}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>👥</div>
            <h3 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "5px", color: "#059669" }}>
              {statsData.totalUsers}
            </h3>
            <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280" }}>Registered Users</p>
          </div>

          <div style={statCard}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>📋</div>
            <h3 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "5px", color: "#3b82f6" }}>
              {statsData.activeApplications}
            </h3>
            <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280" }}>Active Applications</p>
          </div>

          <div style={statCard}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>💬</div>
            <h3 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "5px", color: "#f59e0b" }}>
              {statsData.messagesSent}
            </h3>
            <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280" }}>Messages Sent</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "25px" }}>Quick Actions</h2>
        <div style={quickActionsGrid}>
          <div style={actionCard}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>💼</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px" }}>
              Manage Jobs
            </h3>
            <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "20px" }}>
              Upload new job postings, edit existing jobs, and manage job requirements
            </p>
            <Link
              to="/admin-jobs"
              style={actionButton}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(220, 38, 38, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Manage Jobs
            </Link>
          </div>

          <div style={actionCard}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>�</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px" }}>
              Send Emails
            </h3>
            <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "20px" }}>
              Send emails and job alerts directly to users' email addresses
            </p>
            <Link
              to="/admin-email-sender"
              style={actionButton}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(220, 38, 38, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Email Sender
            </Link>
          </div>

          <div style={actionCard}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>👥</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px" }}>
              User Management
            </h3>
            <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "20px" }}>
              View user profiles, resumes, and manage user applications
            </p>
            <Link
              to="/admin-users"
              style={actionButton}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(220, 38, 38, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Manage Users
            </Link>
          </div>

          <div style={actionCard}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>📊</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px" }}>
              Analytics
            </h3>
            <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "20px" }}>
              View platform statistics, user engagement, and job performance
            </p>
            <Link
              to="/admin-analytics"
              style={actionButton}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(220, 38, 38, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ ...footer, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <span>© 2025 Career Navigator Admin Panel. All Rights Reserved.</span>
        
        <button
          onClick={() => setDark(!dark)}
          style={{ 
            position: "absolute",
            right: "20px",
            background: "transparent",
            color: "white",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            padding: "5px",
            transition: "all 0.3s ease",
          }}
        >
          🌙
        </button>
      </footer>
    </div>
  );
}