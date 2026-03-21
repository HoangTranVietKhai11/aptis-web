const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

console.log('🔧 Migrating: Adding transcript column to practice_questions...');

try {
  db.exec('ALTER TABLE practice_questions ADD COLUMN transcript TEXT');
  console.log('✅ Column transcript added.');
} catch (e) {
  if (e.message.includes('duplicate column')) {
    console.log('ℹ️  Column transcript already exists. Skipping.');
  } else {
    throw e;
  }
}

db.close();
console.log('Done.');
