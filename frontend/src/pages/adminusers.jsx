import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/admin-login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      if (response.success) {
        const usersList = response.data?.users || [];
        setUsers(usersList);
        setFilteredUsers(usersList);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to load users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.skills?.some(skill => skill.toLowerCase().includes(term))
    );
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await adminAPI.deleteUser(userId);
      
      if (response.success) {
        alert(`User "${userName}" deleted successfully!`);
        // Refresh the users list
        await fetchUsers();
      } else {
        alert(`Failed to delete user: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user: " + error.message);
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
    header2: {
      marginBottom: "30px",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "10px",
      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    searchBox: {
      marginBottom: "30px",
    },
    input: {
      width: "100%",
      maxWidth: "100%",
      padding: "15px 20px",
      fontSize: "16px",
      border: "2px solid " + (dark ? "#4b5563" : "#e5e7eb"),
      borderRadius: "12px",
      background: dark ? "#374151" : "white",
      color: dark ? "#e6eef8" : "#0b1b2b",
      transition: "all 0.3s ease",
    },
    usersList: {
      display: "grid",
      gap: "20px",
    },
    userCard: {
      background: dark ? "#374151" : "white",
      padding: "25px",
      borderRadius: "15px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.3s ease",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: "1.3rem",
      fontWeight: "600",
      marginBottom: "5px",
      color: dark ? "#e6eef8" : "#0b1b2b",
    },
    userEmail: {
      fontSize: "1rem",
      color: dark ? "#9ca3af" : "#6b7280",
      marginBottom: "10px",
    },
    userSkills: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "10px",
    },
    skillBadge: {
      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      color: "white",
      padding: "5px 12px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "500",
    },
    actions: {
      display: "flex",
      gap: "10px",
    },
    deleteBtn: {
      background: "linear-gradient(135deg, #ef4444, #dc2626)",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    loading: {
      textAlign: "center",
      padding: "60px 20px",
      fontSize: "1.2rem",
      color: dark ? "#9ca3af" : "#6b7280",
    },
    noUsers: {
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
        <div style={styles.header2}>
          <h1 style={styles.title}>Manage Users</h1>
          <p style={{ color: dark ? "#9ca3af" : "#6b7280", fontSize: "1.1rem" }}>
            View and manage all registered users
          </p>
        </div>

        {/* Search Box */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users by name, email, or skills..."
            value={searchTerm}
            onChange={handleSearch}
            style={styles.input}
          />
        </div>

        {/* Users List */}
        {loading ? (
          <div style={styles.loading}>Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div style={styles.noUsers}>
            {searchTerm ? "No users found matching your search." : "No users registered yet."}
          </div>
        ) : (
          <div style={styles.usersList}>
            {filteredUsers.map((user) => (
              <div
                key={user.id || user._id}
                style={styles.userCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div style={styles.userInfo}>
                  <div style={styles.userName}>{user.name}</div>
                  <div style={styles.userEmail}>{user.email}</div>
                  {user.phone && (
                    <div style={{ ...styles.userEmail, marginTop: "5px" }}>
                      📞 {user.phone}
                    </div>
                  )}
                  {user.skills && user.skills.length > 0 && (
                    <div style={styles.userSkills}>
                      {user.skills.map((skill, index) => (
                        <span key={index} style={styles.skillBadge}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleDeleteUser(user.id || user._id, user.name)}
                    style={styles.deleteBtn}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
