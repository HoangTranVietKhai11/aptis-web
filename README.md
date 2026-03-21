# 🚀 APTIS ESOL 2026 AI Learning Platform

Bảng điều khiển học tập thông minh cho Aptis ESOL, tích hợp AI chấm điểm (Gemini), lộ trình cá nhân hóa (Roadmap Tiên Phong) và hệ thống Gamification.

## 🌟 Tính năng chính

*   **Roadmap Tiên Phong (30 Sessions):** Phân chia A1-A2 và B1-C1 chuyên sâu.
*   **AI Grading (Gemini 2.0):** Chấm điểm Writing/Speaking theo tiêu chuẩn British Council (4 traits).
*   **10 Full Mock Tests:** 1080 câu hỏi mô phỏng 100% cấu trúc đề thi thật.
*   **Smart Mistake Notebook:** Tự động lưu lỗi sai từ vựng/ngữ pháp để ôn tập.
*   **Certificate Generation:** Tặng chứng chỉ khi hoàn thành lộ trình.
*   **Gamification:** Hệ thống XP, Level, Streaks và Leaderboard.

---

## 🛠️ Cách chạy nhanh (Docker - Khuyên dùng cho Deploy)

Nếu bạn muốn người khác dùng nhanh nhất, chỉ cần chạy 1 lệnh với Docker:

1.  **Tạo file `.env`** ở thư mục root và thêm Key:
    ```env
    GEMINI_API_KEY=your_gemini_key_here
    ```

2.  **Build & Run:**
    ```bash
    docker build -t aptis-ai .
    docker run -d -p 3003:3003 --env-file .env aptis-ai
    ```
    *Truy cập tại: http://localhost:3003*

---

## 👨‍💻 Chạy thủ công (Development)

### 1. Backend (API & Static Server)
```bash
cd backend
npm install
node server.js
```
*Backend chạy tại: http://localhost:3003*

### 2. Frontend (Nếu muốn sửa Code)
```bash
cd frontend
npm install
npm run dev
```
*Frontend chạy tại: http://localhost:5173*

---

## 📤 Hướng dẫn Push lên GitHub

1.  **Tạo Repo mới** trên [GitHub](https://github.com/new).
2.  **Add Remote & Push:**
    ```bash
    git remote add origin <url_cua_repo_ban_vừa_tạo>
    git branch -M master
    git push -u origin master
    ```

---

## ☁️ Deployment (Lưu ý về SQLite)

Ứng dụng sử dụng **SQLite** để lưu trữ. Khi deploy (Render/Railway/VPS), bạn cần:
*   **Persistent Disk:** Cấp quyền ghi cho file `backend/database/aptis.db`.
*   **Environment Variable:** Cần set `GEMINI_API_KEY` trong Settings của nhà cung cấp.

---

*Phát triển bởi Ms. Phuong & AI Team.*
