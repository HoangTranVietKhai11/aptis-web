const { Pool } = require('pg');
require('dotenv').config();

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    const res = await pool.query('SELECT COUNT(*) FROM practice_questions');
    console.log('Count of practice_questions:', res.rows[0].count);
    const res2 = await pool.query('SELECT COUNT(*) FROM roadmap');
    console.log('Count of roadmap sessions:', res2.rows[0].count);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
check();
