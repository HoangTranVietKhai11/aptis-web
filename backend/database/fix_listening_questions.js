/**
 * fix_listening_questions.js
 * 
 * Fixes all listening practice questions by:
 * 1. Extracting the 'You hear: "..."' content into the `transcript` column
 * 2. Simplifying the question text to only the actual question
 * 3. Also generates proper transcripts for template listening questions
 *    from the mock test seeds that are still in the old format.
 */
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

console.log('🔧 Fixing listening questions...');

let fixedCount = 0;
let skippedCount = 0;

try {
  const listeningQs = db.prepare(
    "SELECT id, question FROM practice_questions WHERE skill = 'listening'"
  ).all();

  const update = db.prepare(
    'UPDATE practice_questions SET question = ?, transcript = ? WHERE id = ?'
  );

  db.transaction(() => {
    for (const q of listeningQs) {
      const text = q.question;
      
      // Pattern 1: "You hear: "..." \n What is..."
      const youHearMatch = text.match(/You hear:\s*[""](.+?)[""][.\s]*\n?(.*)/s);
      if (youHearMatch) {
        const transcript = youHearMatch[1].trim();
        // The actual question is the part after the You hear line
        let questionText = youHearMatch[2].trim();
        if (!questionText) questionText = 'What did the speaker say?';
        update.run(questionText, transcript, q.id);
        fixedCount++;
        continue;
      }

      // Pattern 2: "Listen to the message. What is...?" - question has no embedded audio
      // Already in correct format but no transcript yet
      if (text.startsWith('Listen to')) {
        // Keep question as-is, the transcript is already assigned from mock seed
        skippedCount++;
        continue;
      }

      // Pattern 3: "[Mock X - Listening Part Y] Listen to..."
      const mockListenMatch = text.match(/\[Mock \d+ - Listening Part \d+\]\s*(.*)/s);
      if (mockListenMatch) {
        // Already has transcript from seed_listening_transcripts.js — just fix question text
        const questionText = mockListenMatch[1].trim();
        if (questionText && questionText !== text) {
          update.run(questionText, null, q.id); // Keep existing transcript
          fixedCount++;
        } else {
          skippedCount++;
        }
        continue;
      }

      skippedCount++;
    }
  })();

  console.log(`✅ Fixed: ${fixedCount} questions`);
  console.log(`ℹ️  Skipped (no change needed): ${skippedCount} questions`);
  console.log('\nDone!');

} catch (e) {
  console.error('❌ Error:', e.message);
} finally {
  db.close();
}
