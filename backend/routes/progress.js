const express = require('express');
const router = express.Router();

// GET /api/progress - overall progress
router.get('/', async (req, res) => {
  try {
    const statsResult = await req.db.query(`
      SELECT skill,
             SUM(total_questions) as total_questions,
             SUM(correct_answers) as correct_answers,
             ROUND(CASE WHEN SUM(total_questions) > 0
               THEN (SUM(correct_answers) * 100.0 / SUM(total_questions))
               ELSE 0 END, 1) as accuracy
      FROM progress
      GROUP BY skill
    `);

    const overallResult = await req.db.query(`
      SELECT SUM(total_questions) as total_questions,
             SUM(correct_answers) as correct_answers,
             ROUND(CASE WHEN SUM(total_questions) > 0
               THEN (SUM(correct_answers) * 100.0 / SUM(total_questions))
               ELSE 0 END, 1) as accuracy
      FROM progress
    `);

    res.json({ skills: statsResult.rows, overall: overallResult.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/history?days=30
router.get('/history', async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const historyResult = await req.db.query(`
      SELECT session_date, skill,
             total_questions, correct_answers,
             ROUND(CASE WHEN total_questions > 0
               THEN (correct_answers * 100.0 / total_questions)
               ELSE 0 END, 1) as accuracy
      FROM progress
      WHERE session_date >= CURRENT_DATE - ($1 * INTERVAL '1 day')
      ORDER BY session_date ASC
    `, [days]);

    res.json(historyResult.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/roadmap
router.get('/roadmap', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM roadmap ORDER BY session_number ASC');
    const sessions = result.rows;
    const completed = sessions.filter(s => s.completed === 1).length;
    res.json({ sessions, total: sessions.length, completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/progress/roadmap/:id/toggle
router.post('/roadmap/:id/toggle', async (req, res) => {
  try {
    const sResult = await req.db.query('SELECT * FROM roadmap WHERE id = $1', [req.params.id]);
    const session = sResult.rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const newVal = session.completed === 1 ? 0 : 1;
    await req.db.query('UPDATE roadmap SET completed = $1 WHERE id = $2', [newVal, req.params.id]);
    res.json({ id: session.id, completed: newVal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/mock-tests
router.get('/mock-tests', async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT * FROM mock_tests WHERE status = $1 ORDER BY completed_at DESC',
      ['completed']
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/progress/stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await req.db.query('SELECT * FROM daily_stats WHERE date = $1', [today]);
    let stats = result.rows[0];

    if (!stats) {
      const lastResult = await req.db.query('SELECT streak_count FROM daily_stats ORDER BY date DESC LIMIT 1');
      const last = lastResult.rows[0];
      stats = {
        questions_answered: 0,
        target_questions: 20,
        streak_count: last ? last.streak_count : 0
      };
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
