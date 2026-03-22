const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { generateQuestionsFromTranscript } = require('../services/ai');

// GET /api/videos - List all videos. If logged in, include progress.
router.get('/', async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    let query;
    let params = [];

    if (userId) {
      query = `
        SELECT 
          v.*,
          p.watched_seconds,
          p.total_seconds,
          p.is_completed,
          p.last_watched_at
        FROM video_lessons v
        LEFT JOIN user_video_progress p ON v.id = p.video_id AND p.user_id = $1
        ORDER BY v.order_index ASC
      `;
      params = [userId];
    } else {
      query = `SELECT * FROM video_lessons ORDER BY order_index ASC`;
    }
    
    const result = await req.db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/videos/:id/progress - Update video progress (Authenticated only, guests ignored)
router.post('/:id/progress', async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: true, message: 'Guest progress not saved to DB' });
    }

    const userId = req.user.id;
    const videoId = parseInt(req.params.id);
    const { watched_seconds, total_seconds, is_completed } = req.body;

    const upsertQuery = `
      INSERT INTO user_video_progress (user_id, video_id, watched_seconds, total_seconds, is_completed, last_watched_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, video_id) 
      DO UPDATE SET 
        watched_seconds = EXCLUDED.watched_seconds,
        total_seconds = EXCLUDED.total_seconds,
        is_completed = EXCLUDED.is_completed OR user_video_progress.is_completed,
        last_watched_at = CURRENT_TIMESTAMP
    `;
    
    await req.db.query(upsertQuery, [userId, videoId, watched_seconds || 0, total_seconds || 0, is_completed || false]);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating video progress:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/videos/:id/notes - Get user notes for a video
router.get('/:id/notes', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = parseInt(req.params.id);
    const result = await req.db.query(
      'SELECT * FROM user_video_notes WHERE user_id = $1 AND video_id = $2 ORDER BY timestamp_seconds ASC',
      [userId, videoId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/videos/:id/notes - Add a note
router.post('/:id/notes', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const videoId = parseInt(req.params.id);
    const { content, timestamp_seconds } = req.body;
    
    const result = await req.db.query(
      'INSERT INTO user_video_notes (user_id, video_id, content, timestamp_seconds) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, videoId, content, timestamp_seconds]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/videos/:id/transcript - Update video transcript
router.put('/:id/transcript', async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const { transcript } = req.body;
    await req.db.query('UPDATE video_lessons SET transcript = $1 WHERE id = $2', [transcript, videoId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/videos/:id/ai-practice - Generate questions from transcript
router.post('/:id/ai-practice', async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const { skill, difficulty, limit } = req.body;
    
    // 1. Get transcript
    const videoResult = await req.db.query('SELECT transcript FROM video_lessons WHERE id = $1', [videoId]);
    const transcript = videoResult.rows[0]?.transcript;
    
    if (!transcript) {
      return res.status(400).json({ error: 'Video chưa có transcript để xử lý.' });
    }

    // 2. Generate
    const questions = await generateQuestionsFromTranscript(transcript, skill, difficulty, limit);

    // 3. Save to practice_questions
    const inserted = [];
    for (const q of questions) {
      const result = await req.db.query(
        `INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, definition_vi, difficulty, part)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [q.skill, q.type, q.question, q.options, q.correct_answer, q.explanation, q.definition_vi || null, q.difficulty, q.part || 1]
      );
      inserted.push(result.rows[0]);
    }

    res.json({ success: true, count: inserted.length, questions: inserted });
  } catch (err) {
    console.error('AI Video Gen Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
