const express = require('express');
const router = express.Router();
const { analyzeResponse, rephraseText, generatePracticeQuestions } = require('../services/ai');

// POST /api/ai/tutor - existing mock logic or bridge to Gemini
router.post('/tutor', async (req, res) => {
  const { prompt, response, skill } = req.body;
  try {
    const analysis = await analyzeResponse(prompt, response, skill);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: 'AI Error' });
  }
});

// POST /api/ai/rephrase
router.post('/rephrase', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  try {
    const rephrased = await rephraseText(text);
    res.json({ rephrased });
  } catch (err) {
    if (err.message === 'RATE_LIMIT') {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait 30 seconds.' });
    }
    res.status(500).json({ error: 'AI Rephrase Error' });
  }
});

// POST /api/ai/generate-practice
router.post('/generate-practice', async (req, res) => {
  const { skill, difficulty = 'B1', limit = 20 } = req.body;
  if (!skill) return res.status(400).json({ error: 'skill is required' });

  // Cap writing and speaking questions to 5 so we don't overwhelm users or the model
  const finalLimit = (skill === 'writing' || skill === 'speaking') ? 5 : Number(limit);

  try {
    const questions = await generatePracticeQuestions(skill, difficulty, finalLimit);

    // Save generated questions to DB and collect inserted rows
    const inserted = [];
    for (const q of questions) {
      try {
        const result = await req.db.query(
          `INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, definition_vi, difficulty, part, roadmap_session, transcript)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
          [q.skill, q.type, q.question, q.options, q.correct_answer, q.explanation, q.definition_vi || null, q.difficulty, q.part || 1, null, q.transcript || null]
        );
        const row = result.rows[0];
        inserted.push({
          ...row,
          options: row.options ? (typeof row.options === 'string' ? JSON.parse(row.options) : row.options) : null,
        });
      } catch (insertErr) {
        console.error('[AI Gen] Insert error:', insertErr.message);
      }
    }

    res.json({ questions: inserted, count: inserted.length });
  } catch (err) {
    console.error('[AI Gen] Error:', err.message);
    res.status(500).json({ error: err.message || 'AI generation failed' });
  }
});

module.exports = router;

