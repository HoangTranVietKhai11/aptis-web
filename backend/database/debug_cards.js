const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

try {
  console.log('--- User_vocabulary Count ---');
  console.log(db.prepare('SELECT count(*) as count FROM user_vocabulary').get());

  console.log('\n--- All user_vocabulary records ---');
  const rows = db.prepare('SELECT id, word, mastery, level, next_review_at FROM user_vocabulary ORDER BY added_at DESC LIMIT 5').all();
  console.table(rows);

  console.log('\n--- Current DB Time ---');
  console.log(db.prepare("SELECT datetime('now') as now").get());

  console.log('\n--- Records due for review ---');
  const due = db.prepare("SELECT id, word FROM user_vocabulary WHERE next_review_at <= datetime('now')").all();
  console.table(due);

} catch (e) {
  console.error(e);
} finally {
  db.close();
}
