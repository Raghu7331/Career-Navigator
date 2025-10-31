import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
  const [dark, setDark] = useState(false);

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
    position: "relative",
    zIndex: 100,
  };

  const nav = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "18px",
    color: "white",
  };

  const brand = {
    fontWeight: 700,
    fontSize: "28px",
    color: "white",
  };

  const heroSection = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "90vh",
    padding: "60px 20px",
    background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
    textAlign: "center",
    position: "relative",
  };

  const featuresSection = {
    padding: "80px 20px",
    backgroundColor: "white",
    width: "100vw",
  };

  const statsSection = {
    padding: "60px 20px",
    backgroundColor: "#f8fafc",
    width: "100vw",
  };

  const ctaSection = {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    width: "100vw",
    textAlign: "center",
  };

  const container = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const contentBox = {
    maxWidth: "800px",
    margin: "0 auto",
    zIndex: 2,
  };

  const logo = {
    fontSize: "5rem",
    fontWeight: "900",
    color: "white",
    marginBottom: "25px",
    textShadow: "0 6px 12px rgba(0,0,0,0.4)",
    letterSpacing: "-1px",
  };

  const tagline = {
    fontSize: "1.8rem",
    color: "white",
    opacity: 0.95,
    marginBottom: "30px",
    lineHeight: "1.4",
    fontWeight: "300",
  };

  const description = {
    fontSize: "1.3rem",
    color: "white",
    opacity: 0.9,
    marginBottom: "50px",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto 50px auto",
  };

  const buttonContainer = {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "40px",
  };

  const primaryButton = {
    padding: "20px 50px",
    fontSize: "1.3rem",
    fontWeight: "700",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.3s ease",
    background: "#f59e0b",
    color: "white",
    boxShadow: "0 8px 25px rgba(245, 158, 11, 0.4)",
    transform: "translateY(0)",
  };

  const secondaryButton = {
    padding: "20px 50px",
    fontSize: "1.3rem",
    fontWeight: "700",
    borderRadius: "15px",
    border: "2px solid white",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.3s ease",
    background: "transparent",
    color: "white",
    boxShadow: "0 6px 20px rgba(255, 255, 255, 0.2)",
  };

  const featuresGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
    marginTop: "50px",
  };

  const featureCard = {
    backgroundColor: "white",
    padding: "40px 30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    marginTop: "40px",
  };

  const statItem = {
    textAlign: "center",
    padding: "20px",
  };

  const heroFeatures = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "30px",
    marginTop: "60px",
    maxWidth: "800px",
    margin: "60px auto 0",
  };

  const heroFeatureItem = {
    textAlign: "center",
    color: "white",
  };

  const decorativeElements = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 1,
  };

  const circle1 = {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    top: "-150px",
    right: "-150px",
  };

  const circle2 = {
    position: "absolute",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.08)",
    bottom: "-75px",
    left: "-75px",
  };

  const darkModeToggle = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    background: dark ? "rgba(255, 255, 255, 0.9)" : "#2563eb",
    color: dark ? "#1f2937" : "white",
    border: `2px solid ${dark ? "rgba(31, 41, 55, 0.2)" : "rgba(255, 255, 255, 0.3)"}`,
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "22px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    zIndex: 1000,
    boxShadow: dark 
      ? "0 4px 15px rgba(0, 0, 0, 0.2)" 
      : "0 4px 15px rgba(37, 99, 235, 0.3)",
    transform: "scale(1)",
  };

  return (
    <div style={page}>
      {/* Hero Section */}
      <section style={heroSection}>
        {/* Decorative background elements */}
        <div style={decorativeElements}>
          <div style={circle1}></div>
          <div style={circle2}></div>
        </div>

        <div style={contentBox}>
          {/* Logo/Brand */}
          <h1 style={logo}>Welcome to Career Navigator</h1>
          
          {/* Tagline */}
          <p style={tagline}>Your Journey to Professional Success Starts Here</p>
          
          {/* Description */}
          <p style={description}>
            Transform your career aspirations into reality with our comprehensive platform. 
            Get personalized guidance, build essential skills, and discover opportunities 
            that align with your unique goals and interests.
          </p>
          
          {/* Action Buttons */}
          <div style={buttonContainer}>
            <Link to="/signup" style={primaryButton}>
              Start Your Journey
            </Link>
            <Link to="/login" style={secondaryButton}>
              Sign In
            </Link>
          </div>
          
          {/* Admin Access */}
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Link 
              to="/admin-login" 
              style={{
                ...secondaryButton,
                fontSize: "1rem",
                padding: "12px 25px",
                background: "rgba(251, 191, 36, 0.2)",
                border: "2px solid #fbbf24",
                color: "#fbbf24"
              }}
            >
              🔐 Admin Login
            </Link>
          </div>
          
          {/* Hero Feature Highlights */}
          <div style={heroFeatures}>
            <div style={heroFeatureItem}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🚀</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", fontWeight: "600" }}>
                Launch Your Career
              </h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.8 }}>
                Fast-track your professional growth
              </p>
            </div>
            
            <div style={heroFeatureItem}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🎯</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", fontWeight: "600" }}>
                Targeted Guidance
              </h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.8 }}>
                Personalized recommendations for you
              </p>
            </div>
            
            <div style={heroFeatureItem}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🌟</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", fontWeight: "600" }}>
                Achieve Excellence
              </h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.8 }}>
                Reach your full potential with expert support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={featuresSection}>
        <div style={container}>
          <h2 style={{ 
            textAlign: "center", 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            marginBottom: "20px", 
            color: "#0b1b2b" 
          }}>
            Why Choose Career Navigator?
          </h2>
          <p style={{ 
            textAlign: "center", 
            fontSize: "1.3rem", 
            color: "#64748b", 
            marginBottom: "50px",
            maxWidth: "600px",
            margin: "0 auto 50px"
          }}>
            Discover the comprehensive tools and resources designed to accelerate your career growth
          </p>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>🧭</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Career Roadmaps
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "1rem" }}>
                Get step-by-step guidance tailored to your industry, experience level, and career goals. 
                Our intelligent system creates personalized paths to success.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>📚</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Skill Development
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "1rem" }}>
                Access curated learning resources, courses, and certifications. Track your progress 
                and build the skills that matter most in today's job market.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>💼</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Job Matching
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "1rem" }}>
                Connect with opportunities that align with your skills, interests, and salary expectations. 
                Get matched with roles from top companies.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>👥</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Expert Mentorship
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "1rem" }}>
                Connect with industry professionals and career coaches. Get personalized advice 
                and insights from experts in your field.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>📊</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Career Analytics
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "1rem" }}>
                Track your career progress with detailed analytics. Understand market trends, 
                salary benchmarks, and skill demand in your industry.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>🎓</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Continuous Learning
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "1rem" }}>
                Stay ahead with the latest industry trends and technologies. Access exclusive 
                content, webinars, and learning paths designed for career advancement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={statsSection}>
        <div style={container}>
          <h2 style={{ 
            textAlign: "center", 
            fontSize: "2.5rem", 
            fontWeight: "700", 
            marginBottom: "50px", 
            color: "#0b1b2b" 
          }}>
            Join Thousands of Successful Professionals
          </h2>

          <div style={statsGrid}>
            <div style={statItem}>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#2563eb", marginBottom: "10px" }}>
                50K+
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#0b1b2b", marginBottom: "5px" }}>
                Active Users
              </h4>
              <p style={{ color: "#64748b" }}>
                Professionals using our platform
              </p>
            </div>

            <div style={statItem}>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#f59e0b", marginBottom: "10px" }}>
                95%
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#0b1b2b", marginBottom: "5px" }}>
                Success Rate
              </h4>
              <p style={{ color: "#64748b" }}>
                Users achieve their career goals
              </p>
            </div>

            <div style={statItem}>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#10b981", marginBottom: "10px" }}>
                1000+
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#0b1b2b", marginBottom: "5px" }}>
                Partner Companies
              </h4>
              <p style={{ color: "#64748b" }}>
                Hiring through our platform
              </p>
            </div>

            <div style={statItem}>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#8b5cf6", marginBottom: "10px" }}>
                24/7
              </div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#0b1b2b", marginBottom: "5px" }}>
                Support Available
              </h4>
              <p style={{ color: "#64748b" }}>
                Expert guidance when you need it
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={darkModeToggle}
        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = dark 
            ? "0 6px 20px rgba(0, 0, 0, 0.3)" 
            : "0 6px 20px rgba(37, 99, 235, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = dark 
            ? "0 4px 15px rgba(0, 0, 0, 0.2)" 
            : "0 4px 15px rgba(37, 99, 235, 0.3)";
        }}
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}