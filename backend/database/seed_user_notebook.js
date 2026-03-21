const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

console.log('🌟 Bắt đầu thêm 20 từ vựng ngẫu nhiên vào Sổ tay (Notebook) của bạn để test Flashcards...');

try {
  // Clear old test data if any
  db.prepare('DELETE FROM user_vocabulary').run();

  // Get 20 random words from vocabulary library
  const words = db.prepare('SELECT * FROM vocabulary ORDER BY RANDOM() LIMIT 20').all();

  const insertNotebook = db.prepare(`
    INSERT INTO user_vocabulary (
      vocabulary_id, word, definition, example_sentence, mastery, level, next_review_at
    ) VALUES (
      ?, ?, ?, ?, 0, 1, datetime('now')
    )
  `);

  let count = 0;
  for (const w of words) {
    try {
      insertNotebook.run(w.id, w.word, w.definition, w.example_sentence);
      count++;
    } catch (e) {
      console.log('Skipped duplicate word:', w.word);
    }
  }

  console.log(`✅ Thành công: Đã chèn thêm ${count} từ vào sổ tay của bạn. Trải nghiệm mục Cards ngay thôi!`);
} catch (error) {
  console.error('❌ Lỗi:', error);
} finally {
  db.close();
}
