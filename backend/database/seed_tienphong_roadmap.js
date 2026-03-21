const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

console.log('Seeding Roadmap Aptis Tiên Phong cho Chị Phương...');

const roadmapName = 'Aptis Tiên Phong [Chị Phương]';

// Xóa roadmap cũ của chị Phương nếu có trùng tên hoặc tạo mới
db.prepare("DELETE FROM roadmap WHERE roadmap_name = ?").run(roadmapName);

const sessions = [
    // --- LÝ THUYẾT (Nguyên tắc 1: 3 tiếng lý thuyết cốt lõi) ---
    { n: 1, title: 'Video 1: Grammar & Vocab Core', skill: 'grammar', stage: 'B1-C1', desc: 'Cô đọng 12 thì cơ bản và từ vựng thiết yếu.', obj: 'Nắm vững nền tảng Grammar Hub.', bc: 'GRAMMAR_HUB' },
    { n: 2, title: 'Video 2: Ngữ Pháp Nâng Cao', skill: 'grammar', stage: 'B1-C1', desc: 'Mối quan hệ từ loại, mệnh đề, câu chẻ, câu điều kiện.', obj: 'Làm chủ các cấu trúc ăn điểm cao.', bc: 'GRAMMAR_HUB' },
    { n: 3, title: 'Video 3: Listening & Reading Tiên Phong', skill: 'reading', stage: 'B1-C1', desc: 'Khẩu quyết giải quyết Reading Part 3,4 và Listening suy luận.', obj: 'Biết cách áp dụng keyword và mẹo loại trừ.', bc: 'Reading & Listening core' },
    { n: 4, title: 'Video 4: Khẩu Quyết Speaking', skill: 'speaking', stage: 'B1-C1', desc: 'Cấu trúc trả lời Speaking 4 Parts không bao giờ bí ý tưởng.', obj: 'Đạt điểm Speaking B2 trở lên.', bc: 'Speaking All Parts' },
    { n: 5, title: 'Video 5: Dàn Bài Writing Bất Bại', skill: 'writing', stage: 'B1-C1', desc: 'Định dạng Email thân mật và Formal Email.', obj: 'Viết Writing Part 4 ăn trọn điểm.', bc: 'Writing Format' },
    
    // --- LUYỆN TẬP GỘP ĐỀ (Nguyên tắc 2: 90% thời gian thực hành có AI chấm) ---
    { n: 6, title: 'Thực Hành: Grammar & Vocabulary', skill: 'grammar', stage: 'B1-C1', desc: 'Luyện tập 50 câu Grammar & Vocab (25 phút).', obj: 'Đạt tốc độ 30 giây/câu.', bc: 'Practice Mode' },
    { n: 7, title: 'Thực Hành: Listening & Reading', skill: 'reading', stage: 'B1-C1', desc: 'Luyện giải đề Listening (40p) và Reading (35p) theo chuẩn 2026.', obj: 'Cải thiện phản xạ nghe đọc.', bc: 'Practice Mode' },
    { n: 8, title: 'Thực Hành: Speaking & Writing (AI Chấm)', skill: 'speaking', stage: 'B1-C1', desc: 'Ghi âm và Gõ máy thực tế. AI báo lỗi s-es và gợi ý từ vựng.', obj: 'Tối ưu hóa phát âm và grammar writing.', bc: 'AI grading' },

    // --- FULL MOCK TESTS (Nguyên tắc 3: Mỗi ngày 1 bộ test chẩn đoán) ---
    { n: 9, title: 'Full Mock Test 1', skill: 'grammar', stage: 'B1-C1', desc: 'Bài thi thử số 1 (Đầu vào).', obj: 'Đánh giá năng lực hiện tại.', bc: 'Full Mock Test 1' },
    { n: 10, title: 'Luyện Tập Khắc Phục Lỗi (Sau Mock 1)', skill: 'speaking', stage: 'B1-C1', desc: 'Hệ thống AI nhắc nhở lỗi sai ở Mock 1.', obj: 'Cải biến điểm yếu.', bc: 'Review Mode' },
    
    { n: 11, title: 'Full Mock Test 2', skill: 'reading', stage: 'B1-C1', desc: 'Bài thi thử số 2.', obj: 'Nâng cao độ tập trung.', bc: 'Full Mock Test 2' },
    { n: 12, title: 'Luyện Tập Khắc Phục Lỗi (Sau Mock 2)', skill: 'writing', stage: 'B1-C1', desc: 'Ôn tập từ vựng, sửa lỗi writing.', obj: 'Biến lỗi sai thành kinh nghiệm.', bc: 'Review Mode' },
    
    { n: 13, title: 'Full Mock Test 3', skill: 'listening', stage: 'B1-C1', desc: 'Bài thi thử số 3.', obj: 'Mô phỏng áp lực phòng thi.', bc: 'Full Mock Test 3' },
    { n: 14, title: 'Full Mock Test 4', skill: 'speaking', stage: 'B1-C1', desc: 'Bài thi thử số 4.', obj: 'Ổn định tâm lý.', bc: 'Full Mock Test 4' },
    { n: 15, title: 'Full Mock Test 5', skill: 'grammar', stage: 'B1-C1', desc: 'Bài thi thử số 5.', obj: 'Hoàn thiện kỹ năng.', bc: 'Full Mock Test 5' },
    
    // Các bộ đề thực chiến cuối cùng
    { n: 16, title: 'Full Mock Test 6', skill: 'reading', stage: 'B1-C1', desc: 'Đề thi thực tế bám sát năm 2026.', obj: 'Target B2-C1.', bc: 'Full Mock Test 6' },
    { n: 17, title: 'Full Mock Test 7', skill: 'writing', stage: 'B1-C1', desc: 'Đề thi thực tế bám sát năm 2026.', obj: 'Target B2-C1.', bc: 'Full Mock Test 7' },
    { n: 18, title: 'Full Mock Test 8', skill: 'speaking', stage: 'B1-C1', desc: 'Đề thi thực tế bám sát năm 2026.', obj: 'Target B2-C1.', bc: 'Full Mock Test 8' },
    { n: 19, title: 'Full Mock Test 9', skill: 'listening', stage: 'B1-C1', desc: 'Đề thi thực tế bám sát năm 2026.', obj: 'Target B2-C1.', bc: 'Full Mock Test 9' },
    
    { n: 20, title: 'Full Mock Test 10 - Tốt Nghiệp B2/C1', skill: 'grammar', stage: 'B1-C1', desc: 'Đề thi TỐT NGHIỆP siêu cấp độ khó.', obj: 'Bảo chứng điểm C1.', bc: 'Full Mock Test 10' }
];

const insertR = db.prepare(`
    INSERT INTO roadmap (session_number, title, skill, description, stage, objectives, bc_ref, unlocked, roadmap_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

db.transaction(() => {
    for (let i = 0; i < sessions.length; i++) {
        const s = sessions[i];
        // Unlock session 1 by default, the rest are locked initially
        insertR.run(s.n, s.title, s.skill, s.desc, s.stage, s.obj, s.bc, i === 0 ? 1 : 0, roadmapName);
    }
})();

console.log(`✅ Thành công: Tạo mới Roadmap "Aptis Tiên Phong [Chị Phương]" với ${sessions.length} sessions.`);
db.close();
