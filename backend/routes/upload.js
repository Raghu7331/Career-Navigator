const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/database');
const { verifyUser } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/resumes');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only PDF and DOC/DOCX files
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOC/DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

// Upload Resume
router.post('/upload', verifyUser, (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    try {
      const userId = req.user.id;
      const file = req.file;

      // Delete existing resume files for this user
      const [existingFiles] = await pool.execute(
        'SELECT file_path FROM resume_files WHERE user_id = ?',
        [userId]
      );

      // Delete physical files
      existingFiles.forEach(fileRecord => {
        const fullPath = path.join(__dirname, '..', fileRecord.file_path);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      // Delete database records
      await pool.execute('DELETE FROM resume_files WHERE user_id = ?', [userId]);

      // Save new file info to database
      const relativePath = `uploads/resumes/${file.filename}`;
      
      const [result] = await pool.execute(
        `INSERT INTO resume_files 
        (user_id, filename, original_name, file_path, file_size, mime_type) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId, file.filename, file.originalname, 
          relativePath, file.size, file.mimetype
        ]
      );

      res.json({
        success: true,
        message: 'Resume uploaded successfully',
        data: {
          fileId: result.insertId,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          uploadedAt: new Date()
        }
      });

    } catch (error) {
      // Delete uploaded file if database operation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.error('Resume upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save resume',
        error: error.message
      });
    }
  });
});

// Get User's Resume Info
router.get('/my', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const [files] = await pool.execute(
      `SELECT id, filename, original_name, file_size, mime_type, uploaded_at
      FROM resume_files 
      WHERE user_id = ? 
      ORDER BY uploaded_at DESC 
      LIMIT 1`,
      [userId]
    );

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No resume found'
      });
    }

    res.json({
      success: true,
      data: files[0]
    });

  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume info',
      error: error.message
    });
  }
});

// Download Resume
router.get('/download/:fileId', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.fileId;

    const [files] = await pool.execute(
      'SELECT filename, original_name, file_path, mime_type FROM resume_files WHERE id = ? AND user_id = ?',
      [fileId, userId]
    );

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found'
      });
    }

    const file = files[0];
    const filePath = path.join(__dirname, '..', file.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Physical file not found'
      });
    }

    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resume',
      error: error.message
    });
  }
});

// Delete Resume
router.delete('/:fileId', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.fileId;

    const [files] = await pool.execute(
      'SELECT file_path FROM resume_files WHERE id = ? AND user_id = ?',
      [fileId, userId]
    );

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found'
      });
    }

    const file = files[0];
    const filePath = path.join(__dirname, '..', file.file_path);

    // Delete physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await pool.execute('DELETE FROM resume_files WHERE id = ? AND user_id = ?', [fileId, userId]);

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });

  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error.message
    });
  }
});

module.exports = router;