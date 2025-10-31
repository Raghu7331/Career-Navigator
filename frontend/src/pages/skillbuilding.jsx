import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SkillBuilding() {
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

  const pathwaysSection = {
    padding: "80px 20px",
    backgroundColor: "#f8fafc",
  };

  const pathwayCard = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    marginBottom: "30px",
  };

  const skillsSection = {
    padding: "80px 20px",
    backgroundColor: "white",
  };

  const skillGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "25px",
    marginTop: "40px",
  };

  const skillCard = {
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };

  const resourcesSection = {
    padding: "80px 20px",
    backgroundColor: "#f8fafc",
  };

  const resourceCard = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: "#2563eb",
    color: "white",
  };

  const skillCategories = [
    { name: "Programming", icon: "💻", level: "Beginner to Expert" },
    { name: "Data Science", icon: "📊", level: "Intermediate" },
    { name: "Digital Marketing", icon: "📱", level: "All Levels" },
    { name: "Project Management", icon: "📋", level: "Professional" },
    { name: "Design", icon: "🎨", level: "Creative" },
    { name: "Communication", icon: "💬", level: "Essential" },
    { name: "Leadership", icon: "👥", level: "Management" },
    { name: "Finance", icon: "💰", level: "Business" }
  ];

  const learningPaths = [
    {
      title: "Frontend Developer Path",
      duration: "6-8 months",
      skills: ["HTML/CSS", "JavaScript", "React", "Portfolio Building"],
      level: "Beginner to Professional"
    },
    {
      title: "Data Analyst Path",
      duration: "4-6 months",
      skills: ["Excel/Sheets", "SQL", "Python", "Data Visualization"],
      level: "Beginner to Advanced"
    },
    {
      title: "Digital Marketing Specialist",
      duration: "3-5 months",
      skills: ["SEO/SEM", "Social Media", "Analytics", "Content Strategy"],
      level: "Beginner to Expert"
    }
  ];

  const resources = [
    { type: "Video Courses", count: "5,000+", icon: "🎥" },
    { type: "Interactive Labs", count: "1,200+", icon: "⚗️" },
    { type: "Practice Projects", count: "800+", icon: "🔨" },
    { type: "Certifications", count: "300+", icon: "🏆" },
    { type: "Mentorship Sessions", count: "Weekly", icon: "👨‍🏫" },
    { type: "Peer Communities", count: "50+", icon: "👥" }
  ];

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
            🛠 Skill Building
          </h1>
          <p style={{ fontSize: "1.4rem", opacity: 0.9, maxWidth: "800px", margin: "0 auto" }}>
            Develop in-demand skills with our comprehensive learning platform. From beginner tutorials 
            to advanced certifications, build the expertise you need to excel in your career.
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
            Why Skill Building Matters
          </h2>
          
          <p style={{ 
            fontSize: "1.2rem", 
            textAlign: "center", 
            color: "#64748b", 
            maxWidth: "800px", 
            margin: "0 auto 50px",
            lineHeight: "1.6"
          }}>
            In today's rapidly evolving job market, continuous learning is essential for career growth. 
            Our skill building platform helps you stay competitive and advance your professional journey.
          </p>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🎯</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Personalized Learning
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Get customized learning paths based on your current skill level, career goals, and 
                learning preferences. Focus on what matters most for your success.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📚</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Expert-Curated Content
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Access high-quality courses and materials created by industry experts and leading 
                educational institutions. Learn from the best in the field.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🏆</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Industry Certifications
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Earn recognized certifications that validate your skills and enhance your resume. 
                Stand out to employers with verified credentials.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⚡</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Hands-On Practice
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Apply your knowledge through real-world projects, interactive labs, and practical 
                exercises. Build a portfolio that showcases your abilities.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📈</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Progress Tracking
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Monitor your learning progress with detailed analytics and achievements. 
                Stay motivated with clear milestones and completion tracking.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>👥</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Community Support
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Join a community of learners and mentors. Get help when you need it, share knowledge, 
                and network with professionals in your field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Pathways */}
      <section style={pathwaysSection}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "50px", 
            color: "#0b1b2b" 
          }}>
            Popular Learning Pathways
          </h2>

          {learningPaths.map((path, index) => (
            <div key={index} style={pathwayCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#0b1b2b", margin: 0 }}>
                  {path.title}
                </h3>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#2563eb", fontWeight: "600", fontSize: "1rem" }}>{path.duration}</div>
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>{path.level}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {path.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    style={{
                      backgroundColor: "#e0f2fe",
                      color: "#0369a1",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "500"
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Categories */}
      <section style={skillsSection}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "30px", 
            color: "#0b1b2b" 
          }}>
            Explore Skills by Category
          </h2>
          
          <p style={{ 
            fontSize: "1.2rem", 
            textAlign: "center", 
            color: "#64748b", 
            maxWidth: "600px", 
            margin: "0 auto 40px",
            lineHeight: "1.6"
          }}>
            Choose from hundreds of skills across different domains and start building your expertise today.
          </p>

          <div style={skillGrid}>
            {skillCategories.map((skill, index) => (
              <div 
                key={index} 
                style={skillCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>{skill.icon}</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px", color: "#0b1b2b" }}>
                  {skill.name}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  {skill.level}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Resources */}
      <section style={resourcesSection}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "50px", 
            color: "#0b1b2b" 
          }}>
            Learning Resources Available
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {resources.map((resource, index) => (
              <div key={index} style={resourceCard}>
                <div style={{ 
                  fontSize: "2rem", 
                  backgroundColor: "#e0f2fe", 
                  padding: "15px", 
                  borderRadius: "12px",
                  marginRight: "15px"
                }}>
                  {resource.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "5px", color: "#0b1b2b" }}>
                    {resource.type}
                  </h3>
                  <p style={{ color: "#2563eb", fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>
                    {resource.count}
                  </p>
                </div>
              </div>
            ))}
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