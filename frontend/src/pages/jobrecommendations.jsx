import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobsAPI, authAPI } from "../services/api";

export default function JobRecommendations() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [userData, setUserData] = useState({});
  const [resumeAnalysis, setResumeAnalysis] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all, high-match, recent
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check authentication and load user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserDataAndJobs();
  }, [navigate]);

  const fetchUserDataAndJobs = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile from database
      const profileResponse = await authAPI.getProfile();
      if (profileResponse.success && profileResponse.data) {
        setUserData(profileResponse.data);
      }

      // Fetch all jobs from database
      const jobsResponse = await jobsAPI.getAllJobs();
      if (jobsResponse.success && jobsResponse.data?.jobs) {
        // Calculate match scores based on user skills
        const jobsWithScores = calculateMatchScores(
          jobsResponse.data.jobs,
          profileResponse.data?.skills || []
        );
        setRecommendations(jobsWithScores);
      }

      // Load applied jobs from localStorage
      const storedAppliedJobs = localStorage.getItem("appliedJobs");
      if (storedAppliedJobs) {
        setAppliedJobs(JSON.parse(storedAppliedJobs));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScores = (jobs, userSkills) => {
    return jobs.map(job => {
      let matchScore = 50; // Base score
      
      if (job.skills && userSkills && userSkills.length > 0) {
        const jobSkills = job.skills.map(s => s.toLowerCase());
        const userSkillsLower = userSkills.map(s => s.toLowerCase());
        
        // Calculate skill match percentage
        const matchingSkills = userSkillsLower.filter(skill => 
          jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
        );
        
        const skillMatchPercentage = (matchingSkills.length / Math.max(jobSkills.length, userSkillsLower.length)) * 100;
        matchScore = Math.min(50 + skillMatchPercentage / 2, 98); // Cap at 98%
      }
      
      return {
        ...job,
        id: job._id,
        matchScore: Math.round(matchScore),
        posted: job.createdAt ? getTimeAgo(new Date(job.createdAt)) : 'Recently',
        remote: job.location?.toLowerCase().includes('remote') || false,
        type: job.type || 'Full-time',
        experience: job.experience || 'All levels'
      };
    }).sort((a, b) => b.matchScore - a.matchScore); // Sort by match score
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  const getFilteredRecommendations = () => {
    switch (filterType) {
      case "high-match":
        return recommendations.filter(job => job.matchScore >= 80);
      case "recent":
        return recommendations.filter(job => 
          job.posted.includes("day") || job.posted === "1 week ago"
        );
      default:
        return recommendations;
    }
  };

  const handleApply = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      const updatedAppliedJobs = [...appliedJobs, jobId];
      setAppliedJobs(updatedAppliedJobs);
      localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedJobs));
      alert("Application submitted successfully! The employer will be notified.");
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return "#059669"; // green
    if (score >= 80) return "#3b82f6"; // blue
    if (score >= 70) return "#f59e0b"; // orange
    return "#6b7280"; // gray
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
    background: dark ? "linear-gradient(135deg, #1e293b, #334155)" : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  };

  const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 5%",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
  };

  const brand = {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "white",
  };

  const nav = {
    display: "flex",
    gap: "30px",
    alignItems: "center",
  };

  const container = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 20px",
    flex: 1,
  };

  const filterBar = {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const filterButton = (isActive) => ({
    background: isActive ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "transparent",
    color: isActive ? "white" : (dark ? "#e6eef8" : "#374151"),
    border: "2px solid " + (isActive ? "#3b82f6" : (dark ? "#4b5563" : "#d1d5db")),
    padding: "12px 24px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const summaryCard = {
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "30px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
  };

  const jobCard = {
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "25px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
    transition: "transform 0.3s ease",
  };

  const jobHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  };

  const matchBadge = (score) => ({
    background: getMatchColor(score),
    color: "white",
    padding: "8px 16px",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    minWidth: "80px",
  });

  const skillTag = {
    background: "#3b82f6",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    margin: "2px",
    display: "inline-block",
  };

  const button = {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const appliedButton = {
    background: "#059669",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: dark ? "#1e293b" : "#2563eb",
    color: "white",
  };

  const filteredJobs = getFilteredRecommendations();

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <Link to="/dashboard" style={{ ...brand, textDecoration: "none" }}>Career Navigator</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>← Dashboard</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Job Recommendations</span>
          </nav>
        </div>
      </header>

      <div style={container}>
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "15px" }}>
            Job Recommendations 🎯
          </h1>
          <p style={{ fontSize: "18px", color: dark ? "#9ca3af" : "#6b7280" }}>
            Personalized job matches from database based on your skills
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            backgroundColor: dark ? "#1e293b" : "white",
            borderRadius: "15px",
            marginBottom: "30px"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏳</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
              Loading job recommendations from database...
            </h3>
            <p style={{ color: dark ? "#9ca3af" : "#6b7280" }}>
              Analyzing your profile and matching with available positions
            </p>
          </div>
        )}

        {/* Profile Summary */}
        {!loading && Object.keys(userData).length > 0 && (
          <div style={summaryCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "5px" }}>
                  Hi {userData.fullName}! 👋
                </h3>
                <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "5px" }}>
                  {userData.profession} • {userData.experience}
                </p>
                {userData.skills && (
                  <p style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                    <strong>Skills:</strong> {userData.skills}
                  </p>
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
                  {resumeAnalysis.matchingScore || 75}%
                </div>
                <div style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                  Profile Match Score
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={filterBar}>
          <button
            onClick={() => setFilterType("all")}
            style={filterButton(filterType === "all")}
          >
            All Jobs ({recommendations.length})
          </button>
          <button
            onClick={() => setFilterType("high-match")}
            style={filterButton(filterType === "high-match")}
          >
            High Match ({recommendations.filter(job => job.matchScore >= 80).length})
          </button>
          <button
            onClick={() => setFilterType("recent")}
            style={filterButton(filterType === "recent")}
          >
            Recent ({recommendations.filter(job => 
              job.posted.includes("day") || job.posted === "1 week ago"
            ).length})
          </button>
        </div>

        {/* Job Recommendations */}
        <div>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} style={jobCard}>
                <div style={jobHeader}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: "600", margin: 0 }}>
                        {job.title}
                      </h3>
                      <div style={matchBadge(job.matchScore)}>
                        {Math.round(job.matchScore)}% Match
                      </div>
                    </div>
                    
                    <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "8px" }}>
                      {job.company} • {job.location} • {job.type}
                    </p>
                    
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px", flexWrap: "wrap" }}>
                      <span style={{
                        background: "#059669",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}>
                        {job.experience}
                      </span>
                      <span style={{
                        background: "#f59e0b",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}>
                        {job.salary}
                      </span>
                      {job.remote && (
                        <span style={{
                          background: "#8b5cf6",
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}>
                          Remote
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "16px", color: dark ? "#d1d5db" : "#374151", marginBottom: "15px", lineHeight: "1.6" }}>
                  {job.description}
                </p>

                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Required Skills:</p>
                  <div>
                    {job.skills.map((skill, index) => (
                      <span key={index} style={{
                        ...skillTag,
                        background: job.matchingSkills && job.matchingSkills.includes(skill.toLowerCase()) ? "#059669" : "#6b7280"
                      }}>
                        {skill} {job.matchingSkills && job.matchingSkills.includes(skill.toLowerCase()) && "✓"}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                  <div style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                    Posted {job.posted}
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link
                      to={`/job-details/${job.id}`}
                      style={{
                        background: "transparent",
                        color: dark ? "#e6eef8" : "#374151",
                        border: "2px solid " + (dark ? "#4b5563" : "#d1d5db"),
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      View Details
                    </Link>
                    
                    {appliedJobs.includes(job.id) ? (
                      <button style={appliedButton}>
                        ✓ Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job.id)}
                        style={button}
                        onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: dark ? "#9ca3af" : "#6b7280"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔍</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>No jobs found</h3>
              <p>Try adjusting your filters or check back later for new opportunities</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {!userData.profileCompleted && (
          <div style={{
            ...summaryCard,
            textAlign: "center",
            background: "linear-gradient(135deg, #fef3c7, #fed7aa)",
            border: "1px solid #f59e0b",
            marginTop: "40px",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>📝</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "10px", color: "#92400e" }}>
              Complete Your Profile
            </h3>
            <p style={{ fontSize: "16px", color: "#92400e", marginBottom: "20px" }}>
              Complete your profile to get better job recommendations and higher match scores
            </p>
            <Link
              to="/resume-upload"
              style={{
                ...button,
                background: "#f59e0b",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Complete Profile
            </Link>
          </div>
        )}
      </div>

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