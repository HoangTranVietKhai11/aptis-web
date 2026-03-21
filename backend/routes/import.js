const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const { parseExamFromText } = require('../services/ai');
const { parseExamText: parseExamManually } = require('../services/pdfParser');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });

  try {
    // 1. Extract text from PDF
    console.log('--- PDF IMPORT START ---');
    console.log('File size:', req.file.size, 'bytes');
    const data = await pdf(req.file.buffer);
    const rawText = data.text;
    console.log('Extracted text length:', rawText.length);

    const cleanText = rawText.replace(/\s+/g, ' ').substring(0, 15000);
    const hintSkill = req.body.skill || '';

    // 2. Try AI first, fallback to manual parser
    let examData;
    let usedFallback = false;

    try {
      console.log('Sending to Gemini AI...');
      examData = await parseExamFromText(cleanText, hintSkill);
      console.log('AI Response received. Questions count:', examData.questions?.length);
    } catch (aiErr) {
      const is429 = aiErr?.status === 429 || aiErr?.message?.includes('429') || aiErr?.message?.includes('quota');
      console.warn(`AI failed (${is429 ? 'Quota exceeded' : aiErr.message}). Switching to manual parser...`);
      examData = parseExamManually(rawText, hintSkill);
      usedFallback = true;
      console.log('Manual parser done. Questions count:', examData.questions?.length);
    }

    // 3. Save to database as a new Mock Test
    const title = examData.title || 'Imported Practice Test';
    const result = req.db.prepare(
      "INSERT INTO mock_tests (title, status, created_at) VALUES (?, ?, datetime('now'))"
    ).run(title, 'pending');

    const testId = result.lastInsertRowid;
    const insertPQ = req.db.prepare(`
      INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, part)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMTQ = req.db.prepare(`
      INSERT INTO mock_test_questions (mock_test_id, question_id)
      VALUES (?, ?)
    `);

    for (const q of examData.questions || []) {
      const pq = insertPQ.run(
        hintSkill || q.skill || 'grammar',
        q.type || 'text_input',
        q.question,
        q.options ? JSON.stringify(q.options) : null,
        q.correct_answer || null,
        q.explanation || '',
        q.difficulty || 'B2',
        q.part || 1
      );
      insertMTQ.run(testId, pq.lastInsertRowid);
    }

    const questionCount = examData.questions?.length || 0;
    res.json({
      id: testId,
      title,
      question_count: questionCount,
      parsed_by: usedFallback ? 'manual_parser' : 'ai',
      note: usedFallback
        ? `⚠️ AI không khả dụng (hết quota). Đã dùng parser thủ công, tìm được ${questionCount} câu hỏi. Bạn có thể chỉnh sửa thủ công sau.`
        : null
    });
  } catch (err) {
    console.error('PDF Import Error:', err);
    res.status(500).json({ error: 'Failed to process PDF: ' + err.message });
  }
});

module.exports = router;
