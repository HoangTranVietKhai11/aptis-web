const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

console.log('Thêm nội dung Lý Thuyết (Theory Content) cho 30 Sessions Roadmap Tiên Phong...');

// Helper to generate content
function generateTheory(title, stage, number) {
  let content = '';

  if (title.includes('Phát Âm Chuẩn IPA')) {
    content = `### 🎯 Bảng Phiên Âm Quốc Tế (IPA)
**Tại sao cần học IPA?** Giúp bạn phát âm chuẩn xác bất kỳ từ nào khi tra từ điển, tối quan trọng cho Speaking Part 1.
*   **Nguyên âm (Vowels):** Bao gồm nguyên âm ngắn (e.g., /ɪ/, /e/) và dài (e.g., /i:/, /a:/). Chú ý khẩu hình miệng.
*   **Phụ âm (Consonants):** Chú ý các phụ âm bật hơi (/p/, /t/, /k/) và các âm xát (/θ/, /ð/ - thè lưỡi).
*   **Trọng âm (Word Stress):** Tiếng Anh không có dấu như tiếng Việt, nhưng có trọng âm. Nhấn sai trọng âm = người bản xứ không hiểu.
> **💡 Mẹo:** Hãy ghi âm lại giọng của mình và so sánh với từ điển Cambridge!`;
  } 
  else if (title.includes('Từ Vựng Đời Sống')) {
    content = `### 📚 Từ vựng sinh tồn (A1-A2)
Với trình độ nền tảng, đừng học từ vựng cao siêu. Hãy tập trung vào:
1.  **Gia đình & Bản thân:** parents, siblings, hobbies, daily routine.
2.  **Thời gian & Con số:** today, tomorrow, usually, sometimes, số đếm từ 1-100.
3.  **Địa điểm:** hospital, restaurant, library, hometown.
> **💡 Khẩu quyết học từ:** Học theo cụm (Collocation) thay vì học từ đơn lẻ. Ví dụ: Học "make a mistake" chứ đừng học chữ "make" và chữ "mistake" rời rạc.`;
  }
  else if (title.includes('6 Thì Tiếng Anh Cơ Bản')) {
    content = `### ⏳ 6 Thì "Cứu Cánh" Trong Aptis
Bạn chỉ cần nắm chắc 6 thì sau là đủ sức lấy B1:
1.  **Hiện tại đơn:** Thói quen, sự thật hiển nhiên (He *plays* football). Dấu hiệu: usually, always.
2.  **Hiện tại tiếp diễn:** Đang diễn ra (I *am studying* now). Dấu hiệu: now, at the moment.
3.  **Quá khứ đơn:** Đã kết thúc trong quá khứ (She *went* home yesterday). Dấu hiệu: yesterday, ago, last.
4.  **Quá khứ tiếp diễn:** Đang xảy ra tại một thời điểm cụ thể trong quá khứ (I *was sleeping* at 8PM yesterday).
5.  **Tương lai đơn:** Sẽ làm gì đó (I *will call* you). Dấu hiệu: tomorrow, next.
6.  **Hiện tại hoàn thành:** Xảy ra trong quá khứ, kéo dài đến hiện tại (I *have lived* here for 5 years). Dấu hiệu: since, for, already.`;
  }
  else if (title.includes('Nghe Chép Chính Tả')) {
    content = `### 🎧 Kỹ thuật chiến phục Listening Part 1
Phần 1 của Aptis Listening luôn yêu cầu bạn nghe thông tin cụ thể (Specific Info).
*   **Numbers & Times:** Chú ý bẫy giữa \`13 (thirteen)\` và \`30 (thirty)\`, hay \`quarter to 5\` (4:45) và \`quarter past 5\` (5:15).
*   **Spelling:** Nắm chắc bảng chữ cái (A-Z). Rất hay có bẫy đọc tên A-N-N-A nhưng sau đó sửa lại thành A-N-A.
> **💡 Chiến thuật:** Đọc kỹ 3 đáp án TRƯỚC khi audio bắt đầu chạy!`;
  }
  else if (title.includes('Đọc Hiểu Câu Đơn')) {
    content = `### 📖 Reading Part 1: Bắt Keyword
Đọc biển báo, thông báo ngắn, hoặc email:
*   Mục tiêu: Đạt 5/5 câu phần này nhanh nhất có thể.
*   **MUST / MUST NOT:** Biển báo cấm (You must not smoke = No smoking).
*   **CAN / ALLOWED:** Cho phép (You can park here = Parking available).
Đừng dịch word-by-word, hãy nhìn cấu trúc phủ định và từ đồng nghĩa (Synonyms).`;
  }
  else if (title.includes('Viết Form') && stage === 'A1-A2') {
    content = `### 📝 Writing Part 1 & 2: Ngắn gọn và chính xác
**Part 1 (Điền Form):**
*   Chỉ cần viết 1-5 từ. KHÔNG CẦN viết cả câu dài.
*   Hỏi "Hobbies?" -> Viết "Reading books, swimming" (10 điểm). Viết dài sai chính tả -> 0 điểm.

**Part 2 (Tin nhắn mạng xã hội):**
*   Yêu cầu: 20-30 từ.
*   Cấu trúc: Trả lời trực tiếp + Đưa ra 1 lý do.
*   Ví dụ: "I love swimming because it helps me relax after a long day at work." (14 từ - quá chuẩn).`;
  }
  else if (title.includes('Speaking Trả Lời Ngắn')) {
    content = `### 🗣️ Speaking Part 1: Thần chú 3 bước
Giám khảo hỏi 3 câu cá nhân (30 giây/câu). Đừng chỉ nói "Yes/No". Dùng công thức A.R.E:
*   **A (Answer):** Trả lời trực tiếp trọng tâm.
*   **R (Reason):** Giải thích lý do vì sao ("because...").
*   **E (Example/Detail):** Đưa thêm 1 chi tiết nhỏ ("For example...", "In fact...").
*Ví dụ:* Do you like sports? -> Yes, I do (A). I love playing football because it keeps me fit (R). I usually play it with my friends on Sundays (E).`;
  }
  else if (title.includes('Grammar & Vocab Core')) {
    content = `### 🧱 Grammar Hub - Ôn Tập B2
Để bứt phá B2, bạn phải dùng được:
1.  **Câu điều kiện hỗn hợp & Loại 3:** Phân tích giả thiết không có thật trong quá khứ.
2.  **Động từ khuyết thiếu trong quá khứ (Perfect Modals):** \`should have P2\` (lẽ ra nên), \`must have P2\` (chắc hẳn đã).
3.  **Mệnh đề quan hệ:** Dùng \`which\` bổ nghĩa cho cả câu trước (bắt buộc có dấu phẩy).
Xem kỹ lại tính năng Grammar Hub trên hệ thống để cày 12 thì cơ bản!`;
  }
  else if (title.includes('Ngữ Pháp Nâng Cao')) {
    content = `### 🚀 Xưng Bá Ngữ Pháp C1 (Advanced Grammar)
Giám khảo luôn tìm kiếm các cấu trúc phức tạp trong bài Writing & Speaking của bạn:
*   **Đảo ngữ (Inversion):** Hardly had I arrived when it rained. (Vừa mới tới thì trời mưa).
*   **Câu chẻ (Cleft sentences):** It is the environment that we must protect. (Chính môi trường là thứ ta phải bảo vệ).
*   **Câu Bị Động Khách Quan (Impersonal Passive):** It is said that / He is believed to have...
> **🚨 Cảnh báo:** Chỉ dùng khi bạn thực sự chắc chắn về cấu trúc ngữ pháp. Dùng sai sẽ bị trừ điểm nặng hơn so với việc dùng câu đơn!`;
  }
  else if (title.includes('Listening & Reading Tiên Phong')) {
    content = `### 👁️‍🗨️ Skimming & Scanning & Loại Trừ Bẫy
**Đối với Reading Part 4 (Nối 7 đoạn văn với 8 tiêu đề):**
*   Chỉ đọc câu ĐẦU TIÊN và câu CUỐI CÙNG của mỗi đoạn để bắt Topic Sentence.
*   Tìm từ đồng nghĩa (Paraphrasing) giữa tiêu đề và đoạn văn. Đừng bao giờ chọn tiêu đề nếu nó lập lại y hệt từ vựng trong đoạn văn (đó thường là bẫy).
**Đối với Listening Part 3 (Suy luận thái độ):**
*   Nghe từ vựng chỉ cảm xúc (amazing, unfortunately, to be honest...).
*   Nghe ngữ điệu (Intonation): Giọng lên cao thường là ngạc nhiên, giọng đi xuống/thở dài là thất vọng (Disappointed).`;
  }
  else if (title.includes('Khẩu Quyết Speaking')) {
    content = `### 🎤 Speaking B2-C1 Frameworks
*   **Part 2 (Mô tả tranh):** Không mô tả vụn vặt. Dùng phác đồ: \`Tâm điểm -> Xung quanh -> Nền & Bố cảnh -> Suy đoán cảm xúc\`. BĂT BUỘC dùng cấu trúc suy đoán: "He looks like...", "They might be...".
*   **Part 3 (So sánh 2 tranh):** ĐỪNG đi mô tả lại từ đầu. Thay vào đó, dùng ngay: "While the first picture shows X, the second displays Y. Both situations have their merits, but...".
*   **Part 4 (Chủ đề trừu tượng):** 1 phút chuẩn bị hãy note 3 keywords. Khi nói, áp dụng: Mở bài (Hook) -> Ý 1 (Cộng ví dụ) -> Ý 2 (Cộng ví dụ) -> Tóm lại. Khép lại bằng "To sum up...".`;
  }
  else if (title.includes('Dàn Bài Writing Bất Bại')) {
    content = `### ✍️ Writing Part 4 - Ăn Điểm Register (Văn phong)
Yêu cầu bạn viết 1 Email Thân Mật (Informal) cho bạn bè và 1 Email Trang Trọng (Formal) cho người lạ. Bạn sẽ bị trừ điểm cực nặng nếu nhầm lẫn văn phong!
**Informal Email (40-50 từ):**
*   Chào hỏi: Hi John, / Hey Mary,
*   Mở đầu: How are things? / Great to hear from you!
*   Kết thúc: Catch up soon, / Best,
*   Từ vựng: Được viết tắt (I'm, can't), dùng Phrasal verbs.

**Formal Email (120-150 từ):**
*   Chào hỏi: Dear Sir/Madam, / Dear Mr. Smith,
*   Mở đầu: I am writing to express my dissatisfaction with... / I am writing to enquire about...
*   Kết thúc: I look forward to hearing from you soon. Yours faithfully/sincerely,
*   Từ vựng: KHÔNG viết tắt (I am, cannot), dùng từ ngữ trang trọng (reside, purchase, inquire).`;
  }
  else if (title.includes('Full Mock Test') || title.includes('Gộp Đề') || title.includes('Thực Hành') || title.includes('Khắc Phục Lỗi') || title.includes('Kiểm Tra Xác Nhận')) {
    content = `### ⚔️ Thực Chiến (Practice Phase)
Nhiệm vụ của bạn ở bài này không còn là học lý thuyết mới, mà là **ÁP DỤNG MỌI THỨ VÀO THỰC TẾ**.
*   **Canh thời gian chặt chẽ:** Aptis là một bài test áp lực thời gian cực lớn (Đặc biệt là Reading 35 phút cho 4 parts). Hãy chú ý đồng hồ của hệ thống đếm ngược bên góc màn hình.
*   **Nhờ AI sửa lỗi:** Phần Writing và Speaking của bạn sẽ được AI Tutor chấm điểm. Đừng chỉ xem số điểm! Hãy ấn đọc phần giải thích tại sao AI lại bôi đỏ từ đó, và lưu lại những từ vựng mà AI gợi ý (Suggested Vocabulary) vào Sổ Tay Từ Vựng.
> **🔥 Lời khuyên:** Fail to prepare is prepare to fail. Tập trung 100% tinh thần như bài thi thật!`;
  }
  else {
    content = `### 📚 Học Liệu Quan Trọng\nChuẩn bị giấy bút, note lại những quy tắc quan trọng trong bài này để áp dụng ngay vào phần Thực hành phía dưới nhé! Đừng quên check AI Feedback sau khi làm xong.`;
  }

  return content;
}

const sessions = db.prepare(`SELECT id, title, stage, session_number FROM roadmap WHERE roadmap_name = 'Aptis Tiên Phong [Chị Phương]'`).all();
const updateStmt = db.prepare(`UPDATE roadmap SET theory_content = ? WHERE id = ?`);

db.transaction(() => {
  let count = 0;
  for (const s of sessions) {
    const theory = generateTheory(s.title, s.stage, s.session_number);
    if (theory) {
      updateStmt.run(theory, s.id);
      count++;
    }
  }
  console.log(`✅ Đã cập nhật theory_content cho ${count} sessions.`);
})();

db.close();
