import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Resume Details
    phone: "",
    location: "",
    profession: "",
    experience: "",
    skills: "",
    education: "",
    summary: "",
    resumeFile: null,
  });
  const [errors, setErrors] = useState({});

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

  const signupContainer = {
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

  const signupForm = {
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
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
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
    
    try {
      // Prepare user data for API
      const userData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || "",
        location: formData.location || "",
        profession: formData.profession || "",
        experience_level: formData.experience || "",
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        education: formData.education || "",
        summary: formData.summary || ""
      };

      const response = await authAPI.register(userData);
      
      if (response.success) {
        // Auto-login after successful registration
        const loginResponse = await authAPI.login({
          email: formData.email,
          password: formData.password
        });

        if (loginResponse.success) {
          // Set legacy localStorage values for compatibility
          localStorage.setItem("currentUser", loginResponse.data.user.email);
          localStorage.setItem("userAuth", "true");
          localStorage.setItem("userName", loginResponse.data.user.name);
          
          alert("Account created successfully! Welcome to Career Navigator!");
          navigate("/resume-upload");
        }
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error.message || "Registration failed. Please try again.");
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
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Signup</span>
          </nav>
        </div>
      </header>

      <main style={signupContainer}>
        <form style={signupForm} onSubmit={handleSubmit}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px", color: "#0b1b2b", textAlign: "center" }}>
            Create Account
          </h1>
          <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "20px" }}>
            Join Career Navigator and start your journey
          </p>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              style={{
                ...inputField,
                borderColor: errors.fullName ? "#dc2626" : "#e5e7eb"
              }}
              placeholder="Enter your full name"
              required
            />
            {errors.fullName && <div style={errorMessage}>{errors.fullName}</div>}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                ...inputField,
                borderColor: errors.email ? "#dc2626" : "#e5e7eb"
              }}
              placeholder="Enter your email"
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
              style={{
                ...inputField,
                borderColor: errors.password ? "#dc2626" : "#e5e7eb"
              }}
              placeholder="Create a password"
              required
            />
            {errors.password && <div style={errorMessage}>{errors.password}</div>}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={{
                ...inputField,
                borderColor: errors.confirmPassword ? "#dc2626" : "#e5e7eb"
              }}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <div style={errorMessage}>{errors.confirmPassword}</div>}
          </div>

          <button type="submit" style={button}>
            Create Account
          </button>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <span style={{ color: "#6b7280" }}>Already have an account? </span>
            <Link to="/login" style={{ color: "#1A56DB", textDecoration: "none", fontWeight: "600" }}>
              Sign in
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