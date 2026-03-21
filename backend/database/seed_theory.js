const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('Populating theory content for Chị Phương Roadmap...');

try {
    db.exec("ALTER TABLE roadmap ADD COLUMN theory_content TEXT");
} catch (e) {
    console.log('Column theory_content already exists.');
}

const theories = {
    'Session 1: Danh từ & Tính từ': `
### 1. Mẹo về danh từ (Nouns)
*   **Giới từ + N/ Ving**: Sau giới từ thường là danh từ hoặc danh động từ.
*   **The + N**: Mạo từ "The" luôn đi với danh từ.
*   **A/an + N (đếm được số ít)**: Cần có mạo từ cho danh từ số ít.
*   **Lượng từ + N**:
    *   *Số nhiều*: few, a few, many, several... + N (số nhiều).
    *   *Không đếm được*: Much, little, a great deal of... + N (không đếm được).
*   **Tính từ sở hữu + N**: my, your, his, her... + N.

### 2. Mẹo về tính từ (Adjectives)
*   **Vị trí**: A/ an/ the + **adj** + N.
*   **Sau từ chỉ số lượng**: Some, many, much... + **adj** + N.
*   **Sau Động từ chỉ trạng thái**: Become, feel, look... + **adj**.
*   **Phân biệt đuôi**:
    *   **-ed**: Bị động, cảm xúc (interested, bored).
    *   **-ing**: Bản chất sự vật (interesting, boring).
    `,
    'Session 2: Trạng từ & Sự hòa hợp S-V': `
### 1. Mẹo về trạng từ (Adverbs)
*   **Cấu tạo**: Adj + **-ly** = Adv (usefully, extremely).
*   **Vị trí thông dụng**:
    *   Be + **adv** + Ving / Ved.
    *   Modal verb + **adv** + V.
    *   Be + **adv** + Adj.
    *   Đứng đầu câu, trước dấu phẩy: **Adv**, S + V.

### 2. Sự hòa hợp Chủ ngữ - Động từ (S-V Agreement)
*   **Chia số ít (is/was/has/Vs,es)**:
    *   Danh từ đếm được số ít / không đếm được.
    *   One of the + N (số nhiều).
    *   Danh động từ (Ving làm chủ ngữ).
    *   Đại từ bất định (someone, everything...).
    *   Each, Every + N.
*   **Chia số nhiều (are/were/have/V)**:
    *   Danh từ số nhiều.
    *   The + Adj (chỉ tầng lớp người: the rich, the poor).
    *   A number of + N (số nhiều).
    *   A and B / Both A and B.
    `,
    'Session 3: Mệnh đề quan hệ & Điều kiện': `
### 1. Mệnh đề quan hệ (Relative Clauses)
*   **Who**: Thay cho người, làm chủ ngữ (N_người + **who** + V).
*   **Whose**: Chỉ sở hữu (N_người + **whose** + N).
*   **Which**: Thay cho vật (N_vật + **which** + V/S-V).
*   **That**: Thay cho cả người và vật (trong mệnh đề xác định).

### 2. Câu điều kiện (Conditionals)
*   **Loại 0 (Sự thật hiển nhiên)**: If + S + V(hiện tại), S + V(hiện tại).
*   **Loại 1 (Có thể xảy ra)**: If + S + V(hiện tại), S + will/can + V(nguyên thể).
*   **Loại 2 (Không có thực ở hiện tại)**: If + S + V(quá khứ/were), S + would/could + V(nguyên thể).
*   **Loại 3 (Không có thực ở quá khứ)**: If + S + had + P2, S + would/could + have + P2.
    `,
    'Session 4: So sánh & Cấu trúc bổ trợ': `
### 1. Dạng so sánh (Comparisons)
*   **So sánh bằng**: S1 + be + **as + adj + as** + S2.
*   **So sánh hơn**:
    *   *Tính từ ngắn*: Adj + **-er** + than.
    *   *Tính từ dài*: **more** + Adj + than.
*   **So sánh nhất**:
    *   *Tính từ ngắn*: the + Adj + **-est**.
    *   *Tính từ dài*: the **most** + Adj.

### 2. Modal Verbs & Special Structures
*   **Used to + V**: Đã từng làm gì.
*   **Be/Get used to + Ving**: Quen với việc gì.
*   **Should/Ought to**: Lời khuyên.
    `,
    'Session 7: Mẹo làm bài Kỹ năng': `
### Mẹo chung cho các kỹ năng APTIS
*   **Reading**: Chú ý từ khóa (keywords) và các từ nối (however, therefore, in addition) để xác định logic đoạn văn.
*   **Listening**: Nghe kỹ các số liệu (numbers), thời gian (time), và địa điểm. Đừng vội chọn ngay khi nghe thấy từ khóa, hãy nghe hết câu.
*   **Speaking Part 2**: Luôn bắt đầu bằng "In this picture, I can see...". Sử dụng giới từ chỉ vị trí (on the left, in the background).
*   **Writing Part 3**: Trả lời đúng trọng tâm câu hỏi của 3 người bạn. Dùng ngôn ngữ thân mật (Hi, Thanks for sharing).
    `
};

for (const [title, theory] of Object.entries(theories)) {
    db.prepare("UPDATE roadmap SET theory_content = ? WHERE title = ?").run(theory.trim(), title);
}

console.log('✅ Theory data seeded.');
db.close();
