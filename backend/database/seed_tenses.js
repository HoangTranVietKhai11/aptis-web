const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('Seeding 60 Grammar Tense Questions...');

const questions = [
  // 1. PRESENT SIMPLE
  { skill: 'grammar', content: 'She usually _____ to school by bus.', correct: 'goes', opts: ['go', 'goes', 'going', 'is going'], exp: '[grammar_present_simple] Dấu hiệu "usually" chỉ thói quen.' },
  { skill: 'grammar', content: 'The sun _____ in the east.', correct: 'rises', opts: ['rise', 'rises', 'rose', 'is rising'], exp: '[grammar_present_simple] Sự thật hiển nhiên luôn dùng hiện tại đơn.' },
  { skill: 'grammar', content: 'Water _____ at 100 degrees Celsius.', correct: 'boils', opts: ['boils', 'boil', 'is boiling', 'has boiled'], exp: '[grammar_present_simple] Chân lý luôn dùng hiện tại đơn.' },
  { skill: 'grammar', content: 'He _____ football every Sunday.', correct: 'plays', opts: ['play', 'plays', 'playing', 'is playing'], exp: '[grammar_present_simple] Thói quen lặp lại "every Sunday".' },
  { skill: 'grammar', content: 'The train _____ at 8 AM tomorrow.', correct: 'leaves', opts: ['leave', 'leaves', 'left', 'leaving'], exp: '[grammar_present_simple] Lịch trình cố định dùng hiện tại đơn.' },

  // 2. PRESENT CONTINUOUS
  { skill: 'grammar', content: 'Look! The baby _____ right now.', correct: 'is sleeping', opts: ['sleeps', 'is sleeping', 'slept', 'has slept'], exp: '[grammar_present_continuous] "Look!" và "right now" là dấu hiệu HTTD.' },
  { skill: 'grammar', content: 'I _____ to the radio at the moment.', correct: 'am listening', opts: ['listen', 'am listening', 'listened', 'listening'], exp: '[grammar_present_continuous] "At the moment" dùng hiện tại tiếp diễn.' },
  { skill: 'grammar', content: 'We _____ our friends tonight.', correct: 'are meeting', opts: ['meet', 'are meeting', 'met', 'have met'], exp: '[grammar_present_continuous] Kế hoạch trong tương lai gần (có dự định) dùng HTTD.' },
  { skill: 'grammar', content: 'Listen! Someone _____ at the door.', correct: 'is knocking', opts: ['knocks', 'is knocking', 'knocked', 'will knock'], exp: '[grammar_present_continuous] "Listen!" chỉ hành động đang xảy ra tức thời.' },
  { skill: 'grammar', content: 'She _____ always _____ late for meetings!', correct: 'is / arriving', opts: ['is / arrive', 'is / arriving', 'has / arrived', 'does / arrive'], exp: '[grammar_present_continuous] Phàn nàn kết hợp "always" dùng HTTD.' },

  // 3. PRESENT PERFECT
  { skill: 'grammar', content: 'I _____ here for 5 years.', correct: 'have lived', opts: ['live', 'lived', 'have lived', 'am living'], exp: '[grammar_present_perfect] "for + khoảng thời gian" là dấu hiệu HTHT.' },
  { skill: 'grammar', content: 'She _____ just _____ her homework.', correct: 'has / finished', opts: ['has / finish', 'have / finished', 'has / finished', 'is / finishing'], exp: '[grammar_present_perfect] "just" dùng trong HTHT.' },
  { skill: 'grammar', content: '_____ you ever _____ to London?', correct: 'Have / been', opts: ['Have / been', 'Have / go', 'Has / been', 'Did / went'], exp: '[grammar_present_perfect] Hỏi về trải nghiệm với "ever".' },
  { skill: 'grammar', content: 'We haven\'t seen him _____ last month.', correct: 'since', opts: ['for', 'since', 'in', 'at'], exp: '[grammar_present_perfect] "since + mốc thời gian" trong HTHT.' },
  { skill: 'grammar', content: 'I _____ my keys. I can\'t find them anywhere.', correct: 'have lost', opts: ['lose', 'lost', 'have lost', 'losing'], exp: '[grammar_present_perfect] Hành động xảy ra trong QK để lại hậu quả hiện tại.' },

  // 4. PRESENT PERFECT CONTINUOUS
  { skill: 'grammar', content: 'It _____ all morning.', correct: 'has been raining', opts: ['rains', 'is raining', 'has been raining', 'rained'], exp: '[grammar_present_perfect_continuous] Nhấn mạnh quá trình kéo dài "all morning".' },
  { skill: 'grammar', content: 'I _____ on this project for 3 hours.', correct: 'have been working', opts: ['am working', 'worked', 'have worked', 'have been working'], exp: '[grammar_present_perfect_continuous] Kéo dài liên tục tới hiện tại dùng HTHT tiếp diễn.' },
  { skill: 'grammar', content: 'You look tired. _____ you _____ hard?', correct: 'Have / been working', opts: ['Have / worked', 'Did / work', 'Have / been working', 'Are / working'], exp: '[grammar_present_perfect_continuous] Dấu hiệu kiệt sức ở HT do một hành động đã và đang xảy ra.' },
  { skill: 'grammar', content: 'She _____ English since she was 10.', correct: 'has been learning', opts: ['learns', 'is learning', 'has learned', 'has been learning'], exp: '[grammar_present_perfect_continuous] Bắt đầu từ QK, còn tiếp diễn ở HT, nhấn mạnh quá trình.' },
  { skill: 'grammar', content: 'They _____ for the bus for 45 minutes.', correct: 'have been waiting', opts: ['wait', 'are waiting', 'have been waiting', 'waited'], exp: '[grammar_present_perfect_continuous] Nhấn mạnh tính liên tục của việc chờ đợi.' },

  // 5. PAST SIMPLE
  { skill: 'grammar', content: 'I _____ Paris last year.', correct: 'visited', opts: ['visit', 'have visited', 'visited', 'am visiting'], exp: '[grammar_past_simple] "last year" là thời gian xác định trong QK đơn.' },
  { skill: 'grammar', content: 'She _____ a new car two days ago.', correct: 'bought', opts: ['buys', 'bought', 'has bought', 'was buying'], exp: '[grammar_past_simple] "ago" dùng Quá khứ đơn.' },
  { skill: 'grammar', content: '_____ you _____ out last night?', correct: 'Did / go', opts: ['Do / go', 'Did / went', 'Did / go', 'Have / gone'], exp: '[grammar_past_simple] Câu hỏi QKĐ mượn trợ động từ "did".' },
  { skill: 'grammar', content: 'He _____ very tired yesterday.', correct: 'was', opts: ['is', 'were', 'was', 'has been'], exp: '[grammar_past_simple] Động từ to-be ở QKĐ của He là "was".' },
  { skill: 'grammar', content: 'They _____ early in the morning.', correct: 'left', opts: ['leave', 'leaving', 'left', 'have left'], exp: '[grammar_past_simple] Một hành động xảy ra rạch ròi trong quá khứ.' },

  // 6. PAST CONTINUOUS
  { skill: 'grammar', content: 'I _____ TV at 8 PM last night.', correct: 'was watching', opts: ['watched', 'was watching', 'am watching', 'have watched'], exp: '[grammar_past_continuous] Hành động xảy ra tại thời điểm xác định trong QK.' },
  { skill: 'grammar', content: 'While I _____, I saw him.', correct: 'was walking', opts: ['walk', 'walked', 'was walking', 'am walking'], exp: '[grammar_past_continuous] Hành động đang xảy ra (QKTD) thì có hành động khác xen vào.' },
  { skill: 'grammar', content: 'They _____ football when it started to rain.', correct: 'were playing', opts: ['played', 'were playing', 'play', 'are playing'], exp: '[grammar_past_continuous] Hành động đang chơi (QKTD) bị trời mưa (QKĐ) xen ngang.' },
  { skill: 'grammar', content: 'What _____ you _____ at 9 PM yesterday?', correct: 'were / doing', opts: ['did / do', 'was / doing', 'were / doing', 'are / doing'], exp: '[grammar_past_continuous] Hỏi về việc đang làm tại mốc thời gian cụ thể.' },
  { skill: 'grammar', content: 'She _____ to music while he was reading a book.', correct: 'was listening', opts: ['listens', 'listened', 'was listening', 'is listening'], exp: '[grammar_past_continuous] Hai hành động xảy ra song song trong quá khứ (While).' },

  // 7. PAST PERFECT
  { skill: 'grammar', content: 'By the time we arrived, the train _____ .', correct: 'had left', opts: ['leaves', 'left', 'had left', 'has left'], exp: '[grammar_past_perfect] Hành động xảy ra trước một mốc thời gian/hành động khác trong quá khứ.' },
  { skill: 'grammar', content: 'I _____ my work before I went out.', correct: 'had finished', opts: ['finished', 'have finished', 'had finished', 'was finishing'], exp: '[grammar_past_perfect] Làm xong (trước) rồi mới đi ra ngoài (sau).' },
  { skill: 'grammar', content: 'After she _____ dinner, she watched TV.', correct: 'had cooked', opts: ['cooks', 'cooked', 'had cooked', 'was cooking'], exp: '[grammar_past_perfect] Sau "After" dùng QKHT cho hành động xảy ra trước.' },
  { skill: 'grammar', content: 'He was sad because he _____ his wallet.', correct: 'had lost', opts: ['lost', 'loses', 'had lost', 'has lost'], exp: '[grammar_past_perfect] Việc làm mất ví (QKHT) dẫn đến buồn (QKĐ).' },
  { skill: 'grammar', content: 'They _____ already _____ the film when I proposed to watch it.', correct: 'had / seen', opts: ['have / seen', 'had / seen', 'did / see', 'were / seeing'], exp: '[grammar_past_perfect] Đã xem trước khi tôi đề nghị ở QK.' },

  // 8. PAST PERFECT CONTINUOUS
  { skill: 'grammar', content: 'He _____ for 2 hours before she arrived.', correct: 'had been waiting', opts: ['was waiting', 'has been waiting', 'had been waiting', 'waited'], exp: '[grammar_past_perfect_continuous] Nhấn mạnh quá trình của hành động xảy ra trước hành động QK.' },
  { skill: 'grammar', content: 'They _____ football until it rained.', correct: 'had been playing', opts: ['were playing', 'had played', 'have been playing', 'had been playing'], exp: '[grammar_past_perfect_continuous] Nhấn mạnh sự liên tục cho đến lúc trời mưa (QKĐ).' },
  { skill: 'grammar', content: 'She was tired because she _____ all day.', correct: 'had been working', opts: ['was working', 'had worked', 'had been working', 'has worked'], exp: '[grammar_past_perfect_continuous] Giải thích nguyên nhân dựa trên một quá trình mệt nhọc trước đó.' },
  { skill: 'grammar', content: 'I _____ to find him for hours before I gave up.', correct: 'had been trying', opts: ['had tried', 'had been trying', 'tried', 'was trying'], exp: '[grammar_past_perfect_continuous] "For hours" + trước hành động QK.' },
  { skill: 'grammar', content: 'When I got home, my eyes were burning. I _____ at screens all day.', correct: 'had been staring', opts: ['was staring', 'stared', 'have been staring', 'had been staring'], exp: '[grammar_past_perfect_continuous] Hậu quả kéo dài trong quá khứ.' },

  // 9. FUTURE SIMPLE
  { skill: 'grammar', content: 'I _____ you with this project.', correct: 'will help', opts: ['help', 'am helping', 'will help', 'helped'], exp: '[grammar_future_simple] Đưa ra lời đề nghị giúp đỡ hoặc hứa hẹn (Will).' },
  { skill: 'grammar', content: 'I think it _____ tomorrow.', correct: 'will rain', opts: ['rains', 'will rain', 'is raining', 'going to rain'], exp: '[grammar_future_simple] Phỏng đoán không có căn cứ (think).' },
  { skill: 'grammar', content: 'Wait, I _____ the door for you.', correct: 'will open', opts: ['open', 'will open', 'am opening', 'opened'], exp: '[grammar_future_simple] Quyết định tức thời (Wait, I will...).' },
  { skill: 'grammar', content: 'She _____ probably come to the party.', correct: 'will', opts: ['is', 'does', 'will', 'has'], exp: '[grammar_future_simple] Dấu hiệu "probably" đi với tương lai đơn.' },
  { skill: 'grammar', content: 'Maybe we _____ there next week.', correct: 'will go', opts: ['go', 'went', 'have gone', 'will go'], exp: '[grammar_future_simple] "Maybe" + next week.' },

  // 10. FUTURE CONTINUOUS
  { skill: 'grammar', content: 'At 8 PM tomorrow, I _____ dinner.', correct: 'will be having', opts: ['will have', 'will be having', 'have', 'am having'], exp: '[grammar_future_continuous] Hành động đang xảy ra tại 1 thời điểm cụ thể trong tương lai.' },
  { skill: 'grammar', content: 'We _____ to London at this time next week.', correct: 'will be flying', opts: ['will fly', 'will be flying', 'fly', 'are flying'], exp: '[grammar_future_continuous] "at this time next week" dùng TLTD.' },
  { skill: 'grammar', content: 'Don\'t call me at 9 AM. I _____ in a meeting.', correct: 'will be sitting', opts: ['will sit', 'sit', 'will be sitting', 'sat'], exp: '[grammar_future_continuous] Trạng thái đang diễn ra khiến không thể nghe điện thoại.' },
  { skill: 'grammar', content: 'This time tomorrow, we _____ on the beach.', correct: 'will be lying', opts: ['will lie', 'lie', 'will be lying', 'are lying'], exp: '[grammar_future_continuous] Dấu hiệu "This time tomorrow".' },
  { skill: 'grammar', content: 'They _____ golf when you arrive.', correct: 'will be playing', opts: ['will play', 'play', 'will be playing', 'are playing'], exp: '[grammar_future_continuous] Tương lai: Đang chơi (TLTD) khi bạn đến (HTĐ).' },

  // 11. FUTURE PERFECT
  { skill: 'grammar', content: 'I _____ the report by Friday.', correct: 'will have finished', opts: ['will finish', 'finish', 'will have finished', 'am finishing'], exp: '[grammar_future_perfect] "by + mốc thời gian TL" dùng chữ "will have V3/ed".' },
  { skill: 'grammar', content: 'By the time you arrive, I _____ dinner.', correct: 'will have cooked', opts: ['will cook', 'will be cooking', 'cook', 'will have cooked'], exp: '[grammar_future_perfect] Hành động nấu đã xong trước khi tới nơi (tương lai).' },
  { skill: 'grammar', content: 'She _____ all the money before the end of the month.', correct: 'will have spent', opts: ['will spend', 'spends', 'will have spent', 'spent'], exp: '[grammar_future_perfect] "before the end of the month" (trước mốc tương lai).' },
  { skill: 'grammar', content: 'They _____ the project by next year.', correct: 'will have completed', opts: ['complete', 'will complete', 'will be completing', 'will have completed'], exp: '[grammar_future_perfect] "by next year".' },
  { skill: 'grammar', content: 'I _____ this book by tomorrow morning.', correct: 'will have read', opts: ['read', 'will read', 'will have read', 'will be reading'], exp: '[grammar_future_perfect] "by tomorrow morning".' },

  // 12. FUTURE PERFECT CONTINUOUS
  { skill: 'grammar', content: 'By next month, I _____ here for 5 years.', correct: 'will have been working', opts: ['will work', 'will have worked', 'will have been working', 'work'], exp: '[grammar_future_perfect_continuous] Kéo dài liên tục tới TL (for 5 years by next month).' },
  { skill: 'grammar', content: 'By 2030, they _____ this city for 10 years.', correct: 'will have been building', opts: ['will build', 'will be building', 'will have been building', 'built'], exp: '[grammar_future_perfect_continuous] Nhấn mạnh quá trình của việc xây dựng (liên tục).' },
  { skill: 'grammar', content: 'When he retires, he _____ for 40 years.', correct: 'will have been teaching', opts: ['will teach', 'will have taught', 'will have been teaching', 'teaches'], exp: '[grammar_future_perfect_continuous] "for 40 years" khi mốc nghỉ hưu (tương lai) tới.' },
  { skill: 'grammar', content: 'By 5 PM, waiting _____ for 3 hours.', correct: 'will have been going on', opts: ['will go on', 'will be going on', 'will have been going on', 'goes on'], exp: '[grammar_future_perfect_continuous] Khoảng thời gian liên tục.' },
  { skill: 'grammar', content: 'I _____ English for 2 hours by the time you arrive.', correct: 'will have been studying', opts: ['will study', 'will have studied', 'will have been studying', 'am studying'], exp: '[grammar_future_perfect_continuous] "for 2 hours by the time...".' },
];

const insertStmt = db.prepare('INSERT INTO practice_questions (skill, type, difficulty, question, correct_answer, options, explanation) VALUES (?, ?, ?, ?, ?, ?, ?)');

let count = 0;
db.transaction(() => {
  for (const q of questions) {
    insertStmt.run(q.skill, 'multiple_choice', 'B2', q.content, q.correct, JSON.stringify(q.opts), q.exp);
    count++;
  }
})();

console.log('Successfully seeded ' + count + ' grammar tense questions.');
db.close();
