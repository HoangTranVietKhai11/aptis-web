const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'aptis.db');
const db = new Database(dbPath);

console.log('Seeding 120 Grammar Tense Questions (10 per tense)...');

const questions = [
  // 1. PRESENT SIMPLE
  { skill: 'grammar', content: 'She usually _____ to school by bus.', correct: 'goes', opts: ['go', 'goes', 'going', 'is going'], exp: '[grammar_present_simple] Dấu hiệu "usually" chỉ thói quen.' },
  { skill: 'grammar', content: 'The sun _____ in the east.', correct: 'rises', opts: ['rise', 'rises', 'rose', 'is rising'], exp: '[grammar_present_simple] Sự thật hiển nhiên luôn dùng hiện tại đơn.' },
  { skill: 'grammar', content: 'Water _____ at 100 degrees Celsius.', correct: 'boils', opts: ['boils', 'boil', 'is boiling', 'has boiled'], exp: '[grammar_present_simple] Chân lý luôn dùng hiện tại đơn.' },
  { skill: 'grammar', content: 'He _____ football every Sunday.', correct: 'plays', opts: ['play', 'plays', 'playing', 'is playing'], exp: '[grammar_present_simple] Thói quen lặp lại "every Sunday".' },
  { skill: 'grammar', content: 'The train _____ at 8 AM tomorrow.', correct: 'leaves', opts: ['leave', 'leaves', 'left', 'leaving'], exp: '[grammar_present_simple] Lịch trình cố định dùng hiện tại đơn.' },
  { skill: 'grammar', content: 'She _____ coffee.', correct: 'doesn\'t like', opts: ['don\'t like', 'doesn\'t like', 'isn\'t liking', 'not like'], exp: '[grammar_present_simple] Phủ định của động từ thường ngôi thứ 3 số ít dùng doesn\'t.' },
  { skill: 'grammar', content: 'My father _____ his car every weekend.', correct: 'washes', opts: ['wash', 'washes', 'is washing', 'washed'], exp: '[grammar_present_simple] "Every weekend" chỉ thói quen.' },
  { skill: 'grammar', content: '_____ you play tennis on Sundays?', correct: 'Do', opts: ['Are', 'Have', 'Do', 'Does'], exp: '[grammar_present_simple] Câu hỏi hiện tại đơn với You dùng trợ động từ Do.' },
  { skill: 'grammar', content: 'The Earth _____ around the Sun.', correct: 'goes', opts: ['go', 'goes', 'is going', 'went'], exp: '[grammar_present_simple] Sự thật vĩnh cửu.' },
  { skill: 'grammar', content: 'They never _____ meat.', correct: 'eat', opts: ['eats', 'is eating', 'eat', 'are eating'], exp: '[grammar_present_simple] Trạng từ chỉ tần suất "never" đi với động từ nguyên mẫu số nhiều.' },

  // 2. PRESENT CONTINUOUS
  { skill: 'grammar', content: 'Look! The baby _____ right now.', correct: 'is sleeping', opts: ['sleeps', 'is sleeping', 'slept', 'has slept'], exp: '[grammar_present_continuous] "Look!" và "right now" là dấu hiệu HTTD.' },
  { skill: 'grammar', content: 'I _____ to the radio at the moment.', correct: 'am listening', opts: ['listen', 'am listening', 'listened', 'listening'], exp: '[grammar_present_continuous] "At the moment" dùng hiện tại tiếp diễn.' },
  { skill: 'grammar', content: 'We _____ our friends tonight.', correct: 'are meeting', opts: ['meet', 'are meeting', 'met', 'have met'], exp: '[grammar_present_continuous] Kế hoạch trong tương lai gần (có dự định) dùng HTTD.' },
  { skill: 'grammar', content: 'Listen! Someone _____ at the door.', correct: 'is knocking', opts: ['knocks', 'is knocking', 'knocked', 'will knock'], exp: '[grammar_present_continuous] "Listen!" chỉ hành động đang xảy ra tức thời.' },
  { skill: 'grammar', content: 'She _____ always _____ late for meetings!', correct: 'is / arriving', opts: ['is / arrive', 'is / arriving', 'has / arrived', 'does / arrive'], exp: '[grammar_present_continuous] Phàn nàn kết hợp "always" dùng HTTD.' },
  { skill: 'grammar', content: 'Look! The boys _____ in the garden.', correct: 'are playing', opts: ['play', 'are playing', 'plays', 'played'], exp: '[grammar_present_continuous] "Look!" -> đang diễn ra lúc nói.' },
  { skill: 'grammar', content: 'I _____ a very interesting book right now.', correct: 'am reading', opts: ['read', 'reads', 'am reading', 'have read'], exp: '[grammar_present_continuous] "Right now".' },
  { skill: 'grammar', content: 'Shhh! The baby _____ .', correct: 'is sleeping', opts: ['sleeps', 'is sleeping', 'slept', 'sleep'], exp: '[grammar_present_continuous] Đang nhắc nhở giữ trật tự vì ai đó đang ngủ.' },
  { skill: 'grammar', content: 'We _____ to the party tonight.', correct: 'aren\'t going', opts: ['don\'t go', 'aren\'t going', 'not go', 'haven\'t gone'], exp: '[grammar_present_continuous] Dự định tương lai gần.' },
  { skill: 'grammar', content: 'What _____ you _____ at the moment?', correct: 'are / doing', opts: ['do / do', 'are / doing', 'did / do', 'have / done'], exp: '[grammar_present_continuous] Hỏi về việc đang làm.' },

  // 3. PRESENT PERFECT
  { skill: 'grammar', content: 'I _____ here for 5 years.', correct: 'have lived', opts: ['live', 'lived', 'have lived', 'am living'], exp: '[grammar_present_perfect] "for + khoảng thời gian" là dấu hiệu HTHT.' },
  { skill: 'grammar', content: 'She _____ just _____ her homework.', correct: 'has / finished', opts: ['has / finish', 'have / finished', 'has / finished', 'is / finishing'], exp: '[grammar_present_perfect] "just" dùng trong HTHT.' },
  { skill: 'grammar', content: '_____ you ever _____ to London?', correct: 'Have / been', opts: ['Have / been', 'Have / go', 'Has / been', 'Did / went'], exp: '[grammar_present_perfect] Hỏi về trải nghiệm với "ever".' },
  { skill: 'grammar', content: 'We haven\'t seen him _____ last month.', correct: 'since', opts: ['for', 'since', 'in', 'at'], exp: '[grammar_present_perfect] "since + mốc thời gian" trong HTHT.' },
  { skill: 'grammar', content: 'I _____ my keys. I can\'t find them anywhere.', correct: 'have lost', opts: ['lose', 'lost', 'have lost', 'losing'], exp: '[grammar_present_perfect] Hành động xảy ra trong QK để lại hậu quả hiện tại.' },
  { skill: 'grammar', content: 'I _____ him since we were children.', correct: 'have known', opts: ['know', 'knew', 'have known', 'have knowing'], exp: '[grammar_present_perfect] "Since" -> HTHT.' },
  { skill: 'grammar', content: 'She _____ her work yet.', correct: 'hasn\'t finished', opts: ['didn\'t finish', 'hasn\'t finished', 'doesn\'t finish', 'haven\'t finished'], exp: '[grammar_present_perfect] "Yet" -> HTHT phủ định.' },
  { skill: 'grammar', content: 'We _____ to Paris three times.', correct: 'have been', opts: ['are', 'were', 'have been', 'went'], exp: '[grammar_present_perfect] Trải nghiệm (số lần).' },
  { skill: 'grammar', content: '_____ you seen this movie before?', correct: 'Have', opts: ['Do', 'Did', 'Have', 'Are'], exp: '[grammar_present_perfect] "Before" (trước đây) dùng HTHT.' },
  { skill: 'grammar', content: 'He _____ just bought a new laptop.', correct: 'has', opts: ['is', 'was', 'has', 'did'], exp: '[grammar_present_perfect] "Just" -> vừa mới xảy ra.' },

  // 4. PRESENT PERFECT CONTINUOUS
  { skill: 'grammar', content: 'It _____ all morning.', correct: 'has been raining', opts: ['rains', 'is raining', 'has been raining', 'rained'], exp: '[grammar_present_perfect_continuous] Nhấn mạnh quá trình kéo dài "all morning".' },
  { skill: 'grammar', content: 'I _____ on this project for 3 hours.', correct: 'have been working', opts: ['am working', 'worked', 'have worked', 'have been working'], exp: '[grammar_present_perfect_continuous] Kéo dài liên tục tới hiện tại dùng HTHT tiếp diễn.' },
  { skill: 'grammar', content: 'You look tired. _____ you _____ hard?', correct: 'Have / been working', opts: ['Have / worked', 'Did / work', 'Have / been working', 'Are / working'], exp: '[grammar_present_perfect_continuous] Dấu hiệu kiệt sức ở HT do một hành động đã và đang xảy ra.' },
  { skill: 'grammar', content: 'She _____ English since she was 10.', correct: 'has been learning', opts: ['learns', 'is learning', 'has learned', 'has been learning'], exp: '[grammar_present_perfect_continuous] Bắt đầu từ QK, còn tiếp diễn ở HT, nhấn mạnh quá trình.' },
  { skill: 'grammar', content: 'They _____ for the bus for 45 minutes.', correct: 'have been waiting', opts: ['wait', 'are waiting', 'have been waiting', 'waited'], exp: '[grammar_present_perfect_continuous] Nhấn mạnh tính liên tục của việc chờ đợi.' },
  { skill: 'grammar', content: 'Sorry I\'m late. _____ you _____ long?', correct: 'Have / been waiting', opts: ['Have / waited', 'Did / wait', 'Have / been waiting', 'Are / waiting'], exp: '[grammar_present_perfect_continuous] Hỏi nhấn mạnh tính liên tục chờ đợi.' },
  { skill: 'grammar', content: 'She _____ for the exam all week.', correct: 'has been studying', opts: ['studied', 'is studying', 'has been studying', 'studies'], exp: '[grammar_present_perfect_continuous] "all week".' },
  { skill: 'grammar', content: 'It _____ since yesterday morning.', correct: 'has been snowing', opts: ['snows', 'is snowing', 'snowed', 'has been snowing'], exp: '[grammar_present_perfect_continuous] "since yesterday morning".' },
  { skill: 'grammar', content: 'I\'m exhausted. I _____ in the garden for hours.', correct: 'have been working', opts: ['work', 'was working', 'have worked', 'have been working'], exp: '[grammar_present_perfect_continuous] Để lại kết quả hiện tại, hành động kéo dài.' },
  { skill: 'grammar', content: 'He _____ well recently.', correct: 'hasn\'t been feeling', opts: ['didn\'t feel', 'hasn\'t been feeling', 'doesn\'t feel', 'wasn\'t feeling'], exp: '[grammar_present_perfect_continuous] "recently" kết hợp tính liên tục của sức khỏe.' },

  // 5. PAST SIMPLE
  { skill: 'grammar', content: 'I _____ Paris last year.', correct: 'visited', opts: ['visit', 'have visited', 'visited', 'am visiting'], exp: '[grammar_past_simple] "last year" là thời gian xác định trong QK đơn.' },
  { skill: 'grammar', content: 'She _____ a new car two days ago.', correct: 'bought', opts: ['buys', 'bought', 'has bought', 'was buying'], exp: '[grammar_past_simple] "ago" dùng Quá khứ đơn.' },
  { skill: 'grammar', content: '_____ you _____ out last night?', correct: 'Did / go', opts: ['Do / go', 'Did / went', 'Did / go', 'Have / gone'], exp: '[grammar_past_simple] Câu hỏi QKĐ mượn trợ động từ "did".' },
  { skill: 'grammar', content: 'He _____ very tired yesterday.', correct: 'was', opts: ['is', 'were', 'was', 'has been'], exp: '[grammar_past_simple] Động từ to-be ở QKĐ của He là "was".' },
  { skill: 'grammar', content: 'They _____ early in the morning.', correct: 'left', opts: ['leave', 'leaving', 'left', 'have left'], exp: '[grammar_past_simple] Một hành động xảy ra rạch ròi trong quá khứ.' },
  { skill: 'grammar', content: 'We _____ to the beach last weekend.', correct: 'went', opts: ['go', 'gone', 'went', 'have gone'], exp: '[grammar_past_simple] "last weekend".' },
  { skill: 'grammar', content: 'She _____ me yesterday.', correct: 'didn\'t call', opts: ['doesn\'t call', 'didn\'t call', 'hasn\'t called', 'not call'], exp: '[grammar_past_simple] "yesterday" phủ định.' },
  { skill: 'grammar', content: '_____ you see the match last night?', correct: 'Did', opts: ['Do', 'Were', 'Did', 'Have'], exp: '[grammar_past_simple] "last night" nghi vấn.' },
  { skill: 'grammar', content: 'I _____ my keys under the sofa.', correct: 'found', opts: ['find', 'finded', 'found', 'have found'], exp: '[grammar_past_simple] Cột 2 của find là found.' },
  { skill: 'grammar', content: 'The train _____ 10 minutes late.', correct: 'arrived', opts: ['arrive', 'arrived', 'has arrived', 'arriving'], exp: '[grammar_past_simple] Chuyện xảy ra rồi.' },

  // 6. PAST CONTINUOUS
  { skill: 'grammar', content: 'I _____ TV at 8 PM last night.', correct: 'was watching', opts: ['watched', 'was watching', 'am watching', 'have watched'], exp: '[grammar_past_continuous] Hành động xảy ra tại thời điểm xác định trong QK.' },
  { skill: 'grammar', content: 'While I _____, I saw him.', correct: 'was walking', opts: ['walk', 'walked', 'was walking', 'am walking'], exp: '[grammar_past_continuous] Hành động đang xảy ra (QKTD) thì có hành động khác xen vào.' },
  { skill: 'grammar', content: 'They _____ football when it started to rain.', correct: 'were playing', opts: ['played', 'were playing', 'play', 'are playing'], exp: '[grammar_past_continuous] Hành động đang chơi (QKTD) bị trời mưa (QKĐ) xen ngang.' },
  { skill: 'grammar', content: 'What _____ you _____ at 9 PM yesterday?', correct: 'were / doing', opts: ['did / do', 'was / doing', 'were / doing', 'are / doing'], exp: '[grammar_past_continuous] Hỏi về việc đang làm tại mốc thời gian cụ thể.' },
  { skill: 'grammar', content: 'She _____ to music while he was reading a book.', correct: 'was listening', opts: ['listens', 'listened', 'was listening', 'is listening'], exp: '[grammar_past_continuous] Hai hành động xảy ra song song trong quá khứ.' },
  { skill: 'grammar', content: 'The phone rang while I _____ a shower.', correct: 'was having', opts: ['had', 'was having', 'have had', 'have'], exp: '[grammar_past_continuous] Đang tắm (QKTD) thì điện thoại reo (QKĐ).' },
  { skill: 'grammar', content: 'It _____ when we left the house.', correct: 'was raining', opts: ['rained', 'was raining', 'is raining', 'rains'], exp: '[grammar_past_continuous] Lúc rời nhà thì trời đang có mưa rơi.' },
  { skill: 'grammar', content: 'What _____ you doing at 10 PM?', correct: 'were', opts: ['are', 'did', 'was', 'were'], exp: '[grammar_past_continuous] "were you doing".' },
  { skill: 'grammar', content: 'They _____ paying attention when the teacher explained the lesson.', correct: 'weren\'t', opts: ['didn\'t', 'aren\'t', 'wasn\'t', 'weren\'t'], exp: '[grammar_past_continuous] Diễn biến lúc giáo viên giảng (explained).' },
  { skill: 'grammar', content: 'While I was studying, my brother _____ video games.', correct: 'was playing', opts: ['played', 'plays', 'was playing', 'is playing'], exp: '[grammar_past_continuous] Song song.' },

  // 7. PAST PERFECT
  { skill: 'grammar', content: 'By the time we arrived, the train _____ .', correct: 'had left', opts: ['leaves', 'left', 'had left', 'has left'], exp: '[grammar_past_perfect] Hành động xảy ra trước một mốc thời gian/hành động khác trong quá khứ.' },
  { skill: 'grammar', content: 'I _____ my work before I went out.', correct: 'had finished', opts: ['finished', 'have finished', 'had finished', 'was finishing'], exp: '[grammar_past_perfect] Làm xong (trước) rồi mới đi ra ngoài (sau).' },
  { skill: 'grammar', content: 'After she _____ dinner, she watched TV.', correct: 'had cooked', opts: ['cooks', 'cooked', 'had cooked', 'was cooking'], exp: '[grammar_past_perfect] Sau "After" dùng QKHT cho hành động xảy ra trước.' },
  { skill: 'grammar', content: 'He was sad because he _____ his wallet.', correct: 'had lost', opts: ['lost', 'loses', 'had lost', 'has lost'], exp: '[grammar_past_perfect] Việc làm mất ví (QKHT) dẫn đến buồn (QKĐ).' },
  { skill: 'grammar', content: 'They _____ already _____ the film when I proposed to watch it.', correct: 'had / seen', opts: ['have / seen', 'had / seen', 'did / see', 'were / seeing'], exp: '[grammar_past_perfect] Đã xem trước khi tôi đề nghị ở QK.' },
  { skill: 'grammar', content: 'I realized I _____ my phone at home.', correct: 'had left', opts: ['left', 'leave', 'had left', 'has left'], exp: '[grammar_past_perfect] Để quên trước khi nhận ra.' },
  { skill: 'grammar', content: 'By the time the police arrived, the thief _____ .', correct: 'had escaped', opts: ['escaped', 'escapes', 'had escaped', 'was escaping'], exp: '[grammar_past_perfect] "By the time" + quá khứ.' },
  { skill: 'grammar', content: 'She felt nervous because she _____ never flown before.', correct: 'had', opts: ['has', 'was', 'did', 'had'], exp: '[grammar_past_perfect] Trải nghiệm tính đến 1 mốc QK.' },
  { skill: 'grammar', content: 'We couldn\'t get a table because we _____ in advance.', correct: 'hadn\'t booked', opts: ['didn\'t book', 'haven\'t booked', 'hadn\'t booked', 'weren\'t booking'], exp: '[grammar_past_perfect] Nguyên nhân sâu xa trước mốc QK.' },
  { skill: 'grammar', content: '_____ you finished the report before the meeting started?', correct: 'Had', opts: ['Did', 'Have', 'Were', 'Had'], exp: '[grammar_past_perfect] Trước "started".' },

  // 8. PAST PERFECT CONTINUOUS
  { skill: 'grammar', content: 'He _____ for 2 hours before she arrived.', correct: 'had been waiting', opts: ['was waiting', 'has been waiting', 'had been waiting', 'waited'], exp: '[grammar_past_perfect_continuous] Nhấn mạnh quá trình của hành động xảy ra trước hành động QK.' },
  { skill: 'grammar', content: 'They _____ football until it rained.', correct: 'had been playing', opts: ['were playing', 'had played', 'have been playing', 'had been playing'], exp: '[grammar_past_perfect_continuous] Nhấn mạnh sự liên tục cho đến lúc trời mưa (QKĐ).' },
  { skill: 'grammar', content: 'She was tired because she _____ all day.', correct: 'had been working', opts: ['was working', 'had worked', 'had been working', 'has worked'], exp: '[grammar_past_perfect_continuous] Giải thích nguyên nhân dựa trên một quá trình mệt nhọc trước đó.' },
  { skill: 'grammar', content: 'I _____ to find him for hours before I gave up.', correct: 'had been trying', opts: ['had tried', 'had been trying', 'tried', 'was trying'], exp: '[grammar_past_perfect_continuous] "For hours" + trước hành động QK.' },
  { skill: 'grammar', content: 'When I got home, my eyes were burning. I _____ at screens all day.', correct: 'had been staring', opts: ['was staring', 'stared', 'have been staring', 'had been staring'], exp: '[grammar_past_perfect_continuous] Hậu quả kéo dài trong quá khứ.' },
  { skill: 'grammar', content: 'They _____ outside for hours before it started to rain.', correct: 'had been playing', opts: ['played', 'were playing', 'have played', 'had been playing'], exp: '[grammar_past_perfect_continuous] Quá trình lặp lại.' },
  { skill: 'grammar', content: 'She _____ at that company for 5 years when she got promoted.', correct: 'had been working', opts: ['had worked', 'was working', 'had been working', 'worked'], exp: '[grammar_past_perfect_continuous].' },
  { skill: 'grammar', content: 'I _____ to call you all morning. Where were you?', correct: 'had been trying', opts: ['was trying', 'had been trying', 'tried', 'have been trying'], exp: '[grammar_past_perfect_continuous] Hành động liên tục ở mốc thời gian trước đó.' },
  { skill: 'grammar', content: 'The ground was wet because it _____ all night.', correct: 'had been raining', opts: ['rained', 'was raining', 'had been raining', 'has rained'], exp: '[grammar_past_perfect_continuous] Giải thích bằng tính liên tục.' },
  { skill: 'grammar', content: 'How long _____ they _____ before they got married?', correct: 'had / been dating', opts: ['had / dated', 'had / been dating', 'were / dating', 'have / dated'], exp: '[grammar_past_perfect_continuous] Quá trình "dating".' },

  // 9. FUTURE SIMPLE
  { skill: 'grammar', content: 'I _____ you with this project.', correct: 'will help', opts: ['help', 'am helping', 'will help', 'helped'], exp: '[grammar_future_simple] Đưa ra lời đề nghị giúp đỡ hoặc hứa hẹn (Will).' },
  { skill: 'grammar', content: 'I think it _____ tomorrow.', correct: 'will rain', opts: ['rains', 'will rain', 'is raining', 'going to rain'], exp: '[grammar_future_simple] Phỏng đoán không có căn cứ (think).' },
  { skill: 'grammar', content: 'Wait, I _____ the door for you.', correct: 'will open', opts: ['open', 'will open', 'am opening', 'opened'], exp: '[grammar_future_simple] Quyết định tức thời (Wait, I will...).' },
  { skill: 'grammar', content: 'She _____ probably come to the party.', correct: 'will', opts: ['is', 'does', 'will', 'has'], exp: '[grammar_future_simple] Dấu hiệu "probably" đi với tương lai đơn.' },
  { skill: 'grammar', content: 'Maybe we _____ there next week.', correct: 'will go', opts: ['go', 'went', 'have gone', 'will go'], exp: '[grammar_future_simple] "Maybe" + next week.' },
  { skill: 'grammar', content: 'I promise I _____ anyone your secret.', correct: 'won\'t tell', opts: ['don\'t tell', 'won\'t tell', 'am not telling', 'didn\'t tell'], exp: '[grammar_future_simple] Lời hứa (Promise) dùng Will.' },
  { skill: 'grammar', content: 'Don\'t worry, I _____ you with your bags.', correct: 'will help', opts: ['help', 'am helping', 'have helped', 'will help'], exp: '[grammar_future_simple] Giúp đỡ tự phát (Đưa ra quyết định ngay lúc nói).' },
  { skill: 'grammar', content: 'Do you think people _____ on Mars in the future?', correct: 'will live', opts: ['live', 'will live', 'are living', 'lived'], exp: '[grammar_future_simple] Suy đoán "Do you think".' },
  { skill: 'grammar', content: 'I\'m sure you _____ the exam.', correct: 'will pass', opts: ['pass', 'will pass', 'passed', 'are passing'], exp: '[grammar_future_simple] Mức độ xác tín cá nhân (I\'m sure).' },
  { skill: 'grammar', content: 'What _____ the weather be like tomorrow?', correct: 'will', opts: ['is', 'does', 'will', 'has'], exp: '[grammar_future_simple] Hỏi về dự báo tương lai.' },

  // 10. FUTURE CONTINUOUS
  { skill: 'grammar', content: 'At 8 PM tomorrow, I _____ dinner.', correct: 'will be having', opts: ['will have', 'will be having', 'have', 'am having'], exp: '[grammar_future_continuous] Hành động đang xảy ra tại 1 thời điểm cụ thể trong tương lai.' },
  { skill: 'grammar', content: 'We _____ to London at this time next week.', correct: 'will be flying', opts: ['will fly', 'will be flying', 'fly', 'are flying'], exp: '[grammar_future_continuous] "at this time next week" dùng TLTD.' },
  { skill: 'grammar', content: 'Don\'t call me at 9 AM. I _____ in a meeting.', correct: 'will be sitting', opts: ['will sit', 'sit', 'will be sitting', 'sat'], exp: '[grammar_future_continuous] Trạng thái đang diễn ra khiến không thể nghe điện thoại.' },
  { skill: 'grammar', content: 'This time tomorrow, we _____ on the beach.', correct: 'will be lying', opts: ['will lie', 'lie', 'will be lying', 'are lying'], exp: '[grammar_future_continuous] Dấu hiệu "This time tomorrow".' },
  { skill: 'grammar', content: 'They _____ golf when you arrive.', correct: 'will be playing', opts: ['will play', 'play', 'will be playing', 'are playing'], exp: '[grammar_future_continuous] Tương lai: Đang chơi (TLTD) khi bạn đến (HTĐ).' },
  { skill: 'grammar', content: 'Don\'t call me at 8 PM. I _____ my favorite show.', correct: 'will be watching', opts: ['will watch', 'watch', 'am watching', 'will be watching'], exp: '[grammar_future_continuous] Đang làm gì lúc 8 giờ tối mai.' },
  { skill: 'grammar', content: 'This time next week, we _____ on the beach.', correct: 'will be relaxing', opts: ['relax', 'will relax', 'will be relaxing', 'relaxed'], exp: '[grammar_future_continuous] "This time next week".' },
  { skill: 'grammar', content: 'I _____ for you outside the cinema at 7.', correct: 'will be waiting', opts: ['wait', 'will wait', 'will be waiting', 'am waiting'], exp: '[grammar_future_continuous] TL cụ thể (có giờ).' },
  { skill: 'grammar', content: '_____ you be using your car tomorrow morning?', correct: 'Will', opts: ['Do', 'Are', 'Will', 'Have'], exp: '[grammar_future_continuous] Hỏi dò kế hoạch của ai đó một cách tế nhị.' },
  { skill: 'grammar', content: 'Next year, she _____ at university.', correct: 'will be studying', opts: ['studies', 'will study', 'will be studying', 'studied'], exp: '[grammar_future_continuous] Trạng thái hoặc thói quen sẽ đang diễn ra.' },

  // 11. FUTURE PERFECT
  { skill: 'grammar', content: 'I _____ the report by Friday.', correct: 'will have finished', opts: ['will finish', 'finish', 'will have finished', 'am finishing'], exp: '[grammar_future_perfect] "by + mốc thời gian TL" dùng chữ "will have V3/ed".' },
  { skill: 'grammar', content: 'By the time you arrive, I _____ dinner.', correct: 'will have cooked', opts: ['will cook', 'will be cooking', 'cook', 'will have cooked'], exp: '[grammar_future_perfect] Hành động nấu đã xong trước khi tới nơi (tương lai).' },
  { skill: 'grammar', content: 'She _____ all the money before the end of the month.', correct: 'will have spent', opts: ['will spend', 'spends', 'will have spent', 'spent'], exp: '[grammar_future_perfect] "before the end of the month" (trước mốc tương lai).' },
  { skill: 'grammar', content: 'They _____ the project by next year.', correct: 'will have completed', opts: ['complete', 'will complete', 'will be completing', 'will have completed'], exp: '[grammar_future_perfect] "by next year".' },
  { skill: 'grammar', content: 'I _____ this book by tomorrow morning.', correct: 'will have read', opts: ['read', 'will read', 'will have read', 'will be reading'], exp: '[grammar_future_perfect] "by tomorrow morning".' },
  { skill: 'grammar', content: 'By this time next year, I _____ enough money for a car.', correct: 'will have saved', opts: ['will save', 'save', 'will have saved', 'am saving'], exp: '[grammar_future_perfect] "By this time" chỉ HT hoàn thành tại TL.' },
  { skill: 'grammar', content: 'Ensure you arrive by 8. The train _____ by then.', correct: 'will have left', opts: ['will leave', 'will be leaving', 'will have left', 'leaves'], exp: '[grammar_future_perfect] "by then" (trước lúc đó).' },
  { skill: 'grammar', content: 'We _____ finished the project by Friday.', correct: 'won\'t have', opts: ['don\'t', 'won\'t have', 'won\'t be', 'haven\'t'], exp: '[grammar_future_perfect] Thể phủ định (sẽ chưa).' },
  { skill: 'grammar', content: 'By the age of 30, she _____ visited 50 countries.', correct: 'will have', opts: ['will be', 'has', 'will have', 'would have'], exp: '[grammar_future_perfect] Thành tựu tương lai trước 30 tuổi.' },
  { skill: 'grammar', content: 'Will you _____ read the book by tomorrow?', correct: 'have', opts: ['has', 'having', 'have', 'had'], exp: '[grammar_future_perfect] "Will" + "have" + V3.' },

  // 12. FUTURE PERFECT CONTINUOUS
  { skill: 'grammar', content: 'By next month, I _____ here for 5 years.', correct: 'will have been working', opts: ['will work', 'will have worked', 'will have been working', 'work'], exp: '[grammar_future_perfect_continuous] Kéo dài liên tục tới TL (for 5 years by next month).' },
  { skill: 'grammar', content: 'By 2030, they _____ this city for 10 years.', correct: 'will have been building', opts: ['will build', 'will be building', 'will have been building', 'built'], exp: '[grammar_future_perfect_continuous] Nhấn mạnh quá trình của việc xây dựng (liên tục).' },
  { skill: 'grammar', content: 'When he retires, he _____ for 40 years.', correct: 'will have been teaching', opts: ['will teach', 'will have taught', 'will have been teaching', 'teaches'], exp: '[grammar_future_perfect_continuous] "for 40 years" khi mốc nghỉ hưu (tương lai) tới.' },
  { skill: 'grammar', content: 'By 5 PM, waiting _____ for 3 hours.', correct: 'will have been going on', opts: ['will go on', 'will be going on', 'will have been going on', 'goes on'], exp: '[grammar_future_perfect_continuous] Khoảng thời gian liên tục.' },
  { skill: 'grammar', content: 'I _____ English for 2 hours by the time you arrive.', correct: 'will have been studying', opts: ['will study', 'will have studied', 'will have been studying', 'am studying'], exp: '[grammar_future_perfect_continuous] "for 2 hours by the time...".' },
  { skill: 'grammar', content: 'By next December, we _____ in this house for 10 years.', correct: 'will have been living', opts: ['will live', 'will have lived', 'will have been living', 'live'], exp: '[grammar_future_perfect_continuous] "10 years" (tính đến thời điểm TL).' },
  { skill: 'grammar', content: 'When I finish this course, I _____ English for 5 years.', correct: 'will have been studying', opts: ['will have studied', 'will have been studying', 'studying', 'studied'], exp: '[grammar_future_perfect_continuous] "for 5 years" khi khoá học kết thúc.' },
  { skill: 'grammar', content: 'She _____ here for a year by the end of the month.', correct: 'will have been working', opts: ['will work', 'will be working', 'will have been working', 'works'], exp: '[grammar_future_perfect_continuous] Cấu trúc nhấn mạnh quá trình đi với for.' },
  { skill: 'grammar', content: 'By the time he retires, he _____ for 40 years.', correct: 'will have been teaching', opts: ['will teach', 'is teaching', 'will have been teaching', 'has taught'], exp: '[grammar_future_perfect_continuous] Quá trình liên tục.' },
  { skill: 'grammar', content: 'How long will you _____ waiting by the time the bus finally arrives?', correct: 'have been', opts: ['have', 'be', 'had been', 'have been'], exp: '[grammar_future_perfect_continuous] Câu hỏi mở đầu bằng How long ở TLHTTD.' },
];

const insertStmt = db.prepare('INSERT INTO practice_questions (skill, type, difficulty, question, correct_answer, options, explanation) VALUES (?, ?, ?, ?, ?, ?, ?)');
const deleteStmt = db.prepare('DELETE FROM practice_questions WHERE explanation LIKE \'%[grammar_%\'');

db.transaction(() => {
  deleteStmt.run(); // clear old ones to prevent duplicates
  let count = 0;
  for (const q of questions) {
    insertStmt.run(q.skill, 'multiple_choice', 'B2', q.content, q.correct, JSON.stringify(q.opts), q.exp);
    count++;
  }
  console.log('Successfully seeded ' + count + ' grammar tense questions.');
})();

db.close();
