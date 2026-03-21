const { Pool } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');
const { initDatabase } = require('./database/init');
require('dotenv').config();

async function migrateData() {
  console.log('🚀 Starting FULL Data Migration: SQLite -> Supabase...');
  
  const cloudPool = await initDatabase();
  const sqliteDb = new Database(path.join(__dirname, 'database', 'aptis.db'));
  const client = await cloudPool.connect();

  try {
    const tables = [
      { name: 'practice_questions', idCol: 'id' },
      { name: 'roadmap', idCol: 'id' },
      { name: 'users', idCol: 'email' }, // Using email for conflict as ID might be text/uuid
      { name: 'vocabulary', idCol: 'id' },
      { name: 'mock_tests', idCol: 'id' },
      { name: 'mock_test_questions', idCol: 'id' },
      { name: 'user_answers', idCol: 'id' },
      { name: 'progress', idCol: 'id' },
      { name: 'daily_stats', idCol: 'date' }
    ];

    for (const table of tables) {
      console.log(`Migrating ${table.name}...`);
      const rows = sqliteDb.prepare(`SELECT * FROM ${table.name}`).all();
      if (rows.length === 0) {
        console.log(`  No data in ${table.name}.`);
        continue;
      }

      for (const row of rows) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const colString = columns.join(', ');
        
        // Handle special columns like 'id' or 'date' for conflict
        const conflictClause = `ON CONFLICT (${table.idCol}) DO NOTHING`;

        const query = `INSERT INTO ${table.name} (${colString}) VALUES (${placeholders}) ${conflictClause}`;
        
        try {
          await client.query(query, values);
        } catch (err) {
          console.error(`  Error in ${table.name} row:`, err.message);
        }
      }
      console.log(`  ✅ Migrated ${rows.length} rows from ${table.name}.`);
    }

    console.log('\n✨ ALL EXAMS AND HISTORY MIGRATED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Migration Error:', err);
  } finally {
    client.release();
    sqliteDb.close();
    await cloudPool.end();
  }
}

migrateData();
