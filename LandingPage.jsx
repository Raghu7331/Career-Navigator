import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div>
      {/* Navbar */}
      <header>
        <h2>Career Navigator</h2>
        <nav>
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Career Navigator</h1>
        <p>
          Plan, explore, and achieve your dream career path with personalized
          guidance and resources.
        </p>
        <Link to="/signup" className="btn">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="feature">
          <i className="fas fa-user-graduate"></i>
          <h3>Personalized Guidance</h3>
          <p>
            Discover career options tailored to your interests, strengths, and
            future goals.
          </p>
        </div>
        <div className="feature">
          <i className="fas fa-briefcase"></i>
          <h3>Job Opportunities</h3>
          <p>
            Stay ahead with access to the latest job openings and internships in
            your field.
          </p>
        </div>
        <div className="feature">
          <i className="fas fa-lightbulb"></i>
          <h3>Skill Building</h3>
          <p>
            Gain curated resources and tips to sharpen your skills and boost your
            confidence.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 Career Navigator. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
