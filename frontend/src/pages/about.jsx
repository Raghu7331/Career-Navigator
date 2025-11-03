import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  const [dark, setDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userAuth = localStorage.getItem("userAuth");
    setIsLoggedIn(!!token || userAuth === "true");
  }, []);

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

  const hero = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "0",
    width: "100vw",
    overflow: "hidden",
  };

  const aboutHero = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
    border: "none",
    outline: "none",
    boxShadow: "none",
    width: "100vw",
    position: "relative",
    left: "50%",
    transform: "translateX(-50%)",
  };

  const contentSection = {
    padding: "60px 20px",
    backgroundColor: "white",
    width: "100vw",
    marginLeft: "-20px",
    marginRight: "-20px",
    marginBottom: "0",
  };

  const sectionContainer = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const featureGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    marginTop: "40px",
  };

  const featureCard = {
    padding: "30px",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
    border: "2px solid #e2e8f0",
    textAlign: "left",
  };

  const stepCard = {
    padding: "30px",
    borderRadius: "16px",
    backgroundColor: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    border: "2px solid #e2e8f0",
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
            {isLoggedIn && <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>}
            <span style={{ color: "white", textDecoration: "underline" }}>About</span>
            <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</Link>
            {!isLoggedIn && <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>}
            {!isLoggedIn && <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Signup</Link>}
          </nav>
        </div>
      </header>

      <main style={hero}>
        {/* Hero Section */}
        <div style={aboutHero}>
          <h1 style={{ fontSize: "4rem", fontWeight: "700", marginBottom: "20px", color: "white" }}>
            About Career Navigator
          </h1>
          <p style={{ maxWidth: "800px", fontSize: "1.4rem", lineHeight: "1.6", color: "white", opacity: 0.9 }}>
            Your trusted companion for career planning, skill development, and professional growth
          </p>
        </div>

        {/* What is Career Navigator Section */}
        <div style={contentSection}>
          <div style={sectionContainer}>
            <h2 style={{ fontSize: "3rem", fontWeight: "700", textAlign: "center", marginBottom: "30px", color: "#0b1b2b" }}>
              What is Career Navigator?
            </h2>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#374151", textAlign: "center", maxWidth: "900px", margin: "0 auto 40px" }}>
              Career Navigator is a comprehensive platform designed to help individuals at every stage of their career journey. 
              Whether you're a recent graduate, looking to change careers, or aiming to advance in your current field, 
              our platform provides personalized guidance, resources, and tools to help you achieve your professional goals.
            </p>

            <div style={featureGrid}>
              <div style={featureCard}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🎯</div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Personalized Career Roadmaps
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                  Get customized career paths based on your skills, interests, and goals. Our AI-powered system creates 
                  tailored roadmaps to guide your professional journey.
                </p>
              </div>

              <div style={featureCard}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📚</div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Skill Development Resources
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                  Access curated learning materials, courses, and tutorials to build the skills you need for your 
                  desired career path and stay competitive in the job market.
                </p>
              </div>

              <div style={featureCard}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🤝</div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Job Matching & Opportunities
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                  Connect with relevant job opportunities that match your profile, skills, and career aspirations. 
                  Get matched with positions that align with your goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div style={{ ...contentSection, backgroundColor: "#f8fafc" }}>
          <div style={sectionContainer}>
            <h2 style={{ fontSize: "3rem", fontWeight: "700", textAlign: "center", marginBottom: "30px", color: "#0b1b2b" }}>
              How to Use Career Navigator
            </h2>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#374151", textAlign: "center", maxWidth: "800px", margin: "0 auto 50px" }}>
              Getting started with Career Navigator is simple. Follow these easy steps to begin your career journey:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" }}>
              <div style={stepCard}>
                <div style={{ 
                  width: "60px", 
                  height: "60px", 
                  backgroundColor: "#2563eb", 
                  color: "white", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "1.5rem", 
                  fontWeight: "700", 
                  margin: "0 auto 20px" 
                }}>
                  1
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Create Your Account
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                  Sign up for free and create your profile. Tell us about your background, interests, and career goals.
                </p>
              </div>

              <div style={stepCard}>
                <div style={{ 
                  width: "60px", 
                  height: "60px", 
                  backgroundColor: "#2563eb", 
                  color: "white", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "1.5rem", 
                  fontWeight: "700", 
                  margin: "0 auto 20px" 
                }}>
                  2
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Complete Assessment
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                  Take our comprehensive career assessment to identify your strengths, skills, and areas for improvement.
                </p>
              </div>

              <div style={stepCard}>
                <div style={{ 
                  width: "60px", 
                  height: "60px", 
                  backgroundColor: "#2563eb", 
                  color: "white", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "1.5rem", 
                  fontWeight: "700", 
                  margin: "0 auto 20px" 
                }}>
                  3
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Get Your Roadmap
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                  Receive your personalized career roadmap with step-by-step guidance and recommended learning paths.
                </p>
              </div>

              <div style={stepCard}>
                <div style={{ 
                  width: "60px", 
                  height: "60px", 
                  backgroundColor: "#2563eb", 
                  color: "white", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "1.5rem", 
                  fontWeight: "700", 
                  margin: "0 auto 20px" 
                }}>
                  4
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Start Learning & Growing
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                  Follow your roadmap, access learning resources, and track your progress toward your career goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div style={contentSection}>
          <div style={sectionContainer}>
            <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "30px", color: "#0b1b2b" }}>
                Our Mission
              </h2>
              <p style={{ fontSize: "1.3rem", lineHeight: "1.8", color: "#374151", marginBottom: "30px" }}>
                At Career Navigator, we believe everyone deserves the opportunity to build a fulfilling and successful career. 
                Our mission is to democratize career guidance and make professional development accessible to all.
              </p>
              <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#6b7280" }}>
                We're committed to providing you with the tools, resources, and support you need to navigate your career 
                journey with confidence and achieve your professional aspirations.
              </p>
            </div>
            
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <Link 
                to="/signup" 
                style={{ 
                  display: "inline-block",
                  padding: "16px 40px", 
                  backgroundColor: "#f59e0b", 
                  color: "white", 
                  textDecoration: "none", 
                  borderRadius: "8px", 
                  fontSize: "1.1rem", 
                  fontWeight: "600",
                  transition: "background-color 0.3s ease"
                }}
              >
                Start Your Journey Today
              </Link>
            </div>
          </div>
        </div>
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