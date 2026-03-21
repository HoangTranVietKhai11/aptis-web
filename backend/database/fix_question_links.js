const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('Migrating roadmap session links...');

// 1. Add column if not exists
try {
    db.exec("ALTER TABLE practice_questions ADD COLUMN roadmap_id INTEGER");
} catch (e) {
    console.log('Column roadmap_id already exists.');
}

// 2. Map questions for "roadmap tự ôn cho chị Phương"
// These sessions were IDs 32 to 38
const phuongSessions = db.prepare("SELECT id, session_number FROM roadmap WHERE roadmap_name = 'roadmap tự ôn cho chị Phương'").all();

for (const session of phuongSessions) {
    console.log(`Linking questions for Phương Session ${session.session_number} (ID: ${session.id})...`);
    // We previously set roadmap_session as the number (1-7)
    db.prepare("UPDATE practice_questions SET roadmap_id = ? WHERE roadmap_session = ? AND difficulty = 'B2'").run(session.id, session.session_number);
}

// 3. Map questions for "Standard Roadmap"
const standardSessions = db.prepare("SELECT id, session_number FROM roadmap WHERE roadmap_name = 'Standard Roadmap'").all();

for (const session of standardSessions) {
    console.log(`Linking questions for Standard Session ${session.session_number} (ID: ${session.id})...`);
    // Standard questions also used roadmap_session = session_number
    db.prepare("UPDATE practice_questions SET roadmap_id = ? WHERE roadmap_session = ? AND difficulty != 'B2'").run(session.id, session.session_number);
}

console.log('✅ Question links migration complete.');
db.close();
