require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.error('FATAL UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('FATAL UNHANDLED REJECTION:', reason);
});

const { initDatabase, pool } = require('./database/init');
// We will refactor seedDatabase to be async later or skipped for now
// const { seedDatabase } = require('./database/seed');

const practiceRoutes = require('./routes/practice');
const mocktestRoutes = require('./routes/mocktest');
const vocabularyRoutes = require('./routes/vocabulary');
const progressRoutes = require('./routes/progress');
const roadmapRoutes = require('./routes/roadmap');
const gamificationRoutes = require('./routes/gamification');
const aiRoutes = require('./routes/ai');
const importRoutes = require('./routes/import');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const ttsRoutes = require('./routes/tts');
const listeningRoutes = require('./routes/listening');
const videoRoutes = require('./routes/videos');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Global logic state
let dbPool = null;

// Async init wrapper
async function startServer() {
  try {
    console.log('⏳ Connecting to Supabase...');
    dbPool = await initDatabase();
    console.log('✅ Connected to Supabase (PostgreSQL)');

    // Make db pool available to routes
    app.use((req, res, next) => {
      req.db = dbPool;
      next();
    });

    // Identifiable header & logger
    app.use((req, res, next) => {
      res.setHeader('X-Backend-Id', 'APTIS-PRO-CLOUD');
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });

    // Test route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'Cloud Backend is reachable', status: 'connected' });
    });

    // Static files for Frontend Production Build
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/practice', practiceRoutes);
    app.use('/api/mocktest', mocktestRoutes);
    app.use('/api/vocabulary', vocabularyRoutes);
    app.use('/api/progress', progressRoutes);
    app.use('/api/roadmap', roadmapRoutes);
    app.use('/api/gamification', gamificationRoutes);
    app.use('/api/ai', aiRoutes);
    app.use('/api/import', importRoutes);
    app.use('/api/tts', ttsRoutes);
    app.use('/api/listening', listeningRoutes);
    app.use('/api/videos', videoRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', database: 'connected' });
    });

    // SPA Catch-all
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('GLOBAL ERROR:', err);
      res.status(500).json({ error: 'Server error: ' + err.message });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 APTIS Cloud Backend running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
