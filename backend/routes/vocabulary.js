const express = require('express');
const router = express.Router();

// GET /api/vocabulary
router.get('/', async (req, res) => {
  const { search, level, theme } = req.query;
  let query = 'SELECT * FROM vocabulary WHERE 1=1';
  const queryParams = [];

  if (search) {
    const idx = queryParams.length + 1;
    query += ` AND (word LIKE $${idx} OR definition LIKE $${idx + 1})`;
    queryParams.push(`%${search}%`, `%${search}%`);
  }
  if (level) {
    const idx = queryParams.length + 1;
    query += ` AND level = $${idx}`;
    queryParams.push(level);
  }
  if (theme) {
    const idx = queryParams.length + 1;
    query += ` AND theme = $${idx}`;
    queryParams.push(theme);
  }
  query += ' ORDER BY theme, word ASC';

  try {
    const result = await req.db.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vocabulary/themes
router.get('/themes', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT theme, COUNT(*) as count FROM vocabulary GROUP BY theme ORDER BY theme`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vocabulary
router.post('/', async (req, res) => {
  try {
    const { word, definition, example_sentence, part_of_speech, level = 'B2', theme = 'General' } = req.body;
    if (!word) return res.status(400).json({ error: 'word is required' });

    const result = await req.db.query(
      'INSERT INTO vocabulary (word, definition, example_sentence, part_of_speech, level, theme) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [word, definition, example_sentence, part_of_speech, level, theme]
    );

    res.json({ id: result.rows[0].id, word, definition, example_sentence, part_of_speech, level, theme });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/vocabulary/:id
router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM vocabulary WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vocabulary/notebook
router.get('/notebook', async (req, res) => {
  const { review_only, set_name } = req.query;
  let query = 'SELECT * FROM user_vocabulary WHERE 1=1';
  const queryParams = [];
  
  if (review_only === 'true') {
    query += " AND next_review_at <= CURRENT_TIMESTAMP";
  }
  if (set_name) {
    query += ` AND set_name = $${queryParams.length + 1}`;
    queryParams.push(set_name);
  }
  query += ' ORDER BY added_at DESC';
  
  try {
    const result = await req.db.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vocabulary/sets
router.get('/sets', async (req, res) => {
  try {
    const result = await req.db.query(
      `SELECT set_name, COUNT(*) as count FROM user_vocabulary WHERE set_name IS NOT NULL GROUP BY set_name ORDER BY set_name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vocabulary/import-csv
router.post('/import-csv', async (req, res) => {
  try {
    const { set_name, rows } = req.body;
    if (!set_name || !Array.isArray(rows)) return res.status(400).json({ error: 'Invalid data' });

    let imported = 0;
    for (const row of rows) {
      if (!row.word) continue;
      await req.db.query(
        `INSERT INTO user_vocabulary (vocabulary_id, word, definition, example_sentence, notes, set_name, mastery, level, next_review_at)
         VALUES (null, $1, $2, $3, $4, $5, 0, 1, CURRENT_TIMESTAMP)`,
        [row.word.trim(), (row.definition || '').trim(), (row.example_sentence || '').trim(), (row.notes || '').trim(), set_name.trim()]
      );
      imported++;
    }
    res.json({ success: true, imported });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vocabulary/notebook/:id/review
router.post('/notebook/:id/review', async (req, res) => {
  try {
    const { quality } = req.body;
    const vResult = await req.db.query('SELECT * FROM user_vocabulary WHERE id = $1', [req.params.id]);
    const word = vResult.rows[0];
    if (!word) return res.status(404).json({ error: 'Word not found' });

    let { level, mastery } = word;
    if (quality >= 3) {
      level += 1;
      mastery = Math.min(100, (mastery || 0) + 20);
    } else {
      level = 1;
      mastery = Math.max(0, (mastery || 0) - 10);
    }

    const intervals = [0, 1, 3, 7, 14, 30, 90, 180];
    const daysToAdd = intervals[Math.min(level, intervals.length - 1)];
    
    await req.db.query(
      `UPDATE user_vocabulary 
       SET level = $1, mastery = $2, next_review_at = CURRENT_TIMESTAMP + ($3 * INTERVAL '1 day') 
       WHERE id = $4`,
      [level, mastery, daysToAdd, req.params.id]
    );

    res.json({ success: true, next_review: daysToAdd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vocabulary/notebook
router.post('/notebook', async (req, res) => {
  try {
    const { word, definition, example_sentence, notes, vocabulary_id, set_name } = req.body;
    if (!word) return res.status(400).json({ error: 'word is required' });

    const result = await req.db.query(
      'INSERT INTO user_vocabulary (vocabulary_id, word, definition, example_sentence, notes, set_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [vocabulary_id || null, word, definition, example_sentence, notes, set_name || null]
    );

    res.json({ id: result.rows[0].id, word });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/vocabulary/notebook/:id
router.put('/notebook/:id', async (req, res) => {
  try {
    const { mastery, notes } = req.body;
    await req.db.query(
      'UPDATE user_vocabulary SET mastery = COALESCE($1, mastery), notes = COALESCE($2, notes) WHERE id = $3',
      [mastery, notes, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/vocabulary/notebook/:id
router.delete('/notebook/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM user_vocabulary WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
