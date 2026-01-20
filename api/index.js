// Combined Express app for Vercel serverless deployment
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/profile', require('../backend/routes/profile'));
app.use('/api/tasks', require('../backend/routes/tasks'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serverless API running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Mongoose connection caching for serverless
let conn = null;
async function connectDB() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/primetrade');
  }
  return conn;
}

module.exports = async (req, res) => {
  await connectDB();
  app(req, res);
};
