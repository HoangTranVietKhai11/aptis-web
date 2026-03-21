const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

const updates = [
    { old: 'Công nghệ', new: 'Technology & Media' },
    { old: 'Môi trường', new: 'Environment & Nature' },
    { old: 'Du lịch', new: 'Travel & Transport' },
    { old: 'Hợp đồng', new: 'Work & Career' },
    { old: 'Kế hoạch kinh doanh', new: 'Work & Career' },
    { old: 'Giáo dục', new: 'Education & Learning' }
];

const updateStmt = db.prepare('UPDATE vocabulary SET theme = ? WHERE theme = ?');
let total = 0;
db.transaction(() => {
    for (const u of updates) {
        const info = updateStmt.run(u.new, u.old);
        total += info.changes;
    }
})();

console.log('Updated ' + total + ' vocabulary themes to match UI categories!');
db.close();
