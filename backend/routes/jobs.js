const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const JobModel = require('../models/Job');
const JobApplicationModel = require('../models/JobApplication');

const router = express.Router();

// Create Job (Admin only)
router.post('/', verifyAdmin, [
  body('title').notEmpty().withMessage('Job title is required'),
  body('company').notEmpty().withMessage('Company name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('description').notEmpty().withMessage('Job description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title, company, location, experience_level, salary_range,
      description, requirements, skills, job_type, status
    } = req.body;

    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      // MongoDB
      const job = new JobModel({
        title,
        company,
        location,
        experience_level: experience_level || 'Entry Level',
        salary_range,
        description,
        requirements,
        skills: Array.isArray(skills) ? skills : [],
        job_type: job_type || 'Full-time',
        status: status || 'active',
        created_by: req.admin.id
      });

      await job.save();

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: {
          jobId: job._id,
          job
        }
      });
    } else {
      // MySQL
      const [result] = await pool.execute(
        `INSERT INTO jobs 
        (title, company, location, experience_level, salary_range, description, 
         requirements, skills, job_type, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, company, location, experience_level, salary_range,
          description, requirements, JSON.stringify(skills || []),
          job_type || 'Full-time', req.admin.id
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: {
          jobId: result.insertId
        }
      });
    }

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
});

// Get All Jobs (Public + Pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const location = req.query.location || '';
    const experience = req.query.experience || '';

    let jobs, totalJobs;

    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      // MongoDB
      const skip = (page - 1) * limit;
      let query = { status: 'active' };

      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { company: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ];
      }

      if (location) {
        query.location = new RegExp(location, 'i');
      }

      if (experience) {
        query.experience_level = experience;
      }

      jobs = await JobModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      totalJobs = await JobModel.countDocuments(query);
    } else {
      // MySQL
      const offset = (page - 1) * limit;
      let whereConditions = ['status = "active"'];
      let queryParams = [];

      if (search) {
        whereConditions.push('(title LIKE ? OR company LIKE ? OR description LIKE ?)');
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (location) {
        whereConditions.push('location LIKE ?');
        queryParams.push(`%${location}%`);
      }

      if (experience) {
        whereConditions.push('experience_level = ?');
        queryParams.push(experience);
      }

      const whereClause = whereConditions.join(' AND ');

      const [jobsResult] = await pool.execute(
        `SELECT 
          id, title, company, location, experience_level, salary_range,
          description, requirements, skills, job_type, created_at
        FROM jobs 
        WHERE ${whereClause}
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
      );

      jobs = jobsResult;

      const [totalCount] = await pool.execute(
        `SELECT COUNT(*) as count FROM jobs WHERE ${whereClause}`,
        queryParams
      );

      totalJobs = totalCount[0].count;

      // Parse skills JSON for each job
      jobs = jobs.map(job => ({
        ...job,
        skills: job.skills ? JSON.parse(job.skills) : []
      }));
    }

    res.json({
      success: true,
      data: {
        jobs: jobs,
        pagination: {
          page,
          limit,
          total: totalJobs,
          totalPages: Math.ceil(totalJobs / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
});

// Get Single Job
router.get('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    const [jobs] = await pool.execute(
      `SELECT 
        id, title, company, location, experience_level, salary_range,
        description, requirements, skills, job_type, created_at
      FROM jobs 
      WHERE id = ? AND status = "active"`,
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const job = jobs[0];
    job.skills = job.skills ? JSON.parse(job.skills) : [];

    res.json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
});

// Update Job (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      title, company, location, experience_level, salary_range,
      description, requirements, skills, job_type, status
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE jobs SET 
        title = ?, company = ?, location = ?, experience_level = ?,
        salary_range = ?, description = ?, requirements = ?, skills = ?,
        job_type = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        title, company, location, experience_level, salary_range,
        description, requirements, JSON.stringify(skills || []),
        job_type, status || 'active', jobId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job updated successfully'
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
});

// Delete Job (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const jobId = req.params.id;

    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      // MongoDB - mark as deleted
      const job = await JobModel.findByIdAndUpdate(
        jobId,
        { status: 'deleted' },
        { new: true }
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });
    } else {
      // MySQL - mark as deleted
      const [result] = await pool.execute(
        'UPDATE jobs SET status = "deleted" WHERE id = ?',
        [jobId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });
    }

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
});

// Apply for Job (User only)
router.post('/:id/apply', verifyUser, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const { notes } = req.body;

    // Check if job exists and is active
    const [jobs] = await pool.execute(
      'SELECT id FROM jobs WHERE id = ? AND status = "active"',
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer available'
      });
    }

    // Check if user already applied
    const [existingApplication] = await pool.execute(
      'SELECT id FROM job_applications WHERE user_id = ? AND job_id = ?',
      [userId, jobId]
    );

    if (existingApplication.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    await pool.execute(
      'INSERT INTO job_applications (user_id, job_id, notes) VALUES (?, ?, ?)',
      [userId, jobId, notes || null]
    );

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully'
    });

  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit job application',
      error: error.message
    });
  }
});

// Get User Applications
router.get('/applications/my', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const [applications] = await pool.execute(
      `SELECT 
        ja.id, ja.status, ja.applied_at, ja.notes,
        j.title, j.company, j.location, j.salary_range
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.user_id = ?
      ORDER BY ja.applied_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

module.exports = router;