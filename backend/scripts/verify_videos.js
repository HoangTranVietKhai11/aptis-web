const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in backend/.env');
  process.exit(1);
}
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function verify() {
  const client = await pool.connect();
  try {
    console.log('Checking video_lessons table...');
    const res = await client.query('SELECT * FROM video_lessons ORDER BY order_index');
    console.log(`Found ${res.rows.length} videos:`);
    res.rows.forEach(v => {
      console.log(` - [${v.order_index}] ${v.title}: ${v.video_url}`);
    });

    if (res.rows.length === 7) {
      console.log('✅ Seeding successful: All 7 videos found.');
    } else {
      console.log(`❌ Expected 7 videos, found ${res.rows.length}.`);
    }
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

verify();
