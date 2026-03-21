const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('Enriching Roadmap with additional questions from Grammar files...');

const extraQuestions = [
    // Session 1: Nouns & Adjectives
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 1,
        question: "I’m reading a really _______ book on the history of Europe.",
        options: ["interest", "interesting", "interested"],
        correct: "interesting",
        explanation: "V-ing dùng để chỉ bản chất của vật (cuốn sách hay)."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 1,
        question: "He is known as the person who always _______ his friends.",
        options: ["backs up", "catches up", "cheers up"],
        correct: "backs up",
        explanation: "Back up: ủng hộ/hỗ trợ ai đó."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 1,
        question: "_______ memory of the day I met the president is very special to me.",
        options: ["The", "A", "(-)"],
        correct: "The",
        explanation: "Dùng 'The' vì danh từ 'memory' đã được xác định bởi cụm 'of the day...'."
    },

    // Session 2: Adverbs & S-V Agreement
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 2,
        question: "Our English teacher _______ us do much homework.",
        options: ["make", "don’t make", "doesn’t make"],
        correct: "doesn’t make",
        explanation: "Chủ ngữ số ít 'teacher' đi với 'doesn't'."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 2,
        question: "In those days, my father _______ never eat dinner after eight o’clock.",
        options: ["would", "will", "used to"],
        correct: "would",
        explanation: "Would dùng để chỉ thói quen trong quá khứ."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 2,
        question: "I’m _______ happy with my new car. It’s brilliant!",
        options: ["so", "quite", "a bit"],
        correct: "so",
        explanation: "So + adj (rất...). 'Brilliant' cho thấy mức độ rất hài lòng."
    },

    // Session 3: Relative Clauses & Conditionals
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 3,
        question: "The performance, _______ was held yesterday, fascinated the audience.",
        options: ["what", "which", "who"],
        correct: "which",
        explanation: "Mệnh đề quan hệ không xác định, dùng 'which' thay cho vật (performance)."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 3,
        question: "If the dress _______ been so expensive, she would have bought it.",
        options: ["hadn’t", "weren’t", "aren’t"],
        correct: "hadn’t",
        explanation: "Câu điều kiện loại 3 (quá khứ), dùng If + S + had + P2."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 3,
        question: "My father, _______ is a dentist, told me not to drink sugary drinks.",
        options: ["who", "which", "that"],
        correct: "who",
        explanation: "Mệnh đề quan hệ dùng 'who' thay cho người (father)."
    },

    // Session 4: Comparisons & Modals
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 4,
        question: "There were _______ than fifty people in the audience last night.",
        options: ["fewer", "lesser", "few"],
        correct: "fewer",
        explanation: "So sánh hơn với danh từ đếm được số nhiều (people) dùng 'fewer'."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 4,
        question: "He’s about 40, but in this photograph he looks much _______.",
        options: ["young", "younger", "youngest"],
        correct: "younger",
        explanation: "So sánh hơn 'younger' (trông trẻ hơn)."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 4,
        question: "You _______ have bought that car. What a waste of money!",
        options: ["shouldn’t", "mustn’t", "couldn’t"],
        correct: "shouldn’t",
        explanation: "Shouldn't have + P2: lẽ ra không nên làm gì (nhưng đã làm)."
    },

    // Session 5/6: General Practice
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 5,
        question: "He _______ be a teacher, but now he has a different job.",
        options: ["used to", "uses to", "using to"],
        correct: "used to",
        explanation: "Used to + V: đã từng làm gì trong quá khứ."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 5,
        question: "The passenger _______ a fine because he didn’t have the right ticket.",
        options: ["given", "was given", "didn’t give"],
        correct: "was given",
        explanation: "Câu bị động (được/bị đưa cho hình phạt)."
    },
    {
        skill: 'grammar', type: 'multiple_choice', roadmap_session: 6,
        question: "It is expected that two million copies of the novel _______ sold by December.",
        options: ["will have been", "have been", "will have being"],
        correct: "will have been",
        explanation: "Thì tương lai hoàn thành bị động (sẽ được bán xong)."
    }
];

const insertPQ = db.prepare(`
    INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, roadmap_session)
    VALUES (?, ?, ?, ?, ?, ?, 'B2', ?)
`);

db.transaction(() => {
    for (const q of extraQuestions) {
        insertPQ.run(q.skill, q.type, q.question, JSON.stringify(q.options), q.correct, q.explanation, q.roadmap_session);
    }
})();

console.log(`✅ Success: Added ${extraQuestions.length} enriched questions to the roadmap.`);
db.close();
