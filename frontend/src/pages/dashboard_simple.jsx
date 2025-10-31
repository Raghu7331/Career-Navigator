import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// CSS Reset for dashboard
const dashboardStyle = `
  html, body, #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: block !important;
    place-items: initial !important;
  }
  
  #root {
    min-height: 100vh !important;
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "User",
    email: "",
  });

  // Apply CSS reset when component mounts
  useEffect(() => {
    // Create and inject CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = dashboardStyle;
    document.head.appendChild(styleElement);
    
    // Cleanup function to remove style when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Check authentication on load
  useEffect(() => {
    const userAuth = localStorage.getItem("userAuth");
    const token = localStorage.getItem("token");
    
    console.log("Dashboard - Auth check:", { userAuth, hasToken: !!token });
    
    if (!userAuth || !token) {
      console.log("Not authenticated - redirecting to login");
      navigate("/login");
      return;
    }

    // Set user data from localStorage
    const userName = localStorage.getItem("userName") || "Dashboard User";
    const userEmail = localStorage.getItem("currentUser") || "user@example.com";
    
    setUserData({
      name: userName,
      email: userEmail
    });
    
    console.log("Dashboard loaded for:", userName, userEmail);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f5f5f5",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "auto",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#2563eb",
        padding: "20px 40px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        flexShrink: 0
      }}>
        <Link to="/" style={{ 
          color: "white", 
          textDecoration: "none", 
          fontSize: "24px", 
          fontWeight: "bold" 
        }}>
          Career Navigator
        </Link>
        <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <span style={{ color: "white", textDecoration: "underline" }}>Dashboard</span>
          <Link to="/home" style={{ color: "white", textDecoration: "none" }}>Landing Page</Link>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Sign Out
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ 
        padding: "40px",
        flex: 1,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box"
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <h1 style={{ 
            color: "#1f2937", 
            fontSize: "2.5rem", 
            marginBottom: "10px",
            margin: 0 
          }}>
            Welcome back, {userData.name}! 👋
          </h1>
          <p style={{ 
            color: "#6b7280", 
            fontSize: "18px",
            margin: "10px 0 0 0" 
          }}>
            Email: {userData.email}
          </p>
          <p style={{ 
            color: "#10b981", 
            fontSize: "16px",
            fontWeight: "600",
            margin: "5px 0 0 0"
          }}>
            ✅ Successfully logged in to your dashboard!
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "25px",
          marginBottom: "30px",
          width: "100%"
        }}>
          {/* Resume Upload Card */}
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
            height: "auto",
            minHeight: "200px"
          }}>
            <h2 style={{ 
              color: "#2563eb", 
              fontSize: "1.5rem", 
              marginBottom: "15px",
              margin: "0 0 15px 0"
            }}>
              📄 Resume & Profile
            </h2>
            <p style={{ 
              color: "#6b7280", 
              marginBottom: "20px",
              margin: "0 0 20px 0"
            }}>
              Upload your resume and complete your profile to get personalized job recommendations.
            </p>
            <Link 
              to="/resume-upload"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "12px 24px",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: "600"
              }}
            >
              Manage Profile
            </Link>
          </div>

          {/* Job Recommendations Card */}
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
            height: "auto",
            minHeight: "200px"
          }}>
            <h2 style={{ 
              color: "#10b981", 
              fontSize: "1.5rem", 
              marginBottom: "15px",
              margin: "0 0 15px 0"
            }}>
              🎯 Job Recommendations
            </h2>
            <p style={{ 
              color: "#6b7280", 
              marginBottom: "20px",
              margin: "0 0 20px 0"
            }}>
              Discover personalized job opportunities based on your skills and experience.
            </p>
            <Link 
              to="/job-recommendations"
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "12px 24px",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: "600"
              }}
            >
              View Jobs
            </Link>
          </div>

          {/* Messages Card */}
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
            height: "auto",
            minHeight: "200px"
          }}>
            <h2 style={{ 
              color: "#8b5cf6", 
              fontSize: "1.5rem", 
              marginBottom: "15px",
              margin: "0 0 15px 0"
            }}>
              💬 Messages
            </h2>
            <p style={{ 
              color: "#6b7280", 
              marginBottom: "20px",
              margin: "0 0 20px 0"
            }}>
              Check messages and updates from career advisors and employers.
            </p>
            <Link 
              to="/user-messages"
              style={{
                backgroundColor: "#8b5cf6",
                color: "white",
                padding: "12px 24px",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: "600"
              }}
            >
              View Messages
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
          textAlign: "center",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <h3 style={{ 
            color: "#1f2937", 
            marginBottom: "20px",
            margin: "0 0 20px 0"
          }}>
            Quick Navigation
          </h3>
          <div style={{ 
            display: "flex", 
            gap: "15px", 
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <Link 
              to="/home" 
              style={{ 
                color: "#2563eb", 
                textDecoration: "none",
                backgroundColor: "#f3f4f6",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                border: "2px solid #2563eb",
                transition: "all 0.3s ease"
              }}
            >
              🏠 Landing Page
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#2563eb",
        color: "white",
        textAlign: "center",
        padding: "25px 40px",
        marginTop: "auto",
        width: "100%",
        boxSizing: "border-box",
        flexShrink: 0
      }}>
        <p style={{ margin: 0 }}>
          © 2025 Career Navigator. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}