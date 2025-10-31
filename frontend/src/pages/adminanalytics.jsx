import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI, jobsAPI, enhancedEmailAPI } from "../services/api";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    messages: 0,
    emailStats: { totalEmails: 0, sentEmails: 0, failedEmails: 0, todayEmails: 0 },
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/admin-login");
      return;
    }
    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await adminAPI.getDashboardStats();
      
      // Fetch email stats
      const emailResponse = await enhancedEmailAPI.getStats();
      
      // Fetch users for skill analysis
      const usersResponse = await adminAPI.getUsers();
      
      // Fetch jobs
      const jobsResponse = await jobsAPI.getJobs();

      if (statsResponse.success) {
        const stats = statsResponse.data?.stats || {};
        setAnalytics({
          users: stats.totalUsers || 0,
          jobs: stats.totalJobs || 0,
          applications: stats.activeApplications || 0,
          messages: stats.messagesSent || 0,
          emailStats: emailResponse.success ? emailResponse.data : {},
        });
      }

      if (usersResponse.success) {
        setUsers(usersResponse.data?.users || []);
      }

      if (jobsResponse.success) {
        setJobs(jobsResponse.data?.jobs || []);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  // Calculate top skills
  const getTopSkills = () => {
    const skillCounts = {};
    users.forEach(user => {
      if (user.skills && Array.isArray(user.skills)) {
        user.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });
    return Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const topSkills = getTopSkills();

  const styles = {
    page: {
      fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      color: dark ? "#e6eef8" : "#0b1b2b",
      minHeight: "100vh",
      width: "100vw",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      background: dark
        ? "linear-gradient(135deg, #1e293b, #334155)"
        : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 5%",
      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      color: "white",
      boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
    },
    brand: {
      fontSize: "1.8rem",
      fontWeight: "700",
    },
    nav: {
      display: "flex",
      gap: "30px",
      alignItems: "center",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "500",
      transition: "opacity 0.3s ease",
    },
    container: {
      width: "100%",
      margin: "0",
      padding: "40px 5%",
      boxSizing: "border-box",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "10px",
      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "25px",
      marginBottom: "40px",
    },
    statCard: {
      background: dark ? "#374151" : "white",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
      transition: "all 0.3s ease",
    },
    statValue: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "10px",
      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    statLabel: {
      fontSize: "1rem",
      color: dark ? "#9ca3af" : "#6b7280",
      fontWeight: "500",
    },
    chartSection: {
      background: dark ? "#374151" : "white",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
      marginBottom: "30px",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "20px",
      color: dark ? "#e6eef8" : "#0b1b2b",
    },
    skillsList: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    skillItem: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    skillName: {
      minWidth: "150px",
      fontSize: "1rem",
      fontWeight: "500",
      color: dark ? "#e6eef8" : "#0b1b2b",
    },
    skillBar: {
      flex: 1,
      height: "30px",
      background: dark ? "#4b5563" : "#e5e7eb",
      borderRadius: "15px",
      overflow: "hidden",
      position: "relative",
    },
    skillBarFill: (percentage) => ({
      height: "100%",
      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      width: percentage + "%",
      transition: "width 1s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: "10px",
      color: "white",
      fontSize: "0.85rem",
      fontWeight: "600",
    }),
    loading: {
      textAlign: "center",
      padding: "60px 20px",
      fontSize: "1.2rem",
      color: dark ? "#9ca3af" : "#6b7280",
    },
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.brand}>Career Navigator - Admin</div>
        <nav style={styles.nav}>
          <Link to="/admin-dashboard" style={styles.link}>
            Dashboard
          </Link>
          <Link to="/admin-jobs" style={styles.link}>
            Jobs
          </Link>
          <Link to="/admin-users" style={styles.link}>
            Users
          </Link>
          <Link to="/admin-analytics" style={styles.link}>
            Analytics
          </Link>
          <Link to="/admin-email-sender" style={styles.link}>
            Emails
          </Link>
          <Link to="/admin-messages" style={styles.link}>
            Messages
          </Link>
          <button
            onClick={handleLogout}
            style={{
              ...styles.link,
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {dark ? "🌞" : "🌙"}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div style={styles.container}>
        <h1 style={styles.title}>Analytics Dashboard</h1>
        <p style={{ color: dark ? "#9ca3af" : "#6b7280", fontSize: "1.1rem", marginBottom: "30px" }}>
          Comprehensive analytics and insights
        </p>

        {loading ? (
          <div style={styles.loading}>Loading analytics...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{analytics.users}</div>
                <div style={styles.statLabel}>Total Users</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{analytics.jobs}</div>
                <div style={styles.statLabel}>Total Jobs</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{analytics.applications}</div>
                <div style={styles.statLabel}>Applications</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{analytics.messages}</div>
                <div style={styles.statLabel}>Messages Sent</div>
              </div>
            </div>

            {/* Email Stats */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{analytics.emailStats.totalEmails || 0}</div>
                <div style={styles.statLabel}>Total Emails</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{analytics.emailStats.sentEmails || 0}</div>
                <div style={styles.statLabel}>Emails Sent</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{analytics.emailStats.failedEmails || 0}</div>
                <div style={styles.statLabel}>Emails Failed</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{analytics.emailStats.todayEmails || 0}</div>
                <div style={styles.statLabel}>Today's Emails</div>
              </div>
            </div>

            {/* Top Skills Chart */}
            {topSkills.length > 0 && (
              <div style={styles.chartSection}>
                <h2 style={styles.sectionTitle}>Top Skills in Demand</h2>
                <div style={styles.skillsList}>
                  {topSkills.map(([skill, count], index) => {
                    const maxCount = topSkills[0][1];
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={index} style={styles.skillItem}>
                        <div style={styles.skillName}>{skill}</div>
                        <div style={styles.skillBar}>
                          <div style={styles.skillBarFill(percentage)}>
                            {count} users
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary Section */}
            <div style={styles.chartSection}>
              <h2 style={styles.sectionTitle}>Platform Summary</h2>
              <div style={{ fontSize: "1.1rem", lineHeight: "1.8", color: dark ? "#d1d5db" : "#374151" }}>
                <p>
                  📊 <strong>Platform Activity:</strong> The platform currently has{" "}
                  <strong>{analytics.users}</strong> registered users with{" "}
                  <strong>{analytics.jobs}</strong> active job listings.
                </p>
                <p>
                  📧 <strong>Email Performance:</strong> A total of{" "}
                  <strong>{analytics.emailStats.totalEmails || 0}</strong> emails have been sent, with{" "}
                  <strong>{analytics.emailStats.sentEmails || 0}</strong> successfully delivered and{" "}
                  <strong>{analytics.emailStats.todayEmails || 0}</strong> sent today.
                </p>
                <p>
                  💼 <strong>Job Applications:</strong> Users have submitted{" "}
                  <strong>{analytics.applications}</strong> job applications across all listings.
                </p>
                {topSkills.length > 0 && (
                  <p>
                    🎯 <strong>Top Skill:</strong> The most common skill among users is{" "}
                    <strong>{topSkills[0][0]}</strong> with <strong>{topSkills[0][1]}</strong> users.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
