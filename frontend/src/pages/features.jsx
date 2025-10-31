import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AllFeatures() {
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

  const heroSection = {
    padding: "60px 20px",
    background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
    textAlign: "center",
    color: "white",
  };

  const container = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const contentSection = {
    padding: "80px 20px",
    backgroundColor: "white",
  };

  const featuresGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "40px",
    marginTop: "50px",
  };

  const featureCard = {
    backgroundColor: "#f8fafc",
    padding: "40px 30px",
    borderRadius: "15px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
  };

  const availableCard = {
    ...featureCard,
    cursor: "pointer",
  };

  const comingSoonCard = {
    ...featureCard,
    opacity: 0.7,
    backgroundColor: "#f1f5f9",
  };

  const comingSoonBadge = {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#f59e0b",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
  };

  const availableBadge = {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#10b981",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: "#2563eb",
    color: "white",
  };

  const features = [
    {
      title: "Personalized Guidance",
      desc: "Get a custom roadmap based on your skills, interests, and career goals. Our AI-powered system analyzes your profile to create tailored career paths.",
      emoji: "🧭",
      available: true,
      link: "/personalized-guidance",
    },
    {
      title: "Job Opportunities",
      desc: "Connect with opportunities that align with your profile and aspirations. Access thousands of jobs from top companies across various industries.",
      emoji: "💼",
      available: true,
      link: "/job-opportunities",
    },
    {
      title: "Skill Building",
      desc: "Identify skill gaps and access curated learning resources. Build in-demand skills with expert-created courses and hands-on projects.",
      emoji: "🛠",
      available: true,
      link: "/skill-building",
    },
    {
      title: "Resume Builder",
      desc: "Create professional resumes with AI-powered suggestions and templates. Stand out with modern designs and industry-specific formats.",
      emoji: "📄",
      available: false,
      link: "#",
    },
    {
      title: "Salary Insights",
      desc: "Get real-time salary data and market insights for informed decisions. Compare compensation packages and negotiate better offers.",
      emoji: "💰",
      available: false,
      link: "#",
    },
  ];

  const renderFeatureCard = (feature, index) => {
    const CardWrapper = feature.available ? Link : "div";
    const cardStyle = feature.available ? availableCard : comingSoonCard;
    const cardProps = feature.available ? { to: feature.link, style: { ...cardStyle, textDecoration: "none", color: "inherit" } } : { style: cardStyle };

    return (
      <CardWrapper
        key={index}
        {...cardProps}
        onMouseEnter={(e) => {
          if (feature.available) {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.15)";
          }
        }}
        onMouseLeave={(e) => {
          if (feature.available) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        <div style={feature.available ? availableBadge : comingSoonBadge}>
          {feature.available ? "Available" : "Coming Soon"}
        </div>
        <div style={{ fontSize: "4rem", marginBottom: "25px" }}>
          {feature.emoji}
        </div>
        <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "20px", color: "#0b1b2b" }}>
          {feature.title}
        </h3>
        <p style={{ color: "#64748b", lineHeight: "1.7", fontSize: "1.1rem" }}>
          {feature.desc}
        </p>
        {feature.available && (
          <div style={{ 
            marginTop: "20px", 
            color: "#2563eb", 
            fontWeight: "600", 
            fontSize: "1rem" 
          }}>
            Explore Feature →
          </div>
        )}
      </CardWrapper>
    );
  };

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <Link to="/" style={{ ...brand, textDecoration: "none" }}>Career Navigator</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>Back to Home</Link>
            <Link to="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
            <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>Contact</Link>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>Sign Out</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={heroSection}>
        <div style={container}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "20px" }}>
            ✨ All Features
          </h1>
          <p style={{ fontSize: "1.4rem", opacity: 0.9, maxWidth: "800px", margin: "0 auto" }}>
            Discover all the powerful tools and features that Career Navigator offers to help you 
            build a successful and fulfilling career. From personalized guidance to skill building, 
            we've got everything you need.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section style={contentSection}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "30px", 
            color: "#0b1b2b" 
          }}>
            Complete Feature Overview
          </h2>
          
          <p style={{ 
            fontSize: "1.2rem", 
            textAlign: "center", 
            color: "#64748b", 
            maxWidth: "800px", 
            margin: "0 auto 50px",
            lineHeight: "1.6"
          }}>
            Explore our comprehensive suite of career development tools. Click on available features 
            to learn more, and stay tuned for exciting new additions coming soon!
          </p>

          <div style={featuresGrid}>
            {features.map((feature, index) => renderFeatureCard(feature, index))}
          </div>
        </div>
      </section>

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