const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 1. Configure where and how to save the video
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Use your existing uploads folder
  },
  filename: (req, file, cb) => {
    // Give it a unique name using the current timestamp
    const uniqueName = `interview-${Date.now()}${path.extname(file.originalname) || '.webm'}`;
    cb(null, uniqueName);
  }
});

// 2. Initialize Multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Limit: 50MB per video
});

// 3. The Upload Endpoint
// 'video' must match the key name we use in React's FormData
router.post('/video', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file received.' });
    }

    res.status(200).json({
      message: 'Video uploaded and saved successfully!',
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: 'Server error during video upload.' });
  }
});

module.exports = router;