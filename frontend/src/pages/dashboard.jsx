import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, jobsAPI, recommendationsAPI, messagesAPI } from "../services/api";

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);
  const [userData, setUserData] = useState({
    name: "User",
    email: "",
    joinDate: "October 2025",
    profileCompletion: 30,
  });
  const [jobsData, setJobsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);

  // Check authentication and load user data
  useEffect(() => {
    const userAuth = localStorage.getItem("userAuth");
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");
    
    console.log("Dashboard useEffect - Auth check:", { userAuth, token: !!token, currentUser });
    setDebugInfo(prev => [...prev, `Auth check: userAuth=${userAuth}, token=${!!token}, currentUser=${currentUser}`]);
    
    if (!userAuth || !token) {
      console.log("No authentication found, redirecting to login");
      setDebugInfo(prev => [...prev, "No authentication - redirecting to login"]);
      navigate("/login");
      return;
    }

    console.log("User authenticated, loading dashboard data");
    setDebugInfo(prev => [...prev, "Authentication found - loading data"]);
    loadUserData();
  }, [navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log("Loading user data...");
      setDebugInfo(prev => [...prev, "Starting loadUserData"]);
      
      // Set basic fallback data immediately
      const fallbackData = {
        name: localStorage.getItem("userName") || "Dashboard User",
        email: localStorage.getItem("currentUser") || "user@example.com",
        joinDate: "October 2025",
        profileCompletion: 30,
      };
      
      setUserData(fallbackData);
      setDebugInfo(prev => [...prev, `Fallback data set: ${fallbackData.name}, ${fallbackData.email}`]);

      // Try to load user profile
      try {
        const profileResponse = await authAPI.getProfile();
        console.log("Profile response:", profileResponse);
        setDebugInfo(prev => [...prev, `Profile API response: ${profileResponse?.success}`]);
        
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data;
          setUserData({
            name: profile.name || fallbackData.name,
            email: profile.email || fallbackData.email,
            joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : fallbackData.joinDate,
            profileCompletion: calculateProfileCompletion(profile),
          });
          setDebugInfo(prev => [...prev, "Profile data updated from API"]);
        }
      } catch (error) {
        console.error("Profile API failed:", error);
        setDebugInfo(prev => [...prev, `Profile API error: ${error.message}`]);
      }

      // Skip other API calls for now to isolate the issue
      setJobsData([]);
      setRecommendationsData([]);
      setMessagesCount(3);

    } catch (error) {
      console.error("Failed to load user data:", error);
      setError(error.message);
      setDebugInfo(prev => [...prev, `Error in loadUserData: ${error.message}`]);
    } finally {
      console.log("Finished loading user data");
      setDebugInfo(prev => [...prev, "Finished loadUserData"]);
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (profile) => {
    let completion = 0;
    if (profile.name) completion += 20;
    if (profile.phone) completion += 15;
    if (profile.location) completion += 15;
    if (profile.skills && JSON.parse(profile.skills || '[]').length > 0) completion += 25;
    if (profile.experience_years) completion += 15;
    if (profile.education) completion += 10;
    return completion;
  };

  const getSkillLevel = (progress) => {
    if (progress >= 80) return "Expert";
    if (progress >= 60) return "Advanced";
    if (progress >= 40) return "Intermediate";
    return "Beginner";
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
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 20px",
  };

  const welcomeSection = {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
  };

  const dashboardGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "30px",
    marginBottom: "30px",
  };

  const card = {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
  };

  const cardHeader = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  };

  const progressBar = {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "10px",
  };

  const progressFill = (percentage) => ({
    height: "100%",
    backgroundColor: "#2563eb",
    width: `${percentage}%`,
    borderRadius: "4px",
    transition: "width 0.3s ease",
  });

  const jobItem = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    marginBottom: "10px",
    border: "1px solid #e2e8f0",
  };

  const skillItem = {
    marginBottom: "20px",
  };

  const statusBadge = (status) => {
    const colors = {
      "Applied": { bg: "#dbeafe", color: "#1d4ed8" },
      "Interview Scheduled": { bg: "#dcfce7", color: "#166534" },
      "Under Review": { bg: "#fef3c7", color: "#92400e" },
    };
    
    return {
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "0.8rem",
      fontWeight: "600",
      backgroundColor: colors[status]?.bg || "#f3f4f6",
      color: colors[status]?.color || "#374151",
    };
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: "#2563eb",
    color: "white",
    marginTop: "auto",
  };

  // Simple test return to debug white page issue
  if (loading) {
    return (
      <div style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        padding: "20px"
      }}>
        <div style={{ backgroundColor: "#2563eb", padding: "20px", color: "white", marginBottom: "20px" }}>
          <h1>Career Navigator - Dashboard Loading</h1>
        </div>
        
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", marginBottom: "20px" }}>
          <h2 style={{ color: "#333" }}>🔄 Loading Dashboard...</h2>
          <p>Current user: {userData.name} ({userData.email})</p>
        </div>

        {debugInfo.length > 0 && (
          <div style={{ backgroundColor: "#fff3cd", padding: "15px", borderRadius: "8px", border: "1px solid #ffeaa7" }}>
            <h3 style={{ color: "#856404", margin: "0 0 10px 0" }}>Debug Information:</h3>
            {debugInfo.map((info, index) => (
              <div key={index} style={{ fontSize: "12px", color: "#856404", marginBottom: "2px" }}>
                {index + 1}. {info}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      backgroundColor: "#f0f0f0"
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#2563eb",
        padding: "20px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "24px", fontWeight: "bold" }}>
          Career Navigator
        </Link>
        <nav style={{ display: "flex", gap: "20px" }}>
          <span style={{ color: "white", textDecoration: "underline" }}>Dashboard</span>
          <Link to="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
          <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</Link>
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Sign Out</Link>
        </nav>
      </header>

      {/* Main Content */}
      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", marginBottom: "20px" }}>
          <h1 style={{ color: "#333", marginBottom: "10px" }}>
            Welcome to your Dashboard, {userData.name}! 🎉
          </h1>
          <p style={{ color: "#666", fontSize: "18px" }}>
            Email: {userData.email} | Member since: {userData.joinDate}
          </p>
          <p style={{ color: "#666" }}>
            Profile completion: {userData.profileCompletion}%
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "20px" }}>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
            <h2 style={{ color: "#2563eb", marginBottom: "10px" }}>📄 Resume Status</h2>
            <p>Upload your resume to get personalized job recommendations</p>
            <Link to="/resume-upload" style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
              marginTop: "10px"
            }}>
              Upload Resume
            </Link>
          </div>

          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
            <h2 style={{ color: "#10b981", marginBottom: "10px" }}>🎯 Job Recommendations</h2>
            <p>Discover jobs tailored to your skills and experience</p>
            <Link to="/job-recommendations" style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
              marginTop: "10px"
            }}>
              View Jobs
            </Link>
          </div>

          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
            <h2 style={{ color: "#8b5cf6", marginBottom: "10px" }}>💬 Messages</h2>
            <p>Check your messages from career advisors</p>
            <Link to="/user-messages" style={{
              backgroundColor: "#8b5cf6",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
              marginTop: "10px"
            }}>
              View Messages
            </Link>
          </div>
        </div>

        {/* Debug Information */}
        {debugInfo.length > 0 && (
          <div style={{ backgroundColor: "#fff3cd", padding: "15px", borderRadius: "8px", border: "1px solid #ffeaa7" }}>
            <h3 style={{ color: "#856404", margin: "0 0 10px 0" }}>Debug Information:</h3>
            {debugInfo.map((info, index) => (
              <div key={index} style={{ fontSize: "12px", color: "#856404", marginBottom: "2px" }}>
                {index + 1}. {info}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={container}>
        {/* Welcome Section */}
        <div style={welcomeSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px", color: "#0b1b2b" }}>
                Welcome back, {userData.name}! 👋
              </h1>
              {userData.profileCompletion < 50 ? (
                <div>
                  <p style={{ fontSize: "1.2rem", color: "#dc2626", marginBottom: "15px" }}>
                    ⚠️ Please complete your profile to get personalized job recommendations
                  </p>
                  <Link 
                    to="/resume-upload" 
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                      display: "inline-block"
                    }}
                  >
                    📄 Upload Resume Now
                  </Link>
                </div>
              ) : (
                <p style={{ fontSize: "1.2rem", color: "#64748b", marginBottom: "20px" }}>
                  Get personalized job recommendations based on your resume!
                </p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: hasResume ? "#2563eb" : "#dc2626" }}>
                {userData.profileCompletion}%
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Profile Complete
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div style={dashboardGrid}>
          {/* Resume Status Card */}
          <div style={card}>
            <div style={cardHeader}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#0b1b2b", margin: 0 }}>
                � Resume Status
              </h2>
              {userData.profileCompletion >= 50 ? (
                <Link to="/resume-upload" style={{ color: "#2563eb", textDecoration: "none", fontSize: "0.9rem" }}>
                  Update Profile
                </Link>
              ) : (
                <Link to="/resume-upload" style={{ color: "#dc2626", textDecoration: "none", fontSize: "0.9rem" }}>
                  Complete Profile
                </Link>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {userData.profileCompletion >= 50 ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#10b981", fontSize: "1.5rem" }}>✅</span>
                    <span style={{ fontWeight: "600", color: "#10b981" }}>Resume Uploaded</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: "600", color: "#374151" }}>Status: </span>
                    <span style={{ color: "#10b981" }}>Active & Analyzed</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: "600", color: "#374151" }}>Last Updated: </span>
                    <span style={{ color: "#64748b" }}>Today</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#dc2626", fontSize: "1.5rem" }}>❌</span>
                    <span style={{ fontWeight: "600", color: "#dc2626" }}>No Resume Found</span>
                  </div>
                  <p style={{ color: "#64748b", margin: 0 }}>
                    Upload your resume to get personalized job recommendations and career guidance.
                  </p>
                  <Link 
                    to="/resume-upload"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "600"
                    }}
                  >
                    Upload Now
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Job Recommendations Card */}
          <div style={card}>
            <div style={cardHeader}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#0b1b2b", margin: 0 }}>
                🎯 Job Recommendations
              </h2>
              {hasResume ? (
                <Link to="/job-recommendations" style={{ color: "#2563eb", textDecoration: "none", fontSize: "0.9rem" }}>
                  View All
                </Link>
              ) : (
                <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Upload Resume First
                </span>
              )}
            </div>
            <div>
              {hasResume ? (
                <>
                  <div style={{ marginBottom: "15px" }}>
                    <span style={{ fontSize: "2rem", fontWeight: "800", color: "#2563eb" }}>12</span>
                    <span style={{ color: "#64748b", marginLeft: "8px" }}>New matches found</span>
                  </div>
                  <div style={{ backgroundColor: "#f0f9ff", padding: "12px", borderRadius: "8px", border: "1px solid #e0f2fe", marginBottom: "15px" }}>
                    <div style={{ fontWeight: "600", color: "#0369a1", marginBottom: "5px" }}>Top Match:</div>
                    <div style={{ color: "#075985" }}>Frontend Developer at TechCorp</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>95% match • $70-90k • Remote</div>
                  </div>
                  <Link 
                    to="/job-recommendations"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: "600",
                      display: "block"
                    }}
                  >
                    View All Recommendations
                  </Link>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📄</div>
                  <p style={{ color: "#64748b", margin: 0 }}>
                    Upload your resume to get AI-powered job recommendations tailored to your skills and experience.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages and Profile Grid */}
        <div style={dashboardGrid}>
          {/* User Messages Card */}
          <div style={card}>
            <div style={cardHeader}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#0b1b2b", margin: 0 }}>
                � Messages
              </h2>
              <Link to="/user-messages" style={{ color: "#2563eb", textDecoration: "none", fontSize: "0.9rem" }}>
                View All
              </Link>
            </div>
            <div>
              <div style={{ marginBottom: "15px" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#dc2626" }}>3</span>
                <span style={{ color: "#64748b", marginLeft: "8px" }}>Unread messages</span>
              </div>
              <div style={{ backgroundColor: "#fef2f2", padding: "12px", borderRadius: "8px", border: "1px solid #fecaca", marginBottom: "15px" }}>
                <div style={{ fontWeight: "600", color: "#dc2626", marginBottom: "5px" }}>Latest Message:</div>
                <div style={{ color: "#991b1b" }}>New job opportunities matching your skills...</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Admin • 2 hours ago</div>
              </div>
              <Link 
                to="/user-messages"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  textAlign: "center",
                  fontWeight: "600",
                  display: "block"
                }}
              >
                Check Messages
              </Link>
            </div>
          </div>

          {/* Profile Management Card */}
          <div style={card}>
            <div style={cardHeader}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#0b1b2b", margin: 0 }}>
                � Profile Management
              </h2>
              <Link to="/resume-upload" style={{ color: "#2563eb", textDecoration: "none", fontSize: "0.9rem" }}>
                Edit Profile
              </Link>
            </div>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Name: </span>
                  <span style={{ color: "#64748b" }}>{userData.name}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Email: </span>
                  <span style={{ color: "#64748b" }}>{userData.email}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Member Since: </span>
                  <span style={{ color: "#64748b" }}>{userData.joinDate}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Profile Completion: </span>
                  <span style={{ color: hasResume ? "#10b981" : "#dc2626", fontWeight: "600" }}>
                    {userData.profileCompletion}%
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <Link 
                  to="/resume-upload" 
                  style={{ 
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "600",
                    display: "block"
                  }}
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Button */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "30px 0",
        background: dark ? "linear-gradient(135deg, #1e293b, #334155)" : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
      }}>
        <Link
          to="/home"
          style={{
            background: "#f59e0b",
            color: "white",
            textDecoration: "none",
            padding: "15px 30px",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "600",
            boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
            transition: "all 0.3s ease",
            display: "inline-block",
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 15px 35px rgba(245, 158, 11, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 10px 25px rgba(245, 158, 11, 0.3)";
          }}
        >
           Go to Home
        </Link>
      </div>

      {/* Footer */}
      <footer style={{ ...footer, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <span>© 2025 Career Navigator. All Rights Reserved.</span>
        
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
