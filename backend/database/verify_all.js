const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('--- ROADMAP SESSIONS ---');
const sessions = db.prepare('SELECT id, session_number, title, skill, stage FROM roadmap ORDER BY session_number').all();
console.table(sessions);

console.log('\n--- PRACTICE QUESTIONS BY SESSION ---');
const questionCounts = db.prepare('SELECT roadmap_session, COUNT(*) as count FROM practice_questions WHERE roadmap_session IS NOT NULL GROUP BY roadmap_session').all();
console.table(questionCounts);

db.close();
