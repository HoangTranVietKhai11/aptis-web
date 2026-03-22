/**
 * Seed script — 25 APTIS-style Listening questions (4 parts)
 * Run: node backend/scripts/seed_listening.js
 * 
 * Part 1: Information Recognition (Q1–7)  — specific facts
 * Part 2: Information Matching (Q8–13)    — match details
 * Part 3: Inference – Discussion (Q14–19) — attitude/intent, 2-person
 * Part 4: Inference – Monologue (Q20–25)  — deep inference, long monologue
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const questions = [
  // ── PART 1: Information Recognition (7 questions) ──────────────────────────
  {
    part: 1,
    question: `[Phone conversation]\nReceptionist: "Good morning, Riverside Medical Centre. How can I help you?"\nCaller: "Hi, I'd like to book an appointment with Doctor Mills, please."\nReceptionist: "Certainly. She has availability on Tuesday the fourteenth at half past two, or Thursday the sixteenth at a quarter to eleven."\nCaller: "Thursday morning works better for me, thank you."\n\nQuestion: What time is the caller's appointment?`,
    options: ['2:30 PM Tuesday', '10:45 AM Thursday', '11:15 AM Thursday', '2:15 PM Thursday'],
    correct: '10:45 AM Thursday',
    explanation: 'A quarter to eleven = 10:45 AM. The caller chose Thursday morning.'
  },
  {
    part: 1,
    question: `[Radio announcement]\n"Attention passengers: the 08:15 service to Edinburgh has been delayed by approximately forty minutes due to signalling problems near York. Passengers should wait on Platform 3. We apologise for any inconvenience."\n\nQuestion: What is the new expected departure time?`,
    options: ['08:15', '08:40', '08:55', '09:15'],
    correct: '08:55',
    explanation: '08:15 + 40 minutes = 08:55.'
  },
  {
    part: 1,
    question: `[Voicemail message]\n"Hi, this is a message for Sarah. It's Tom from Harper & Sons. Could you call me back on 07821 334 560? I'll be available between nine and five on weekdays. Thanks a lot."\n\nQuestion: What is the phone number Tom leaves?`,
    options: ['07812 334 560', '07821 334 506', '07821 334 560', '07812 344 560'],
    correct: '07821 334 560',
    explanation: 'Tom clearly states: 07821 334 560.'
  },
  {
    part: 1,
    question: `[Shop announcement]\n"Welcome to Greenfield Supermarket. Today only, get twenty percent off all fresh bakery items. Our deli counter closes at six p.m., and the store remains open until nine p.m. Don't miss our weekend sale starting Saturday!"\n\nQuestion: When does the deli counter close today?`,
    options: ['5:00 PM', '6:00 PM', '7:00 PM', '9:00 PM'],
    correct: '6:00 PM',
    explanation: 'The announcement clearly states the deli counter closes at six p.m.'
  },
  {
    part: 1,
    question: `[Conversation at an information desk]\nVisitor: "Excuse me, could you tell me the price of an adult ticket for the museum?"\nStaff: "Of course. Standard adult entry is twelve pounds fifty. However, if you're a student or over sixty, it's eight pounds."\nVisitor: "I'm a student, so the reduced price applies. Great!"\n\nQuestion: How much will the visitor pay?`,
    options: ['£12.50', '£10.00', '£8.00', '£6.50'],
    correct: '£8.00',
    explanation: 'The visitor is a student and therefore pays the reduced price of eight pounds.'
  },
  {
    part: 1,
    question: `[Telephone booking]\nAgent: "…So that's two adults and one child departing on the fifth of March, returning the twelfth, correct?"\nCustomer: "Actually, we're coming back a day earlier — the eleventh."\nAgent: "Of course, I'll update that. So return date is the eleventh of March."\n\nQuestion: What is the correct return date?`,
    options: ['5 March', '10 March', '11 March', '12 March'],
    correct: '11 March',
    explanation: 'The customer corrects the date to the eleventh of March.'
  },
  {
    part: 1,
    question: `[Weather forecast]\n"And now for tomorrow's forecast. Expect cloudy skies throughout the morning with light showers likely from midday. Temperatures will reach a maximum of fourteen degrees. By evening the rain should clear, giving way to some clear spells overnight."\n\nQuestion: What is tomorrow's maximum temperature?`,
    options: ['12°C', '13°C', '14°C', '16°C'],
    correct: '14°C',
    explanation: 'The forecast states temperatures will reach a maximum of fourteen degrees.'
  },

  // ── PART 2: Information Matching (6 questions) ────────────────────────────
  {
    part: 2,
    question: `[Conversation in a travel agency]\nAgent: "So where would you like to go for your holiday?"\nCustomer: "I was thinking somewhere warm. I liked the idea of Portugal, but my partner prefers somewhere with more culture and history — like Rome."\nAgent: "Rome is beautiful in autumn. Shall I look into flights?"\nCustomer: "Yes please, let's go with Rome."\n\nQuestion: Which destination does the couple choose?`,
    options: ['Portugal', 'Rome', 'Barcelona', 'Athens'],
    correct: 'Rome',
    explanation: 'The customer ultimately agrees to go with Rome, which their partner preferred.'
  },
  {
    part: 2,
    question: `[Radio interview]\nHost: "So Carla, you're opening a new business. What kind?"\nCarla: "That's right. People assume it's a café because I used to work in hospitality, but actually it's a bookshop — with a small reading corner and some light snacks."\n\nQuestion: What type of business is Carla opening?`,
    options: ['A café', 'A restaurant', 'A bookshop', 'A library'],
    correct: 'A bookshop',
    explanation: 'Carla explicitly corrects the assumption — it is a bookshop, not a café.'
  },
  {
    part: 2,
    question: `[Conversation between colleagues]\nMark: "Did you book the conference room for Friday?"\nLisa: "I tried, but it's taken all day. I've booked Meeting Room B for the morning and the foyer for the afternoon presentation."\nMark: "The foyer? Is that big enough?"\nLisa: "It should be — we're expecting about thirty people."\n\nQuestion: Where will the afternoon presentation be held?`,
    options: ['Conference room', 'Meeting Room B', 'The foyer', 'The canteen'],
    correct: 'The foyer',
    explanation: 'Lisa says she booked the foyer for the afternoon presentation.'
  },
  {
    part: 2,
    question: `[Customer service call]\nAgent: "Thank you for calling TechCare. Are you calling about your laptop, tablet, or mobile phone?"\nCustomer: "It's my tablet. The screen is cracked and it won't turn on anymore."\nAgent: "I see. And is it within the warranty period?"\nCustomer: "I bought it eighteen months ago, so I think the warranty expired."\n\nQuestion: What product does the customer have a problem with?`,
    options: ['Laptop', 'Mobile phone', 'Tablet', 'Smart TV'],
    correct: 'Tablet',
    explanation: 'The customer specifically says "It\'s my tablet."'
  },
  {
    part: 2,
    question: `[Conversation at a gym]\nReceptionist: "Are you interested in a membership, or a day pass?"\nVisitor: "I'd normally go for a membership, but I'm only in the city for three days for work. What's the option for short-term visits?"\nReceptionist: "We sell three-day passes for twenty-five pounds, which gives you unlimited access."\nVisitor: "Perfect, I'll take that."\n\nQuestion: What does the visitor buy?`,
    options: ['Monthly membership', 'Annual membership', 'Day pass', 'Three-day pass'],
    correct: 'Three-day pass',
    explanation: 'The visitor buys a three-day pass as they are only in the city for three days.'
  },
  {
    part: 2,
    question: `[Conversation about transport]\nAnna: "How are you getting to the conference next week?"\nBen: "I was going to drive, but parking downtown is a nightmare. I might take the train."\nAnna: "I'm cycling — it's only twenty minutes door to door."\nBen: "Actually that sounds great. I think I'll do the same."\n\nQuestion: How will Ben travel to the conference?`,
    options: ['By car', 'By train', 'By bus', 'By bicycle'],
    correct: 'By bicycle',
    explanation: 'Ben changes his mind and decides to cycle, following Anna\'s suggestion.'
  },

  // ── PART 3: Inference – Discussion (6 questions) ──────────────────────────
  {
    part: 3,
    question: `[Discussion between two friends]\nJane: "I don't know why they're closing the community centre. It's the only place around here for young people."\nDave: "I know. They say it's budget cuts, but honestly it feels like they just don't care about this area."\nJane: "Exactly. Someone should organise a petition."\nDave: "I'd sign it, but I doubt the council would listen."\n\nQuestion: What is Dave's attitude towards the petition?`,
    options: ['Enthusiastic', 'Supportive but pessimistic', 'Completely opposed', 'Indifferent'],
    correct: 'Supportive but pessimistic',
    explanation: 'Dave says he\'d sign, but doubts the council would listen — he supports the idea but is pessimistic about its effect.'
  },
  {
    part: 3,
    question: `[Work meeting discussion]\nManager: "We need to cut costs. I'm thinking we reduce staff hours."\nEmployee: "With respect, that could seriously damage morale. Maybe we could look at reducing supplier costs instead?"\nManager: "I've already tried that avenue — it's not viable."\nEmployee: "I understand, but I still think there are other options we haven't explored."\n\nQuestion: What is the employee's attitude in this conversation?`,
    options: ['Defiant and aggressive', 'Diplomatically persistent', 'Fully agreeable', 'Confused and uncertain'],
    correct: 'Diplomatically persistent',
    explanation: 'The employee respectfully disagrees and continues suggesting alternatives — diplomatic but persistent.'
  },
  {
    part: 3,
    question: `[Two students talking]\nAmy: "I can't believe the exam is next week. I haven't started revising properly."\nTom: "Really? I've been studying every day for two weeks. You should start now."\nAmy: "I know, I just find it hard to motivate myself. I always leave things to the last minute."\nTom: "Well, if you want, we could study together this weekend?"\nAmy: "That might actually help. Yes, let's do it."\n\nQuestion: What can be inferred about Amy?`,
    options: ['She is well-prepared for the exam', 'She tends to procrastinate', 'She has already completed her revision', 'She does not want help from Tom'],
    correct: 'She tends to procrastinate',
    explanation: 'Amy says she "always leaves things to the last minute" — a clear description of procrastination.'
  },
  {
    part: 3,
    question: `[Conversation about a colleague]\nSam: "Did you see that Maria was given the team leader role?"\nKate: "Yes. Between us, I think it should have been Jake. He's been here longer and worked just as hard."\nSam: "Maybe, but Maria impressed everyone at the last project review."\nKate: "I suppose. I just hope it doesn't create tension in the team."\n\nQuestion: What is Kate's view of the promotion decision?`,
    options: ['She is fully supportive', 'She thinks it was unfair to Jake', 'She believes Maria is unqualified', 'She is completely indifferent'],
    correct: 'She thinks it was unfair to Jake',
    explanation: 'Kate says the role "should have been Jake\'s," implying she finds the decision unfair to him.'
  },
  {
    part: 3,
    question: `[Neighbours talking]\nPaul: "The new coffee shop on the high street is getting really popular."\nSusan: "Too popular, if you ask me. The queue stretches right past my front gate every morning."\nPaul: "But it brings life to the area, doesn't it? The street was so quiet before."\nSusan: "That's true, I suppose. But I do miss the quiet mornings."\n\nQuestion: What is Susan's overall feeling about the coffee shop?`,
    options: ['Entirely positive', 'Mixed — she sees benefits but has concerns', 'Entirely negative', 'Neutral and unconcerned'],
    correct: 'Mixed — she sees benefits but has concerns',
    explanation: 'Susan acknowledges the street has more life but dislikes the queues — her view is mixed.'
  },
  {
    part: 3,
    question: `[Discussion between flatmates]\nRob: "I think we should have a rota for cleaning. It would be fairer."\nLucy: "We've tried that before and it never works. People just ignore it."\nRob: "Maybe if we all agreed on the rules together it would be different."\nLucy: "Hmm. I'm willing to try it if everyone commits. But I'm not optimistic."\n\nQuestion: What is Lucy's position by the end of the conversation?`,
    options: ['She strongly supports the rota idea', 'She refuses to accept a rota', 'She is cautiously willing but doubtful it will work', 'She suggests a different solution'],
    correct: 'She is cautiously willing but doubtful it will work',
    explanation: 'Lucy says "I\'m willing to try it" but adds "I\'m not optimistic" — cautiously willing but doubtful.'
  },

  // ── PART 4: Inference – Monologue (6 questions) ──────────────────────────
  {
    part: 4,
    question: `[Podcast monologue — speaker talking about career change]\n"I spent fifteen years in finance. Good money, nice office, everything people tell you to aim for. But I woke up one morning and realised I genuinely dreaded going to work. So I quit. Everyone thought I was having a breakdown. My parents barely spoke to me for months. I retrained as a primary school teacher. I earn a quarter of what I used to, and honestly? I've never felt more like myself."\n\nQuestion: What can be inferred about the speaker's decision to change career?`,
    options: ['It was impulsive and based on a breakdown', 'It was financially motivated', 'It was a deeply personal decision despite external pressure', 'It was driven by family encouragement'],
    correct: 'It was a deeply personal decision despite external pressure',
    explanation: 'The speaker made the decision despite people thinking it was a breakdown and family disapproval — it was personal, not impulsive or externally encouraged.'
  },
  {
    part: 4,
    question: `[Monologue — community leader speaking at a local meeting]\n"I've been asked whether I'm angry about what happened to our park — the removal of the fountain, the playground. And yes, of course I am. But I think what we need now is not to keep shouting about what we've lost. We need to think constructively about what we want to build. I'm proposing we form a working group, get some architects involved, and create a vision for what this space could become."\n\nQuestion: What is the speaker's primary intention?`,
    options: ['To express anger at the council', 'To mourn the loss of the park features', 'To move towards constructive action', 'To criticise the other residents'],
    correct: 'To move towards constructive action',
    explanation: 'Despite acknowledging anger, the speaker\'s focus is clearly on proposing constructive steps, not expressing grievance.'
  },
  {
    part: 4,
    question: `[Radio monologue — journalist commenting on social media]\n"People talk about social media as if it's equally harmful across the board. But the evidence is really quite nuanced. For teenagers who already have strong social support networks, the research suggests it's largely neutral or even positive. The problems arise for isolated young people who use it as a substitute for real-world connection. So rather than banning it, we should be asking: who is struggling, and why?"\n\nQuestion: What is the journalist's view on social media and young people?`,
    options: ['It is harmful to all teenagers without exception', 'It is harmless for all teenagers', 'Its impact depends on the individual\'s circumstances', 'It should be banned for teenagers under sixteen'],
    correct: 'Its impact depends on the individual\'s circumstances',
    explanation: 'The journalist argues the evidence is nuanced — the effect depends on whether the young person has existing social support.'
  },
  {
    part: 4,
    question: `[Lecture excerpt — professor on climate policy]\n"We have the technology. We have the scientific consensus. What we consistently fail to produce is the political will. Every time a meaningful climate policy reaches a committee, it gets diluted, delayed, or discarded. And the reason is not ignorance — the data is available to everyone. The reason is fear. Fear of economic disruption, fear of voter backlash, fear of short-term unpopularity. Until we address that fear directly, the technology will remain largely unused."\n\nQuestion: According to the professor, what is the main barrier to effective climate policy?`,
    options: ['Lack of scientific evidence', 'Insufficient technology', 'Political fear and inaction', 'Public ignorance of climate issues'],
    correct: 'Political fear and inaction',
    explanation: 'The professor explicitly states that the barrier is fear among politicians — not ignorance, not lack of technology.'
  },
  {
    part: 4,
    question: `[Monologue — small business owner at an event]\n"When I started, I thought the hardest part would be getting customers. And yes, that was tough. But what nobody warned me about was the loneliness. You're making decisions constantly, on your own, without anyone to check your thinking. I joined a business networking group eventually, less for the contacts and more for the sanity. Just talking to someone who genuinely understood the pressure was transformative."\n\nQuestion: What does the speaker most value about the networking group?`,
    options: ['The financial opportunities it provided', 'The emotional support from others in similar situations', 'The professional contacts it offered', 'The business training and workshops'],
    correct: 'The emotional support from others in similar situations',
    explanation: 'The speaker explicitly says they joined "less for the contacts and more for the sanity" — the emotional support was most valuable.'
  },
  {
    part: 4,
    question: `[Monologue — arts programme manager describing a project]\n"When we launched the initiative, we expected the younger participants to be the most enthusiastic. What surprised us was watching the over-seventies group. Initially quite resistant — some refused to come the first week — but by the third session they were the ones staying late, coming in early, helping others. The transformation in confidence was remarkable. Some of them told us it was the first creative thing they'd done since school."\n\nQuestion: What was unexpected about the project?`,
    options: ['The younger participants showed the most enthusiasm', 'The elderly participants eventually showed the greatest engagement', 'The over-seventies refused to participate throughout', 'The project was completed ahead of schedule'],
    correct: 'The elderly participants eventually showed the greatest engagement',
    explanation: 'The speaker says they expected young people to be the most enthusiastic, but in fact the over-seventies group became the most involved — this was the unexpected outcome.'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log(`🌱 Seeding ${questions.length} listening questions...`);
    let inserted = 0;

    for (const q of questions) {
      const explanation = `part:${q.part}|${q.explanation}`;
      const result = await client.query(
        `INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          'listening',
          'multiple_choice',
          q.question,
          JSON.stringify(q.options),
          q.correct,
          explanation
        ]
      );
      console.log(`  ✅ [Part ${q.part}] Insert id=${result.rows[0].id}`);
      inserted++;
    }

    console.log(`\n🎉 Done! Inserted ${inserted} listening questions.`);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
