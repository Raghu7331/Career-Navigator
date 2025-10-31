import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobsAPI } from "../services/api";

export default function JobOpportunities() {
  const [dark, setDark] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Fetch jobs from database
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = jobs.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAllJobs();
      if (response.success && response.data?.jobs) {
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  const benefitsSection = {
    padding: "80px 20px",
    backgroundColor: "#f8fafc",
  };

  const benefitCard = {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "40px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  };

  const iconBox = {
    backgroundColor: "#2563eb",
    color: "white",
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    flexShrink: 0,
  };

  const industriesSection = {
    padding: "80px 20px",
    backgroundColor: "white",
  };

  const industryGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    marginTop: "40px",
  };

  const industryCard = {
    backgroundColor: "#f8fafc",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: "#2563eb",
    color: "white",
  };

  const industries = [
    { name: "Technology", icon: "💻", jobs: "15,000+" },
    { name: "Healthcare", icon: "🏥", jobs: "12,500+" },
    { name: "Finance", icon: "💰", jobs: "8,700+" },
    { name: "Education", icon: "🎓", jobs: "6,200+" },
    { name: "Marketing", icon: "📈", jobs: "9,100+" },
    { name: "Engineering", icon: "⚙️", jobs: "11,300+" },
    { name: "Design", icon: "🎨", jobs: "4,800+" },
    { name: "Sales", icon: "📊", jobs: "7,900+" }
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
            💼 Job Opportunities
          </h1>
          <p style={{ fontSize: "1.4rem", opacity: 0.9, maxWidth: "800px", margin: "0 auto" }}>
            Discover thousands of career opportunities that match your skills, interests, and aspirations. 
            Connect with top employers and land your dream job with our intelligent matching system.
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
            Why Choose Our Job Platform?
          </h2>
          
          <p style={{ 
            fontSize: "1.2rem", 
            textAlign: "center", 
            color: "#64748b", 
            maxWidth: "800px", 
            margin: "0 auto 50px",
            lineHeight: "1.6"
          }}>
            Our advanced job matching technology connects you with opportunities that truly align 
            with your career goals, ensuring you find positions where you can thrive and grow.
          </p>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🎯</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Smart Matching
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Our AI-powered matching system analyzes your skills, experience, and preferences 
                to recommend the most relevant job opportunities for your career path.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🏢</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Top Employers
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Access exclusive job postings from leading companies across various industries. 
                Connect directly with hiring managers and HR professionals.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📋</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Application Tracking
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Keep track of all your job applications in one place. Monitor application status, 
                interview schedules, and follow-up reminders.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>💡</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Career Insights
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Get detailed insights about companies, salary ranges, work culture, and growth 
                opportunities to make informed career decisions.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⚡</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Quick Apply
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Apply to multiple jobs with just one click using your saved profile and resume. 
                Streamline your job search process and save valuable time.
              </p>
            </div>

            <div style={featureCard}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🔔</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "15px", color: "#0b1b2b" }}>
                Job Alerts
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Set up personalized job alerts and never miss an opportunity. Get notified 
                instantly when new positions matching your criteria become available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Jobs Section */}
      <section style={{ padding: "80px 20px", backgroundColor: "#f8fafc" }}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "20px", 
            color: "#0b1b2b" 
          }}>
            Available Job Opportunities
          </h2>
          
          <p style={{ 
            fontSize: "1.2rem", 
            textAlign: "center", 
            color: "#64748b", 
            maxWidth: "800px", 
            margin: "0 auto 40px",
            lineHeight: "1.6"
          }}>
            Browse through our latest job openings from top companies
          </p>

          {/* Search Bar */}
          <div style={{ 
            maxWidth: "600px", 
            margin: "0 auto 40px",
            display: "flex",
            gap: "10px"
          }}>
            <input
              type="text"
              placeholder="Search by title, company, location, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "15px 20px",
                fontSize: "16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                outline: "none"
              }}
            />
            <button
              onClick={() => setSearchTerm("")}
              style={{
                padding: "15px 30px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", color: "#64748b" }}>
              <div style={{ marginBottom: "20px", fontSize: "3rem" }}>⏳</div>
              Loading jobs from database...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              backgroundColor: "#fee", 
              borderRadius: "10px",
              color: "#c00"
            }}>
              <div style={{ marginBottom: "20px", fontSize: "3rem" }}>⚠️</div>
              {error}
            </div>
          )}

          {/* Jobs List */}
          {!loading && !error && (
            <>
              <div style={{ 
                textAlign: "center", 
                marginBottom: "30px", 
                fontSize: "1.1rem", 
                color: "#64748b" 
              }}>
                Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} from database
              </div>

              {filteredJobs.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "60px 20px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  border: "2px dashed #e2e8f0"
                }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔍</div>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#0b1b2b" }}>
                    No jobs found
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
                    {searchTerm ? "Try adjusting your search terms" : "No jobs are currently available"}
                  </p>
                </div>
              ) : (
                <div style={{ 
                  display: "grid", 
                  gap: "30px",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))"
                }}>
                  {filteredJobs.map((job) => (
                    <div
                      key={job._id}
                      style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "15px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s ease",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
                      }}
                    >
                      <h3 style={{ 
                        fontSize: "1.5rem", 
                        fontWeight: "700", 
                        marginBottom: "10px", 
                        color: "#0b1b2b" 
                      }}>
                        {job.title || 'Untitled Position'}
                      </h3>
                      
                      <div style={{ 
                        fontSize: "1.1rem", 
                        color: "#2563eb", 
                        fontWeight: "600", 
                        marginBottom: "15px" 
                      }}>
                        {job.company || 'Company Name'}
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "8px", 
                          marginBottom: "8px",
                          color: "#64748b",
                          fontSize: "0.95rem"
                        }}>
                          <span>📍</span>
                          <span>{job.location || 'Location not specified'}</span>
                        </div>
                        {job.salary && (
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px",
                            color: "#64748b",
                            fontSize: "0.95rem"
                          }}>
                            <span>💰</span>
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>

                      {job.description && (
                        <p style={{ 
                          color: "#64748b", 
                          lineHeight: "1.6", 
                          marginBottom: "15px",
                          fontSize: "0.95rem"
                        }}>
                          {job.description.substring(0, 150)}
                          {job.description.length > 150 ? '...' : ''}
                        </p>
                      )}

                      {job.skills && job.skills.length > 0 && (
                        <div style={{ marginBottom: "20px" }}>
                          <div style={{ 
                            display: "flex", 
                            flexWrap: "wrap", 
                            gap: "8px" 
                          }}>
                            {job.skills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                style={{
                                  padding: "5px 12px",
                                  backgroundColor: "#eff6ff",
                                  color: "#2563eb",
                                  borderRadius: "20px",
                                  fontSize: "0.85rem",
                                  fontWeight: "500"
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 4 && (
                              <span style={{ 
                                padding: "5px 12px", 
                                color: "#64748b",
                                fontSize: "0.85rem"
                              }}>
                                +{job.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        style={{
                          width: "100%",
                          padding: "12px",
                          backgroundColor: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "background-color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#2563eb"}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section style={benefitsSection}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "50px", 
            color: "#0b1b2b" 
          }}>
            Benefits of Using Career Navigator
          </h2>

          <div style={benefitCard}>
            <div style={iconBox}>🚀</div>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                Faster Job Discovery
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Find relevant job opportunities 5x faster with our intelligent search and filtering system. 
                Spend less time searching and more time preparing for interviews.
              </p>
            </div>
          </div>

          <div style={benefitCard}>
            <div style={iconBox}>📈</div>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                Higher Success Rate
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Our users have a 75% higher interview success rate thanks to detailed company insights, 
                interview tips, and application optimization features.
              </p>
            </div>
          </div>

          <div style={benefitCard}>
            <div style={iconBox}>💰</div>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                Better Salary Negotiations
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Access real-time salary data and market insights to negotiate better compensation packages. 
                Know your worth and get paid accordingly.
              </p>
            </div>
          </div>

          <div style={benefitCard}>
            <div style={iconBox}>🎯</div>
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                Perfect Job Fit
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                Find positions that truly match your skills, values, and career aspirations. 
                Reduce job-hopping and build a more satisfying career path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section style={industriesSection}>
        <div style={container}>
          <h2 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "700", 
            textAlign: "center", 
            marginBottom: "30px", 
            color: "#0b1b2b" 
          }}>
            Explore Opportunities by Industry
          </h2>
          
          <p style={{ 
            fontSize: "1.2rem", 
            textAlign: "center", 
            color: "#64748b", 
            maxWidth: "600px", 
            margin: "0 auto 40px",
            lineHeight: "1.6"
          }}>
            Browse thousands of job opportunities across different industries and find your perfect match.
          </p>

          <div style={industryGrid}>
            {industries.map((industry, index) => (
              <div 
                key={index} 
                style={{
                  ...industryCard,
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-5px)";
                  e.target.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>{industry.icon}</div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px", color: "#0b1b2b" }}>
                  {industry.name}
                </h3>
                <p style={{ color: "#2563eb", fontSize: "1.1rem", fontWeight: "600" }}>
                  {industry.jobs} Jobs Available
                </p>
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