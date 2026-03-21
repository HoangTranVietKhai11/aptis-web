const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('Adding more questions for chị Phương roadmap...');

// Get unique IDs for Phương roadmap sessions by session_number
const getSessionId = (num) => {
    const s = db.prepare("SELECT id FROM roadmap WHERE roadmap_name = 'roadmap tự ôn cho chị Phương' AND session_number = ?").get(num);
    return s ? s.id : null;
};

const s1 = getSessionId(1); // Danh từ & Tính từ
const s2 = getSessionId(2); // Trạng từ & S-V Agreement
const s3 = getSessionId(3); // Mệnh đề quan hệ & Điều kiện
const s4 = getSessionId(4); // So sánh & Modal Verbs
const s5 = getSessionId(5); // Luyện tập 1
const s6 = getSessionId(6); // Luyện tập 2
const s7 = getSessionId(7); // Mẹo làm bài

console.log(`Session IDs: S1=${s1}, S2=${s2}, S3=${s3}, S4=${s4}, S5=${s5}, S6=${s6}, S7=${s7}`);

const questions = [
    // ─── SESSION 1: Danh từ & Tính từ ─────────────────────────────
    {
        roadmap_id: s1, skill: 'grammar', type: 'multiple_choice',
        question: "She is a very _______ student. She always gets good grades.",
        options: ["dedicate", "dedicated", "dedicating"],
        correct: "dedicated",
        explanation: "Dùng tính từ dạng -ed (dedicated) để bổ nghĩa cho danh từ người (vị trí sau 'a very')."
    },
    {
        roadmap_id: s1, skill: 'grammar', type: 'multiple_choice',
        question: "There are _______ students in the classroom today.",
        options: ["a few", "a little", "much"],
        correct: "a few",
        explanation: "A few + N đếm được số nhiều (students). 'A little' dùng cho N không đếm được."
    },
    {
        roadmap_id: s1, skill: 'grammar', type: 'multiple_choice',
        question: "The news _______ very shocking.",
        options: ["was", "were", "are"],
        correct: "was",
        explanation: "'News' là danh từ không đếm được, chia động từ số ít (was)."
    },
    {
        roadmap_id: s1, skill: 'grammar', type: 'multiple_choice',
        question: "This is _______ interesting movie I have ever seen.",
        options: ["a", "an", "the"],
        correct: "the",
        explanation: "Dùng 'the' vì có phần xác định 'most interesting...ever seen' đi sau."
    },
    {
        roadmap_id: s1, skill: 'grammar', type: 'multiple_choice',
        question: "The presentation was _______ than I expected.",
        options: ["bored", "boring", "more boring"],
        correct: "more boring",
        explanation: "So sánh hơn của tính từ dài 'boring': more boring."
    },
    {
        roadmap_id: s1, skill: 'grammar', type: 'multiple_choice',
        question: "She was _______ in the lecture on climate change.",
        options: ["interested", "interesting", "interest"],
        correct: "interested",
        explanation: "-ed (interested) diễn tả cảm xúc của người (chủ thể bị tác động)."
    },
    {
        roadmap_id: s1, skill: 'grammar', type: 'multiple_choice',
        question: "I'd like _______ glass of water, please.",
        options: ["a", "an", "the"],
        correct: "a",
        explanation: "'Glass' là danh từ đếm được số ít bắt đầu bằng phụ âm, dùng 'a'."
    },
    {
        roadmap_id: s1, skill: 'grammar', type: 'multiple_choice',
        question: "She needs _______ advice about her career.",
        options: ["a", "an", "—"],
        correct: "—",
        explanation: "'Advice' là danh từ không đếm được, không dùng a/an trước nó."
    },

    // ─── SESSION 2: Trạng từ & S-V Agreement ──────────────────────
    {
        roadmap_id: s2, skill: 'grammar', type: 'multiple_choice',
        question: "The number of students in the class _______ increasing.",
        options: ["are", "is", "have"],
        correct: "is",
        explanation: "'The number of' + N số nhiều → chia động từ số ít (is)."
    },
    {
        roadmap_id: s2, skill: 'grammar', type: 'multiple_choice',
        question: "He _______ finished his homework before dinner.",
        options: ["quick", "quickly", "quicker"],
        correct: "quickly",
        explanation: "Trạng từ (quickly) bổ nghĩa cho động từ (finished)."
    },
    {
        roadmap_id: s2, skill: 'grammar', type: 'multiple_choice',
        question: "Neither the manager nor the employees _______ happy with the decision.",
        options: ["was", "were", "is"],
        correct: "were",
        explanation: "Neither A nor B → chia động từ theo B (employees = số nhiều → were)."
    },
    {
        roadmap_id: s2, skill: 'grammar', type: 'multiple_choice',
        question: "Swimming every day _______ good for your health.",
        options: ["are", "is", "have been"],
        correct: "is",
        explanation: "Danh động từ (Swimming) làm chủ ngữ → chia số ít (is)."
    },
    {
        roadmap_id: s2, skill: 'grammar', type: 'multiple_choice',
        question: "She speaks English very _______.",
        options: ["fluent", "fluently", "fluence"],
        correct: "fluently",
        explanation: "Trạng từ (fluently) đứng sau động từ để bổ nghĩa cho cách thức."
    },
    {
        roadmap_id: s2, skill: 'grammar', type: 'multiple_choice',
        question: "A number of problems _______ raised at the meeting.",
        options: ["was", "were", "is"],
        correct: "were",
        explanation: "'A number of' + N số nhiều → động từ số nhiều (were)."
    },
    {
        roadmap_id: s2, skill: 'grammar', type: 'multiple_choice',
        question: "Everyone in the team _______ hard for the project.",
        options: ["work", "works", "are working"],
        correct: "works",
        explanation: "'Everyone' là đại từ bất định → chia số ít (works)."
    },

    // ─── SESSION 3: Mệnh đề quan hệ & Điều kiện ───────────────────
    {
        roadmap_id: s3, skill: 'grammar', type: 'multiple_choice',
        question: "If I _______ you, I would apologize immediately.",
        options: ["am", "were", "was"],
        correct: "were",
        explanation: "Câu điều kiện loại 2: If + S + were... (dù chủ ngữ là gì)."
    },
    {
        roadmap_id: s3, skill: 'grammar', type: 'multiple_choice',
        question: "The book _______ I bought yesterday is very interesting.",
        options: ["who", "which", "whom"],
        correct: "which",
        explanation: "'Which' thay cho vật (book) trong mệnh đề quan hệ xác định."
    },
    {
        roadmap_id: s3, skill: 'grammar', type: 'multiple_choice',
        question: "If it rains tomorrow, we _______ the picnic.",
        options: ["cancel", "will cancel", "would cancel"],
        correct: "will cancel",
        explanation: "Câu điều kiện loại 1 (có thể xảy ra): If + HTĐ, S + will + V."
    },
    {
        roadmap_id: s3, skill: 'grammar', type: 'multiple_choice',
        question: "The woman _______ bag was stolen reported it to the police.",
        options: ["who", "whose", "which"],
        correct: "whose",
        explanation: "'Whose' chỉ sở hữu (túi của người phụ nữ)."
    },
    {
        roadmap_id: s3, skill: 'grammar', type: 'multiple_choice',
        question: "If you heat water to 100°C, it _______.",
        options: ["boils", "will boil", "would boil"],
        correct: "boils",
        explanation: "Câu điều kiện loại 0 (sự thật khoa học): If + HTĐ, HTĐ."
    },
    {
        roadmap_id: s3, skill: 'grammar', type: 'multiple_choice',
        question: "If she _______ harder, she would have passed the exam.",
        options: ["studied", "had studied", "has studied"],
        correct: "had studied",
        explanation: "Câu điều kiện loại 3 (không có thực ở quá khứ): If + had + P2."
    },
    {
        roadmap_id: s3, skill: 'grammar', type: 'multiple_choice',
        question: "This is the restaurant _______ we had our first date.",
        options: ["which", "where", "who"],
        correct: "where",
        explanation: "'Where' thay cho nơi chốn trong mệnh đề quan hệ."
    },

    // ─── SESSION 4: So sánh & Modal Verbs ─────────────────────────
    {
        roadmap_id: s4, skill: 'grammar', type: 'multiple_choice',
        question: "This exam is _______ I thought.",
        options: ["harder than", "more hard than", "hardest than"],
        correct: "harder than",
        explanation: "So sánh hơn của tính từ ngắn 'hard': harder than."
    },
    {
        roadmap_id: s4, skill: 'grammar', type: 'multiple_choice',
        question: "You _______ smoke in the hospital. It's not allowed.",
        options: ["mustn't", "don't have to", "couldn't"],
        correct: "mustn't",
        explanation: "Mustn't = bị cấm (không được phép). 'Don't have to' = không bắt buộc."
    },
    {
        roadmap_id: s4, skill: 'grammar', type: 'multiple_choice',
        question: "The more you practice, _______ you become.",
        options: ["the better", "the best", "better"],
        correct: "the better",
        explanation: "Cấu trúc: The more..., the + so sánh hơn..."
    },
    {
        roadmap_id: s4, skill: 'grammar', type: 'multiple_choice',
        question: "She is not _______ her sister.",
        options: ["as tall than", "as tall as", "taller as"],
        correct: "as tall as",
        explanation: "So sánh bằng: as + adj + as."
    },
    {
        roadmap_id: s4, skill: 'grammar', type: 'multiple_choice',
        question: "You look tired. You _______ take a rest.",
        options: ["must", "should", "have to"],
        correct: "should",
        explanation: "'Should' = lời khuyên (nên). 'Must/Have to' = bắt buộc."
    },
    {
        roadmap_id: s4, skill: 'grammar', type: 'multiple_choice',
        question: "Paris is _______ city I have ever visited.",
        options: ["most beautiful", "the most beautiful", "the more beautiful"],
        correct: "the most beautiful",
        explanation: "So sánh nhất của tính từ dài: the most + adj."
    },

    // ─── SESSION 5: Luyện tập tổng hợp 1 ─────────────────────────
    {
        roadmap_id: s5, skill: 'grammar', type: 'multiple_choice',
        question: "The letter _______ by the time he arrived.",
        options: ["sent", "had been sent", "was sending"],
        correct: "had been sent",
        explanation: "Thì quá khứ hoàn thành bị động (had been + P2) xảy ra trước hành động trong quá khứ."
    },
    {
        roadmap_id: s5, skill: 'grammar', type: 'multiple_choice',
        question: "I _______ to go to the gym, but now I prefer jogging.",
        options: ["was used", "used", "am used"],
        correct: "used",
        explanation: "'Used to + V' = đã từng làm gì trong quá khứ, nay không còn nữa."
    },
    {
        roadmap_id: s5, skill: 'grammar', type: 'multiple_choice',
        question: "By next month, she _______ for this company for 10 years.",
        options: ["will work", "will have worked", "has worked"],
        correct: "will have worked",
        explanation: "Thì tương lai hoàn thành (will have + P2): xong trước một thời điểm tương lai."
    },
    {
        roadmap_id: s5, skill: 'grammar', type: 'multiple_choice',
        question: "The report was _______ presented to the board.",
        options: ["clear", "clearing", "clearly"],
        correct: "clearly",
        explanation: "Trạng từ (clearly) bổ nghĩa cho động từ (was presented)."
    },
    {
        roadmap_id: s5, skill: 'grammar', type: 'multiple_choice',
        question: "He denied _______ the money from the company.",
        options: ["to steal", "stealing", "stolen"],
        correct: "stealing",
        explanation: "deny + V-ing (phủ nhận việc đã làm gì)."
    },

    // ─── SESSION 6: Luyện tập tổng hợp 2 ─────────────────────────
    {
        roadmap_id: s6, skill: 'grammar', type: 'multiple_choice',
        question: "She suggested _______ out for dinner to celebrate.",
        options: ["to go", "going", "went"],
        correct: "going",
        explanation: "suggest + V-ing (gợi ý làm gì)."
    },
    {
        roadmap_id: s6, skill: 'grammar', type: 'multiple_choice',
        question: "It's high time you _______ a decision.",
        options: ["make", "made", "have made"],
        correct: "made",
        explanation: "'It's high time + S + V (quá khứ)' → đã đến lúc phải làm gì rồi."
    },
    {
        roadmap_id: s6, skill: 'grammar', type: 'multiple_choice',
        question: "I wish I _______ more money right now.",
        options: ["had", "have", "would have"],
        correct: "had",
        explanation: "'Wish + S + quá khứ đơn' → ước điều gì không có thực ở hiện tại."
    },
    {
        roadmap_id: s6, skill: 'grammar', type: 'multiple_choice',
        question: "The students are expected _______ their assignments by Friday.",
        options: ["submitting", "to submit", "submit"],
        correct: "to submit",
        explanation: "expect + to V (dự kiến/kỳ vọng làm gì)."
    },
    {
        roadmap_id: s6, skill: 'grammar', type: 'multiple_choice',
        question: "Not only _______ to the concert, but he also met the singer.",
        options: ["he went", "did he go", "he did go"],
        correct: "did he go",
        explanation: "Đảo ngữ với 'Not only': Not only + did + S + V."
    },

    // ─── SESSION 7: Mẹo làm bài Kỹ năng ─────────────────────────
    {
        roadmap_id: s7, skill: 'reading', type: 'multiple_choice',
        question: "In a 'match headings' reading task, where should you look first to understand a paragraph's main idea?",
        options: ["The middle sentences", "The first and last sentence", "Every single word"],
        correct: "The first and last sentence",
        explanation: "Câu chủ đề thường ở đầu hoặc cuối đoạn. Đây là mẹo đọc nhanh (skimming) hiệu quả."
    },
    {
        roadmap_id: s7, skill: 'listening', type: 'multiple_choice',
        question: "When listening for specific information (e.g., a number), what is the best strategy?",
        options: ["Write nothing until the audio ends", "Listen for context around the number, not just the number itself", "Always pick the first number you hear"],
        correct: "Listen for context around the number, not just the number itself",
        explanation: "Các đáp án có thể chứa nhiều số. Phải nghe ngữ cảnh xung quanh để xác định đúng thông tin."
    },
    {
        roadmap_id: s7, skill: 'speaking', type: 'multiple_choice',
        question: "In APTIS Speaking Part 2 (Describe a photo), which phrase is best to start with?",
        options: ["I think this photo is...", "In this picture, I can see...", "The photo shows me..."],
        correct: "In this picture, I can see...",
        explanation: "'In this picture, I can see...' là cách mở đầu chuẩn và tự nhiên nhất cho phần tả ảnh."
    },
    {
        roadmap_id: s7, skill: 'writing', type: 'multiple_choice',
        question: "For APTIS Writing Part 4b (Formal Email, 120-150 words), which register is required?",
        options: ["Informal, like texting a friend", "Formal, using polite language and full sentences", "Academic, with citations"],
        correct: "Formal, using polite language and full sentences",
        explanation: "Email chính thức (Formal) cần ngôn ngữ lịch sự, không dùng viết tắt (I'm → I am), tránh tiếng lóng."
    },
];

const insert = db.prepare(`
    INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, roadmap_id)
    VALUES (?, ?, ?, ?, ?, ?, 'B2', ?)
`);

const insertMany = db.transaction(() => {
    for (const q of questions) {
        if (!q.roadmap_id) { console.log(`Skipping: no session ID for question "${q.question.slice(0,30)}..."`); continue; }
        insert.run(q.skill, q.type, q.question, JSON.stringify(q.options), q.correct, q.explanation, q.roadmap_id);
    }
});

insertMany();
console.log(`✅ Done! Added ${questions.length} new questions aligned with theory content.`);
db.close();
