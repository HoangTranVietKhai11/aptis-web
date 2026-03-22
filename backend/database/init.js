const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// If using Supabase pooler (port 6543) or localhost, SSL might need to be disabled or handled specifically
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes(':6543')) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolConfig);

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
        definition_vi TEXT,
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
        word TEXT NOT NULL UNIQUE,
        definition TEXT,
        definition_vi TEXT, -- Vietnamese translation
        example_sentence TEXT,
        part_of_speech TEXT,
        level TEXT DEFAULT 'A2',
        theme TEXT DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_vocabulary (
        id SERIAL PRIMARY KEY,
        user_id TEXT, -- Reference to users.id
        vocabulary_id INTEGER REFERENCES vocabulary(id),
        word TEXT NOT NULL,
        definition TEXT,
        definition_vi TEXT, -- Vietnamese translation
        example_sentence TEXT,
        mastery INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        next_review_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id TEXT, -- Reference to users.id
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

      CREATE TABLE IF NOT EXISTS video_lessons (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        thumbnail_url TEXT,
        order_index INTEGER DEFAULT 0,
        chapters TEXT, -- JSON array of { time: number, label: string }
        practice_link TEXT, -- URL to practice section
        transcript TEXT, -- Full lesson transcript for AI
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_video_progress (
        user_id TEXT REFERENCES users(id),
        video_id INTEGER REFERENCES video_lessons(id),
        watched_seconds INTEGER DEFAULT 0,
        total_seconds INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, video_id)
      );

      CREATE TABLE IF NOT EXISTS user_video_notes (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        video_id INTEGER REFERENCES video_lessons(id),
        content TEXT NOT NULL,
        timestamp_seconds INTEGER NOT NULL,
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
      { table: 'practice_questions', column: 'roadmap_id', type: 'INTEGER' },
      { table: 'practice_questions', column: 'transcript', type: 'TEXT' },
      { table: 'video_lessons', column: 'chapters', type: 'TEXT' },
      { table: 'video_lessons', column: 'practice_link', type: 'TEXT' },
      { table: 'video_lessons', column: 'transcript', type: 'TEXT' },
      { table: 'vocabulary', column: 'definition_vi', type: 'TEXT' },
      { table: 'user_vocabulary', column: 'definition_vi', type: 'TEXT' },
      { table: 'practice_questions', column: 'definition_vi', type: 'TEXT' },
      { table: 'user_vocabulary', column: 'user_id', type: 'TEXT' },
      { table: 'progress', column: 'user_id', type: 'TEXT' }
    ];

    for (const m of migrationChecks) {
      try {
        await client.query(`ALTER TABLE ${m.table} ADD COLUMN IF NOT EXISTS ${m.column} ${m.type}`);
      } catch (err) { }
    }

    // New unique constraint migration
    try {
      await client.query('ALTER TABLE vocabulary ADD CONSTRAINT unique_vocabulary_word UNIQUE (word)');
    } catch (err) { }

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

    // Seed teacher videos
    const videos = [
      { 
        title: 'Buổi 1: Tổng quan APTIS', 
        video_id: '1mzpGQO_j_THnSvC0ruxx4g7WuISLaJ3j',
        practice_link: '/practice',
        chapters: JSON.stringify([
          { time: 0, label: 'Giới thiệu' },
          { time: 300, label: 'Cấu trúc bài thi' },
          { time: 900, label: 'Thang điểm' }
        ])
      },
      { 
        title: 'Buổi 2: Kỹ năng Listening', 
        video_id: '12uAgW5D2RgyowskBEKHJI-SG_gmb50He',
        practice_link: '/practice/listening',
        chapters: JSON.stringify([
          { time: 0, label: 'Tổng quan Listening' },
          { time: 600, label: 'Part 1 & 2' },
          { time: 1800, label: 'Part 3 & 4' }
        ])
      },
      { 
        title: 'Buổi 3: Kỹ năng Reading', 
        video_id: '11yd21vF3B4uUVpm0Cx4pif_PXnthHMdf',
        practice_link: '/practice/reading',
        chapters: JSON.stringify([
          { time: 0, label: 'Tổng quan Reading' },
          { time: 1200, label: 'Chiến thuật làm bài' }
        ])
      },
      { 
        title: 'Buổi 4: Kỹ năng Writing - Part 1 & 2', 
        video_id: '1gJVm82iZPBdZb-c7j0i-UuomjlLkKEKk',
        practice_link: '/practice/writing',
        chapters: JSON.stringify([
          { time: 0, label: 'Writing Part 1' },
          { time: 900, label: 'Writing Part 2' }
        ])
      },
      { 
        title: 'Buổi 5: Kỹ năng Writing - Part 3 & 4', 
        video_id: '19ZVfHpyC0G1vX7e7W7mXEwpemcqf597q',
        practice_link: '/practice/writing',
        chapters: JSON.stringify([
          { time: 0, label: 'Writing Part 3' },
          { time: 1500, label: 'Writing Part 4 (Email)' }
        ])
      },
      { 
        title: 'Buổi 6: Kỹ năng Speaking - Part 1 & 2', 
        video_id: '1LVGxbCpUxwEhJRIGy22835Me2ICmxJRq',
        practice_link: '/practice/speaking',
        chapters: JSON.stringify([
          { time: 0, label: 'Speaking Part 1' },
          { time: 600, label: 'Speaking Part 2' }
        ])
      },
      { 
        title: 'Buổi 7: Kỹ năng Speaking - Part 3 & 4', 
        video_id: '1ngmnmPbvzEYCNcao4lE5oaauReGbqrkf',
        practice_link: '/practice/speaking',
        chapters: JSON.stringify([
          { time: 0, label: 'Speaking Part 3' },
          { time: 1200, label: 'Speaking Part 4' }
        ])
      }
    ];

    for (const [index, v] of videos.entries()) {
      const url = `https://drive.google.com/file/d/${v.video_id}/preview`;
      const existingVideo = await client.query('SELECT id FROM video_lessons WHERE title = $1', [v.title]);
      if (existingVideo.rows.length === 0) {
        await client.query(
          'INSERT INTO video_lessons (title, video_url, order_index, chapters, practice_link) VALUES ($1, $2, $3, $4, $5)',
          [v.title, url, index + 1, v.chapters, v.practice_link]
        );
      } else {
        // Update existing with new info
        await client.query(
          'UPDATE video_lessons SET chapters = $1, practice_link = $2 WHERE id = $3',
          [v.chapters, v.practice_link, existingVideo.rows[0].id]
        );
      }
    }
    console.log('✅ Video lessons seeded');

    return pool;
  } finally {
    client.release();
  }
}

module.exports = { initDatabase, pool };
