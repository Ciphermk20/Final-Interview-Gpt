const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Load environment variables
dotenv.config();

// 2. Connect to MongoDB
connectDB();

// 3. Initialize Express app
const app = express();

// 4. Middleware
app.use(cors()); 
app.use(express.json());

// 5. Basic test route
app.get('/', (req, res) => {
  res.send('InterviewGPT API is running...');
});

// --- API ROUTES ---

// Auth Routes (Login/Signup)
app.use('/api/auth', require('./routes/authRoutes'));

// Gemini AI Interview Routes (Evaluation)
app.use('/api/interview', require('./routes/interviewRoutes')); 

// NEW: Video Upload Routes (Camera Module)
app.use('/api/upload', require('./routes/uploadRoutes')); 

// 6. Define Port and Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});