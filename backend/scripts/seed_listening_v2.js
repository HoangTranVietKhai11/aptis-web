/**
 * Seed script — Second Batch of 25 APTIS-style Listening questions
 * Run: node backend/scripts/seed_listening_v2.js
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
    question: `[Radio announcement]\n"The main library will be closed for essential maintenance from Monday the fifth of June until Friday the ninth. It will reopen as usual on Saturday the tenth at nine a.m. We apologize for any inconvenience to our members."\n\nQuestion: When will the library reopen?`,
    options: ['Monday 5 June', 'Friday 9 June', 'Saturday 10 June', 'Sunday 11 June'],
    correct: 'Saturday 10 June',
    explanation: 'The announcement says it reopens on Saturday the tenth.'
  },
  {
    part: 1,
    question: `[Conversation in a shoe shop]\nCustomer: "Excuse me, do you have these boots in a size seven?"\nAssistant: "Let me check... We have them in an eight and a six. Oh, wait, I've found a pair in a seven and a half. Would you like to try those?"\nCustomer: "Yes, please. That might actually fit better with thick socks."\n\nQuestion: What size boots will the customer try on?`,
    options: ['Size 6', 'Size 7', 'Size 7.5', 'Size 8'],
    correct: 'Size 7.5',
    explanation: 'The assistant finds a size seven and a half and the customer agrees to try them.'
  },
  {
    part: 1,
    question: `[Voicemail message]\n"Hi, this is David from the dental surgery. I'm calling to confirm your appointment for tomorrow, Wednesday, at quarter past four. Please arrive ten minutes early to fill out some forms. Thanks."\n\nQuestion: What time is the dental appointment?`,
    options: ['4:00 PM', '4:10 PM', '4:15 PM', '4:30 PM'],
    correct: '4:15 PM',
    explanation: 'Quarter past four is 4:15 PM.'
  },
  {
    part: 1,
    question: `[Bus station announcement]\n"The X32 express service to Northwood is now boarding at Gate 12. Please have your tickets ready. The journey time today is estimated at fifty-five minutes due to roadworks on the motorway."\n\nQuestion: How long is the journey to Northwood expected to take?`,
    options: ['15 minutes', '32 minutes', '45 minutes', '55 minutes'],
    correct: '55 minutes',
    explanation: 'The announcement states the journey time is fifty-five minutes.'
  },
  {
    part: 1,
    question: `[Phone conversation]\nCustomer: "I'd like to order a large pepperoni pizza and two garlic breads, please."\nStaff: "Certainly. That comes to fifteen pounds ninety-nine. Would you like to pay now by card or in cash on delivery?"\nCustomer: "I'll pay by card now, please."\n\nQuestion: How much does the order cost?`,
    options: ['£12.99', '£15.00', '£15.99', '£16.50'],
    correct: '£15.99',
    explanation: 'The staff member says the total is fifteen pounds ninety-nine.'
  },
  {
    part: 1,
    question: `[Weather forecast]\n"After a very cold weekend, Monday will see temperatures rising to a mild ten degrees. However, expect strong winds from the west, reaching up to fifty miles per hour by the afternoon. Stay safe if you're traveling."\n\nQuestion: What is the main weather warning for Monday?`,
    options: ['Freezing temperatures', 'Heavy rain', 'Strong winds', 'Thick fog'],
    correct: 'Strong winds',
    explanation: 'The forecast warns of strong winds up to fifty miles per hour.'
  },
  {
    part: 1,
    question: `[Cinema announcement]\n"Screen 4 is now showing 'The Silent Star'. Please note that the film has a running time of two hours and ten minutes. There will be no trailers shown today, so the feature will start immediately."\n\nQuestion: How long is the film?`,
    options: ['1 hour 50 minutes', '2 hours', '2 hours 10 minutes', '2 hours 30 minutes'],
    correct: '2 hours 10 minutes',
    explanation: 'The running time is stated as two hours and ten minutes.'
  },

  // ── PART 2: Information Matching (6 questions) ────────────────────────────
  {
    part: 2,
    question: `[Conversation about weekend plans]\nAlex: "Are you coming to the beach on Sunday?"\nSam: "I'd love to, but I've promised to help my brother move into his new flat."\nAlex: "Oh, that's a shame. Maybe Saturday instead?"\nSam: "No, I'm working then. Have a great time at the beach though!"\n\nQuestion: Why can't Sam go to the beach on Sunday?`,
    options: ['He is working', 'He is visiting his parents', 'He is helping his brother move', 'He is going to a party'],
    correct: 'He is helping his brother move',
    explanation: 'Sam says he promised to help his brother move into his new flat on Sunday.'
  },
  {
    part: 2,
    question: `[Discussion about a new car]\nBen: "I see you've finally got a new car! Is it electric?"\nClara: "I looked at some electric models, but they were too expensive. This one's a hybrid. It's much better for my commute than my old diesel one."\n\nQuestion: What type of car did Clara buy?`,
    options: ['Electric', 'Diesel', 'Petrol', 'Hybrid'],
    correct: 'Hybrid',
    explanation: 'Clara explicitly states it is a hybrid car.'
  },
  {
    part: 2,
    question: `[Conversation at a hotel]\nGuest: "Is the gym open yet?"\nReceptionist: "I'm afraid the gym and the pool are closed for cleaning until noon. But the sauna is available if you'd like to use that?"\nGuest: "Thanks, but I was really hoping for a swim. I'll come back later."\n\nQuestion: Which facility is the guest interested in?`,
    options: ['Gym', 'Swimming pool', 'Sauna', 'Spa'],
    correct: 'Swimming pool',
    explanation: 'The guest says "I was really hoping for a swim," indicating the pool.'
  },
  {
    part: 2,
    question: `[Colleagues talking about lunch]\nJane: "Let's go to that new Italian place for lunch."\nMark: "I've heard it's really slow. How about the sushi bar?"\nJane: "I'm not really in the mood for cold food today. Let's just grab a sandwich from the bakery and eat in the park."\nMark: "Fine with me, it's a lovely day."\n\nQuestion: Where do the colleagues decide to get lunch?`,
    options: ['Italian restaurant', 'Sushi bar', 'The bakery', 'The office canteen'],
    correct: 'The bakery',
    explanation: 'Jane suggests getting a sandwich from the bakery and Mark agrees.'
  },
  {
    part: 2,
    question: `[Conversation about a gift]\nSophie: "What did you get for your mum's birthday?"\nLiam: "I was going to buy her some perfume, but she has so much already. I ended up getting her a digital photo frame so she can see all the pictures of her grandkids."\nSophie: "That's a lovely idea. I'm sure she'll use it every day."\n\nQuestion: What gift did Liam buy?`,
    options: ['Perfume', 'A photo frame', 'A digital camera', 'Flowers'],
    correct: 'A photo frame',
    explanation: 'Liam says he bought a digital photo frame.'
  },
  {
    part: 2,
    question: `[Inquiry about a course]\nStudent: "When does the creative writing course start?"\nAdmin: "The evening classes start on the twentieth of September, but the weekend intensive starts earlier, on the twelfth."\nStudent: "I work during the week, so the weekend option is the only one I can do."\n\nQuestion: When will the student's course start?`,
    options: ['12 September', '20 September', '1 October', '12 October'],
    correct: '12 September',
    explanation: 'The student chooses the weekend intensive, which starts on the twelfth.'
  },

  // ── PART 3: Inference – Discussion (6 questions) ──────────────────────────
  {
    part: 3,
    question: `[Discussion about a film]\nEmma: "I found the ending of the movie really confusing. It didn't seem to fit the rest of the story."\nJack: "I thought it was brilliant! It left so many questions unanswered, which is exactly why it was so haunting."\nEmma: "I prefer a story that ties up all the loose ends, personally."\n\nQuestion: What is Jack's opinion of the film's ending?`,
    options: ['He found it confusing', 'He thought it was unfinished', 'He admired its ambiguity', 'He found it predictable'],
    correct: 'He admired its ambiguity',
    explanation: 'Jack liked that it "left so many questions unanswered," which means he valued its ambiguity.'
  },
  {
    part: 3,
    question: `[Two colleagues talking about a task]\nSarah: "The manager wants the report by five p.m. today. There's no way we can finish it."\nTom: "If we both focus on it and skip our lunch break, we might just make it. I've already finished the first three sections."\nSarah: "I'm still struggling with the data analysis. I don't want to rush it and make mistakes."\n\nQuestion: What is Sarah's main concern?`,
    options: ['Missing the deadline', 'Working through lunch', 'Maintaining the quality of the work', 'Tom\'s lack of support'],
    correct: 'Maintaining the quality of the work',
    explanation: 'Sarah says she doesn\'t want to "rush it and make mistakes," identifying quality as her priority over the speed/deadline.'
  },
  {
    part: 3,
    question: `[Conversation about a local park]\nMr. Green: "They're planning to build a new car park on the old meadow. It's a disaster for the local wildlife."\nMrs. White: "I agree it's a shame to lose the green space, but honestly, have you tried parking near the shops lately? It's impossible."\nMr. Green: "There are other ways to solve parking without destroying the environment."\n\nQuestion: What is Mrs. White's attitude towards the car park project?`,
    options: ['Entirely supportive', 'Conflicted but sees the necessity', 'Strongly opposed', 'Completely indifferent'],
    correct: 'Conflicted but sees the necessity',
    explanation: 'Mrs. White agrees it\'s a "shame" (conflict) but points out the "impossible" parking situation (necessity).'
  },
  {
    part: 3,
    question: `[Discussion about social media]\nFiona: "I've decided to delete all my social media apps. They're such a waste of time."\nKyle: "I find them useful for staying in touch with friends abroad, though. It would be hard to keep up with them otherwise."\nFiona: "Maybe, but I'd rather have one real conversation than a hundred 'likes'."\n\nQuestion: What does Fiona value more than social media interaction?`,
    options: ['Technological efficiency', 'Having many friends', 'Deep personal connection', 'Being popular'],
    correct: 'Deep personal connection',
    explanation: 'Fiona says she prefers "one real conversation," which represents deep personal connection.'
  },
  {
    part: 3,
    question: `[Colleagues talking about a new office layout]\nDave: "I don't like this new open-plan layout. It's far too noisy to concentrate."\nLinda: "I've actually found it easier to talk to the rest of the team. We don't have to walk across the building anymore."\nDave: "That's fine for you, but my work requires total silence."\n\nQuestion: What was the main benefit of the new layout for Linda?`,
    options: ['More desk space', 'Improved team communication', 'Less noise from colleagues', 'Better office furniture'],
    correct: 'Improved team communication',
    explanation: 'Linda says it is "easier to talk to the rest of the team," referring to communication.'
  },
  {
    part: 3,
    question: `[Two friends discussing a concert]\nAnna: "The tickets are fifty pounds. Isn't that a bit expensive for a band we've only heard twice?"\nLeo: "They're supposed to be incredible live, though. It's a once-in-a-lifetime opportunity since they're retiring next year."\nAnna: "I suppose you're right. We might regret it if we don't go."\n\nQuestion: Why does Leo think they should buy the tickets?`,
    options: ['The tickets are cheap', 'They are very famous', 'It is their last chance to see the band', 'He has already bought his ticket'],
    correct: 'It is their last chance to see the band',
    explanation: 'Leo mentions the band is "retiring next year," making this concert a "once-in-a-lifetime opportunity."'
  },

  // ── PART 4: Inference – Monologue (6 questions) ──────────────────────────
  {
    part: 4,
    question: `[Monologue — architect talking about urban design]\n"People often think city planning is just about where roads go and how tall buildings are. But the real heartbeat of any urban environment is its open spaces — the squares, the parks, the small corners where nothing is built at all. These 'voids' are where the life of the city actually happens. Without them, even the most beautiful architecture just feels like a prison. My goal is to design the empty spaces first, and let the buildings follow."\n\nQuestion: What is the speaker's main philosophy in urban design?`,
    options: ['Buildings should be as tall as possible', 'The design of buildings is more important than parks', 'Open spaces are more essential than the buildings themselves', 'Roads should be the first priority in planning'],
    correct: 'Open spaces are more essential than the buildings themselves',
    explanation: 'The speaker calls open spaces the "heartbeat" and says they are where city life actually happens.'
  },
  {
    part: 4,
    question: `[Monologue — mountain climber reflecting on a failed climb]\n"We were only two hundred meters from the summit when the storm hit. My partner wanted to push on, thinking we could make it before it got really bad. But I looked at the clouds and the rapidly dropping temperature and I knew. The mountain wasn't going anywhere. We turned back. I've been criticized for 'giving up', but in my mind, a successful climb is one where everyone comes home alive. The summit is just a bonus."\n\nQuestion: What is the speaker's definition of a successful climb?`,
    options: ['Reaching the highest point possible', 'Taking risks to achieve a goal', 'Ensuring the safety of the team', 'Winning against other climbers'],
    correct: 'Ensuring the safety of the team',
    explanation: 'The speaker explicitly states that a successful climb is "where everyone comes home alive."'
  },
  {
    part: 4,
    question: `[Radio monologue — author discussing their writing process]\n"I'm often asked where my ideas come from, as if there's a specific 'spark' or a single moment of inspiration. But writing for me is more like gardening. You plant a lot of small seeds — bits of overheard conversation, a face in a crowd, a news headline — and you wait. Most of them die. But occasionally, one begins to grow, and you have to nurture it for months, sometimes years, before it becomes a book. It's not magic; it's mostly just patient attention."\n\nQuestion: How does the author describe the process of finding ideas?`,
    options: ['A sudden and magical flash of inspiration', 'A logical and highly structured method', 'A slow process of growth and selection', 'An easy task that requires little effort'],
    correct: 'A slow process of growth and selection',
    explanation: 'The author compares it to gardening — planting seeds and waiting patiently for them to grow.'
  },
  {
    part: 4,
    question: `[Monologue — environmentalist on renewable energy]\n"Changing our energy grid is a massive challenge, and yes, it requires huge investment. But the cost of doing nothing is far higher. We focus so much on the price of wind turbines or solar panels today, but we ignore the astronomical costs of future flood damage, heatwaves, and crop failures. Transitioning to green energy isn't a luxury we might choose; it's a basic insurance policy for the survival of our economy."\n\nQuestion: What is the speaker's core argument?`,
    options: ['Renewable energy is far too expensive to implement', 'Green energy is a luxury for wealthy nations', 'The long-term costs of climate change will outweigh the costs of green energy', 'We should wait until technology becomes cheaper'],
    correct: 'The long-term costs of climate change will outweigh the costs of green energy',
    explanation: 'The speaker argues that the "cost of doing nothing is far higher" than the current investment in green energy.'
  },
  {
    part: 4,
    question: `[Monologue — retired athlete on competition]\n"When I was at the top of my game, I hated my rivals. I thought they were the enemy, standing between me and the gold medal. Now, looking back, I realize they were actually my greatest allies. Without them pushing me to my absolute limit every single day, I would never have discovered how fast I could really go. I wasn't just racing against them; I was racing with them, towards the best version of myself."\n\nQuestion: How has the speaker's view of their rivals changed over time?`,
    options: ['He now realizes they were more talented than him', 'He sees them as essential to his own personal development', 'He regrets the time he spent competing against them', 'He still views them with anger and resentment'],
    correct: 'He sees them as essential to his own personal development',
    explanation: 'The speaker now sees them as "allies" who pushed him to discover his true potential.'
  },
  {
    part: 4,
    question: `[Monologue — tech CEO on the future of AI]\n"There's a lot of fear that AI will replace human creativity. But I see it differently. I think AI will take over the repetitive, structural parts of the creative process — the 'heavy lifting' if you will. This will leave humans with more time and energy to focus on the truly unique elements: the emotional depth, the moral questions, the subtext. AI is a tool that will refine our humanity, not replace it."\n\nQuestion: What is the speaker's optimistic view of AI in the creative process?`,
    options: ['AI will eventually become more creative than humans', 'AI will handle the routine tasks, allowing humans to be more creative', 'AI will replace human artists in most industries', 'AI is too unreliable to be used in creative work'],
    correct: 'AI will handle the routine tasks, allowing humans to be more creative',
    explanation: 'The speaker believes AI will do the "heavy lifting" (repetitive parts) so humans can focus on emotional and moral depth.'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log(`🌱 Seeding ${questions.length} MORE listening questions (Batch 2)...`);
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

    console.log(`\n🎉 Done! Inserted ${inserted} MORE listening questions.`);
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
