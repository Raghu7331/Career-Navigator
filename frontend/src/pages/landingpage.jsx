import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CareerNavigator() {
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

  const hero = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "0",
    width: "100vw",
    overflow: "hidden",
  };

  const cardContainer = {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    gap: "25px",
    marginTop: "40px",
    maxWidth: "1300px",
    margin: "40px auto 0",
    padding: "0 40px",
  };

  const featureCard = {
    width: "380px",
    padding: "40px",
    borderRadius: "20px",
    background: dark ? "#07172a" : "#ffffff",
    boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.6)" : "0 10px 35px rgba(0,0,0,0.2)",
    textAlign: "left",
    minHeight: "280px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    flex: "1 1 380px",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: "#2563eb",
    color: "white",
  };

  const button = {
    padding: "16px 40px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "16px",
  };

  const primaryBtn = {
    ...button,
    background: "#f59e0b",
    color: "white",
    marginRight: "10px",
  };

  const ghostBtn = {
    ...button,
    background: "transparent",
    color: dark ? "#cfe1ff" : "#0b1b2b",
    border: dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.1)",
  };

  const features = [
    {
      title: "Personalized Guidance",
      desc: "Get a custom roadmap based on your skills, interests, and career goals.",
      emoji: "🧭",
      available: true,
    },
    {
      title: "Job Opportunities",
      desc: "Connect with opportunities that align with your profile and aspirations.",
      emoji: "💼",
      available: true,
    },
    {
      title: "Skill Building",
      desc: "Identify skill gaps and access curated learning resources.",
      emoji: "🛠",
      available: true,
    },
    {
      title: "Resume Builder",
      desc: "Create professional resumes with AI-powered suggestions and templates.",
      emoji: "📄",
      available: false,
    },
    {
      title: "Salary Insights",
      desc: "Get real-time salary data and market insights for informed decisions.",
      emoji: "💰",
      available: false,
    },
  ];

  const scrollToFeatures = () => {
    const featuresElement = document.getElementById("key-features");
    if (featuresElement) {
      featuresElement.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <div style={page}>
      <header style={header}>
        <Link to="/" style={{ ...brand, textDecoration: "none" }}>Career Navigator</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/job-opportunities" style={{ color: "white", textDecoration: "none" }}>Jobs</Link>
            <Link to="/job-recommendations" style={{ color: "white", textDecoration: "none" }}>Recommendations</Link>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>Sign Out</Link>
          </nav>
        </div>
      </header>

      <main style={hero}>
        {/* Above the fold content */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          minHeight: "calc(100vh - 140px)",
          padding: "40px 0px",
          background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
          border: "none",
          outline: "none",
          boxShadow: "none",
          width: "100vw",
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)"
        }}>
          <h1 style={{ fontSize: "4.5rem", fontWeight: "700", marginBottom: "20px", color: "white" }}>Welcome to Career Navigator</h1>
          <p style={{ maxWidth: "700px", marginTop: "10px", opacity: 0.9, fontSize: "1.3rem", lineHeight: "1.6", color: "white" }}>
            Plan, explore, and achieve your dream career path with personalized guidance and resources.
          </p>

          <div style={{ marginTop: "20px" }}>
            <button style={primaryBtn} onClick={scrollToFeatures}>Get Started</button>
          </div>

          {/* Scroll indicator */}
          <div style={{ 
            marginTop: "40px", 
            fontSize: "18px", 
            opacity: 0.8,
            animation: "bounce 2s infinite",
            color: "white"
          }}>
            {/* ↓ Scroll down to explore more ↓ */}
          </div>
        </div>

        {/* Below the fold content */}
        <div id="key-features" style={{ 
          padding: "40px 20px 60px 20px", 
          backgroundColor: "white",
          width: "100vw",
          marginLeft: "-20px",
          marginRight: "-20px",
          marginBottom: "0"
        }}>
          <h2 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px", color: "#0b1b2b" }}>
            Key Features
          </h2>
          <h3 style={{ marginBottom: "30px", textAlign: "center", fontSize: "2rem", fontWeight: "600", color: "#374151" }}>
            Discover the tools and insights you need to build a successful and fulfilling career.
          </h3>

          <div style={cardContainer}>
            {features.slice(0, 3).map((f) => (
              f.title === "Personalized Guidance" ? (
                <Link 
                  key={f.title} 
                  to="/personalized-guidance" 
                  style={{ ...featureCard, textDecoration: "none", color: "inherit", cursor: "pointer" }}
                >
                  <div style={{ textAlign: "center", fontSize: "3rem", marginBottom: "20px" }}>
                    {f.emoji}
                  </div>
                  <h4 style={{ fontSize: "1.4rem", marginBottom: "15px", textAlign: "center" }}>{f.title}</h4>
                  <p style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: "1.5" }}>{f.desc}</p>
                </Link>
              ) : f.title === "Job Opportunities" ? (
                <Link 
                  key={f.title} 
                  to="/job-opportunities" 
                  style={{ ...featureCard, textDecoration: "none", color: "inherit", cursor: "pointer" }}
                >
                  <div style={{ textAlign: "center", fontSize: "3rem", marginBottom: "20px" }}>
                    {f.emoji}
                  </div>
                  <h4 style={{ fontSize: "1.4rem", marginBottom: "15px", textAlign: "center" }}>{f.title}</h4>
                  <p style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: "1.5" }}>{f.desc}</p>
                </Link>
              ) : f.title === "Skill Building" ? (
                <Link 
                  key={f.title} 
                  to="/skill-building" 
                  style={{ ...featureCard, textDecoration: "none", color: "inherit", cursor: "pointer" }}
                >
                  <div style={{ textAlign: "center", fontSize: "3rem", marginBottom: "20px" }}>
                    {f.emoji}
                  </div>
                  <h4 style={{ fontSize: "1.4rem", marginBottom: "15px", textAlign: "center" }}>{f.title}</h4>
                  <p style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: "1.5" }}>{f.desc}</p>
                </Link>
              ) : (
                <div key={f.title} style={featureCard}>
                  <div style={{ textAlign: "center", fontSize: "3rem", marginBottom: "20px" }}>
                    {f.emoji}
                  </div>
                  <h4 style={{ fontSize: "1.4rem", marginBottom: "15px", textAlign: "center" }}>{f.title}</h4>
                  <p style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: "1.5" }}>{f.desc}</p>
                </div>
              )
            ))}
          </div>

          <Link 
            to="/features" 
            style={{ 
              display: "block",
              marginTop: "40px", 
              fontWeight: 600, 
              cursor: "pointer",
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#1A56DB",
              textDecoration: "none"
            }}
          >
            View All Features ➜
          </Link>
        </div>
      </main>

      <footer style={{ ...footer, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <span>© 2025 Career Navigator. All Rights Reserved.</span>
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark(!dark)}
          style={{ 
            position: "absolute",
            right: "20px",
            background: dark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.background = dark ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.background = dark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)";
          }}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </footer>
    </div>
  );
}