import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const response = await adminAPI.login({
        email: formData.email.trim(),
        password: formData.password.trim()
      });

      if (response.success) {
        console.log("Admin login successful:", response.data.admin.email);
        
        // The adminAPI.login already sets adminToken, isAdminLoggedIn, and admin
        // Just set the email for compatibility
        localStorage.setItem("adminEmail", response.data.admin.email);
        
        navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("Admin login failed:", error);
      setErrors({ general: error.message || "Invalid admin credentials. Please check your email and password." });
    } finally {
      setLoading(false);
    }
  };

  const page = {
    fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    color: "#0b1b2b",
    minHeight: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
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

  const loginContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 140px)",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
    border: "none",
    outline: "none",
    boxShadow: "none",
    width: "100vw",
    position: "relative",
    left: "50%",
    transform: "translateX(-50%)",
  };

  const loginForm = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const inputField = {
    padding: "16px 20px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
    textAlign: "left",
    width: "100%",
    boxSizing: "border-box",
  };

  const button = {
    padding: "16px 40px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "16px",
    background: "#f59e0b",
    color: "white",
    width: "100%",
    transition: "background-color 0.3s ease",
  };

  const errorMessage = {
    color: "#dc2626",
    fontSize: "14px",
    marginTop: "5px",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: "#2563eb",
    color: "white",
  };

  return (
    <div style={page}>
      <header style={header}>
        <Link to="/" style={{ ...brand, textDecoration: "none" }}>Career Navigator</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>← Back to Home</Link>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>User Login</Link>
          </nav>
        </div>
      </header>

      <main style={loginContainer}>
        <form style={loginForm} onSubmit={handleSubmit}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px", color: "#0b1b2b", textAlign: "center" }}>
            Admin Login
          </h1>
          <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "20px" }}>
            Sign in to admin panel to manage jobs and users
          </p>

          {errors.general && (
            <div style={{ ...errorMessage, textAlign: "center", marginBottom: "20px", padding: "10px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca" }}>
              {errors.general}
            </div>
          )}
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={inputField}
              placeholder="Enter your admin email"
              required
            />
            {errors.email && <div style={errorMessage}>{errors.email}</div>}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={inputField}
              placeholder="Enter your admin password"
              required
            />
            {errors.password && <div style={errorMessage}>{errors.password}</div>}
          </div>

          <button type="submit" style={{...button, opacity: loading ? 0.7 : 1}} disabled={loading}>
            {loading ? "Signing In..." : "Sign In to Admin Panel"}
          </button>

          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <Link to="/login" style={{ color: "#ffffff", textDecoration: "none", fontSize: "14px" }}>
              ← Back to User Login
            </Link>
          </div>
        </form>
      </main>

      <footer style={footer}>
        <span>© 2025 Career Navigator. All Rights Reserved.</span>
      </footer>
    </div>
  );
}