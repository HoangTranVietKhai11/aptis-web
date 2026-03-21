const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

function initDatabase() {
  const dbPath = path.join(__dirname, 'aptis.db');
  const db = new Database(dbPath);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'Learner',
      email TEXT UNIQUE,
      password TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      target_level TEXT NOT NULL DEFAULT 'B2',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Practice Questions aligned with BC Aptis format
    CREATE TABLE IF NOT EXISTS practice_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      skill TEXT NOT NULL CHECK(skill IN ('grammar','vocabulary','reading','listening','writing','speaking')),
      type TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT,
      correct_answer TEXT,
      explanation TEXT,
      difficulty TEXT DEFAULT 'A1',
      part INTEGER DEFAULT 1,
      roadmap_session INTEGER,
      audio_url TEXT,
      image_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Full mock tests
    CREATE TABLE IF NOT EXISTS mock_tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 120,
      status TEXT DEFAULT 'pending',
      score REAL,
      started_at TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS mock_test_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mock_test_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      user_answer TEXT,
      is_correct INTEGER,
      score REAL,
      ai_feedback TEXT,
      FOREIGN KEY (mock_test_id) REFERENCES mock_tests(id),
      FOREIGN KEY (question_id) REFERENCES practice_questions(id)
    );

    -- User answer history with AI grading
    CREATE TABLE IF NOT EXISTS user_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      answer TEXT NOT NULL,
      is_correct INTEGER,
      score REAL,
      ai_feedback TEXT,
      time_spent INTEGER DEFAULT 0,
      answered_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (question_id) REFERENCES practice_questions(id)
    );

    -- Vocabulary library with THEMES
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      definition TEXT,
      example_sentence TEXT,
      part_of_speech TEXT,
      level TEXT DEFAULT 'A2',
      theme TEXT DEFAULT 'General',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- User's personal vocabulary notebook with SRS
    CREATE TABLE IF NOT EXISTS user_vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vocabulary_id INTEGER,
      word TEXT NOT NULL,
      definition TEXT,
      example_sentence TEXT,
      mastery INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      next_review_at TEXT DEFAULT (datetime('now')),
      notes TEXT,
      added_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id)
    );

    -- Progress tracking
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      skill TEXT NOT NULL,
      score REAL DEFAULT 0,
      total_questions INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      study_time INTEGER DEFAULT 0,
      session_date TEXT DEFAULT (date('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Roadmap with stages A1-A2, B1-B2
    CREATE TABLE IF NOT EXISTS roadmap (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      skill TEXT NOT NULL,
      description TEXT,
      stage TEXT NOT NULL DEFAULT 'A1-A2',
      objectives TEXT,
      bc_ref TEXT,
      completed INTEGER DEFAULT 0,
      unlocked INTEGER DEFAULT 0,
      completed_at TEXT,
      roadmap_name TEXT DEFAULT 'Standard Roadmap',
      theory_content TEXT
    );

    -- AI tutor conversations
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER,
      user_message TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Daily stats for streak tracking
    CREATE TABLE IF NOT EXISTS daily_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL DEFAULT (date('now')),
      questions_answered INTEGER DEFAULT 0,
      target_questions INTEGER DEFAULT 20,
      streak_count INTEGER DEFAULT 0,
      study_time INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // ─── Migrate existing DB: add new columns if they don't exist ─────────────
  const migrations = [
    "ALTER TABLE users ADD COLUMN email TEXT",
    "ALTER TABLE users ADD COLUMN password TEXT",
    "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'",
    "ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0",
    "ALTER TABLE roadmap ADD COLUMN roadmap_name TEXT DEFAULT 'Standard Roadmap'",
    "ALTER TABLE roadmap ADD COLUMN theory_content TEXT",
  ];
  for (const sql of migrations) {
    try { db.exec(sql); } catch (_) { /* column already exists, skip */ }
  }

  // Seed default admin account if not exists
  const adminEmail = 'admin@aptis.local';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existing) {
    const hashedPass = bcrypt.hashSync('admin123', 10);
    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run(uuidv4(), 'Admin', adminEmail, hashedPass, 'admin');
    console.log('✅ Default admin created: admin@aptis.local / admin123');
  }

  // Seed default user account if not exists
  const userEmail = 'user@aptis.local';
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(userEmail);
  if (!existingUser) {
    const hashedPass = bcrypt.hashSync('user123', 10);
    db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run(uuidv4(), 'Khải', userEmail, hashedPass, 'user');
    console.log('✅ Default user created: user@aptis.local / user123');
  }

  return db;
}

module.exports = { initDatabase };
