const express = require('express');
const router = express.Router();

// GET /api/listening/questions — fetch a randomized 25-question set (7, 6, 6, 6 structure)
router.get('/questions', async (req, res) => {
  try {
    const config = [
      { part: 1, limit: 7 },
      { part: 2, limit: 6 },
      { part: 3, limit: 6 },
      { part: 4, limit: 6 }
    ];

    let allSelected = [];

    for (const c of config) {
      const partResult = await req.db.query(
        `SELECT id, question, options, correct_answer, explanation, type
         FROM practice_questions
         WHERE skill = 'listening' AND explanation LIKE $1
         ORDER BY RANDOM() LIMIT $2`,
        [`part:${c.part}|%`, c.limit]
      );
      
      const parsedPart = partResult.rows.map(q => {
        let explanation = q.explanation || '';
        explanation = explanation.replace(/^part:\d\|/, '');
        return {
          ...q,
          part: c.part,
          explanation,
          options: q.options
            ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options)
            : []
        };
      });
      allSelected = allSelected.concat(parsedPart);
    }

    // Group by part for the response
    const byPart = { 1: [], 2: [], 3: [], 4: [] };
    for (const q of allSelected) {
      if (byPart[q.part]) byPart[q.part].push(q);
    }

    // Return the questions sorted by part then id to keep the natural exam flow
    const sorted = allSelected.sort((a, b) => a.part - b.part || a.id - b.id);

    res.json({ questions: sorted, byPart });
  } catch (err) {
    console.error('[Listening] GET /questions error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/listening/submit — score a full listening test attempt
router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body; // { [questionId]: selectedOption }
    if (!answers) return res.status(400).json({ error: 'answers required' });

    const ids = Object.keys(answers).map(Number);
    if (ids.length === 0) return res.status(400).json({ error: 'no answers provided' });

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const result = await req.db.query(
      `SELECT id, correct_answer, explanation FROM practice_questions WHERE id IN (${placeholders})`,
      ids
    );

    const byPart = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 }, 4: { correct: 0, total: 0 } };
    let totalCorrect = 0;

    const review = result.rows.map(q => {
      let part = 1;
      const match = (q.explanation || '').match(/^part:(\d)\|/);
      if (match) part = parseInt(match[1]);

      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) totalCorrect++;

      if (byPart[part]) {
        byPart[part].total++;
        if (isCorrect) byPart[part].correct++;
      }

      return { id: q.id, part, correct_answer: q.correct_answer, user_answer: userAnswer, is_correct: isCorrect };
    });

    const score = ids.length > 0 ? Math.round((totalCorrect / ids.length) * 100) : 0;

    res.json({
      total: ids.length,
      correct: totalCorrect,
      score,
      byPart,
      review
    });
  } catch (err) {
    console.error('[Listening] POST /submit error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
