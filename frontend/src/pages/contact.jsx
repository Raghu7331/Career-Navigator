import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [dark, setDark] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
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

  const hero = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "0",
    width: "100vw",
    overflow: "hidden",
  };

  const contactHero = {
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

  const contactGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
    marginTop: "50px",
  };

  const contactCard = {
    padding: "40px 30px",
    borderRadius: "20px",
    backgroundColor: "white",
    boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
    textAlign: "center",
    border: "2px solid #f1f5f9",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const contactForm = {
    backgroundColor: "#f8fafc",
    padding: "40px",
    borderRadius: "20px",
    border: "2px solid #e2e8f0",
    marginTop: "50px",
  };

  const inputField = {
    width: "100%",
    padding: "16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
    marginBottom: "20px",
    boxSizing: "border-box",
  };

  const textareaField = {
    width: "100%",
    padding: "16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
    marginBottom: "20px",
    boxSizing: "border-box",
    minHeight: "120px",
    resize: "vertical",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Contact form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={page}>
      <header style={header}>
        <Link to="/" style={{ ...brand, textDecoration: "none" }}>Career Navigator</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Contact</span>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Signup</Link>
          </nav>
        </div>
      </header>

      <main style={hero}>
        {/* Hero Section */}
        <div style={contactHero}>
          <h1 style={{ fontSize: "4rem", fontWeight: "700", marginBottom: "20px", color: "white" }}>
            Contact Us
          </h1>
          <p style={{ maxWidth: "800px", fontSize: "1.4rem", lineHeight: "1.6", color: "white", opacity: 0.9 }}>
            Get in touch with our team - we're here to help you with your career journey
          </p>
        </div>

        {/* Contact Methods Section */}
        <div style={contentSection}>
          <div style={sectionContainer}>
            <h2 style={{ fontSize: "3rem", fontWeight: "700", textAlign: "center", marginBottom: "30px", color: "#0b1b2b" }}>
              How to Reach Us
            </h2>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#374151", textAlign: "center", maxWidth: "800px", margin: "0 auto 40px" }}>
              We offer multiple ways to get in touch with our support team. Choose the method that works best for you.
            </p>

            <div style={contactGrid}>
              {/* Email Contact */}
              <div style={contactCard}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📧</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Email Support
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" }}>
                  Send us an email and we'll respond within 24 hours
                </p>
                <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#2563eb", marginBottom: "10px" }}>
                  support@careernavigator.com
                </div>
                <div style={{ fontSize: "1rem", color: "#6b7280" }}>
                  Response time: 24 hours
                </div>
              </div>

              {/* Phone Contact */}
              <div style={contactCard}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📞</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Phone Support
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" }}>
                  Speak directly with our support team
                </p>
                <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#2563eb", marginBottom: "10px" }}>
                  +1 (555) 123-4567
                </div>
                <div style={{ fontSize: "1rem", color: "#6b7280" }}>
                  Mon-Fri: 9 AM - 6 PM EST
                </div>
              </div>

              {/* Live Chat */}
              <div style={contactCard}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>💬</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Live Chat
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" }}>
                  Get instant help through our live chat feature
                </p>
                <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#2563eb", marginBottom: "10px" }}>
                  Available on website
                </div>
                <div style={{ fontSize: "1rem", color: "#6b7280" }}>
                  Mon-Fri: 8 AM - 8 PM EST
                </div>
              </div>

              {/* Social Media */}
              <div style={contactCard}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🌐</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Social Media
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" }}>
                  Follow us and send us a message on social platforms
                </p>
                <div style={{ fontSize: "1rem", color: "#6b7280" }}>
                  LinkedIn | Twitter | Facebook
                </div>
              </div>

              {/* Office Address */}
              <div style={contactCard}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📍</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  Office Location
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" }}>
                  Visit our headquarters for in-person meetings
                </p>
                <div style={{ fontSize: "1rem", color: "#6b7280", lineHeight: "1.5" }}>
                  123 Career Street<br/>
                  Business District<br/>
                  New York, NY 10001
                </div>
              </div>

              {/* FAQ */}
              <div style={contactCard}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>❓</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                  FAQ & Help Center
                </h3>
                <p style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" }}>
                  Find answers to common questions instantly
                </p>
                <div style={{ fontSize: "1rem", color: "#2563eb", fontWeight: "600" }}>
                  Visit Help Center →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div style={{ ...contentSection, backgroundColor: "#f8fafc" }}>
          <div style={sectionContainer}>
            <h2 style={{ fontSize: "3rem", fontWeight: "700", textAlign: "center", marginBottom: "30px", color: "#0b1b2b" }}>
              Send Us a Message
            </h2>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#374151", textAlign: "center", maxWidth: "600px", margin: "0 auto 40px" }}>
              Have a specific question or need personalized assistance? Fill out the form below and we'll get back to you.
            </p>

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <form style={contactForm} onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={inputField}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={inputField}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    style={inputField}
                    placeholder="What is this about?"
                    required
                  />
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    style={textareaField}
                    placeholder="Please describe your question or concern in detail..."
                    required
                  ></textarea>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button type="submit" style={button}>
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Business Hours Section */}
        <div style={contentSection}>
          <div style={sectionContainer}>
            <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "30px", color: "#0b1b2b" }}>
                Business Hours
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", marginTop: "30px" }}>
                <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                    Support Team
                  </h4>
                  <p style={{ color: "#6b7280", margin: 0 }}>
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br/>
                    Saturday: 10:00 AM - 4:00 PM EST<br/>
                    Sunday: Closed
                  </p>
                </div>
                <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                    Live Chat
                  </h4>
                  <p style={{ color: "#6b7280", margin: 0 }}>
                    Monday - Friday: 8:00 AM - 8:00 PM EST<br/>
                    Saturday: 9:00 AM - 5:00 PM EST<br/>
                    Sunday: 12:00 PM - 6:00 PM EST
                  </p>
                </div>
              </div>
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