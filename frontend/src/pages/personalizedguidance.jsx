import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function PersonalizedGuidance() {
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
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
    marginTop: "50px",
  };

  const featureCard = {
    backgroundColor: "#f8fafc",
    padding: "30px",
    borderRadius: "15px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
  };

  const stepsSection = {
    padding: "80px 20px",
    backgroundColor: "#f8fafc",
  };

  const stepCard = {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "40px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  };

  const stepNumber = {
    backgroundColor: "#2563eb",
    color: "white",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "700",
    flexShrink: 0,
  };

  const ctaSection = {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    textAlign: "center",
    color: "white",
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
    textDecoration: "none",
    display: "inline-block",
    transition: "background-color 0.3s ease",
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
      {/* Header */}
      <header style={header}>
        <Link to="/" style={{ ...brand, textDecoration: "none" }}>Career Navigator</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>Back to Home</Link>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>Sign Out</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={heroSection}>
        <div style={container}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "20px" }}>
            🧭 Personalized Career Guidance
          </h1>
          <p style={{ fontSize: "1.4rem", opacity: 0.9, maxWidth: "800px", margin: "0 auto" }}>
            Get tailored career advice and roadmaps designed specifically for your unique skills, 
            interests, and professional goals. Your success journey starts with personalized guidance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={contentSection}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "30px", 
            color: "#0b1b2b" 
          }}>
            Why Personalized Guidance Matters
          </h2>
          
          <p style={{ 
            fontSize: "1.2rem", 
            textAlign: "center", 
            color: "#64748b", 
            maxWidth: "800px", 
            margin: "0 auto 50px",
            lineHeight: "1.6"
          }}>
            Every professional journey is unique. Our personalized guidance system analyzes your 
            background, aspirations, and market trends to create a custom roadmap that accelerates 
            your career growth and helps you achieve your goals faster.
          </p>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🎯</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Tailored Career Paths
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Receive customized career roadmaps based on your current skills, experience level, 
                and target roles. No generic advice - just personalized strategies for your success.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📊</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Skills Gap Analysis
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Identify exactly which skills you need to develop for your target role. Get specific 
                recommendations for courses, certifications, and learning resources.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>💡</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Industry Insights
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Stay ahead with real-time industry trends, salary benchmarks, and job market 
                analysis specific to your field and geographic location.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🚀</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Accelerated Growth
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Follow proven strategies that have helped thousands of professionals advance 
                their careers faster and achieve their goals with confidence.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>👥</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Expert Mentorship
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Connect with industry mentors and career coaches who understand your specific 
                challenges and can provide personalized advice and support.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🎓</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Continuous Learning
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Access curated learning paths, courses, and resources that align with your 
                career goals and help you stay competitive in your field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={stepsSection}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "50px", 
            color: "#0b1b2b" 
          }}>
            How Personalized Guidance Works
          </h2>

          <div style={stepCard}>
            <div style={stepNumber}>1</div>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                Profile Assessment
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Complete a comprehensive assessment of your skills, experience, interests, and career goals. 
                Our AI analyzes your profile to understand your unique professional landscape.
              </p>
            </div>
          </div>

          <div style={stepCard}>
            <div style={stepNumber}>2</div>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                Custom Roadmap Creation
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Receive a personalized career roadmap with specific milestones, skill development 
                recommendations, and timeline for achieving your goals.
              </p>
            </div>
          </div>

          <div style={stepCard}>
            <div style={stepNumber}>3</div>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                Ongoing Support & Updates
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Get continuous guidance as you progress. Your roadmap updates based on your 
                achievements, market changes, and evolving career aspirations.
              </p>
            </div>
          </div>

          <div style={stepCard}>
            <div style={stepNumber}>4</div>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                Track Progress & Success
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Monitor your career advancement with detailed analytics, celebrate milestones, 
                and adjust your strategy based on real-time feedback and results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSection}>
        <div style={container}>
          <h2 style={{ fontSize: "2.8rem", fontWeight: "700", marginBottom: "20px" }}>
            Ready to Get Your Personalized Career Guidance?
          </h2>
          <p style={{ 
            fontSize: "1.3rem", 
            opacity: 0.9, 
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px"
          }}>
            Join thousands of professionals who have accelerated their careers with our 
            personalized guidance system.
          </p>
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