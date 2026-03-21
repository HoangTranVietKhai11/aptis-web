const express = require('express');
const router = express.Router();
const { analyzeResponse } = require('../services/ai');
const { updateDailyStreak } = require('../services/streaks');
const { rewardXP } = require('../services/gamification');

// GET /api/practice?skill=grammar&limit=10
router.get('/', async (req, res) => {
  const { skill, difficulty, limit = 10 } = req.query;
  let query = 'SELECT * FROM practice_questions';
  const conditions = [];
  const queryParams = [];

  if (skill) {
    if (skill.startsWith('grammar_')) {
      conditions.push('skill = $1');
      queryParams.push('grammar');
      conditions.push('explanation LIKE $2');
      queryParams.push('%[' + skill + ']%');
    } else {
      conditions.push('skill = $1');
      queryParams.push(skill);
    }
  }
  
  const difficultyIdx = queryParams.length + 1;
  if (difficulty) {
    conditions.push(`difficulty = $${difficultyIdx}`);
    queryParams.push(difficulty);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const limitIdx = queryParams.length + 1;
  query += ` ORDER BY RANDOM() LIMIT $${limitIdx}`;
  queryParams.push(Number(limit));

  try {
    const result = await req.db.query(query, queryParams);
    const questions = result.rows;
    
    // Parse options JSON
    const parsed = questions.map(q => ({
      ...q,
      options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : null
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/practice/skills
router.get('/skills', async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT skill, COUNT(*) as count FROM practice_questions GROUP BY skill'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/practice/answer
router.post('/answer', async (req, res) => {
  try {
    const { question_id, answer } = req.body;
    if (!question_id || answer === undefined) {
      return res.status(400).json({ error: 'question_id and answer are required' });
    }

    const qResult = await req.db.query('SELECT * FROM practice_questions WHERE id = $1', [question_id]);
    const question = qResult.rows[0];
    if (!question) return res.status(404).json({ error: 'Question not found' });

    let is_correct = question.correct_answer ? (answer === question.correct_answer ? 1 : 0) : null;
    let ai_feedback = null;
    let score = is_correct === 1 ? 50 : 0;

    // AI Analysis for Writing/Speaking
    if (question.skill === 'writing' || question.skill === 'speaking') {
      try {
        const analysis = await analyzeResponse(question.question, answer, question.skill);
        score = analysis.score;
        ai_feedback = JSON.stringify(analysis);
        is_correct = score >= 35 ? 1 : 0;
      } catch (aiErr) {
        console.error('AI Practice Error:', aiErr);
      }
    }

    // Reward XP
    let xpEarned = 0;
    try {
      xpEarned = is_correct === 1 
        ? await rewardXP(req.db, 'PRACTICE_CORRECT') 
        : await rewardXP(req.db, 'PRACTICE_ATTEMPT');
    } catch (xpErr) { console.error('XP Error:', xpErr); }

    await req.db.query(
      'INSERT INTO user_answers (question_id, answer, is_correct, score, ai_feedback) VALUES ($1, $2, $3, $4, $5)',
      [question_id, answer, is_correct, score, ai_feedback]
    );

    // Update Daily Streak
    try {
      await updateDailyStreak(req.db);
    } catch (streakErr) { console.error('Streak Error:', streakErr); }

    // Update progress
    const today = new Date().toISOString().split('T')[0];
    const progResult = await req.db.query(
      'SELECT * FROM progress WHERE skill = $1 AND session_date = $2',
      [question.skill, today]
    );
    const existing = progResult.rows[0];

    if (existing) {
      await req.db.query(
        'UPDATE progress SET total_questions = total_questions + 1, correct_answers = correct_answers + COALESCE($1, 0) WHERE id = $2',
        [is_correct, existing.id]
      );
    } else {
      await req.db.query(
        'INSERT INTO progress (skill, total_questions, correct_answers, session_date) VALUES ($1, 1, COALESCE($2, 0), $3)',
        [question.skill, is_correct, today]
      );
    }

    res.json({
      is_correct: is_correct === 1,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      score: score,
      ai_feedback: ai_feedback,
      user_answer: answer,
      xp_earned: xpEarned
    });
  } catch (err) {
    console.error('Fatal Answer Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
