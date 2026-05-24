require("dotenv").config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const bloodRequestRoutes = require("./routes/bloodRequest");
const messageRoutes = require("./routes/messages");
const userRoutes = require('./routes/users');
const announcementRoutes = require('./routes/announcements');
const analyzeRoutes = require("./routes/analyze");

const app = express();

const MONGO_URI = process.env.MONGO_URI;
const DB_STATE = ['disconnected', 'connected', 'connecting', 'disconnecting'];

/* Middleware */
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* Routes */
app.get('/', (req, res) => {
  res.send('VitalLink Backend API is running perfectly!');
});

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    api: 'ok',
    database: DB_STATE[dbState] || 'unknown',
    mongoConfigured: Boolean(MONGO_URI),
    aiServiceConfigured: Boolean(process.env.AI_SERVICE_URL),
    aiServiceUrl: process.env.AI_SERVICE_URL
      ? process.env.AI_SERVICE_URL.replace(/\/analyze\/?$/, '') + '/analyze'
      : null,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', bloodRequestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/analyze', analyzeRoutes);

/* Serve frontend HTML when backend URL is used (fallback for misconfigured static deploy) */
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('/donate', (req, res) => {
    res.sendFile(path.join(frontendPath, 'donate.html'));
  });
}

/* MongoDB */
if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI is not set. Auth and database routes will fail until it is configured.');
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err.message));
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!MONGO_URI) {
    console.warn('Set MONGO_URI in Render environment variables and redeploy.');
  }
  if (!process.env.AI_SERVICE_URL) {
    console.warn('AI_SERVICE_URL not set — donor image analysis will use localhost (won\'t work on Render).');
  }
});
