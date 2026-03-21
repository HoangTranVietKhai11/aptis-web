const express = require('express');
const router = express.Router();

// GET /api/vocabulary — with optional theme/level/search filters
router.get('/', (req, res) => {
  const { search, level, theme } = req.query;
  let query = 'SELECT * FROM vocabulary WHERE 1=1';
  const params = [];

  if (search) { query += ' AND (word LIKE ? OR definition LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (level) { query += ' AND level = ?'; params.push(level); }
  if (theme) { query += ' AND theme = ?'; params.push(theme); }
  query += ' ORDER BY theme, word ASC';

  const words = req.db.prepare(query).all(...params);
  res.json(words);
});

// GET /api/vocabulary/themes — list all distinct themes
router.get('/themes', (req, res) => {
  const themes = req.db.prepare(
    `SELECT theme, COUNT(*) as count FROM vocabulary GROUP BY theme ORDER BY theme`
  ).all();
  res.json(themes);
});

// POST /api/vocabulary - add a word to the library
router.post('/', (req, res) => {
  const { word, definition, example_sentence, part_of_speech, level = 'B2', theme = 'General' } = req.body;
  if (!word) return res.status(400).json({ error: 'word is required' });

  const result = req.db.prepare(
    'INSERT INTO vocabulary (word, definition, example_sentence, part_of_speech, level, theme) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(word, definition, example_sentence, part_of_speech, level, theme);

  res.json({ id: result.lastInsertRowid, word, definition, example_sentence, part_of_speech, level, theme });
});

// DELETE /api/vocabulary/:id
router.delete('/:id', (req, res) => {
  req.db.prepare('DELETE FROM vocabulary WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- User Vocabulary Notebook ---

// GET /api/vocabulary/notebook
router.get('/notebook', (req, res) => {
  const { review_only, set_name } = req.query;
  let query = 'SELECT * FROM user_vocabulary WHERE 1=1';
  const params = [];
  if (review_only === 'true') {
    query += " AND next_review_at <= datetime('now')";
  }
  if (set_name) {
    query += ' AND set_name = ?';
    params.push(set_name);
  }
  query += ' ORDER BY added_at DESC';
  const words = req.db.prepare(query).all(...params);
  res.json(words);
});

// GET /api/vocabulary/sets - list all distinct set names
router.get('/sets', (req, res) => {
  const sets = req.db.prepare(
    `SELECT set_name, COUNT(*) as count FROM user_vocabulary WHERE set_name IS NOT NULL GROUP BY set_name ORDER BY set_name`
  ).all();
  res.json(sets);
});

// POST /api/vocabulary/import-csv
// Body: { set_name: "My Set", rows: [{word, definition, example_sentence?, notes?}] }
router.post('/import-csv', (req, res) => {
  const { set_name, rows } = req.body;
  if (!set_name || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'set_name and rows[] are required' });
  }

  const insert = req.db.prepare(
    `INSERT INTO user_vocabulary (vocabulary_id, word, definition, example_sentence, notes, set_name, mastery, level, next_review_at)
     VALUES (null, ?, ?, ?, ?, ?, 0, 1, datetime('now'))`
  );

  let imported = 0;
  let skipped = 0;
  const insertMany = req.db.transaction((rows) => {
    for (const row of rows) {
      if (!row.word) { skipped++; continue; }
      insert.run(
        row.word.trim(),
        (row.definition || '').trim(),
        (row.example_sentence || '').trim(),
        (row.notes || '').trim(),
        set_name.trim()
      );
      imported++;
    }
  });

  insertMany(rows);
  res.json({ success: true, imported, skipped });
});

// POST /api/vocabulary/notebook/:id/review
router.post('/notebook/:id/review', (req, res) => {
  const { quality } = req.body; // 0 (forgot) to 5 (perfect)
  const word = req.db.prepare('SELECT * FROM user_vocabulary WHERE id = ?').get(req.params.id);
  if (!word) return res.status(404).json({ error: 'Word not found' });

  let { level, next_review_at, mastery } = word;
  
  // Simple SRS Algorithm (v1)
  if (quality >= 3) {
    level += 1;
    mastery = Math.min(100, mastery + 20);
  } else {
    level = 1;
    mastery = Math.max(0, mastery - 10);
  }

  const intervals = [0, 1, 3, 7, 14, 30, 90, 180];
  const daysToAdd = intervals[Math.min(level, intervals.length - 1)];
  
  req.db.prepare(
    `UPDATE user_vocabulary 
     SET level = ?, mastery = ?, next_review_at = datetime('now', '+' || ? || ' days') 
     WHERE id = ?`
  ).run(level, mastery, daysToAdd, req.params.id);

  res.json({ success: true, next_review: daysToAdd });
});

// POST /api/vocabulary/notebook
router.post('/notebook', (req, res) => {
  const { word, definition, example_sentence, notes, vocabulary_id, set_name } = req.body;
  if (!word) return res.status(400).json({ error: 'word is required' });

  const result = req.db.prepare(
    'INSERT INTO user_vocabulary (vocabulary_id, word, definition, example_sentence, notes, set_name) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(vocabulary_id || null, word, definition, example_sentence, notes, set_name || null);

  res.json({ id: result.lastInsertRowid, word });
});

// PUT /api/vocabulary/notebook/:id
router.put('/notebook/:id', (req, res) => {
  const { mastery, notes } = req.body;
  req.db.prepare(
    'UPDATE user_vocabulary SET mastery = COALESCE(?, mastery), notes = COALESCE(?, notes) WHERE id = ?'
  ).run(mastery, notes, req.params.id);
  res.json({ success: true });
});

// DELETE /api/vocabulary/notebook/:id
router.delete('/notebook/:id', (req, res) => {
  req.db.prepare('DELETE FROM user_vocabulary WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
