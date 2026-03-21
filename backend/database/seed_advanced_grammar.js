const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

const ADVANCED_GRAMMAR_QUESTIONS = [
  // 1. Parts of Speech (10 questions)
  {
    topic: 'grammar_parts_of_speech',
    questions: [
      { q: "His sudden ___ surprised everyone in the room.", o: ["appear", "appearance", "appeared", "appearing"], a: "appearance", e: "Cần một danh từ (noun) sau tính từ sở hữu 'His' và tính từ 'sudden'." },
      { q: "She speaks English very ___.", o: ["fluent", "fluency", "fluently", "fluenter"], a: "fluently", e: "Cần một trạng từ (adverb) để bổ nghĩa cho động từ thường 'speaks'." },
      { q: "The weather today is extremely ___.", o: ["beauty", "beautiful", "beautifully", "beautify"], a: "beautiful", e: "Cần một tính từ (adjective) sau động từ to be 'is' và trạng từ chỉ mức độ 'extremely'." },
      { q: "They decided to ___ the old house.", o: ["modern", "modernity", "modernize", "modernly"], a: "modernize", e: "Cần một động từ (verb) nguyên mẫu sau 'to'." },
      { q: "My brother is interested ___ learning foreign languages.", o: ["on", "at", "in", "about"], a: "in", e: "Giới từ đi kèm với 'interested' là 'in'." },
      { q: "We must take ___ action immediately to stop the problem.", o: ["decide", "decision", "decisive", "decisively"], a: "decisive", e: "Cần một tính từ (adjective) đứng trước danh từ 'action' để bổ nghĩa cho nó." },
      { q: "He looked at her ___ when she told the joke.", o: ["happily", "happy", "happiness", "happier"], a: "happily", e: "Cần trạng từ (adverb) bổ nghĩa cho động từ 'look at'." },
      { q: "The ___ of the new policy caused public outrage.", o: ["announce", "announced", "announcer", "announcement"], a: "announcement", e: "Cần danh từ (noun) sau mạo từ 'The'." },
      { q: "She relies heavily ___ her parents for financial support.", o: ["in", "on", "with", "for"], a: "on", e: "Động từ 'rely' luôn đi kèm với giới từ 'on'." },
      { q: "This task requires high ___, so pay attention.", o: ["concentrate", "concentration", "concentrated", "concentrating"], a: "concentration", e: "Cần danh từ (noun) sau tính từ 'high'." }
    ]
  },
  // 2. Relative Clauses (10 questions)
  {
    topic: 'grammar_relative_clauses',
    questions: [
      { q: "The man ___ is standing over there is my uncle.", o: ["who", "whom", "which", "whose"], a: "who", e: "Thay thế cho danh từ chỉ người 'The man' và làm chủ ngữ trong mệnh đề quan hệ." },
      { q: "The book ___ I bought yesterday is very interesting.", o: ["who", "whom", "which", "whose"], a: "which", e: "Thay thế cho danh từ chỉ vật 'The book'." },
      { q: "Do you know the girl ___ mother is a famous actress?", o: ["who", "whom", "whose", "that"], a: "whose", e: "Dùng 'whose' để chỉ sở hữu (mẹ của cô gái đó)." },
      { q: "The hotel ___ we stayed last year was fantastic.", o: ["which", "that", "where", "when"], a: "where", e: "Thay thế cho trạng ngữ chỉ nơi chốn (The hotel in which = where)." },
      { q: "The student ___ I talked to is very smart.", o: ["who", "whom", "which", "whose"], a: "whom", e: "'Whom' làm tân ngữ chỉ người, thay thế cho 'the student' (talked to whom)." },
      { q: "The day ___ we first met was rainy.", o: ["when", "where", "which", "whose"], a: "when", e: "Thay thế cho trạng ngữ chỉ thời gian 'The day'." },
      { q: "The building ___ in the 19th century is now a museum.", o: ["built", "building", "was built", "to build"], a: "built", e: "Rút gọn mệnh đề quan hệ dạng bị động (which was built -> built)." },
      { q: "The girl ___ next to me in class is from Japan.", o: ["sit", "sitting", "sits", "sat"], a: "sitting", e: "Rút gọn mệnh đề quan hệ dạng chủ động (who sits -> sitting)." },
      { q: "He was the first person ___ the finish line.", o: ["crossing", "crossed", "to cross", "cross"], a: "to cross", e: "Rút gọn MĐQH dùng 'to-infinitive' sau 'the first'." },
      { q: "My father, ___ is 50 years old, still plays tennis.", o: ["who", "that", "whom", "which"], a: "who", e: "MĐQH không xác định (có dấu phẩy) không dùng 'that', thay cho người làm chủ ngữ dùng 'who'." }
    ]
  },
  // 3. Adverbial Clauses (10 questions)
  {
    topic: 'grammar_adverbial_clauses',
    questions: [
      { q: "I will call you ___ I arrive at the hotel.", o: ["until", "as soon as", "while", "where"], a: "as soon as", e: "Mệnh đề trạng ngữ chỉ thời gian (Ngay khi tôi đến...)." },
      { q: "___ it was raining heavily, we stayed indoors.", o: ["Because", "Although", "So that", "However"], a: "Because", e: "Mệnh đề trạng ngữ chỉ nguyên nhân (Bởi vì trời mưa...)." },
      { q: "She spoke quietly ___ nobody could hear her.", o: ["because", "so that", "since", "until"], a: "so that", e: "Mệnh đề trạng ngữ chỉ mục đích (để mà không ai nghe thấy)." },
      { q: "He ran ___ fast that he won the first prize.", o: ["so", "such", "too", "enough"], a: "so", e: "Cấu trúc kết quả 'so + adj/adv + that' (quá... đến nỗi mà)." },
      { q: "It was ___ a beautiful day that we went for a picnic.", o: ["so", "such", "very", "too"], a: "such", e: "Cấu trúc kết quả 'such + (a/an) + N + that'." },
      { q: "___ I was walking down the street, I saw an old friend.", o: ["When", "While", "Since", "Until"], a: "While", e: "Nhấn mạnh hành động đang diễn ra trong quá khứ (Trong khi tôi đang đi...)." },
      { q: "You can sit ___ you like.", o: ["wherever", "whenever", "whatever", "whoever"], a: "wherever", e: "Mệnh đề trạng ngữ chỉ địa điểm (Bất cứ nơi nào)." },
      { q: "___ he is very tired, he continues working.", o: ["Because", "Although", "Since", "As"], a: "Although", e: "Mệnh đề chỉ sự nhượng bộ (Mặc dù anh ấy mệt...)." },
      { q: "They left early ___ catch the first train.", o: ["so that", "in order to", "because", "as to"], a: "in order to", e: "Chỉ mục đích, cấu trúc 'in order to + V nguyên mẫu'." },
      { q: "Wait here ___ I come back.", o: ["since", "until", "when", "while"], a: "until", e: "Chỉ thời gian (Cho đến khi)." }
    ]
  },
  // 4. Comparison Sentences (10 questions)
  {
    topic: 'grammar_comparisons',
    questions: [
      { q: "This test is ___ than the previous one.", o: ["difficult", "more difficult", "most difficult", "as difficult"], a: "more difficult", e: "So sánh hơn với tính từ dài 'difficult'." },
      { q: "Mary is not as ___ as her sister.", o: ["tall", "taller", "tallest", "more tall"], a: "tall", e: "So sánh ngang bằng (not as + adj + as)." },
      { q: "He runs ___ than anyone else in the team.", o: ["fast", "faster", "fastest", "more fast"], a: "faster", e: "So sánh hơn với trạng từ ngắn 'fast'." },
      { q: "This is the ___ book I have ever read.", o: ["interesting", "more interesting", "most interesting", "as interesting"], a: "most interesting", e: "So sánh nhất với tính từ dài 'interesting' và cụm giới hạn 'I have ever read'." },
      { q: "My car is much ___ than yours.", o: ["expensive", "more expensive", "most expensive", "expensiver"], a: "more expensive", e: "So sánh hơn với tính từ dài (much được dùng để nhấn mạnh mức độ)." },
      { q: "Today is the ___ day of my life.", o: ["happy", "happier", "happiest", "most happy"], a: "happiest", e: "So sánh nhất của tính từ kết thúc bằng 'y'." },
      { q: "The ___ you study, the better your results will be.", o: ["hard", "harder", "hardest", "more hard"], a: "harder", e: "So sánh kép (The + so sánh hơn..., the + so sánh hơn...)." },
      { q: "He has ___ money than I do.", o: ["few", "less", "fewer", "least"], a: "less", e: "So sánh hơn với danh từ không đếm được 'money', dạng so sánh hơn của 'little' là 'less'." },
      { q: "She drives ___ carefully than her brother.", o: ["as", "more", "most", "the most"], a: "more", e: "So sánh hơn với trạng từ dài 'carefully'." },
      { q: "This dress is twice as ___ as that one.", o: ["expensive", "more expensive", "expensiver", "most expensive"], a: "expensive", e: "So sánh gấp số lần (twice as + adj + as)." }
    ]
  },
  // 5. Reported Speech (10 questions)
  {
    topic: 'grammar_reported_speech',
    questions: [
      { q: "He said, 'I want to buy a car.' -> He said that he ___ to buy a car.", o: ["want", "wants", "wanted", "has wanted"], a: "wanted", e: "Lùi một thì: Hiện tại đơn -> Quá khứ đơn." },
      { q: "She asked me, 'Where do you live?' -> She asked me where ___.", o: ["do I live", "I live", "I lived", "did I live"], a: "I lived", e: "Câu hỏi dạng WH- gián tiếp: đưa chủ ngữ lên trước động từ và lùi thì (do you live -> I lived)." },
      { q: "John said, 'I will call you tomorrow.' -> John said he ___ me the next day.", o: ["will call", "would call", "calls", "called"], a: "would call", e: "Lùi thì: Will -> Would và 'tomorrow' -> 'the next day'." },
      { q: "The teacher asked us, 'Are you ready?' -> The teacher asked us ___ we were ready.", o: ["if", "what", "that", "where"], a: "if", e: "Câu hỏi Yes/No chuyển sang gián tiếp thêm 'if' hoặc 'whether'." },
      { q: "Tom said, 'I have finished my homework.' -> Tom said that he ___ his homework.", o: ["have finished", "has finished", "had finished", "finished"], a: "had finished", e: "Hiện tại hoàn thành lùi thành Quá khứ hoàn thành." },
      { q: "Mary said, 'I visited Paris last year.' -> Mary said she had visited Paris ___.", o: ["last year", "the previous year", "the next year", "this year"], a: "the previous year", e: "Đổi trạng từ thời gian: last year -> the previous year." },
      { q: "'Don't talk in class!' the teacher said -> The teacher told us ___ in class.", o: ["not talk", "don't talk", "not to talk", "to not talk"], a: "not to talk", e: "Câu mệnh lệnh phủ định: tell someone NOT TO do something." },
      { q: "He said, 'I am studying now.' -> He said he was studying ___.", o: ["now", "then", "today", "yesterday"], a: "then", e: "Đổi trạng từ thời gian: now -> then." },
      { q: "She said, 'This is my bag.' -> She said that ___ her bag.", o: ["this was", "that is", "that was", "this is"], a: "that was", e: "Đổi 'this' thành 'that' và lùi thì 'is' thành 'was'." },
      { q: "'Please help me,' she said to him -> She asked him ___ her.", o: ["to help", "help", "he helps", "helping"], a: "to help", e: "Câu mệnh lệnh khẳng định: ask someone TO do something." }
    ]
  },
  // 6. Passive Voice (10 questions)
  {
    topic: 'grammar_passive_voice',
    questions: [
      { q: "They built this bridge in 1990. -> This bridge ___ in 1990.", o: ["builds", "built", "was built", "is built"], a: "was built", e: "Bị động quá khứ đơn: was/were + V3/ed." },
      { q: "Someone is cleaning the room. -> The room ___ right now.", o: ["is cleaned", "is being cleaned", "was cleaned", "has been cleaned"], a: "is being cleaned", e: "Bị động hiện tại tiếp diễn: am/is/are + being + V3/ed." },
      { q: "They have finished the project. -> The project ___.", o: ["have been finished", "has been finished", "is finished", "was finished"], a: "has been finished", e: "Bị động hiện tại hoàn thành: have/has + been + V3/ed (chú ý chủ ngữ số ít 'The project')." },
      { q: "The company will launch a new product. -> A new product ___.", o: ["will launch", "will be launched", "is launched", "would launch"], a: "will be launched", e: "Bị động tương lai đơn: will + be + V3/ed." },
      { q: "People speak English all over the world. -> English ___ all over the world.", o: ["spoke", "is speaking", "is spoken", "has spoken"], a: "is spoken", e: "Bị động hiện tại đơn: am/is/are + V3/ed." },
      { q: "She had written the report before the meeting. -> The report ___ before the meeting.", o: ["had written", "was written", "had been written", "has been written"], a: "had been written", e: "Bị động quá khứ hoàn thành: had + been + V3/ed." },
      { q: "You must finish this task today. -> This task must ___ today.", o: ["finish", "be finished", "be finishing", "have finished"], a: "be finished", e: "Bị động động từ khuyết thiếu (modal): modal + be + V3/ed." },
      { q: "They are going to build a new hospital here. -> A new hospital is going to ___ here.", o: ["build", "be build", "be built", "building"], a: "be built", e: "Bị động tương lai gần: be going to + be + V3/ed." },
      { q: "Nobody told me about the meeting. -> I ___ about the meeting.", o: ["didn't tell", "wasn't told", "haven't told", "was told"], a: "wasn't told", e: "Bị động quá khứ đơn, chủ ngữ là nobody mang nghĩa phủ định -> I wasn't told." },
      { q: "They saw him leave the building. -> He was seen ___ the building.", o: ["leave", "to leave", "leaving", "left"], a: "to leave", e: "Bị động với động từ trị giác (see, hear): chuyển sang bị động dùng to-infinitive (was seen TO leave)." }
    ]
  },
  // 7. Cleft Sentences (10 questions)
  {
    topic: 'grammar_cleft_sentences',
    questions: [
      { q: "___ my father who bought this car.", o: ["It is", "It was", "This is", "He was"], a: "It was", e: "Câu chẻ nhấn mạnh quá khứ (bought): It was + ... + who/that." },
      { q: "It is the lesson ___ inspired many students.", o: ["who", "whom", "that", "where"], a: "that", e: "Câu chẻ nhấn mạnh sự vật (the lesson), dùng 'that'." },
      { q: "It was last night ___ they met at the restaurant.", o: ["when", "where", "which", "that"], a: "that", e: "Câu chẻ nhấn mạnh trạng từ chỉ thời gian: It was + time + THAT." },
      { q: "___ the marketing team needs is more time.", o: ["It is", "All", "What", "There"], a: "What", e: "Câu chẻ với 'What' (Điều đội ngũ cần là...)." },
      { q: "It was Linda ___ Sarah invited to the party.", o: ["which", "what", "that", "where"], a: "that", e: "Trường hợp nhấn mạnh tân ngữ chỉ người, có thể dùng 'that' (hoặc 'whom')." },
      { q: "___ Sarah wants is to spend time with her family.", o: ["It is", "All", "What is", "That"], a: "All", e: "Dùng từ All (Tất cả những gì Sarah muốn là...)." },
      { q: "It is English ___ I want to master.", o: ["what", "which", "that", "who"], a: "that", e: "Nhấn mạnh tân ngữ chỉ vật: It is + N + THAT." },
      { q: "___ in 1990 that my parents got married.", o: ["It was", "There was", "That was", "They were"], a: "It was", e: "Nhấn mạnh trạng từ thời gian trong quá khứ." },
      { q: "It was my brother ___ fixed the television.", o: ["whom", "who", "which", "what"], a: "who", e: "Nhấn mạnh chủ ngữ chỉ người dùng 'who'." },
      { q: "___ he needs is a good rest.", o: ["All what", "What", "It is", "That"], a: "What", e: "Mệnh đề danh từ làm chủ ngữ bằng 'What' (Những gì anh ấy cần...)." }
    ]
  },
  // 8. Conditional Sentences (10 questions)
  {
    topic: 'grammar_conditionals',
    questions: [
      { q: "If it rains tomorrow, we ___ at home.", o: ["will stay", "would stay", "stayed", "would have stayed"], a: "will stay", e: "Câu điều kiện loại 1 (Có thể xảy ra ở hiện tại/tương lai)." },
      { q: "If I ___ you, I wouldn't do that.", o: ["am", "was", "were", "had been"], a: "were", e: "Câu điều kiện loại 2 (giả định không có thật hiện tại), dùng 'were' cho mọi chủ ngữ." },
      { q: "If she had studied harder, she ___ the exam.", o: ["would pass", "will pass", "would have passed", "passed"], a: "would have passed", e: "Câu điều kiện loại 3 (Giả định không có thật trong quá khứ)." },
      { q: "Water boils if you ___ it to 100 degrees.", o: ["heat", "will heat", "heated", "heats"], a: "heat", e: "Câu điều kiện loại 0 (Sự thật hiển nhiên)." },
      { q: "If I had known you were coming, I ___ a cake.", o: ["would bake", "will bake", "would have baked", "baked"], a: "would have baked", e: "Câu điều kiện loại 3." },
      { q: "If he ___ more carefully, he wouldn't have caused the accident.", o: ["drives", "drove", "had driven", "has driven"], a: "had driven", e: "Câu điều kiện loại 3 (mệnh đề If dùng quá khứ hoàn thành)." },
      { q: "___ I rich, I would travel the world.", o: ["If", "Were", "Had", "Was"], a: "Were", e: "Đảo ngữ câu điều kiện loại 2 (Were I = If I were)." },
      { q: "If I had taken the medicine, I ___ fine now.", o: ["will be", "would be", "would have been", "am"], a: "would be", e: "Câu điều kiện hỗn hợp (If loại 3, kết quả loại 2 chỉ hậu quả ở hiện tại 'now')." },
      { q: "I will go to the party unless I ___ busy.", o: ["am", "will be", "was", "were"], a: "am", e: "Unless = If not. Mệnh đề after unless chia thì hiện tại đơn trong ĐK loại 1." },
      { q: "___ he arrived on time, we would have seen the performance.", o: ["If", "Had", "Were", "Unless"], a: "Had", e: "Đảo ngữ câu điều kiện loại 3 (Had he arrived = If he had arrived)." }
    ]
  },
  // 9. Tag Questions (10 questions)
  {
    topic: 'grammar_tag_questions',
    questions: [
      { q: "It's a beautiful day, ___?", o: ["is it", "isn't it", "does it", "doesn't it"], a: "isn't it", e: "Mệnh đề trước khẳng định 'is' -> đuôi phủ định 'isn't'." },
      { q: "You didn't go to school yesterday, ___?", o: ["did you", "didn't you", "were you", "weren't you"], a: "did you", e: "Mệnh đề trước phủ định 'didn't' -> đuôi khẳng định 'did'." },
      { q: "She has been working here for 5 years, ___?", o: ["has she", "hasn't she", "does she", "doesn't she"], a: "hasn't she", e: "Dùng trợ động từ 'has' của thì hiện tại hoàn thành." },
      { q: "I am late, ___?", o: ["am not I", "aren't I", "don't I", "isn't I"], a: "aren't I", e: "Trường hợp đặc biệt: 'I am' -> đuôi là 'aren't I'." },
      { q: "Let's go to the cinema, ___?", o: ["will we", "would we", "shall we", "do we"], a: "shall we", e: "Trường hợp đặc biệt: 'Let's' -> đuôi là 'shall we'." },
      { q: "Nobody phoned while I was away, ___?", o: ["did they", "didn't they", "did nobody", "did he"], a: "did they", e: "'Nobody' mang nghĩa phủ định nên đuôi khẳng định. Đại từ thay thế cho nobody là 'they'." },
      { q: "Don't drop that vase, ___?", o: ["do you", "don't you", "will you", "won't you"], a: "will you", e: "Câu mệnh lệnh (khẳng định/phủ định) thường có đuôi là 'will you'." },
      { q: "He rarely goes out at night, ___?", o: ["does he", "doesn't he", "is he", "isn't he"], a: "does he", e: "'rarely' mang nghĩa phủ định nên đuôi phải ở dạng khẳng định." },
      { q: "Everything is fine, ___?", o: ["is it", "isn't it", "are they", "aren't they"], a: "isn't it", e: "'Everything' thay bằng đại từ 'it'." },
      { q: "You had a great time, ___?", o: ["had you", "hadn't you", "did you", "didn't you"], a: "didn't you", e: "'had' ở đây là động từ thường (sở hữu/trải qua) trong thì QKĐ -> trợ động từ mượn là 'did'." }
    ]
  },
  // 10. Perfect Modals (10 questions)
  {
    topic: 'grammar_perfect_modals',
    questions: [
      { q: "He ___ have forgotten about the meeting; he's usually very punctual.", o: ["must", "can't", "should", "might"], a: "can't", e: "Can't have V3: Chắc chắn không thể xảy ra trong quá khứ." },
      { q: "You ___ have told me earlier! I would have helped you.", o: ["must", "can't", "should", "might"], a: "should", e: "Should have V3: Lẽ ra nên làm ở quá khứ nhưng đã không làm." },
      { q: "She got the highest score. She ___ have studied very hard.", o: ["must", "can't", "should", "will"], a: "must", e: "Must have V3: Chắc chắn đã xảy ra trong quá khứ (suy luận logic có cơ sở)." },
      { q: "I didn't see him at the party. He ___ have left early.", o: ["must", "should", "can't", "might"], a: "might", e: "Might have V3: Có lẽ/Có thể đã xảy ra nhưng không chắc chắn." },
      { q: "You ___ have bought this expensive dress. My old one is still fine.", o: ["mustn't", "can't", "needn't", "shouldn't"], a: "needn't", e: "Needn't have V3: Lẽ ra không cần làm nhưng đã lỡ làm (sự lãng phí/dư thừa)." },
      { q: "They ___ have taken the earlier train to avoid traffic.", o: ["must", "should", "can", "will"], a: "should", e: "Should have V3: Một lời trách móc/khuyên răn về quá khứ." },
      { q: "The streets are entirely wet. It ___ have rained hard last night.", o: ["must", "could", "should", "can't"], a: "must", e: "Suy đoán chắc chắn có bằng chứng rõ ràng." },
      { q: "He ___ have committed the crime. He was with me the whole time.", o: ["must", "can't", "should", "might"], a: "can't", e: "Phủ định chắc chắn việc xảy ra ở quá khứ do có chứng cứ ngoại phạm." },
      { q: "I am not sure where I left my keys. I ___ have left them in the car.", o: ["must", "should", "can't", "might"], a: "might", e: "Sự suy đoán không chắc chắn (not sure)." },
      { q: "We ___ have brought umbrellas. It didn't rain at all.", o: ["needn't", "can't", "shouldn't", "mustn't"], a: "needn't", e: "Needn't have V3: Không cần mang ô nhưng thật ra đã bắt công mang theo." }
    ]
  }
];

try {
  // Delete existing advanced grammar questions to prevent duplicates upon multiple runs
  let deletedRows = 0;
  for (const item of ADVANCED_GRAMMAR_QUESTIONS) {
    const info = db.prepare(`DELETE FROM practice_questions WHERE skill = 'grammar' AND explanation LIKE ?`).run(`%[${item.topic}]%`);
    deletedRows += info.changes;
  }
  console.log(`🧹 Cleared ${deletedRows} old advanced grammar questions.`);

  const insertPQ = db.prepare(`
    INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, 'B2')
  `);

  let insertedCount = 0;

  db.transaction(() => {
    for (const group of ADVANCED_GRAMMAR_QUESTIONS) {
      const topicId = group.topic;
      for (const q of group.questions) {
        // Tag the explanation with [grammar_abc] to make frontend routing work properly
        const taggedExplanation = `[${topicId}] ${q.e}`;
        insertPQ.run('grammar', 'multiple_choice', q.q, JSON.stringify(q.o), q.a, taggedExplanation);
        insertedCount++;
      }
    }
  })();

  console.log(`✅ Successfully seeded ${insertedCount} advanced grammar questions (10 per topic).`);
} catch (error) {
  console.error('❌ Error seeding advanced grammar questions:', error);
} finally {
  db.close();
}
