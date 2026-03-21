const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('Seeding Roadmap for chị Phương...');

// 1. Clear existing roadmap (optional, but requested as "đặt tên là roadmap tự ôn cho chị Phương")
// We'll keep existing but add this specifically
const roadmapSessions = [
    { num: 1, title: 'Session 1: Danh từ & Tính từ', skill: 'grammar', stage: 'A1-B2', desc: 'Học về vị trí và dấu hiệu nhận biết Danh từ (N) và Tính từ (Adj).', obj: 'Nắm vững cấu trúc A/an/the + N và Adjectives.' },
    { num: 2, title: 'Session 2: Trạng từ & Sự hòa hợp S-V', skill: 'grammar', stage: 'A1-B2', desc: 'Cách dùng Trạng từ và các quy tắc chia động từ theo chủ ngữ.', obj: 'Phân biệt Adj vs Adv, quy tắc chia is/are/has/have.' },
    { num: 3, title: 'Session 3: Mệnh đề quan hệ & Điều kiện', skill: 'grammar', stage: 'B1-B2', desc: 'Ôn tập Who, Which, That và 4 loại câu điều kiện.', obj: 'Sử dụng đúng các loại câu If 0, 1, 2, 3.' },
    { num: 4, title: 'Session 4: So sánh & Cấu trúc bổ trợ', skill: 'grammar', stage: 'B1-B2', desc: 'So sánh bằng, hơn, nhất và Modal Verbs.', obj: 'Sử dụng thành thạo structures as...as, more than, the most.' },
    { num: 5, title: 'Session 5: Luyện tập Tổng hợp 1', skill: 'grammar', stage: 'B2', desc: 'Làm bài tập thực hành từ đề thi mẫu.', obj: 'Áp dụng mẹo làm bài vào đề thi thực tế.' },
    { num: 6, title: 'Session 6: Luyện tập Tổng hợp 2', skill: 'grammar', stage: 'B2', desc: 'Luyện tập nâng cao và sửa lỗi sai thường gặp.', obj: 'Tối ưu hóa thời gian làm bài 12 phút cho 25 câu.' },
    { num: 7, title: 'Session 7: Mẹo làm bài Kỹ năng', skill: 'reading', stage: 'B1-B2', desc: 'Tổng hợp mẹo cho Reading, Listening, Speaking, Writing.', obj: 'Nắm được các "cheat sheet" giúp đạt điểm cao.' }
];

const insertRoadmap = db.prepare(`
    INSERT INTO roadmap (session_number, title, skill, stage, description, objectives, unlocked)
    VALUES (?, ?, ?, ?, ?, ?, 1)
`);

db.transaction(() => {
    // Optional: clear old roadmap if you want a fresh start for her
    // db.prepare('DELETE FROM roadmap').run();
    
    for (const s of roadmapSessions) {
        insertRoadmap.run(s.num, s.title, s.skill, s.stage, s.desc, s.obj);
    }
})();

console.log('✅ Roadmap "tự ôn cho chị Phương" created.');

// 2. Add sample questions from the PDF files
const questions = [
    {
        skill: 'grammar',
        type: 'multiple_choice',
        question: "Today’s deposits total $4,800.00, leaving you with a balance _______ $10,665.62.",
        options: ["to", "of", "for"],
        correct: "of",
        explanation: "Cấu trúc balance of sth (số dư của cái gì).",
        roadmap_session: 1
    },
    {
        skill: 'grammar',
        type: 'multiple_choice',
        question: "I called her on at least three occasions, but she _______ got back to me.",
        options: ["rarely", "sometimes", "never"],
        correct: "never",
        explanation: "Dựa vào nghĩa câu: đã gọi ít nhất 3 lần nhưng KHÔNG BAO GIỜ gọi lại.",
        roadmap_session: 2
    },
    {
        skill: 'grammar',
        type: 'multiple_choice',
        question: "We _______ to inform you that your application for credit has been disapproved.",
        options: ["revert", "resent", "regret"],
        correct: "regret",
        explanation: "Cấu trúc regret to inform (lấy làm tiếc khi thông báo).",
        roadmap_session: 2
    },
    {
        skill: 'grammar',
        type: 'multiple_choice',
        question: "If Mr. Singh _______ to apply for the position, he would be hired in an instant.",
        options: ["may", "were", "is"],
        correct: "were",
        explanation: "Câu điều kiện loại 2 (giả định), dùng 'were' cho mọi chủ ngữ.",
        roadmap_session: 3
    },
    {
        skill: 'grammar',
        type: 'multiple_choice',
        question: "San Francisco is the _______ beautiful city I have ever visited.",
        options: ["most", "more", "much"],
        correct: "most",
        explanation: "So sánh nhất với tính từ dài 'beautiful'.",
        roadmap_session: 4
    },
    {
        skill: 'grammar',
        type: 'multiple_choice',
        question: "Employers _______ to pay their employees a decent wage.",
        options: ["must", "ought", "should"],
        correct: "ought",
        explanation: "Cấu trúc ought to + V-inf.",
        roadmap_session: 4
    }
];

const insertPQ = db.prepare(`
    INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, roadmap_session)
    VALUES (?, ?, ?, ?, ?, ?, 'B2', ?)
`);

db.transaction(() => {
    for (const q of questions) {
        insertPQ.run(q.skill, q.type, q.question, JSON.stringify(q.options), q.correct, q.explanation, q.roadmap_session);
    }
})();

console.log('✅ Practice questions for roadmap added.');
db.close();
