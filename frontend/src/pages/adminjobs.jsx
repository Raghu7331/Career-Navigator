import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobsAPI } from "../services/api";

export default function AdminJobs() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check admin authentication and load jobs
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const adminToken = localStorage.getItem("adminToken");
    if (!isAdminLoggedIn || !adminToken) {
      navigate("/admin-login");
      return;
    }
    loadJobs();
  }, [navigate]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs();
      if (response.success) {
        setJobs(response.data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    experience: "",
    skills: "",
    description: "",
    salary: "",
    requirements: "",
  });

  const [jobs, setJobs] = useState([]);

  const handleInputChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const jobData = {
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        job_type: jobForm.type,
        experience_level: jobForm.experience,
        skills: jobForm.skills.split(',').map(s => s.trim()),
        description: jobForm.description,
        salary_range: jobForm.salary,
        requirements: jobForm.requirements,
        status: 'active'
      };
      
      const response = await jobsAPI.createJob(jobData);
      
      if (response.success) {
        alert("Job posted successfully!");
        setJobForm({
          title: "",
          company: "",
          location: "",
          type: "",
          experience: "",
          skills: "",
          description: "",
          salary: "",
          requirements: "",
        });
        setShowAddForm(false);
        // Reload jobs list
        await loadJobs();
      } else {
        alert("Failed to create job: " + response.message);
      }
    } catch (error) {
      console.error("Failed to create job:", error);
      alert("Failed to create job: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await jobsAPI.deleteJob(id);
      
      if (response.success) {
        alert("Job deleted successfully!");
        // Reload jobs list
        await loadJobs();
      } else {
        alert("Failed to delete job: " + response.message);
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin-login");
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
    width: "100%",
    margin: "0",
    padding: "40px 5%",
    boxSizing: "border-box",
    flex: 1,
  };

  const formContainer = {
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "40px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
  };

  const formGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  };

  const formGroup = {
    marginBottom: "20px",
  };

  const label = {
    display: "block",
    marginBottom: "8px",
    fontSize: "16px",
    fontWeight: "600",
    color: dark ? "#e6eef8" : "#374151",
  };

  const input = {
    width: "100%",
    padding: "12px",
    border: "2px solid " + (dark ? "#4b5563" : "#e5e7eb"),
    borderRadius: "10px",
    fontSize: "16px",
    background: dark ? "#1f2937" : "white",
    color: dark ? "#e6eef8" : "#0b1b2b",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  };

  const textarea = {
    ...input,
    minHeight: "120px",
    resize: "vertical",
  };

  const select = {
    ...input,
  };

  const button = {
    background: "linear-gradient(135deg, #dc2626, #991b1b)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginRight: "10px",
  };

  const secondaryButton = {
    background: "transparent",
    color: dark ? "#e6eef8" : "#374151",
    border: "2px solid " + (dark ? "#4b5563" : "#d1d5db"),
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const jobCard = {
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "20px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
  };

  const jobHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  };

  const jobActions = {
    display: "flex",
    gap: "10px",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: dark ? "#1e293b" : "#2563eb",
    color: "white",
  };

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <Link to="/admin-dashboard" style={{ ...brand, textDecoration: "none" }}>Career Navigator Admin</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/admin-dashboard" style={{ color: "white", textDecoration: "none" }}>← Dashboard</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Job Management</span>
            <button
              onClick={handleSignOut}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <div style={container}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px" }}>
              Job Management 💼
            </h1>
            <p style={{ fontSize: "18px", color: dark ? "#9ca3af" : "#6b7280" }}>
              Manage job postings and track applications
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              ...button,
              fontSize: "18px",
              padding: "15px 30px",
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            {showAddForm ? "Cancel" : "Add New Job"}
          </button>
        </div>

        {/* Add Job Form */}
        {showAddForm && (
          <div style={formContainer}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "25px" }}>
              Add New Job Posting
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={formGrid}>
                <div style={formGroup}>
                  <label htmlFor="title" style={label}>Job Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={jobForm.title}
                    onChange={handleInputChange}
                    style={input}
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />
                </div>

                <div style={formGroup}>
                  <label htmlFor="company" style={label}>Company *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={jobForm.company}
                    onChange={handleInputChange}
                    style={input}
                    placeholder="e.g. TechCorp Inc."
                    required
                  />
                </div>

                <div style={formGroup}>
                  <label htmlFor="location" style={label}>Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={jobForm.location}
                    onChange={handleInputChange}
                    style={input}
                    placeholder="e.g. San Francisco, CA"
                    required
                  />
                </div>

                <div style={formGroup}>
                  <label htmlFor="type" style={label}>Job Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={jobForm.type}
                    onChange={handleInputChange}
                    style={select}
                    required
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div style={formGroup}>
                  <label htmlFor="experience" style={label}>Experience Level *</label>
                  <select
                    id="experience"
                    name="experience"
                    value={jobForm.experience}
                    onChange={handleInputChange}
                    style={select}
                    required
                  >
                    <option value="">Select Experience</option>
                    <option value="Entry Level (0-1 years)">Entry Level (0-1 years)</option>
                    <option value="Junior (1-3 years)">Junior (1-3 years)</option>
                    <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
                    <option value="Senior (5+ years)">Senior (5+ years)</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div style={formGroup}>
                  <label htmlFor="salary" style={label}>Salary Range</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleInputChange}
                    style={input}
                    placeholder="e.g. $70,000 - $90,000"
                  />
                </div>
              </div>

              <div style={formGroup}>
                <label htmlFor="skills" style={label}>Required Skills *</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={jobForm.skills}
                  onChange={handleInputChange}
                  style={input}
                  placeholder="e.g. React, JavaScript, Node.js, Python (comma separated)"
                  required
                />
              </div>

              <div style={formGroup}>
                <label htmlFor="description" style={label}>Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={jobForm.description}
                  onChange={handleInputChange}
                  style={textarea}
                  placeholder="Describe the job role, responsibilities, and what you're looking for..."
                  required
                />
              </div>

              <div style={formGroup}>
                <label htmlFor="requirements" style={label}>Additional Requirements</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={jobForm.requirements}
                  onChange={handleInputChange}
                  style={textarea}
                  placeholder="Any additional requirements, qualifications, or preferences..."
                />
              </div>

              <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={secondaryButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={button}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Job Listings */}
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "25px" }}>
            Current Job Postings ({jobs.length})
          </h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", fontSize: "1.1rem", color: dark ? "#9ca3af" : "#6b7280" }}>
              Loading jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", fontSize: "1.1rem", color: dark ? "#9ca3af" : "#6b7280" }}>
              No jobs posted yet. Click "Post New Job" to add one.
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id || job._id} style={jobCard}>
                <div style={jobHeader}>
                  <div>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "8px" }}>
                      {job.title}
                    </h3>
                    <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "5px" }}>
                      {job.company} • {job.location}
                    </p>
                    <p style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
                      Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'} • Status: {job.status || 'active'}
                    </p>
                  </div>
                  <div style={jobActions}>
                    <button
                      style={{
                        ...secondaryButton,
                        padding: "8px 16px",
                        fontSize: "14px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id || job._id)}
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
                  <span style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>
                    {job.job_type || job.type || 'Full-time'}
                  </span>
                  <span style={{
                    background: "#059669",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>
                    {job.experience_level || job.experience || 'All levels'}
                  </span>
                  {(job.salary_range || job.salary) && (
                    <span style={{
                      background: "#f59e0b",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}>
                      {job.salary_range || job.salary}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "10px" }}>
                  <strong>Skills:</strong> {Array.isArray(job.skills) ? job.skills.join(', ') : job.skills}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ ...footer, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <span>© 2025 Career Navigator Admin Panel. All Rights Reserved.</span>
        
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