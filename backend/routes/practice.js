const express = require('express');
const router = express.Router();

// GET /api/practice?skill=grammar&limit=10
router.get('/', (req, res) => {
  const { skill, difficulty, limit = 10 } = req.query;
  let query = 'SELECT * FROM practice_questions';
  const conditions = [];
  const params = [];

  if (skill) {
    if (skill.startsWith('grammar_')) {
      conditions.push('skill = ?');
      params.push('grammar');
      conditions.push('explanation LIKE ?');
      params.push('%[' + skill + ']%');
    } else {
      conditions.push('skill = ?');
      params.push(skill);
    }
  }
  if (difficulty) {
    conditions.push('difficulty = ?');
    params.push(difficulty);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY RANDOM() LIMIT ?';
  params.push(Number(limit));

  const questions = req.db.prepare(query).all(...params);
  // Parse options JSON
  const parsed = questions.map(q => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null
  }));
  res.json(parsed);
});

// GET /api/practice/skills
router.get('/skills', (req, res) => {
  const skills = req.db.prepare(
    'SELECT skill, COUNT(*) as count FROM practice_questions GROUP BY skill'
  ).all();
  res.json(skills);
});

const { analyzeResponse } = require('../services/ai');
const { updateDailyStreak } = require('../services/streaks');
const { rewardXP } = require('../services/gamification');

// POST /api/practice/answer
router.post('/answer', async (req, res) => {
  try {
    const { question_id, answer } = req.body;
    if (!question_id || answer === undefined) {
      return res.status(400).json({ error: 'question_id and answer are required' });
    }

    const question = req.db.prepare('SELECT * FROM practice_questions WHERE id = ?').get(question_id);
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
        // Fallback already handled inside analyzeResponse mostly, but just in case
      }
    }

    // Reward XP
    let xpEarned = 0;
    try {
      xpEarned = is_correct === 1 ? rewardXP(req.db, 'PRACTICE_CORRECT') : rewardXP(req.db, 'PRACTICE_ATTEMPT');
    } catch (xpErr) { console.error('XP Error:', xpErr); }

    req.db.prepare(
      'INSERT INTO user_answers (question_id, answer, is_correct, score, ai_feedback) VALUES (?, ?, ?, ?, ?)'
    ).run(question_id, answer, is_correct, score, ai_feedback);

    // Update Daily Streak
    try {
      updateDailyStreak(req.db);
    } catch (streakErr) { console.error('Streak Error:', streakErr); }

    // Update progress
    const today = new Date().toISOString().split('T')[0];
    const existing = req.db.prepare(
      'SELECT * FROM progress WHERE skill = ? AND session_date = ?'
    ).get(question.skill, today);

    if (existing) {
      req.db.prepare(
        'UPDATE progress SET total_questions = total_questions + 1, correct_answers = correct_answers + COALESCE(?, 0) WHERE id = ?'
      ).run(is_correct, existing.id);
    } else {
      req.db.prepare(
        'INSERT INTO progress (skill, total_questions, correct_answers, session_date) VALUES (?, 1, COALESCE(?, 0), ?)'
      ).run(question.skill, is_correct, today);
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
    res.status(500).json({ error: 'Internal server error occurred while processing your answer.' });
  }
});

module.exports = router;
