const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database', 'aptis.db'));

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('--- DATABASE SCHEMA ---');
  for (const table of tables) {
    const info = db.prepare(`PRAGMA table_info(${table.name})`).all();
    const count = db.prepare(`SELECT COUNT(*) as c FROM ${table.name}`).get();
    console.log(`Table: ${table.name} (${count.c} rows)`);
    console.log('Columns:', info.map(c => `${c.name} (${c.type})`).join(', '));
    console.log('---');
  }
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
