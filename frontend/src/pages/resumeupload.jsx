import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uploadAPI, authAPI } from "../services/api";

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    profession: "",
    experience: "",
    skills: "",
    education: "",
    summary: "",
    resumeFile: null,
    workExperience: [
      { company: "", position: "", duration: "", description: "" }
    ],
    projects: [
      { name: "", description: "", technologies: "", link: "" }
    ]
  });
  const [errors, setErrors] = useState({});
  const [uploadMethod, setUploadMethod] = useState("form"); // "form" or "file"
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const userAuth = localStorage.getItem("userAuth");
    if (!userAuth) {
      navigate("/login");
    }
  }, [navigate]);

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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
    flex: 1,
  };

  const methodSelector = {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
    justifyContent: "center",
  };

  const methodButton = (isActive) => ({
    background: isActive ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "transparent",
    color: isActive ? "white" : (dark ? "#e6eef8" : "#374151"),
    border: "2px solid " + (isActive ? "#3b82f6" : (dark ? "#4b5563" : "#d1d5db")),
    padding: "15px 30px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const formContainer = {
    background: dark ? "linear-gradient(135deg, #374151, #4b5563)" : "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
  };

  const formGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    marginBottom: "25px",
  };

  const formGroup = {
    marginBottom: "25px",
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
    padding: "15px",
    border: "2px solid " + (dark ? "#4b5563" : "#e5e7eb"),
    borderRadius: "12px",
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

  const fileUpload = {
    ...input,
    padding: "20px",
    textAlign: "center",
    border: "2px dashed " + (dark ? "#4b5563" : "#d1d5db"),
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const button = {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const secondaryButton = {
    background: "transparent",
    color: dark ? "#e6eef8" : "#374151",
    border: "2px solid " + (dark ? "#4b5563" : "#d1d5db"),
    padding: "15px 30px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginRight: "15px",
  };

  const errorMessage = {
    color: "#dc2626",
    fontSize: "14px",
    marginTop: "5px",
  };

  const footer = {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    background: dark ? "#1e293b" : "#2563eb",
    color: "white",
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.workExperience];
    updatedExperience[index][field] = value;
    setFormData({
      ...formData,
      workExperience: updatedExperience
    });
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        { company: "", position: "", duration: "", description: "" }
      ]
    });
  };

  const removeWorkExperience = (index) => {
    const updatedExperience = formData.workExperience.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      workExperience: updatedExperience
    });
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index][field] = value;
    setFormData({
      ...formData,
      projects: updatedProjects
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { name: "", description: "", technologies: "", link: "" }
      ]
    });
  };

  const removeProject = (index) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      projects: updatedProjects
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.profession) newErrors.profession = "Profession is required";
    if (!formData.skills) newErrors.skills = "Skills are required";
    if (!formData.experience) newErrors.experience = "Experience level is required";
    
    if (uploadMethod === "file" && !formData.resumeFile) {
      newErrors.resumeFile = "Please upload a resume file";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    
    try {
      // If uploading a file
      if (uploadMethod === "file" && formData.resumeFile) {
        const uploadResponse = await uploadAPI.uploadResume(formData.resumeFile);
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message || 'Failed to upload resume');
        }
      }

      // Update user profile with form data
      const profileData = {
        phone: formData.phone,
        location: formData.location,
        profession: formData.profession,
        experience_years: formData.experience,
        skills: formData.skills.split(',').map(s => s.trim()),
        education: formData.education,
        summary: formData.summary,
        work_experience: formData.workExperience,
        projects: formData.projects
      };

      const updateResponse = await authAPI.updateProfile(profileData);
      
      if (updateResponse.success) {
        // Update localStorage with new user data
        const currentUser = localStorage.getItem("currentUser");
        const updatedUserData = {
          ...profileData,
          email: currentUser,
          profileCompleted: true,
          completedDate: new Date().toISOString(),
        };
        
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        localStorage.removeItem("tempUserData");
        
        alert("Profile completed successfully! Redirecting to your dashboard...");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (window.confirm("Are you sure you want to skip this step? You can complete your profile later, but this will limit job recommendations.")) {
      navigate("/dashboard");
    }
  };

  const renderFileUpload = () => (
    <div style={formContainer}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>📄</div>
        <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "10px" }}>Upload Your Resume</h2>
        <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280" }}>
          Upload your resume file and we'll extract the information automatically
        </p>
      </div>

      <div style={formGroup}>
        <label htmlFor="resumeFile" style={label}>Upload Resume (PDF, DOC, DOCX) *</label>
        <div style={fileUpload}>
          <input
            type="file"
            id="resumeFile"
            name="resumeFile"
            onChange={handleInputChange}
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
          />
          <div onClick={() => document.getElementById("resumeFile").click()}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>📎</div>
            <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "5px" }}>
              Click to upload your resume
            </p>
            <p style={{ fontSize: "14px", color: dark ? "#9ca3af" : "#6b7280" }}>
              Supports PDF, DOC, DOCX (Max 5MB)
            </p>
            {formData.resumeFile && (
              <p style={{ fontSize: "14px", color: "#059669", marginTop: "10px" }}>
                ✓ {formData.resumeFile.name}
              </p>
            )}
          </div>
        </div>
        {errors.resumeFile && <div style={errorMessage}>{errors.resumeFile}</div>}
      </div>

      {/* Basic info still needed */}
      <div style={formGrid}>
        <div style={formGroup}>
          <label htmlFor="profession" style={label}>Profession/Field *</label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            style={{
              ...input,
              borderColor: errors.profession ? "#dc2626" : (dark ? "#4b5563" : "#e5e7eb")
            }}
            placeholder="e.g. Software Developer, Designer"
          />
          {errors.profession && <div style={errorMessage}>{errors.profession}</div>}
        </div>

        <div style={formGroup}>
          <label htmlFor="experience" style={label}>Experience Level *</label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            style={{
              ...input,
              borderColor: errors.experience ? "#dc2626" : (dark ? "#4b5563" : "#e5e7eb")
            }}
          >
            <option value="">Select Experience</option>
            <option value="Entry Level (0-1 years)">Entry Level (0-1 years)</option>
            <option value="Junior (1-3 years)">Junior (1-3 years)</option>
            <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
            <option value="Senior (5+ years)">Senior (5+ years)</option>
            <option value="Executive">Executive</option>
          </select>
          {errors.experience && <div style={errorMessage}>{errors.experience}</div>}
        </div>
      </div>

      <div style={formGroup}>
        <label htmlFor="skills" style={label}>Key Skills *</label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          style={{
            ...input,
            borderColor: errors.skills ? "#dc2626" : (dark ? "#4b5563" : "#e5e7eb")
          }}
          placeholder="e.g. React, JavaScript, Python, Design (comma separated)"
        />
        {errors.skills && <div style={errorMessage}>{errors.skills}</div>}
        <small style={{ fontSize: "12px", color: dark ? "#9ca3af" : "#6b7280" }}>
          These will be used for job matching even if resume upload fails
        </small>
      </div>
    </div>
  );

  const renderFormFill = () => (
    <div style={formContainer}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>✍️</div>
        <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "10px" }}>Fill Your Profile</h2>
        <p style={{ fontSize: "16px", color: dark ? "#9ca3af" : "#6b7280" }}>
          Complete your professional profile for better job matching
        </p>
      </div>

      {/* Basic Info */}
      <div style={formGrid}>
        <div style={formGroup}>
          <label htmlFor="phone" style={label}>Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={input}
            placeholder="Your phone number"
          />
        </div>

        <div style={formGroup}>
          <label htmlFor="location" style={label}>Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            style={input}
            placeholder="City, State/Country"
          />
        </div>
      </div>

      <div style={formGrid}>
        <div style={formGroup}>
          <label htmlFor="profession" style={label}>Profession/Field *</label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            style={{
              ...input,
              borderColor: errors.profession ? "#dc2626" : (dark ? "#4b5563" : "#e5e7eb")
            }}
            placeholder="e.g. Software Developer, Designer"
          />
          {errors.profession && <div style={errorMessage}>{errors.profession}</div>}
        </div>

        <div style={formGroup}>
          <label htmlFor="experience" style={label}>Experience Level *</label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            style={{
              ...input,
              borderColor: errors.experience ? "#dc2626" : (dark ? "#4b5563" : "#e5e7eb")
            }}
          >
            <option value="">Select Experience</option>
            <option value="Entry Level (0-1 years)">Entry Level (0-1 years)</option>
            <option value="Junior (1-3 years)">Junior (1-3 years)</option>
            <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
            <option value="Senior (5+ years)">Senior (5+ years)</option>
            <option value="Executive">Executive</option>
          </select>
          {errors.experience && <div style={errorMessage}>{errors.experience}</div>}
        </div>
      </div>

      <div style={formGroup}>
        <label htmlFor="skills" style={label}>Skills *</label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          style={{
            ...input,
            borderColor: errors.skills ? "#dc2626" : (dark ? "#4b5563" : "#e5e7eb")
          }}
          placeholder="e.g. React, JavaScript, Python, Design (comma separated)"
        />
        {errors.skills && <div style={errorMessage}>{errors.skills}</div>}
      </div>

      <div style={formGroup}>
        <label htmlFor="education" style={label}>Education</label>
        <input
          type="text"
          id="education"
          name="education"
          value={formData.education}
          onChange={handleInputChange}
          style={input}
          placeholder="e.g. Bachelor's in Computer Science"
        />
      </div>

      <div style={formGroup}>
        <label htmlFor="summary" style={label}>Professional Summary</label>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          style={textarea}
          placeholder="Brief summary of your experience and career goals..."
        />
      </div>

      {/* Work Experience */}
      <div style={formGroup}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <label style={label}>Work Experience</label>
          <button
            type="button"
            onClick={addWorkExperience}
            style={{
              ...secondaryButton,
              padding: "8px 16px",
              fontSize: "14px",
              margin: 0,
            }}
          >
            + Add Experience
          </button>
        </div>
        
        {formData.workExperience.map((exp, index) => (
          <div key={index} style={{
            border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "15px",
            background: dark ? "#1f2937" : "#f9fafb"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Experience {index + 1}</h4>
              {formData.workExperience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkExperience(index)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div style={formGrid}>
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)}
                style={input}
              />
              <input
                type="text"
                placeholder="Position/Title"
                value={exp.position}
                onChange={(e) => handleWorkExperienceChange(index, "position", e.target.value)}
                style={input}
              />
            </div>
            <input
              type="text"
              placeholder="Duration (e.g. Jan 2020 - Dec 2022)"
              value={exp.duration}
              onChange={(e) => handleWorkExperienceChange(index, "duration", e.target.value)}
              style={{ ...input, marginBottom: "15px" }}
            />
            <textarea
              placeholder="Job description and key achievements..."
              value={exp.description}
              onChange={(e) => handleWorkExperienceChange(index, "description", e.target.value)}
              style={textarea}
            />
          </div>
        ))}
      </div>

      {/* Projects */}
      <div style={formGroup}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <label style={label}>Projects</label>
          <button
            type="button"
            onClick={addProject}
            style={{
              ...secondaryButton,
              padding: "8px 16px",
              fontSize: "14px",
              margin: 0,
            }}
          >
            + Add Project
          </button>
        </div>
        
        {formData.projects.map((project, index) => (
          <div key={index} style={{
            border: "1px solid " + (dark ? "#4b5563" : "#e5e7eb"),
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "15px",
            background: dark ? "#1f2937" : "#f9fafb"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Project {index + 1}</h4>
              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div style={formGrid}>
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                style={input}
              />
              <input
                type="text"
                placeholder="Technologies Used"
                value={project.technologies}
                onChange={(e) => handleProjectChange(index, "technologies", e.target.value)}
                style={input}
              />
            </div>
            <input
              type="url"
              placeholder="Project Link (optional)"
              value={project.link}
              onChange={(e) => handleProjectChange(index, "link", e.target.value)}
              style={{ ...input, marginBottom: "15px" }}
            />
            <textarea
              placeholder="Project description and your role..."
              value={project.description}
              onChange={(e) => handleProjectChange(index, "description", e.target.value)}
              style={textarea}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <Link to="/dashboard" style={{ ...brand, textDecoration: "none" }}>Career Navigator</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <nav style={nav}>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>← Dashboard</Link>
            <span style={{ color: "white", textDecoration: "underline" }}>Complete Profile</span>
          </nav>
        </div>
      </header>

      <div style={container}>
        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "15px" }}>
            Complete Your Profile 🎯
          </h1>
          <p style={{ fontSize: "18px", color: dark ? "#9ca3af" : "#6b7280", marginBottom: "30px" }}>
            Help us match you with the perfect job opportunities by completing your profile
          </p>

          {/* Method Selector */}
          <div style={methodSelector}>
            <button
              onClick={() => setUploadMethod("file")}
              style={methodButton(uploadMethod === "file")}
            >
              📄 Upload Resume
            </button>
            <button
              onClick={() => setUploadMethod("form")}
              style={methodButton(uploadMethod === "form")}
            >
              ✍️ Fill Form
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {uploadMethod === "file" ? renderFileUpload() : renderFormFill()}

          {/* Action Buttons */}
          <div style={{ 
            display: "flex", 
            gap: "15px", 
            justifyContent: "center", 
            marginTop: "40px",
            flexWrap: "wrap"
          }}>
            <button
              type="button"
              onClick={handleSkip}
              style={secondaryButton}
            >
              Skip for Now
            </button>
            <button
              type="submit"
              style={{...button, opacity: loading ? 0.7 : 1}}
              disabled={loading}
              onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => !loading && (e.target.style.transform = "translateY(0)")}
            >
              {loading ? "Updating Profile..." : "Complete Profile"}
            </button>
          </div>
        </form>
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