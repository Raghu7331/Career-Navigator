import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { messagesAPI } from "../services/api";

export default function AdminMessages() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  // Check admin authentication and load messages
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const adminToken = localStorage.getItem("adminToken");
    if (!isAdminLoggedIn || !adminToken) {
      navigate("/admin-login");
      return;
    }
    loadSentMessages();
  }, [navigate]);

  const loadSentMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getAdminMessages();
      
      if (response.success) {
        setSentMessages(response.data.messages || []);
      } else {
        throw new Error(response.message || "Failed to load messages");
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      alert("Failed to load messages: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const [messageForm, setMessageForm] = useState({
    title: "",
    content: "",
    type: "",
    targetSkills: "",
    urgent: false,
  });

  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMessageForm({
      ...messageForm,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare message data for API
      const messageData = {
        subject: messageForm.title,
        content: messageForm.content,
        message_type: messageForm.type || 'general',
        recipient_type: 'all_users',
        target_skills: messageForm.targetSkills ? messageForm.targetSkills.split(',').map(s => s.trim()) : []
      };

      const response = await messagesAPI.sendMessage(messageData);
      
      if (response.success) {
        alert("Message sent successfully to all users!");
        setMessageForm({
          title: "",
          content: "",
          type: "",
          targetSkills: "",
          urgent: false,
        });
        // Reload messages to show the new one
        loadSentMessages();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message record?")) {
      setSentMessages(sentMessages.filter(message => message.id !== id));
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/");
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
    width: "100%",
    margin: "0",
    padding: "40px 5%",
    boxSizing: "border-box",
    flex: 1,
  };

  const formContainer = {
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "40px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
  };

  const formGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  };

  const formGroup = {
    marginBottom: "20px",
  };

  const label = {
    display: "block",
    marginBottom: "8px",
    fontSize: "16px",
    fontWeight: "600",
    color: dark ? "#e6eef8" : "#374151",
  };

  const input = {
    width: "100%",
    padding: "12px",
    border: "2px solid " + (dark ? "#4b5563" : "#e5e7eb"),
    borderRadius: "10px",
    fontSize: "16px",
    background: dark ? "#1f2937" : "white",
    color: dark ? "#e6eef8" : "#0b1b2b",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  };

  const textarea = {
    ...input,
    minHeight: "120px",
    resize: "vertical",
  };

  const select = {
    ...input,
  };

  const checkbox = {
    marginRight: "10px",
    transform: "scale(1.2)",
  };

  const button = {
    background: "linear-gradient(135deg, #dc2626, #991b1b)",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const messageCard = {
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "20px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
  };

  const messageHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
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

  const typeBadge = {
    background: "#3b82f6",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: dark ? "#1e293b" : "#2563eb",
    color: "white",
  };

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <Link to="/admin-dashboard" style={{ ...brand, textDecoration: "none" }}>Career Navigator Admin</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/admin-dashboard" style={{ color: "white", textDecoration: "none" }}>← Dashboard</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Messages</span>
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

      <div style={container}>
        {/* Page Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px" }}>
            Send Messages 📢
          </h1>
          <p style={{ fontSize: "18px", color: dark ? "#9ca3af" : "#6b7280" }}>
            Send announcements and job alerts to users based on their skills
          </p>
        </div>

        {/* Message Form */}
        <div style={formContainer}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "25px" }}>
            Compose New Message
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              <div style={formGroup}>
                <label htmlFor="title" style={label}>Message Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={messageForm.title}
                  onChange={handleInputChange}
                  style={input}
                  placeholder="e.g. New Job Opportunities Available"
                  required
                />
              </div>

              <div style={formGroup}>
                <label htmlFor="type" style={label}>Message Type *</label>
                <select
                  id="type"
                  name="type"
                  value={messageForm.type}
                  onChange={handleInputChange}
                  style={select}
                  required
                >
                  <option value="">Select Message Type</option>
                  <option value="Job Alert">Job Alert</option>
                  <option value="System Update">System Update</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Career Guidance">Career Guidance</option>
                  <option value="Event Notification">Event Notification</option>
                </select>
              </div>
            </div>

            <div style={formGroup}>
              <label htmlFor="targetSkills" style={label}>Target Audience *</label>
              <input
                type="text"
                id="targetSkills"
                name="targetSkills"
                value={messageForm.targetSkills}
                onChange={handleInputChange}
                style={input}
                placeholder="e.g. React, JavaScript, Python (comma separated) or 'All Users'"
                required
              />
              <small style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                Enter specific skills to target users with those skills, or "All Users" to send to everyone
              </small>
            </div>

            <div style={formGroup}>
              <label htmlFor="content" style={label}>Message Content *</label>
              <textarea
                id="content"
                name="content"
                value={messageForm.content}
                onChange={handleInputChange}
                style={textarea}
                placeholder="Write your message content here..."
                required
              />
            </div>

            <div style={formGroup}>
              <label style={{ ...label, display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="urgent"
                  checked={messageForm.urgent}
                  onChange={handleInputChange}
                  style={checkbox}
                />
                Mark as Urgent
              </label>
              <small style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                Urgent messages will be highlighted and prioritized for users
              </small>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={button}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                Send Message to Users
              </button>
            </div>
          </form>
        </div>

        {/* Sent Messages History */}
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "25px" }}>
            Message History ({sentMessages.length})
          </h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "18px", color: dark ? "#9ca3af" : "#6b7280" }}>
                Loading messages...
              </div>
            </div>
          ) : sentMessages.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: dark ? "#9ca3af" : "#6b7280"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>No messages sent yet</h3>
              <p>Send your first message to users using the form above</p>
            </div>
          ) : (
            sentMessages.map((message) => (
              <div key={message.id} style={messageCard}>
                <div style={messageHeader}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                      <h3 style={{ fontSize: "1.4rem", fontWeight: "600", margin: 0 }}>
                        {message.subject || message.title}
                      </h3>
                      {message.urgent && <span style={urgentBadge}>URGENT</span>}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                      <span style={typeBadge}>{message.message_type || message.type}</span>
                      <span style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                        Sent on {new Date(message.created_at || message.dateSent).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(message.id)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>

                <p style={{ fontSize: "16px", color: dark ? "#d1d5db" : "#374151", marginBottom: "15px", lineHeight: "1.6" }}>
                  {message.content}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                    <strong>Target Skills:</strong> {
                      message.target_skills 
                        ? (typeof message.target_skills === 'string' 
                           ? message.target_skills 
                           : JSON.parse(message.target_skills || '[]').join(', '))
                        : message.targetSkills || 'All Users'
                    }
                  </span>
                </div>
              </div>
            ))
          )}
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