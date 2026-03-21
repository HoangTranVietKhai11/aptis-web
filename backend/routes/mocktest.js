const express = require('express');
const router = express.Router();

// POST /api/mocktest - create a new mock test
router.post('/', (req, res) => {
  const { title = 'APTIS B2 Mock Test' } = req.body;

  const result = req.db.prepare(
    "INSERT INTO mock_tests (title, status, started_at) VALUES (?, ?, datetime('now'))"
  ).run(title, 'in_progress');

  const testId = result.lastInsertRowid;

  const skills = req.body.skill ? [req.body.skill] : ['grammar', 'reading', 'listening', 'writing', 'speaking'];
  const insertMTQ = req.db.prepare(
    'INSERT INTO mock_test_questions (mock_test_id, question_id) VALUES (?, ?)'
  );

  const questions = [];
  for (const s of skills) {
    const qs = req.db.prepare(
      'SELECT id FROM practice_questions WHERE skill = ? ORDER BY RANDOM() LIMIT 5'
    ).all(s);
    for (const q of qs) {
      insertMTQ.run(testId, q.id);
      questions.push(q.id);
    }
  }

  res.json({ id: testId, title, question_count: questions.length });
});

// GET /api/mocktest/:id
router.get('/:id', (req, res) => {
  const test = req.db.prepare('SELECT * FROM mock_tests WHERE id = ?').get(req.params.id);
  if (!test) return res.status(404).json({ error: 'Mock test not found' });

  const questions = req.db.prepare(`
    SELECT mtq.id as mtq_id, mtq.user_answer, mtq.is_correct,
           pq.id, pq.skill, pq.type, pq.question, pq.options, pq.correct_answer, pq.explanation, pq.transcript
    FROM mock_test_questions mtq
    JOIN practice_questions pq ON mtq.question_id = pq.id
    WHERE mtq.mock_test_id = ?
    ORDER BY pq.skill
  `).all(req.params.id);

  const parsed = questions.map(q => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null
  }));

  res.json({ ...test, questions: parsed });
});

const { analyzeResponse } = require('../services/ai');
const { rewardXP } = require('../services/gamification');

// POST /api/mocktest/:id/answer
router.post('/:id/answer', async (req, res) => {
  try {
    const { mtq_id, answer } = req.body;

    const mtq = req.db.prepare(`
      SELECT mtq.*, pq.correct_answer, pq.explanation, pq.skill, pq.question, pq.transcript
      FROM mock_test_questions mtq
      JOIN practice_questions pq ON mtq.question_id = pq.id
      WHERE mtq.id = ?
    `).get(mtq_id);

    if (!mtq) return res.status(404).json({ error: 'Question not found' });

    let is_correct = mtq.correct_answer ? (answer === mtq.correct_answer ? 1 : 0) : null;
    let ai_feedback = null;
    let score = is_correct === 1 ? 50 : 0;

    if (mtq.skill === 'writing' || mtq.skill === 'speaking') {
      try {
        const analysis = await analyzeResponse(mtq.question, answer, mtq.skill);
        score = analysis.score;
        ai_feedback = JSON.stringify(analysis);
        is_correct = score >= 35 ? 1 : 0;
      } catch (aiErr) {
        console.error('AI Mock Error:', aiErr);
      }
    }

    req.db.prepare(
      'UPDATE mock_test_questions SET user_answer = ?, is_correct = ?, score = ?, ai_feedback = ? WHERE id = ?'
    ).run(answer, is_correct, score, ai_feedback, mtq_id);

    // Reward XP
    try {
      rewardXP(req.db, is_correct === 1 ? 'MOCK_CORRECT' : 'MOCK_ATTEMPT');
    } catch (xpErr) { console.error('XP Error:', xpErr); }

    // Update Daily Streak
    try {
      updateDailyStreak(req.db);
    } catch (streakErr) { console.error('Streak Error:', streakErr); }

    res.json({
      is_correct: is_correct === 1,
      correct_answer: mtq.correct_answer,
      explanation: mtq.explanation
    });
  } catch (err) {
    console.error('Fatal Mock Answer Error:', err);
    res.status(500).json({ error: 'Internal server error occurred while processing your test answer.' });
  }
});

// POST /api/mocktest/:id/complete
router.post('/:id/complete', (req, res) => {
  const questions = req.db.prepare(
    'SELECT score, is_correct FROM mock_test_questions WHERE mock_test_id = ?'
  ).all(req.params.id);

  const totalPossible = questions.length * 50;
  const totalScore = questions.reduce((acc, q) => acc + (q.score || 0), 0);
  const scorePercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  req.db.prepare(
    "UPDATE mock_tests SET status = ?, score = ?, completed_at = datetime('now') WHERE id = ?"
  ).run('completed', scorePercentage, req.params.id);

  // Reward XP
  rewardXP(req.db, 'MOCK_TEST_COMPLETE');

  res.json({ score: scorePercentage, total: questions.length, correct: questions.filter(q => q.is_correct === 1).length });
});

// GET /api/mocktest - list all tests
router.get('/', (req, res) => {
  const tests = req.db.prepare('SELECT * FROM mock_tests ORDER BY created_at DESC').all();
  res.json(tests);
});

module.exports = router;
