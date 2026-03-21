const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('Applying roadmap naming updates...');

try {
    // 1. Add column if it doesn't exist (safety)
    db.exec("ALTER TABLE roadmap ADD COLUMN roadmap_name TEXT DEFAULT 'Standard Roadmap'");
} catch (e) {
    console.log('Column roadmap_name already exists.');
}

// 2. Identify "Chị Phương" sessions and update them
// These are the sessions I added recently (IDs 32-38 based on previous verify_all output)
const sessions = db.prepare("SELECT id, title FROM roadmap").all();
for (const s of sessions) {
    if (s.title.includes('Session') && (s.title.includes('Danh từ') || s.title.includes('grammar') || s.title.includes('Mẹo'))) {
        db.prepare("UPDATE roadmap SET roadmap_name = 'roadmap tự ôn cho chị Phương' WHERE id = ?").run(s.id);
    }
}

// Specifically update the ones from the seed script if they are recognizable
db.prepare("UPDATE roadmap SET roadmap_name = 'roadmap tự ôn cho chị Phương' WHERE title LIKE 'Session %'").run();

// 3. Fix session_number for the new roadmap to be consistent (1-7)
// They already are 1-7, but let's double check
console.log('✅ Updated roadmap names.');

console.log('\n--- VERIFICATION ---');
const check = db.prepare('SELECT id, session_number, title, roadmap_name FROM roadmap').all();
console.table(check);

db.close();
