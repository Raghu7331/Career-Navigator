import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { messagesAPI } from "../services/api";

export default function UserMessages() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [userData, setUserData] = useState({});
  const [messages, setMessages] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all, urgent, job-alerts, system
  const [loading, setLoading] = useState(false);

  // Check authentication and load user data
  useEffect(() => {
    const userAuth = localStorage.getItem("userAuth");
    if (!userAuth) {
      navigate("/login");
      return;
    }

    // Load user data
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    
    loadMessages();
  }, [navigate]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getUserMessages();
      if (response.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      // Fallback to empty array if API fails
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };



  const getFilteredMessages = () => {
    switch (filterType) {
      case "urgent":
        return messages.filter(message => message.urgent);
      case "job-alerts":
        return messages.filter(message => message.message_type === "job_alert" || message.type === "Job Alert");
      case "system":
        return messages.filter(message => message.message_type === "system" || message.type === "System Update");
      default:
        return messages;
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await messagesAPI.markMessageRead(messageId);
      setMessages(messages.map(message => 
        message.id === messageId ? { ...message, is_read: true, read: true } : message
      ));
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const deleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setMessages(messages.filter(message => message.id !== messageId));
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Job Alert": return "#3b82f6";
      case "System Update": return "#6b7280";
      case "Event Notification": return "#8b5cf6";
      case "Career Guidance": return "#059669";
      default: return "#6b7280";
    }
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
    background: dark ? "linear-gradient(135deg, #1e293b, #334155)" : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  };

  const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 5%",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
  };

  const brand = {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "white",
  };

  const nav = {
    display: "flex",
    gap: "30px",
    alignItems: "center",
  };

  const container = {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
    flex: 1,
  };

  const filterBar = {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const filterButton = (isActive) => ({
    background: isActive ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "transparent",
    color: isActive ? "white" : (dark ? "#e6eef8" : "#374151"),
    border: "2px solid " + (isActive ? "#3b82f6" : (dark ? "#4b5563" : "#d1d5db")),
    padding: "10px 20px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const summaryCard = {
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "30px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
  };

  const messageCard = (isRead) => ({
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "20px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
    opacity: isRead ? 0.8 : 1,
    borderLeft: isRead ? "none" : "4px solid #3b82f6",
  });

  const messageHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    gap: "15px",
  };

  const urgentBadge = {
    background: "#dc2626",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    marginLeft: "10px",
  };

  const typeBadge = (type) => ({
    background: getTypeColor(type),
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  });

  const unreadBadge = {
    background: "#3b82f6",
    color: "white",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "10px",
    fontWeight: "600",
    marginLeft: "10px",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: dark ? "#1e293b" : "#2563eb",
    color: "white",
  };

  const filteredMessages = getFilteredMessages();
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <Link to="/dashboard" style={{ ...brand, textDecoration: "none" }}>Career Navigator</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>← Dashboard</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Messages</span>
          </nav>
        </div>
      </header>

      <div style={container}>
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "15px" }}>
            Messages & Announcements 📬
          </h1>
          <p style={{ fontSize: "18px", color: dark ? "#9ca3af" : "#6b7280" }}>
            Stay updated with job alerts and important announcements
          </p>
        </div>

        {/* Summary Card */}
        <div style={summaryCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "5px" }}>
                Your Messages 📩
              </h3>
              <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280" }}>
                You have {messages.length} total messages, {unreadCount} unread
              </p>
            </div>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3b82f6" }}>
                  {messages.length}
                </div>
                <div style={{ fontSize: "12px", color: dark ? "#9ca3af" : "#6b7280" }}>
                  Total
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#dc2626" }}>
                  {unreadCount}
                </div>
                <div style={{ fontSize: "12px", color: dark ? "#9ca3af" : "#6b7280" }}>
                  Unread
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={filterBar}>
          <button
            onClick={() => setFilterType("all")}
            style={filterButton(filterType === "all")}
          >
            All Messages ({messages.length})
          </button>
          <button
            onClick={() => setFilterType("urgent")}
            style={filterButton(filterType === "urgent")}
          >
            Urgent ({messages.filter(m => m.urgent).length})
          </button>
          <button
            onClick={() => setFilterType("job-alerts")}
            style={filterButton(filterType === "job-alerts")}
          >
            Job Alerts ({messages.filter(m => m.type === "Job Alert").length})
          </button>
          <button
            onClick={() => setFilterType("system")}
            style={filterButton(filterType === "system")}
          >
            System ({messages.filter(m => m.type === "System Update").length})
          </button>
        </div>

        {/* Messages */}
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "18px", color: dark ? "#9ca3af" : "#6b7280" }}>
                Loading messages...
              </div>
            </div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div key={message.id} style={messageCard(message.is_read || message.read)}>
                <div style={messageHeader}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }}>
                      <h3 style={{ fontSize: "1.3rem", fontWeight: "600", margin: 0 }}>
                        {message.subject || message.title}
                      </h3>
                      {!(message.is_read || message.read) && <span style={unreadBadge}>NEW</span>}
                      {message.urgent && <span style={urgentBadge}>URGENT</span>}
                    </div>
                    
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px", flexWrap: "wrap" }}>
                      <span style={typeBadge(message.message_type || message.type)}>
                        {message.message_type || message.type}
                      </span>
                      <span style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                        Sent on {new Date(message.created_at || message.dateSent).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    {!(message.is_read || message.read) && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        style={{
                          background: "transparent",
                          color: "#3b82f6",
                          border: "1px solid #3b82f6",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(message.id)}
                      style={{
                        background: "transparent",
                        color: "#dc2626",
                        border: "1px solid #dc2626",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p style={{ 
                  fontSize: "16px", 
                  color: dark ? "#d1d5db" : "#374151", 
                  lineHeight: "1.6",
                  marginBottom: "15px"
                }}>
                  {message.content}
                </p>

                <div style={{ fontSize: "12px", color: dark ? "#9ca3af" : "#6b7280" }}>
                  <strong>From:</strong> {message.sender_name || 'Admin'} • 
                  <strong> Target Audience:</strong> {
                    message.target_skills 
                      ? (typeof message.target_skills === 'string' 
                         ? message.target_skills 
                         : JSON.parse(message.target_skills || '[]').join(', '))
                      : message.targetSkills || 'All Users'
                  }
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: dark ? "#9ca3af" : "#6b7280"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>No messages found</h3>
              <p>No messages match your current filter. Try selecting a different filter.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          ...summaryCard,
          textAlign: "center",
          marginTop: "40px",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>🔔</div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "10px" }}>
            Stay Connected
          </h3>
          <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "20px" }}>
            Don't miss important updates! Make sure your profile is complete to receive relevant job alerts.
          </p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/job-recommendations"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: "white",
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
            >
              View Job Recommendations
            </Link>
            <Link
              to="/resume-upload"
              style={{
                background: "transparent",
                color: dark ? "#e6eef8" : "#374151",
                border: "2px solid " + (dark ? "#4b5563" : "#d1d5db"),
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
            >
              Update Profile
            </Link>
          </div>
        </div>
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