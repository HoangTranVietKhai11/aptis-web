const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

try {
  // Check if roadmap column 'bc_ref' exists (it may not if schema wasn't migrated)
  try {
    db.exec("ALTER TABLE roadmap ADD COLUMN bc_ref TEXT");
  } catch (e) {
    // Ignore if column already exists
  }

  // Find max session number for Standard Roadmap
  const row = db.prepare("SELECT MAX(session_number) as maxNum FROM roadmap").get();
  const nextSession = (row.maxNum || 7) + 1;

  db.prepare(`
    INSERT INTO roadmap (session_number, title, skill, stage, description, objectives, unlocked, bc_ref, roadmap_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    nextSession, 
    'Session 8: 12 Thì Cơ Bản Tiếng Anh', 
    'grammar', 
    'A1-A2', 
    'Hệ thống toàn diện 12 thì cơ bản trong tiếng Anh.', 
    'Nắm chắc công thức, cách dùng và dấu hiệu nhận biết của 12 thì (hiển thị trực tiếp trong trang học).', 
    1, 
    'GRAMMAR_HUB',
    'Standard Roadmap'
  );

  // Link grammar tense questions to this session
  const qIds = db.prepare("SELECT id FROM practice_questions WHERE explanation LIKE '%[grammar_%'").all();
  const updatePQ = db.prepare("UPDATE practice_questions SET roadmap_session = ? WHERE id = ?");

  let updatedCount = 0;
  db.transaction(() => {
     for (const q of qIds) {
        updatePQ.run(nextSession, q.id);
        updatedCount++;
     }
  })();
  
  console.log(`✅ Successfully added "Session 8: 12 Thì Cơ Bản Tiếng Anh" to the roadmap.`);
  console.log(`✅ Linked ${updatedCount} grammar tense questions to this session.`);
} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
}
