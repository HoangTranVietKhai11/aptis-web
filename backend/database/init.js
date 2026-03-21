const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase in most environments
  }
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    // Note: PostgreSQL uses different syntax for AUTOINCREMENT and types
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT 'Learner',
        email TEXT UNIQUE,
        password TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        target_level TEXT NOT NULL DEFAULT 'B2',
        xp INTEGER DEFAULT 0,
        streak_count INTEGER DEFAULT 0,
        last_active_date TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS practice_questions (
        id SERIAL PRIMARY KEY,
        skill TEXT NOT NULL,
        type TEXT NOT NULL,
        question TEXT NOT NULL,
        options TEXT,
        correct_answer TEXT,
        explanation TEXT,
        difficulty TEXT DEFAULT 'A1',
        part INTEGER DEFAULT 1,
        roadmap_session INTEGER,
        roadmap_id INTEGER,
        audio_url TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS mock_tests (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        duration_minutes INTEGER DEFAULT 120,
        status TEXT DEFAULT 'pending',
        score REAL,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS mock_test_questions (
        id SERIAL PRIMARY KEY,
        mock_test_id INTEGER REFERENCES mock_tests(id),
        question_id INTEGER REFERENCES practice_questions(id),
        user_answer TEXT,
        is_correct INTEGER,
        score REAL,
        ai_feedback TEXT
      );

      CREATE TABLE IF NOT EXISTS user_answers (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES practice_questions(id),
        answer TEXT NOT NULL,
        is_correct INTEGER,
        score REAL,
        ai_feedback TEXT,
        time_spent INTEGER DEFAULT 0,
        answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vocabulary (
        id SERIAL PRIMARY KEY,
        word TEXT NOT NULL,
        definition TEXT,
        example_sentence TEXT,
        part_of_speech TEXT,
        level TEXT DEFAULT 'A2',
        theme TEXT DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_vocabulary (
        id SERIAL PRIMARY KEY,
        vocabulary_id INTEGER REFERENCES vocabulary(id),
        word TEXT NOT NULL,
        definition TEXT,
        example_sentence TEXT,
        mastery INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        next_review_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        skill TEXT NOT NULL,
        score REAL DEFAULT 0,
        total_questions INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        study_time INTEGER DEFAULT 0,
        session_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS roadmap (
        id SERIAL PRIMARY KEY,
        session_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        skill TEXT NOT NULL,
        description TEXT,
        stage TEXT NOT NULL DEFAULT 'A1-A2',
        objectives TEXT,
        bc_ref TEXT,
        completed INTEGER DEFAULT 0,
        unlocked INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        roadmap_name TEXT DEFAULT 'Standard Roadmap',
        theory_content TEXT
      );

      CREATE TABLE IF NOT EXISTS ai_conversations (
        id SERIAL PRIMARY KEY,
        question_id INTEGER,
        user_message TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS daily_stats (
        id SERIAL PRIMARY KEY,
        date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
        questions_answered INTEGER DEFAULT 0,
        target_questions INTEGER DEFAULT 20,
        streak_count INTEGER DEFAULT 0,
        study_time INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add columns if they don't exist (Migrations)
    const migrationChecks = [
      { table: 'users', column: 'xp', type: 'INTEGER DEFAULT 0' },
      { table: 'users', column: 'streak_count', type: 'INTEGER DEFAULT 0' },
      { table: 'users', column: 'last_active_date', type: 'TEXT' },
      { table: 'roadmap', column: 'roadmap_name', type: "TEXT DEFAULT 'Standard Roadmap'" },
      { table: 'roadmap', column: 'theory_content', type: 'TEXT' },
      { table: 'practice_questions', column: 'roadmap_id', type: 'INTEGER' }
    ];

    for (const m of migrationChecks) {
      try {
        await client.query(`ALTER TABLE ${m.table} ADD COLUMN IF NOT EXISTS ${m.column} ${m.type}`);
      } catch (err) {
        // Silently skip if column exists or error
      }
    }

    // Seed default admin account
    const adminEmail = 'admin@aptis.local';
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (existing.rows.length === 0) {
      const hashedPass = bcrypt.hashSync('admin123', 10);
      await client.query(
        "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)",
        [uuidv4(), 'Admin', adminEmail, hashedPass, 'admin']
      );
      console.log('✅ Default admin created in Supabase: admin@aptis.local / admin123');
    }

    // Seed default user
    const userEmail = 'user@aptis.local';
    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [userEmail]);
    if (existingUser.rows.length === 0) {
      const hashedPass = bcrypt.hashSync('user123', 10);
      await client.query(
        "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)",
        [uuidv4(), 'Khải', userEmail, hashedPass, 'user']
      );
      console.log('✅ Default user created in Supabase: user@aptis.local / user123');
    }

    return pool;
  } finally {
    client.release();
  }
}

module.exports = { initDatabase, pool };
