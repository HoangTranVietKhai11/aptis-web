const express = require('express');
const router = express.Router();
const { getRank } = require('../services/gamification');
const { requireAuth } = require('../middleware/auth');

// GET /api/gamification/leaderboard
router.get('/leaderboard', (req, res) => {
  const users = req.db.prepare(`
    SELECT id, name, xp FROM users 
    WHERE role = 'user' 
    ORDER BY xp DESC 
    LIMIT 10
  `).all();
  
  const leaderboard = users.map((u, index) => ({
    ...u,
    rank: index + 1,
    level: getRank(u.xp)
  }));
  
  res.json(leaderboard);
});

// GET /api/gamification/stats
router.get('/stats', requireAuth, (req, res) => {
  const user = req.db.prepare('SELECT id, name, xp FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  // Get current streak from daily_stats
  const today = new Date().toISOString().split('T')[0];
  const stats = req.db.prepare('SELECT streak_count FROM daily_stats WHERE date = ?').get(today);
  
  res.json({
    xp: user.xp || 0,
    level: getRank(user.xp || 0),
    streak: stats ? stats.streak_count : 0
  });
});

module.exports = router;
