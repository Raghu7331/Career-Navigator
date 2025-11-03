import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

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

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: "#2563eb",
    color: "white",
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      const response = await authAPI.login({
        email: formData.email.trim(),
        password: formData.password.trim()
      });

      if (response.success) {
        console.log("Login successful:", response.data.user.name);
        
        // Set all necessary localStorage values for compatibility
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("currentUser", response.data.user.email);
        localStorage.setItem("userAuth", "true");
        localStorage.setItem("userName", response.data.user.name);
        
        // Small delay to ensure localStorage is set
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <header style={header}>
        <div style={{ ...brand, textDecoration: "none" }}>Career Navigator</div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
            <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Login</span>
            <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Signup</Link>
          </nav>
        </div>
      </header>

      <main style={loginContainer}>
        <form style={loginForm} onSubmit={handleSubmit}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px", color: "#0b1b2b", textAlign: "center" }}>
            Welcome Back
          </h1>
          <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "20px" }}>
            Sign in to your Career Navigator account
          </p>
          
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
              placeholder="Enter your email"
              required
            />
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" style={{...button, opacity: loading ? 0.7 : 1}} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <span style={{ color: "#6b7280" }}>Don't have an account? </span>
            <Link to="/signup" style={{ color: "#1A56DB", textDecoration: "none", fontWeight: "600" }}>
              Sign up
            </Link>
          </div>
        </form>
      </main>

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