const express = require('express');
const router = express.Router();

// GET /api/progress - overall progress
router.get('/', (req, res) => {
  const stats = req.db.prepare(`
    SELECT skill,
           SUM(total_questions) as total_questions,
           SUM(correct_answers) as correct_answers,
           ROUND(CASE WHEN SUM(total_questions) > 0
             THEN (SUM(correct_answers) * 100.0 / SUM(total_questions))
             ELSE 0 END, 1) as accuracy
    FROM progress
    GROUP BY skill
  `).all();

  const overall = req.db.prepare(`
    SELECT SUM(total_questions) as total_questions,
           SUM(correct_answers) as correct_answers,
           ROUND(CASE WHEN SUM(total_questions) > 0
             THEN (SUM(correct_answers) * 100.0 / SUM(total_questions))
             ELSE 0 END, 1) as accuracy
    FROM progress
  `).get();

  res.json({ skills: stats, overall });
});

// GET /api/progress/history?days=30
router.get('/history', (req, res) => {
  const days = Number(req.query.days) || 30;
  const history = req.db.prepare(`
    SELECT session_date, skill,
           total_questions, correct_answers,
           ROUND(CASE WHEN total_questions > 0
             THEN (correct_answers * 100.0 / total_questions)
             ELSE 0 END, 1) as accuracy
    FROM progress
    WHERE session_date >= date('now', '-' || ? || ' days')
    ORDER BY session_date ASC
  `).all(days);

  res.json(history);
});

// GET /api/progress/roadmap
router.get('/roadmap', (req, res) => {
  const sessions = req.db.prepare('SELECT * FROM roadmap ORDER BY session_number ASC').all();
  const completed = sessions.filter(s => s.completed === 1).length;
  res.json({ sessions, total: sessions.length, completed });
});

// POST /api/progress/roadmap/:id/toggle
router.post('/roadmap/:id/toggle', (req, res) => {
  const session = req.db.prepare('SELECT * FROM roadmap WHERE id = ?').get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const newVal = session.completed === 1 ? 0 : 1;
  req.db.prepare('UPDATE roadmap SET completed = ? WHERE id = ?').run(newVal, req.params.id);
  res.json({ id: session.id, completed: newVal });
});

// GET /api/progress/mock-tests
router.get('/mock-tests', (req, res) => {
  const tests = req.db.prepare(
    'SELECT * FROM mock_tests WHERE status = ? ORDER BY completed_at DESC'
  ).all('completed');
  res.json(tests);
});

// GET /api/progress/stats
router.get('/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const stats = req.db.prepare('SELECT * FROM daily_stats WHERE date = ?').get(today) || {
    questions_answered: 0,
    target_questions: 20,
    streak_count: 0
  };
  
  // If no stats today, check last streak
  if (stats.streak_count === 0) {
    const last = req.db.prepare('SELECT streak_count FROM daily_stats ORDER BY date DESC LIMIT 1').get();
    if (last) stats.streak_count = last.streak_count;
  }

  res.json(stats);
});

module.exports = router;
