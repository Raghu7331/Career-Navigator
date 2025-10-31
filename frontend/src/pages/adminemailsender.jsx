import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailAPI, enhancedEmailAPI } from "../services/api";

export default function AdminEmailSender() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailService, setEmailService] = useState(null);
  const [users, setUsers] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailStats, setEmailStats] = useState(null);

  // Check admin authentication
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const adminToken = localStorage.getItem("adminToken");
    if (!isAdminLoggedIn || !adminToken) {
      navigate("/admin-login");
      return;
    }
    
    initializePage();
  }, [navigate]);

  const initializePage = async () => {
    try {
      setLoading(true);
      
  // Test enhanced email service
  const serviceTest = await enhancedEmailAPI.testService();
      setEmailService(serviceTest);
      
      // Load users
      const usersResponse = await emailAPI.getUsers();
      if (usersResponse.success) {
        setUsers(usersResponse.data || []);
      }
      
      // Load email logs
      const logsResponse = await emailAPI.getLogs(1, 10);
      if (logsResponse.success) {
        setEmailLogs(logsResponse.data.logs || []);
      }

      // Load enhanced email stats
      const statsResponse = await enhancedEmailAPI.getStats();
      if (statsResponse.success) {
        setEmailStats(statsResponse.data || null);
      }
    } catch (error) {
      console.error("Failed to initialize email page:", error);
    } finally {
      setLoading(false);
    }
  };

  // Email form state
  const [emailForm, setEmailForm] = useState({
    recipientType: 'specific', // 'specific' or 'all'
    email: '',
    subject: '',
    message: '',
    messageType: 'general' // 'general', 'urgent', 'announcement', 'guidance'
  });

  const [jobAlertForm, setJobAlertForm] = useState({
    email: '',
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    applyLink: ''
  });

  const [welcomeForm, setWelcomeForm] = useState({
    email: '',
    userName: ''
  });

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm({
      ...emailForm,
      [name]: value
    });
  };

  const handleJobAlertInputChange = (e) => {
    const { name, value } = e.target;
    setJobAlertForm({
      ...jobAlertForm,
      [name]: value
    });
  };

  const handleWelcomeInputChange = (e) => {
    const { name, value } = e.target;
    setWelcomeForm({
      ...welcomeForm,
      [name]: value
    });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let result;
      if (emailForm.recipientType === 'all') {
        // Enhanced broadcast supports 'notification' type
        result = await enhancedEmailAPI.sendToAll({
          subject: emailForm.subject,
          message: emailForm.message,
          messageType: 'notification'
        });
      } else {
        if (emailForm.messageType === 'guidance') {
          result = await enhancedEmailAPI.sendGuidance({
            email: emailForm.email,
            message: emailForm.message
          });
        } else {
          result = await enhancedEmailAPI.sendNotification({
            email: emailForm.email,
            subject: emailForm.subject,
            message: emailForm.message
          });
        }
      }
      
      if (result.success) {
        alert(`Email sent successfully!${result.previewURL ? `\n\nPreview: ${result.previewURL}` : ''}`);
        setEmailForm({
          recipientType: 'specific',
          email: '',
          subject: '',
          message: '',
          messageType: 'general'
        });
        
        // Refresh logs in a separate try-catch to avoid interfering with success message
        try {
          const logsResponse = await emailAPI.getLogs(1, 10);
          if (logsResponse.success) {
            setEmailLogs(logsResponse.data.logs || []);
          }
          const statsResponse = await enhancedEmailAPI.getStats();
          if (statsResponse.success) {
            setEmailStats(statsResponse.data || null);
          }
        } catch (logsError) {
          console.error("Failed to refresh email logs:", logsError);
          // Don't show alert for logs error as email was successful
        }
      } else {
        alert(`Failed to send email: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendJobAlert = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
  const result = await enhancedEmailAPI.sendJobAlert(jobAlertForm);
      
      if (result.success) {
        alert(`Job alert email sent successfully!${result.previewURL ? `\n\nPreview: ${result.previewURL}` : ''}`);
        setJobAlertForm({
          email: '',
          jobTitle: '',
          companyName: '',
          jobDescription: '',
          applyLink: ''
        });
        
        // Refresh logs in a separate try-catch to avoid interfering with success message
        try {
          const logsResponse = await emailAPI.getLogs(1, 10);
          if (logsResponse.success) {
            setEmailLogs(logsResponse.data.logs || []);
          }
          const statsResponse = await enhancedEmailAPI.getStats();
          if (statsResponse.success) {
            setEmailStats(statsResponse.data || null);
          }
        } catch (logsError) {
          console.error("Failed to refresh email logs:", logsError);
          // Don't show alert for logs error as email was successful
        }
      } else {
        alert(`Failed to send job alert: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to send job alert:", error);
      alert("Failed to send job alert: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWelcome = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await enhancedEmailAPI.sendWelcome({
        email: welcomeForm.email,
        userName: welcomeForm.userName
      });
      if (result.success) {
        alert('Welcome email sent!');
        setWelcomeForm({ email: '', userName: '' });
        try {
          const logsResponse = await emailAPI.getLogs(1, 10);
          if (logsResponse.success) setEmailLogs(logsResponse.data.logs || []);
          const statsResponse = await enhancedEmailAPI.getStats();
          if (statsResponse.success) setEmailStats(statsResponse.data || null);
        } catch {}
      } else {
        alert('Failed to send welcome email: ' + (result.message || ''));
      }
    } catch (error) {
      alert('Failed to send welcome email: ' + error.message);
    } finally {
      setLoading(false);
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

  const card = {
    backgroundColor: dark ? "#1f2937" : "white",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: dark ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: dark ? "1px solid #374151" : "1px solid #e5e7eb",
  };

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <Link to="/admin-dashboard" style={{ ...brand, textDecoration: "none" }}>
          Career Navigator Admin
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/admin-dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Email Sender</span>
            <button
              onClick={handleSignOut}
              style={{
                backgroundColor: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main style={container}>
        {/* Page Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "700", color: dark ? "#f3f4f6" : "#1f2937", margin: 0 }}>
            📧 Email Sender
          </h1>
          <p style={{ fontSize: "1.2rem", color: dark ? "#9ca3af" : "#6b7280", marginTop: "10px" }}>
            Send emails to users with complete functionality
          </p>
        </div>

        {/* Email Service Status */}
        <div style={card}>
          <h2 style={{ color: dark ? "#f3f4f6" : "#1f2937", marginBottom: "20px" }}>📡 Email Service Status</h2>
          <div style={{ 
            padding: "15px", 
            borderRadius: "8px", 
            backgroundColor: emailService?.success ? "#10b981" : "#ef4444",
            color: "white"
          }}>
            {emailService?.success ? "✅ Email service is ready" : "❌ Email service unavailable"}
            {emailService?.message && <div style={{ marginTop: "5px", fontSize: "14px" }}>{emailService.message}</div>}
            <div style={{ marginTop: "10px" }}>
              <button onClick={initializePage} disabled={loading} style={{
                backgroundColor: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}>Re-test & Refresh</button>
            </div>
          </div>
        </div>

        {/* Enhanced Email Stats */}
        <div style={card}>
          <h2 style={{ color: dark ? "#f3f4f6" : "#1f2937", marginBottom: "20px" }}>📈 Email Stats</h2>
          {emailStats ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {[{label:'Total', value: emailStats.total}, {label:'Sent', value: emailStats.sent}, {label:'Failed', value: emailStats.failed}, {label:'Today', value: emailStats.today}].map((item) => (
                <div key={item.label} style={{
                  backgroundColor: dark ? "#111827" : "#f9fafb",
                  border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <div style={{ color: dark ? "#9ca3af" : "#6b7280", fontSize: "14px" }}>{item.label}</div>
                  <div style={{ color: dark ? "#f3f4f6" : "#111827", fontSize: "24px", fontWeight: 700 }}>{item.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: dark ? "#9ca3af" : "#6b7280" }}>No stats available</div>
          )}
        </div>

        {/* Send Custom Email */}
        <div style={card}>
          <h2 style={{ color: dark ? "#f3f4f6" : "#1f2937", marginBottom: "20px" }}>📝 Send Custom Email</h2>
          <form onSubmit={handleSendEmail}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                  Recipient Type
                </label>
                <select
                  name="recipientType"
                  value={emailForm.recipientType}
                  onChange={handleEmailInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "6px",
                    backgroundColor: dark ? "#374151" : "white",
                    color: dark ? "#f3f4f6" : "#1f2937"
                  }}
                >
                  <option value="specific">Specific User</option>
                  <option value="all">All Users</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                  Message Type
                </label>
                <select
                  name="messageType"
                  value={emailForm.messageType}
                  onChange={handleEmailInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "6px",
                    backgroundColor: dark ? "#374151" : "white",
                    color: dark ? "#f3f4f6" : "#1f2937"
                  }}
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="announcement">Announcement</option>
                  <option value="guidance">Career Guidance</option>
                </select>
              </div>
            </div>

            {emailForm.recipientType === 'specific' && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                  Recipient Email
                </label>
                <select
                  name="email"
                  value={emailForm.email}
                  onChange={handleEmailInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "6px",
                    backgroundColor: dark ? "#374151" : "white",
                    color: dark ? "#f3f4f6" : "#1f2937"
                  }}
                >
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={emailForm.subject}
                onChange={handleEmailInputChange}
                required
                placeholder="Enter email subject..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                  borderRadius: "6px",
                  backgroundColor: dark ? "#374151" : "white",
                  color: dark ? "#f3f4f6" : "#1f2937"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                Message
              </label>
              <textarea
                name="message"
                value={emailForm.message}
                onChange={handleEmailInputChange}
                required
                rows="6"
                placeholder="Enter your message..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                  borderRadius: "6px",
                  backgroundColor: dark ? "#374151" : "white",
                  color: dark ? "#f3f4f6" : "#1f2937",
                  resize: "vertical"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Sending..." : "Send Email"}
            </button>
          </form>
        </div>

        {/* Send Welcome Email */}
        <div style={card}>
          <h2 style={{ color: dark ? "#f3f4f6" : "#1f2937", marginBottom: "20px" }}>🎉 Send Welcome Email</h2>
          <form onSubmit={handleSendWelcome}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: dark ? '#f3f4f6' : '#374151' }}>Recipient Email</label>
                <select
                  name="email"
                  value={welcomeForm.email}
                  onChange={handleWelcomeInputChange}
                  required
                  style={{ width: '100%', padding: 12, border: `1px solid ${dark ? '#4b5563' : '#d1d5db'}`, borderRadius: 6, backgroundColor: dark ? '#374151' : 'white', color: dark ? '#f3f4f6' : '#1f2937' }}
                >
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: dark ? '#f3f4f6' : '#374151' }}>User Name (optional)</label>
                <input type="text" name="userName" value={welcomeForm.userName} onChange={handleWelcomeInputChange} placeholder="e.g., Raghu" style={{ width: '100%', padding: 12, border: `1px solid ${dark ? '#4b5563' : '#d1d5db'}`, borderRadius: 6, backgroundColor: dark ? '#374151' : 'white', color: dark ? '#f3f4f6' : '#1f2937' }} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '12px 24px', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Sending...' : 'Send Welcome Email'}
            </button>
          </form>
        </div>

        {/* Send Job Alert */}
        <div style={card}>
          <h2 style={{ color: dark ? "#f3f4f6" : "#1f2937", marginBottom: "20px" }}>🎯 Send Job Alert</h2>
          <form onSubmit={handleSendJobAlert}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                  Recipient Email
                </label>
                <select
                  name="email"
                  value={jobAlertForm.email}
                  onChange={handleJobAlertInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "6px",
                    backgroundColor: dark ? "#374151" : "white",
                    color: dark ? "#f3f4f6" : "#1f2937"
                  }}
                >
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={jobAlertForm.jobTitle}
                  onChange={handleJobAlertInputChange}
                  required
                  placeholder="e.g., Software Engineer"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "6px",
                    backgroundColor: dark ? "#374151" : "white",
                    color: dark ? "#f3f4f6" : "#1f2937"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={jobAlertForm.companyName}
                  onChange={handleJobAlertInputChange}
                  required
                  placeholder="e.g., Tech Corp"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "6px",
                    backgroundColor: dark ? "#374151" : "white",
                    color: dark ? "#f3f4f6" : "#1f2937"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                  Apply Link
                </label>
                <input
                  type="url"
                  name="applyLink"
                  value={jobAlertForm.applyLink}
                  onChange={handleJobAlertInputChange}
                  required
                  placeholder="https://company.com/apply"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "6px",
                    backgroundColor: dark ? "#374151" : "white",
                    color: dark ? "#f3f4f6" : "#1f2937"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: dark ? "#f3f4f6" : "#374151" }}>
                Job Description
              </label>
              <textarea
                name="jobDescription"
                value={jobAlertForm.jobDescription}
                onChange={handleJobAlertInputChange}
                required
                rows="4"
                placeholder="Enter job description..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${dark ? "#4b5563" : "#d1d5db"}`,
                  borderRadius: "6px",
                  backgroundColor: dark ? "#374151" : "white",
                  color: dark ? "#f3f4f6" : "#1f2937",
                  resize: "vertical"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Sending..." : "Send Job Alert"}
            </button>
          </form>
        </div>

        {/* Recent Email Logs */}
        <div style={card}>
          <h2 style={{ color: dark ? "#f3f4f6" : "#1f2937", marginBottom: "20px" }}>📋 Recent Email Logs</h2>
          {emailLogs.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: dark ? "#374151" : "#f9fafb" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: `1px solid ${dark ? "#4b5563" : "#e5e7eb"}` }}>Recipient</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: `1px solid ${dark ? "#4b5563" : "#e5e7eb"}` }}>Subject</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: `1px solid ${dark ? "#4b5563" : "#e5e7eb"}` }}>Type</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: `1px solid ${dark ? "#4b5563" : "#e5e7eb"}` }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: `1px solid ${dark ? "#4b5563" : "#e5e7eb"}` }}>Error</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: `1px solid ${dark ? "#4b5563" : "#e5e7eb"}` }}>Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.map((log, index) => (
                    <tr key={log.id || index} style={{ borderBottom: `1px solid ${dark ? "#4b5563" : "#e5e7eb"}` }}>
                      <td style={{ padding: "12px" }}>{log.recipient_email}</td>
                      <td style={{ padding: "12px" }}>{log.subject}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          backgroundColor: log.message_type === 'urgent' ? '#ef4444' : '#6b7280',
                          color: 'white'
                        }}>
                          {log.message_type}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          backgroundColor: log.status === 'sent' ? '#10b981' : '#ef4444',
                          color: 'white'
                        }}>
                          {log.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", maxWidth: "280px", color: dark ? '#fca5a5' : '#b91c1c' }}>
                        {log.status !== 'sent' ? (log.error_message || '-') : '-'}
                      </td>
                      <td style={{ padding: "12px" }}>{new Date(log.sent_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: dark ? "#9ca3af" : "#6b7280", textAlign: "center", padding: "20px" }}>
              No emails sent yet
            </p>
          )}
        </div>
      </main>
    </div>
  );
}