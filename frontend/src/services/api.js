// API Service for Career Navigator Frontend
// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

// Debug: Log the API URL being used (remove in production)
console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.MODE);

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }
  
  return data;
};

// Authentication API
export const authAPI = {
  // User Registration
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // User Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    
    // Store token in localStorage
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  },

  // Get User Profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update User Profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = '/';
  }
};

// Admin API
export const adminAPI = {
  // Admin Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    
    // Store admin token
    if (data.success && data.data.token) {
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('admin', JSON.stringify(data.data.admin));
    }
    
    return data;
  },

  // Get Dashboard Statistics
  getDashboardStats: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Get All Users
  getUsers: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Delete User
  deleteUser: async (userId) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('admin');
    window.location.href = '/';
  }
};

// Jobs API
export const jobsAPI = {
  // Get All Jobs with pagination and filters
  getJobs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/jobs?${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  // Get Single Job
  getJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  // Create Job (Admin only)
  createJob: async (jobData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });
    return handleResponse(response);
  },

  // Update Job (Admin only)
  updateJob: async (jobId, jobData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });
    return handleResponse(response);
  },

  // Delete Job (Admin only)
  deleteJob: async (jobId) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Apply for Job (User)
  applyForJob: async (jobId, applicationData = {}) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  // Get User's Job Applications
  getMyApplications: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/jobs/my-applications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};

// Recommendations API
export const recommendationsAPI = {
  // Get Personalized Job Recommendations
  getRecommendations: async () => {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Save Job for Later
  saveJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/recommendations/save/${jobId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get Saved Jobs
  getSavedJobs: async () => {
    const response = await fetch(`${API_BASE_URL}/recommendations/saved`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Messages API
export const messagesAPI = {
  // Send Message (Admin)
  sendMessage: async (messageData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(messageData)
    });
    return handleResponse(response);
  },

  // Get User Messages
  getUserMessages: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Get Admin Sent Messages
  getAdminMessages: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/messages/sent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Mark Message as Read
  markMessageRead: async (messageId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};

// Upload API
export const uploadAPI = {
  // Upload Resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return handleResponse(response);
  },

  // Download Resume
  downloadResume: async (filename) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload/resume/${filename}`, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to download resume');
    }
    
    return response.blob();
  },

  // Delete Resume
  deleteResume: async (filename) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/upload/resume/${filename}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Helper function to check if admin is authenticated
export const isAdminAuthenticated = () => {
  return localStorage.getItem('isAdminLoggedIn') === 'true' && !!localStorage.getItem('adminToken');
};

// Helper function to get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Email API (legacy endpoints)
export const emailAPI = {
  // Test Email Service
  testService: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/email/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Send Email to Specific User
  sendToUser: async (emailData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/email/send-to-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(emailData)
    });
    return handleResponse(response);
  },

  // Send Email to All Users
  sendToAll: async (emailData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/email/send-to-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(emailData)
    });
    return handleResponse(response);
  },

  // Send Job Alert Email
  sendJobAlert: async (jobAlertData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/email/job-alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobAlertData)
    });
    return handleResponse(response);
  },

  // Get Email Logs
  getLogs: async (page = 1, limit = 20) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/email/logs?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Get Users for Email Selection
  getUsers: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/email/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};

// Enhanced Email API
export const enhancedEmailAPI = {
  // Test Enhanced Email Service
  testService: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/test-enhanced`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Send Notification to a specific user
  sendNotification: async ({ email, subject, message, userName }) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, subject, message, userName })
    });
    return handleResponse(response);
  },

  // Send Career Guidance to a specific user
  sendGuidance: async ({ email, message, tips = [], userName }) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/send-guidance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, message, tips, userName })
    });
    return handleResponse(response);
  },

  // Send Welcome email to a specific user
  sendWelcome: async ({ email, userName }) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/send-welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, userName })
    });
    return handleResponse(response);
  },

  // Send Job Alert to a specific user
  sendJobAlert: async ({ email, jobTitle, companyName, jobDescription, applyLink, requirements, salary, location }) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/send-job-alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, jobTitle, companyName, jobDescription, applyLink, requirements, salary, location })
    });
    return handleResponse(response);
  },

  // Send to all users (notification only)
  sendToAll: async ({ subject, message, messageType = 'notification' }) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/send-to-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ subject, message, messageType })
    });
    return handleResponse(response);
  },

  // Send Welcome Email
  sendWelcome: async ({ email, userName }) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/send-welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, userName })
    });
    return handleResponse(response);
  },

  // Get enhanced email statistics
  getStats: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // User preferences (requires user auth token)
  getPreferences: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/preferences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  updatePreferences: async (prefs) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/enhanced-email/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(prefs)
    });
    return handleResponse(response);
  },

  // Public unsubscribe endpoint
  unsubscribe: async ({ email, token }) => {
    const response = await fetch(`${API_BASE_URL}/enhanced-email/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token })
    });
    return handleResponse(response);
  }
};

// Helper function to get current admin
export const getCurrentAdmin = () => {
  const adminStr = localStorage.getItem('admin');
  return adminStr ? JSON.parse(adminStr) : null;
};

// Export default API object
const API = {
  auth: authAPI,
  admin: adminAPI,
  jobs: jobsAPI,
  recommendations: recommendationsAPI,
  messages: messagesAPI,
  upload: uploadAPI,
  email: emailAPI,
  enhancedEmail: enhancedEmailAPI,
  isAuthenticated,
  isAdminAuthenticated,
  getCurrentUser,
  getCurrentAdmin
};

export default API;