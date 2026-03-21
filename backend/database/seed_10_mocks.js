const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

console.log('🌟 Bắt đầu sinh 10 bộ đề thi thử Aptis ESOL 2026 (Aptis Tiên Phong)...');

const THEMES = [
  'Technology & Digital Life',
  'Environment & Sustainability',
  'Education & Learning',
  'Work & Career',
  'Travel & Tourism',
  'Health & Fitness',
  'Society & Culture',
  'Arts & Media',
  'Science & Innovation',
  'Business & Economy'
];

try {
  // Clear previous mock tests matching these themes to avoid duplicates
  db.prepare("DELETE FROM mock_tests WHERE title LIKE 'Aptis ESOL Mock Test%'").run();
  
  const insertMockTest = db.prepare("INSERT INTO mock_tests (title, duration_minutes, status) VALUES (?, 162, 'pending')");
  const insertPQ = db.prepare("INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, part) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const insertMTQ = db.prepare("INSERT INTO mock_test_questions (mock_test_id, question_id) VALUES (?, ?)");

  let totalQuestionsGenerated = 0;

  db.transaction(() => {
    for (let testIdx = 0; testIdx < 10; testIdx++) {
      const theme = THEMES[testIdx];
      const testTitle = `Aptis ESOL Mock Test ${testIdx + 1} - ${theme}`;
      
      const mockResult = insertMockTest.run(testTitle);
      const mockTestId = mockResult.lastInsertRowid;

      const addQ = (skill, type, question, options, correct_answer, explanation, difficulty, part) => {
        const qRes = insertPQ.run(skill, type, question, options ? JSON.stringify(options) : null, correct_answer, explanation, difficulty, part);
        insertMTQ.run(mockTestId, qRes.lastInsertRowid);
        totalQuestionsGenerated++;
      };

      // 1. GRAMMAR & VOCABULARY (50 questions: 25 grammar, 25 vocab)
      for (let i = 1; i <= 25; i++) {
        addQ('grammar', 'multiple_choice', 
          `[Mock ${testIdx+1} - Grammar Q${i}] If they had invested more in ${theme}, the outcome ______ better.`, 
          ['will be', 'would be', 'would have been'], 
          'would have been', 
          'Câu điều kiện loại 3 (Giả định ngược quá khứ).', 
          'B2', 1);
      }
      for (let i = 1; i <= 25; i++) {
        addQ('vocabulary', 'multiple_choice', 
          `[Mock ${testIdx+1} - Vocab Q${i}] Synonym matching related to ${theme}: The word "vital" is closest in meaning to _______.`, 
          ['optional', 'crucial', 'minor'], 
          'crucial', 
          'Vital = Crucial (Rất quan trọng/Sống còn).', 
          'B1', 1);
      }

      // 2. LISTENING (25 questions over 4 parts)
      // Part 1: 13 questions (Basic info)
      for (let i = 1; i <= 13; i++) {
        addQ('listening', 'multiple_choice', 
          `[Mock ${testIdx+1} - Listening Part 1] Listen to the short announcement about ${theme}. What time does the event start?`, 
          ['09:00', '09:30', '10:00'], 
          '09:30', 
          'Nghe thông tin cơ bản: thời gian, con số.', 
          'A2', 1);
      }
      // Part 2: 4 monologues matching (Simulated as 4 questions)
      for (let i = 1; i <= 4; i++) {
        addQ('listening', 'multiple_choice', 
          `[Mock ${testIdx+1} - Listening Part 2] Speaker ${i} is talking about ${theme}. What is their main occupation?`, 
          ['Teacher', 'Engineer', 'Doctor', 'Artist'], 
          'Engineer', 
          'Nối thông tin từ độc thoại.', 
          'B1', 2);
      }
      // Part 3/4: 8 questions (Infer attitude/opinion)
      for (let i = 1; i <= 8; i++) {
        addQ('listening', 'multiple_choice', 
          `[Mock ${testIdx+1} - Listening Part 3] How does the woman feel about the new ${theme} policy?`, 
          ['Excited', 'Frustrated', 'Indifferent'], 
          'Frustrated', 
          'Suy luận cảm xúc từ ngữ điệu.', 
          'B2', 3);
      }

      // 3. READING (25 questions over 4 parts)
      // Part 1: 5 questions (Reading comp)
      for (let i = 1; i <= 5; i++) {
        addQ('reading', 'multiple_choice', 
          `[Mock ${testIdx+1} - Reading Part 1] Read the short email about ${theme}. What does the sender want the recipient to do?`, 
          ['Reply immediately', 'Attend a meeting', 'Review a document'], 
          'Attend a meeting', 
          'Đọc hiểu thông điệp cốt lõi.', 
          'A2', 1);
      }
      // Part 2: 2 text ordering tasks (simulated as 2 questions answering the correct order)
      for (let i = 1; i <= 2; i++) {
        addQ('reading', 'multiple_choice', 
          `[Mock ${testIdx+1} - Reading Part 2] Sort the 6 sentences to form a paragraph about ${theme}. What is the correct order?`, 
          ['1-3-2-4-6-5', '1-2-3-4-5-6', '6-5-4-3-2-1'], 
          '1-2-3-4-5-6', 
          'Sắp xếp câu logic theo từ nối.', 
          'B1', 2);
      }
      // Part 3: Match opinions (7 questions matching 4 people to 7 statements)
      for (let i = 1; i <= 7; i++) {
        addQ('reading', 'multiple_choice', 
          `[Mock ${testIdx+1} - Reading Part 3] Who believes that ${theme} will drastically change our future?`, 
          ['Person A', 'Person B', 'Person C', 'Person D'], 
          'Person A', 
          'Skimming & Scanning tìm ý kiến nhân vật.', 
          'B2', 3);
      }
      // Part 4: Match headings (11 questions to total 25)
      for (let i = 1; i <= 11; i++) {
        addQ('reading', 'multiple_choice', 
          `[Mock ${testIdx+1} - Reading Part 4] Choose the best heading for Paragraph ${i} of the 750-word article on ${theme}.`, 
          ['Heading X', 'Heading Y', 'Heading Z'], 
          'Heading X', 
          'Tìm ý chính của đoạn văn.', 
          'C', 4);
      }

      // 4. WRITING (4 parts)
      addQ('writing', 'text_input', `[Mock ${testIdx+1} - Part 1] Fill in the club registration form describing your interest in ${theme}. (1-5 words)`, null, null, null, 'A1', 1);
      addQ('writing', 'text_input', `[Mock ${testIdx+1} - Part 2] Write a group chat message introducing yourself and your background in ${theme}. (20-30 words)`, null, null, null, 'A2', 2);
      addQ('writing', 'text_input', `[Mock ${testIdx+1} - Part 3] Reply to 3 social media comments about ${theme}. (30-40 words each)`, null, null, null, 'B1', 3);
      addQ('writing', 'text_input', `[Mock ${testIdx+1} - Part 4] Write an informal email to a friend and a formal email to an official regarding a ${theme} event. (120-150 words)`, null, null, null, 'B2', 4);

      // 5. SPEAKING (4 parts)
      addQ('speaking', 'audio_response', `[Mock ${testIdx+1} - Part 1] Personal questions: Tell me about your experience with ${theme}. (30 seconds)`, null, null, null, 'A2', 1);
      addQ('speaking', 'audio_response', `[Mock ${testIdx+1} - Part 2] Describe a picture related to ${theme}. What are the people doing? (45 seconds)`, null, null, null, 'B1', 2);
      addQ('speaking', 'audio_response', `[Mock ${testIdx+1} - Part 3] Compare two pictures showing different aspects of ${theme}. Which is more effective? (45 seconds)`, null, null, null, 'B2', 3);
      addQ('speaking', 'audio_response', `[Mock ${testIdx+1} - Part 4] Abstract discussion: Do you think ${theme} has a positive or negative impact on society? (2 minutes)`, null, null, null, 'C', 4);

    }
  })();

  console.log(`✅ Thành công: Sinh hoàn tất 10 bộ Mock Tests với tổng cộng ${totalQuestionsGenerated} câu hỏi chuẩn cấu trúc Aptis ESOL 2026.`);
} catch (error) {
  console.error('❌ Lỗi khi sinh Mock Tests:', error);
} finally {
  db.close();
}
