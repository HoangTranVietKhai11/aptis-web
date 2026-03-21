/**
 * Manual APTIS PDF Parser - No AI Required
 * Phân tích cấu trúc đề thi APTIS từ raw text mà không cần AI
 */

function detectSkill(text) {
  const lower = text.toLowerCase();
  if (lower.includes('reading') || lower.includes('read the passage') || lower.includes('read the text')) return 'reading';
  if (lower.includes('listening') || lower.includes('listen to')) return 'listening';
  if (lower.includes('writing') || lower.includes('write a') || lower.includes('write about')) return 'writing';
  if (lower.includes('speaking') || lower.includes('talk about') || lower.includes('describe')) return 'speaking';
  if (lower.includes('grammar') || lower.includes('complete the sentence') || lower.includes('fill in')) return 'grammar';
  if (lower.includes('vocabulary') || lower.includes('choose the word') || lower.includes('synonym')) return 'vocabulary';
  return 'reading';
}

function extractTitle(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    if (/aptis/i.test(line) || /practice test/i.test(line) || /mock test/i.test(line) || /reading test/i.test(line)) {
      return line.substring(0, 100);
    }
  }
  return lines[0]?.substring(0, 100) || 'APTIS Practice Test';
}

/**
 * Main detection: find all numbered questions like:
 *   1.  What does the writer...
 *   2)  According to the text...
 * Then find options A-D following each question.
 */
function parseQuestions(rawText, forcedSkill = '') {
  const questions = [];
  const globalSkill = forcedSkill || detectSkill(rawText);

  const text = rawText.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');
  const lines = text.split('\n').map(l => l.trim());

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const qMatch = line.match(/^(\d{1,2})[\.\)]\s+(.{5,})/);
    if (qMatch) {
      const questionText = qMatch[2].trim();
      const options = [];
      let j = i + 1;

      while (j < lines.length && j < i + 10) {
        const optLine = lines[j].trim();
        if (!optLine) { j++; continue; }

        // Inline multiple options: "A) ... B) ... C) ..."
        const inlineAll = optLine.match(/[A-D]\)\s*[^A-D\)]{2,}/g);
        if (inlineAll && inlineAll.length >= 2) {
          inlineAll.forEach(opt => {
            const m = opt.match(/([A-D])\)\s*(.+)/);
            if (m) options.push(m[2].trim());
          });
          j++;
          break;
        }

        // Single option per line: "A) text", "A. text", "(A) text"
        const optMatch = optLine.match(/^[\(\[]?([A-Da-d])[\)\]\.]\s+(.{2,})/);
        if (optMatch) {
          options.push(optMatch[2].trim());
          j++;
          continue;
        }

        // Next numbered question — stop
        if (/^\d{1,2}[\.\)]/.test(optLine)) break;

        if (optLine.length < 3) { j++; continue; }
        break;
      }

      if (options.length >= 2) {
        questions.push({
          skill: globalSkill,
          type: 'multiple_choice',
          question: questionText,
          options,
          correct_answer: options[0],
          explanation: 'Xem đáp án trong tài liệu gốc',
          difficulty: 'B2',
          part: 1
        });
        i = j;
        continue;
      } else if (questionText.length > 20) {
        questions.push({
          skill: globalSkill,
          type: 'text_input',
          question: questionText,
          options: null,
          correct_answer: null,
          explanation: '',
          difficulty: 'B2',
          part: 1
        });
      }
    }

    i++;
  }

  return questions;
}

/**
 * Fallback: extract question-like sentences (ending with ? or starting with question words)
 */
function extractGenericQuestions(rawText, globalSkill) {
  const questions = [];
  const sentences = rawText
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 30);

  for (const sentence of sentences) {
    if (sentence.endsWith('?') || /^(what|which|who|where|when|how|why|according|true or false|choose|select)/i.test(sentence)) {
      questions.push({
        skill: globalSkill,
        type: 'text_input',
        question: sentence,
        options: null,
        correct_answer: null,
        explanation: '',
        difficulty: 'B2',
        part: 1
      });
    }
    if (questions.length >= 30) break;
  }
  return questions;
}

/**
 * Main parse entry point
 */
function parseExamText(rawText, forcedSkill = '') {
  console.log('[Manual Parser] Starting parse, text length:', rawText.length, 'Forced skill:', forcedSkill);

  const title = extractTitle(rawText);
  const globalSkill = forcedSkill || detectSkill(rawText);

  let questions = parseQuestions(rawText, globalSkill);
  console.log(`[Manual Parser] Structured parse found: ${questions.length} questions`);

  if (questions.length < 3) {
    const generic = extractGenericQuestions(rawText, globalSkill);
    console.log(`[Manual Parser] Generic extraction found: ${generic.length} extra questions`);
    questions = questions.concat(generic);
  }

  // Deduplicate
  const seen = new Set();
  questions = questions.filter(q => {
    const key = q.question.substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`[Manual Parser] Done. Total unique questions: ${questions.length}`);

  return {
    title,
    questions: questions.slice(0, 100)
  };
}

module.exports = { parseExamText };
