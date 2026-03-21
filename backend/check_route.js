const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database', 'aptis.db'));

const skill = 'grammar_parts_of_speech';
const difficulty = 'B2';
const limit = 10;

let query = 'SELECT * FROM practice_questions';
const conditions = [];
const params = [];

if (skill) {
  if (skill.startsWith('grammar_')) {
    conditions.push('skill = ?');
    params.push('grammar');
    conditions.push('explanation LIKE ?');
    params.push('%[' + skill + ']%');
  } else {
    conditions.push('skill = ?');
    params.push(skill);
  }
}
if (difficulty) {
  conditions.push('difficulty = ?');
  params.push(difficulty);
}

if (conditions.length > 0) {
  query += ' WHERE ' + conditions.join(' AND ');
}

query += ' ORDER BY RANDOM() LIMIT ?';
params.push(Number(limit));

console.log('QUERY:', query);
console.log('PARAMS:', params);

try {
  const questions = db.prepare(query).all(...params);
  console.log('FOUND:', questions.length);
} catch (e) {
  console.error(e);
}
