const db = require('better-sqlite3')('aptis.db');
const insertQ = db.prepare('INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, part, roadmap_session) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

const newSpeakingQs = [
  { q: '[Speaking Part 1] Answer this question in 20-30 seconds:\n\n"Please tell me about your favourite food and why you like it."', diff: 'A1', part: 1, session: 2 },
  { q: '[Speaking Part 1] Answer this question in 20-30 seconds:\n\n"Describe the best holiday you have ever had."', diff: 'A2', part: 1, session: 3 },
  { q: '[Speaking Part 1] Answer this question in 20-30 seconds:\n\n"What kind of weather do you prefer and what do you do in that weather?"', diff: 'A2', part: 1, session: 5 },
  { q: '[Speaking Part 1] Answer this question in 20-30 seconds:\n\n"Please tell me about your typical daily routine."', diff: 'A1', part: 1, session: 6 },
  { q: '[Speaking Part 1] Answer this question in 20-30 seconds:\n\n"What is your dream job and why?"', diff: 'A2', part: 1, session: 7 },
  { q: '[Speaking Part 1] Answer this question in 20-30 seconds:\n\n"How do you usually travel to work or school?"', diff: 'A2', part: 1, session: 8 },

  { q: '[Speaking Part 2] Look at this description and respond:\n\n[Imagine a photo of people shopping in a crowded outdoor market]\n\nDescribe what you see. Then answer: "Do you prefer shopping in a local market or a large modern mall? Why?" (Speak for 45 seconds)', diff: 'B1', part: 2, session: 10 },
  { q: '[Speaking Part 2] Look at this description and respond:\n\n[Imagine a photo of a team of people working together in a modern office]\n\nDescribe what the people are doing. Then answer: "Is it important to have a good relationship with your colleagues? Why?" (Speak for 45 seconds)', diff: 'B1', part: 2, session: 12 },

  { q: '[Speaking Part 3] Compare these two situations:\n\nSituation A: A traditional classroom with a teacher at the front.\nSituation B: A student studying alone online at home.\n\n"What are the advantages of each method? Which method do you think is better for teenagers?" (Speak for 45 seconds)', diff: 'B2', part: 3, session: 15 },
  { q: '[Speaking Part 3] Compare these two situations:\n\nSituation A: People exercising indoors at a crowded gym.\nSituation B: Someone jogging alone in a beautiful park.\n\n"What are the benefits of each? Which environment do you prefer for staying healthy?" (Speak for 45 seconds)', diff: 'B2', part: 3, session: 18 },

  { q: '[Speaking Part 4] You have 1 minute to prepare and 2 minutes to speak:\n\nTopic: "Social media isolates people rather than connecting them."\n\nDiscuss how you feel about this statement. Give your opinion with reasons and examples.', diff: 'B2', part: 4, session: 20 },
  { q: '[Speaking Part 4] You have 1 minute to prepare and 2 minutes to speak:\n\nTopic: "Fast food is responsible for the decline in public health and should be heavily taxed."\n\nDo you agree or disagree with this statement? Explain your reasons.', diff: 'B2', part: 4, session: 22 },
  { q: '[Speaking Part 4] You have 1 minute to prepare and 2 minutes to speak:\n\nTopic: "Learning a foreign language is no longer necessary because of translation apps."\n\nDiscuss this topic. Do you agree or disagree? Provide examples.', diff: 'B2', part: 4, session: 25 }
];

let added = 0;
for (const s of newSpeakingQs) {
  insertQ.run('speaking', 'audio_response', s.q, null, null, null, s.diff, s.part, s.session);
  added++;
}
console.log('Added ' + added + ' new speaking questions.');
