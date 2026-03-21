const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

try {
  const allGrammar = db.prepare("SELECT id, skill, explanation, difficulty FROM practice_questions WHERE explanation LIKE '%grammar_parts%'").all();
  console.log('--- FOUND ROWS ---');
  console.log(JSON.stringify(allGrammar.slice(0, 3), null, 2));
  console.log('Total matches for %grammar_parts%:', allGrammar.length);
  
  const b2Matches = db.prepare("SELECT id, skill, explanation, difficulty FROM practice_questions WHERE skill = 'grammar' AND explanation LIKE '%[grammar_parts_of_speech]%' AND difficulty = 'B2'").all();
  console.log('--- EXACT API QUERY MATCHES ---');
  console.log(JSON.stringify(b2Matches.slice(0, 3), null, 2));
  console.log('Total exact matches:', b2Matches.length);
} catch (e) {
  console.error(e);
} finally {
  db.close();
}
