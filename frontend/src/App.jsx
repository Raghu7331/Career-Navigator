import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/mainpage';
import CareerNavigator from './pages/landingpage';
import About from './pages/about';
import Contact from './pages/contact';
import Login from './pages/login';
import Signup from './pages/signup';
import PersonalizedGuidance from './pages/personalizedguidance';
import JobOpportunities from './pages/jobopportunities';
import SkillBuilding from './pages/skillbuilding';
import AllFeatures from './pages/features';
import Dashboard from './pages/dashboard_simple';
// Admin Pages
import AdminLogin from './pages/adminlogin';
import AdminDashboard from './pages/admindashboard';
import AdminJobs from './pages/adminjobs';
import AdminMessages from './pages/adminmessages';
import AdminEmailSender from './pages/adminemailsender';
import AdminUsers from './pages/adminusers';
import AdminAnalytics from './pages/adminanalytics';
// User Features
import ResumeUpload from './pages/resumeupload';
import JobRecommendations from './pages/jobrecommendations';
import UserMessages from './pages/usermessages';
import EmailPreferences from './pages/emailpreferences';
import './styles/landingpage.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<CareerNavigator />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Feature Pages */}
          <Route path="/personalized-guidance" element={<PersonalizedGuidance />} />
          <Route path="/job-opportunities" element={<JobOpportunities />} />
          <Route path="/skill-building" element={<SkillBuilding />} />
          <Route path="/features" element={<AllFeatures />} />
          
          {/* User Dashboard & Features */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/job-recommendations" element={<JobRecommendations />} />
          <Route path="/user-messages" element={<UserMessages />} />
          <Route path="/email-preferences" element={<EmailPreferences />} />
          
          {/* Admin Pages */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-jobs" element={<AdminJobs />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
          <Route path="/admin-messages" element={<AdminMessages />} />
          <Route path="/admin-email-sender" element={<AdminEmailSender />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;