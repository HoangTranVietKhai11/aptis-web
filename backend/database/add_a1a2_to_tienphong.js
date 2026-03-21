const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

console.log('Cập nhật Roadmap: Thêm nền tảng A1-A2 cho học viên yếu...');

db.transaction(() => {
    // 1. Dịch chuyển các session B1-C1 hiện tại lên 10 bậc để nhường chỗ trống từ 1-10
    db.prepare(`
        UPDATE roadmap 
        SET session_number = session_number + 10 
        WHERE roadmap_name = 'Aptis Tiên Phong [Chị Phương]' AND stage = 'B1-C1'
    `).run();

    // 2. Định nghĩa 10 session nền tảng A1-A2
    const a1a2Sessions = [
        { n: 1, title: 'Nền Tảng 1: Phát Âm Chẩn IPA', skill: 'speaking', stage: 'A1-A2', desc: 'Làm quen bảng phiên âm quốc tế IPA và cách phát âm cơ bản.', obj: 'Đọc đúng phiên âm từng từ vựng mới.', bc: 'Foundation' },
        { n: 2, title: 'Nền Tảng 2: Từ Vựng Đời Sống', skill: 'vocabulary', stage: 'A1-A2', desc: 'Nhồi 300 từ vựng cơ bản nhất (Gia đình, Thời gian, Đồ vật).', obj: 'Nắm chắc vốn từ vựng sinh tồn.', bc: 'Foundation' },
        { n: 3, title: 'Nền Tảng 3: 6 Thì Tiếng Anh Cơ Bản', skill: 'grammar', stage: 'A1-A2', desc: 'Hiện Tại Đơn, Tiếp Diễn, Quá Khứ, Tương Lai Đơn.', obj: 'Không sai ngữ pháp khi đặt câu đơn.', bc: 'Foundation' },
        { n: 4, title: 'Nền Tảng 4: Nghe Chép Chính Tả (A1)', skill: 'listening', stage: 'A1-A2', desc: 'Luyện nghe số điện thoại, giờ giấc, tên người.', obj: 'Bắt đúng keyword cơ bản trong Part 1 Listening.', bc: 'Foundation' },
        { n: 5, title: 'Nền Tảng 5: Đọc Hiểu Câu Đơn (A1)', skill: 'reading', stage: 'A1-A2', desc: 'Nhận diện biển báo, Email ngắn nhắn tin.', obj: 'Làm quen văn bản reading cơ bản.', bc: 'Foundation' },
        { n: 6, title: 'Nền Tảng 6: Viết Form & Tin Nhắn', skill: 'writing', stage: 'A1-A2', desc: 'Thực hành điền Form (Part 1) và nhắn tin (Part 2) Writing.', obj: 'Viết câu hoàn chỉnh không sai chính tả.', bc: 'Foundation' },
        { n: 7, title: 'Nền Tảng 7: Speaking Trả Lời Ngắn', skill: 'speaking', stage: 'A1-A2', desc: 'Luyện trả lời 3 câu hỏi cá nhân Part 1 Speaking.', obj: 'Nói tự tin, trôi chảy thông tin cá nhân.', bc: 'Foundation' },
        { n: 8, title: 'Luyện Tập Gộp Đề (A1-A2) - Đọc & Nghe', skill: 'reading', stage: 'A1-A2', desc: 'Mini test Đọc & Nghe dễ.', obj: 'Quen với áp lực làm bài nhẹ.', bc: 'Foundation' },
        { n: 9, title: 'Luyện Tập Gộp Đề (A1-A2) - Nói & Viết', skill: 'writing', stage: 'A1-A2', desc: 'Thực hành Nói & Viết có AI check lỗi chính tả, s-es.', obj: 'Hình thành phản xạ output.', bc: 'Foundation' },
        { n: 10, title: 'Bài Kiểm Tra Xuyên Môn (Tốt Nghiệp A2)', skill: 'grammar', stage: 'A1-A2', desc: 'Review toàn diện kiến thức để sẵn sàng lên B1.', obj: 'Xác nhận sẵn sàng học giai đoạn tăng tốc B1-C1.', bc: 'Foundation' }
    ];

    const insertR = db.prepare(`
        INSERT INTO roadmap (session_number, title, skill, description, stage, objectives, bc_ref, unlocked, roadmap_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < a1a2Sessions.length; i++) {
        const s = a1a2Sessions[i];
        insertR.run(s.n, s.title, s.skill, s.desc, s.stage, s.obj, s.bc, i === 0 ? 1 : 0, 'Aptis Tiên Phong [Chị Phương]');
    }

    // Đảm bảo session_number 1 (A1-A2) là unlocked, còn session 11 (trước đây là 1 của B1-C1) bị khoá lại nếu cần
    // (Tuỳ chọn: cứ để 11 unlocked nếu chị phương đã làm tới đó, nhưng logic tốt nhất là cứ kệ nó)
})();

console.log('✅ Thành công: Đã chèn thành công 10 Session nền tảng A1-A2 vào hành trình học!');
db.close();
