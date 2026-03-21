const express = require('express');
const router = express.Router();
const { analyzeResponse } = require('../services/ai');
const { rewardXP } = require('../services/gamification');
const { updateDailyStreak } = require('../services/streaks');

// POST /api/mocktest - create a new mock test
router.post('/', async (req, res) => {
  try {
    const { title = 'APTIS B2 Mock Test' } = req.body;

    const result = await req.db.query(
      "INSERT INTO mock_tests (title, status, started_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id",
      [title, 'in_progress']
    );

    const testId = result.rows[0].id;

    const skills = req.body.skill ? [req.body.skill] : ['grammar', 'reading', 'listening', 'writing', 'speaking'];
    
    const questions = [];
    for (const s of skills) {
      const qsResult = await req.db.query(
        'SELECT id FROM practice_questions WHERE skill = $1 ORDER BY RANDOM() LIMIT 5',
        [s]
      );
      const qs = qsResult.rows;
      for (const q of qs) {
        await req.db.query(
          'INSERT INTO mock_test_questions (mock_test_id, question_id) VALUES ($1, $2)',
          [testId, q.id]
        );
        questions.push(q.id);
      }
    }

    res.json({ id: testId, title, question_count: questions.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/mocktest/:id
router.get('/:id', async (req, res) => {
  try {
    const tResult = await req.db.query('SELECT * FROM mock_tests WHERE id = $1', [req.params.id]);
    const test = tResult.rows[0];
    if (!test) return res.status(404).json({ error: 'Mock test not found' });

    const qResult = await req.db.query(`
      SELECT mtq.id as mtq_id, mtq.user_answer, mtq.is_correct,
             pq.id, pq.skill, pq.type, pq.question, pq.options, pq.correct_answer, pq.explanation
      FROM mock_test_questions mtq
      JOIN practice_questions pq ON mtq.question_id = pq.id
      WHERE mtq.mock_test_id = $1
      ORDER BY pq.skill
    `, [req.params.id]);
    
    const questions = qResult.rows;

    const parsed = questions.map(q => ({
      ...q,
      options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : null
    }));

    res.json({ ...test, questions: parsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/mocktest/:id/answer
router.post('/:id/answer', async (req, res) => {
  try {
    const { mtq_id, answer } = req.body;

    const result = await req.db.query(`
      SELECT mtq.*, pq.correct_answer, pq.explanation, pq.skill, pq.question
      FROM mock_test_questions mtq
      JOIN practice_questions pq ON mtq.question_id = pq.id
      WHERE mtq.id = $1
    `, [mtq_id]);
    const mtq = result.rows[0];

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

    await req.db.query(
      'UPDATE mock_test_questions SET user_answer = $1, is_correct = $2, score = $3, ai_feedback = $4 WHERE id = $5',
      [answer, is_correct, score, ai_feedback, mtq_id]
    );

    // Reward XP
    try {
      await rewardXP(req.db, is_correct === 1 ? 'MOCK_CORRECT' : 'MOCK_ATTEMPT');
    } catch (xpErr) { console.error('XP Error:', xpErr); }

    // Update Daily Streak
    try {
      await updateDailyStreak(req.db);
    } catch (streakErr) { console.error('Streak Error:', streakErr); }

    res.json({
      is_correct: is_correct === 1,
      correct_answer: mtq.correct_answer,
      explanation: mtq.explanation
    });
  } catch (err) {
    console.error('Fatal Mock Answer Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/mocktest/:id/complete
router.post('/:id/complete', async (req, res) => {
  try {
    const qResult = await req.db.query(
      'SELECT score, is_correct FROM mock_test_questions WHERE mock_test_id = $1',
      [req.params.id]
    );
    const questions = qResult.rows;

    const totalPossible = questions.length * 50;
    const totalScore = questions.reduce((acc, q) => acc + (q.score || 0), 0);
    const scorePercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

    await req.db.query(
      "UPDATE mock_tests SET status = $1, score = $2, completed_at = CURRENT_TIMESTAMP WHERE id = $3",
      ['completed', scorePercentage, req.params.id]
    );

    // Reward XP
    await rewardXP(req.db, 'MOCK_TEST_COMPLETE');

    res.json({ 
      score: scorePercentage, 
      total: questions.length, 
      correct: questions.filter(q => q.is_correct === 1).length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/mocktest - list all tests
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM mock_tests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
