const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { rewardXP } = require('../services/gamification');

// GET /api/roadmap - list all sessions
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM roadmap ORDER BY roadmap_name, session_number');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/roadmap/list - get unique roadmap names
router.get('/list', async (req, res) => {
  try {
    const result = await req.db.query('SELECT DISTINCT roadmap_name FROM roadmap');
    res.json(result.rows.map(n => n.roadmap_name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/roadmap/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM roadmap WHERE id = $1', [req.params.id]);
    const session = result.rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/roadmap/:id/complete
router.post('/:id/complete', requireAuth, async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const result = await req.db.query('SELECT * FROM roadmap WHERE id = $1', [sessionId]);
    const session = result.rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!session.unlocked) return res.status(403).json({ error: 'Session is still locked' });

    // Mark complete
    await req.db.query(
      `UPDATE roadmap SET completed = 1, completed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [sessionId]
    );

    // Award XP
    const xpGained = await rewardXP(req.db, 'ROADMAP_SESSION_COMPLETE');

    // Unlock next
    const nextResult = await req.db.query(
      'SELECT * FROM roadmap WHERE roadmap_name = $1 AND session_number = $2',
      [session.roadmap_name, session.session_number + 1]
    );
    const nextSession = nextResult.rows[0];

    if (nextSession) {
      await req.db.query('UPDATE roadmap SET unlocked = 1 WHERE id = $1', [nextSession.id]);
    }

    res.json({
      success: true,
      completed_session: session.session_number,
      xp_gained: xpGained,
      next_unlocked: nextSession ? nextSession.session_number : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/roadmap/questions/:sessionId
router.get('/questions/:sessionId', async (req, res) => {
  try {
    const sResult = await req.db.query('SELECT * FROM roadmap WHERE id = $1', [req.params.sessionId]);
    const session = sResult.rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!session.unlocked) return res.status(403).json({ error: 'Session is locked' });

    const qResult = await req.db.query(
      'SELECT * FROM practice_questions WHERE roadmap_session = $1 ORDER BY RANDOM() LIMIT 10',
      [session.session_number]
    );
    let finalQuestions = qResult.rows;

    if (finalQuestions.length === 0) {
      const fbResult = await req.db.query(
        'SELECT * FROM practice_questions WHERE skill = $1 AND difficulty IN ($2, $3) ORDER BY RANDOM() LIMIT 10',
        [session.skill, 'A1', 'A2']
      );
      finalQuestions = fbResult.rows;
    }

    const parsed = finalQuestions.map(q => ({
      ...q,
      options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : null
    }));

    res.json({ session, questions: parsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
