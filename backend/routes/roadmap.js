const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// GET /api/roadmap - list all sessions grouped/ordered by roadmap_name
router.get('/', (req, res) => {
  const sessions = req.db.prepare('SELECT * FROM roadmap ORDER BY roadmap_name, session_number').all();
  res.json(sessions);
});

// GET /api/roadmap/list - get unique roadmap names
router.get('/list', (req, res) => {
  const names = req.db.prepare('SELECT DISTINCT roadmap_name FROM roadmap').all();
  res.json(names.map(n => n.roadmap_name));
});

// GET /api/roadmap/:id
router.get('/:id', (req, res) => {
  const session = req.db.prepare('SELECT * FROM roadmap WHERE id = ?').get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

const { rewardXP } = require('../services/gamification');

// POST /api/roadmap/:id/complete — mark session as complete and unlock next
router.post('/:id/complete', requireAuth, (req, res) => {
  const sessionId = parseInt(req.params.id);
  const session = req.db.prepare('SELECT * FROM roadmap WHERE id = ?').get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (!session.unlocked) return res.status(403).json({ error: 'Session is still locked' });

  // Mark this session complete
  req.db.prepare(
    `UPDATE roadmap SET completed = 1, completed_at = datetime('now') WHERE id = ?`
  ).run(sessionId);

  // Award XP to user
  const xpGained = rewardXP(req.db, 'ROADMAP_SESSION_COMPLETE');

  // Unlock the next session
  const nextSession = req.db.prepare(
    'SELECT * FROM roadmap WHERE roadmap_name = ? AND session_number = ?'
  ).get(session.roadmap_name, session.session_number + 1);

  if (nextSession) {
    req.db.prepare('UPDATE roadmap SET unlocked = 1 WHERE id = ?').run(nextSession.id);
  }

  res.json({
    success: true,
    completed_session: session.session_number,
    xp_gained: xpGained,
    next_unlocked: nextSession ? nextSession.session_number : null,
    stage_complete: !nextSession
  });
});

// GET /api/roadmap/questions/:sessionId — get questions for a roadmap session
router.get('/questions/:sessionId', (req, res) => {
  const session = req.db.prepare('SELECT * FROM roadmap WHERE id = ?').get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (!session.unlocked) return res.status(403).json({ error: 'Session is locked. Complete prior sessions first.' });

  // Fetch questions specifically linked to this unique session ID
  const questions = req.db.prepare(
    'SELECT * FROM practice_questions WHERE roadmap_session = ? ORDER BY RANDOM() LIMIT 10'
  ).all(session.session_number);

  // Fallback: if no specific questions, use the old logic but narrowed to the session's skill
  let finalQuestions = questions;
  if (questions.length === 0) {
    finalQuestions = req.db.prepare(
      'SELECT * FROM practice_questions WHERE skill = ? AND difficulty IN (?, ?) ORDER BY RANDOM() LIMIT 10'
    ).all(session.skill, 'A1', 'A2');
  }

  const parsed = finalQuestions.map(q => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null
  }));

  res.json({ session, questions: parsed });
});

module.exports = router;
