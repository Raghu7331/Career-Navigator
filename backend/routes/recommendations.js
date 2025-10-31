const express = require('express');
const { pool } = require('../config/database');
const { verifyUser } = require('../middleware/auth');

const router = express.Router();

// Get Job Recommendations for User
router.get('/', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user profile and skills
    const [users] = await pool.execute(
      'SELECT skills, profile_summary FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const user = users[0];
    const userSkills = user.skills ? JSON.parse(user.skills) : [];

    if (userSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please update your profile with skills to get recommendations'
      });
    }

    // Get all active jobs
    const [jobs] = await pool.execute(
      `SELECT 
        id, title, company, location, experience_level, salary_range,
        description, requirements, skills, job_type, created_at
      FROM jobs 
      WHERE status = "active"
      ORDER BY created_at DESC`
    );

    // Calculate match scores for each job
    const jobsWithScores = jobs.map(job => {
      const jobSkills = job.skills ? JSON.parse(job.skills) : [];
      const matchScore = calculateMatchScore(userSkills, jobSkills, job, user);
      
      return {
        ...job,
        skills: jobSkills,
        matchScore: Math.round(matchScore),
        matchedSkills: jobSkills.filter(skill => 
          userSkills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        )
      };
    });

    // Sort by match score and filter out low scores
    const recommendations = jobsWithScores
      .filter(job => job.matchScore >= 30) // Minimum 30% match
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // Top 20 recommendations

    res.json({
      success: true,
      data: {
        recommendations,
        userSkills,
        totalJobs: jobs.length,
        recommendedJobs: recommendations.length
      }
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job recommendations',
      error: error.message
    });
  }
});

// Helper function to calculate match score
function calculateMatchScore(userSkills, jobSkills, job, user) {
  let score = 0;
  const maxScore = 100;

  // Skills matching (60% of total score)
  if (jobSkills.length > 0 && userSkills.length > 0) {
    const matchedSkills = jobSkills.filter(jobSkill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    const skillsScore = (matchedSkills.length / jobSkills.length) * 60;
    score += skillsScore;
  }

  // Title/Description keyword matching (25% of total score)
  if (user.profile_summary) {
    const summaryWords = user.profile_summary.toLowerCase().split(' ');
    const jobDescription = (job.title + ' ' + job.description).toLowerCase();
    
    let keywordMatches = 0;
    const relevantWords = summaryWords.filter(word => word.length > 3);
    
    relevantWords.forEach(word => {
      if (jobDescription.includes(word)) {
        keywordMatches++;
      }
    });
    
    if (relevantWords.length > 0) {
      const keywordScore = Math.min((keywordMatches / relevantWords.length) * 25, 25);
      score += keywordScore;
    }
  }

  // Experience level bonus (10% of total score)
  const experienceLevels = {
    'Entry Level': 1,
    'Junior': 2,
    'Mid Level': 3,
    'Senior': 4,
    'Lead': 5
  };

  // Assume user has mid-level experience if not specified
  const userExperienceLevel = 3;
  const jobExperienceLevel = experienceLevels[job.experience_level] || 3;
  
  if (Math.abs(userExperienceLevel - jobExperienceLevel) <= 1) {
    score += 10;
  } else if (Math.abs(userExperienceLevel - jobExperienceLevel) <= 2) {
    score += 5;
  }

  // Recency bonus (5% of total score)
  const jobAge = Math.floor((Date.now() - new Date(job.created_at)) / (1000 * 60 * 60 * 24));
  if (jobAge <= 7) {
    score += 5; // New jobs get bonus
  } else if (jobAge <= 30) {
    score += 2;
  }

  return Math.min(score, maxScore);
}

// Get Job Recommendations by Skills
router.get('/by-skills', verifyUser, async (req, res) => {
  try {
    const { skills } = req.query;
    
    if (!skills) {
      return res.status(400).json({
        success: false,
        message: 'Skills parameter is required'
      });
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());

    // Get jobs that match any of the specified skills
    const [jobs] = await pool.execute(
      `SELECT 
        id, title, company, location, experience_level, salary_range,
        description, skills, job_type, created_at
      FROM jobs 
      WHERE status = "active"
      ORDER BY created_at DESC`
    );

    const matchingJobs = jobs
      .map(job => {
        const jobSkills = job.skills ? JSON.parse(job.skills) : [];
        const matchedSkills = jobSkills.filter(jobSkill => 
          skillsArray.some(userSkill => 
            userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );

        return {
          ...job,
          skills: jobSkills,
          matchedSkills,
          matchScore: matchedSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 0
        };
      })
      .filter(job => job.matchedSkills.length > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: {
        jobs: matchingJobs,
        searchSkills: skillsArray,
        totalMatches: matchingJobs.length
      }
    });

  } catch (error) {
    console.error('Get skills-based recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill-based recommendations',
      error: error.message
    });
  }
});

// Save Job (Bookmark)
router.post('/:jobId/save', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    // Check if job exists
    const [jobs] = await pool.execute(
      'SELECT id FROM jobs WHERE id = ? AND status = "active"',
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Create a "saved" application status
    const [existing] = await pool.execute(
      'SELECT id FROM job_applications WHERE user_id = ? AND job_id = ?',
      [userId, jobId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved or applied'
      });
    }

    await pool.execute(
      'INSERT INTO job_applications (user_id, job_id, status, notes) VALUES (?, ?, ?, ?)',
      [userId, jobId, 'saved', 'Job saved for later']
    );

    res.status(201).json({
      success: true,
      message: 'Job saved successfully'
    });

  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save job',
      error: error.message
    });
  }
});

// Get Saved Jobs
router.get('/saved/my', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const [savedJobs] = await pool.execute(
      `SELECT 
        j.id, j.title, j.company, j.location, j.salary_range,
        j.skills, ja.applied_at as saved_at
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.user_id = ? AND ja.status = 'saved' AND j.status = 'active'
      ORDER BY ja.applied_at DESC`,
      [userId]
    );

    const jobsWithParsedSkills = savedJobs.map(job => ({
      ...job,
      skills: job.skills ? JSON.parse(job.skills) : []
    }));

    res.json({
      success: true,
      data: jobsWithParsedSkills
    });

  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved jobs',
      error: error.message
    });
  }
});

module.exports = router;