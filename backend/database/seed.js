function seedDatabase(db) {
  const count = db.prepare('SELECT COUNT(*) as c FROM practice_questions').get();
  if (count.c === 0) {
    // --- Default user ---
    db.prepare(`INSERT OR IGNORE INTO users (id, name, target_level) VALUES (?, ?, ?)`).run('default', 'Learner', 'B2');

  const insertQ = db.prepare(
    `INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, part, roadmap_session) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  // ==================== A1-A2 GRAMMAR ====================
  const a1Grammar = [
    { q: 'I _____ a student.', opts: '["am","is","are","be"]', ans: 'am', exp: '"I" uses "am" in the verb "to be".' },
    { q: 'She _____ a teacher.', opts: '["am","is","are","be"]', ans: 'is', exp: '"She" uses "is" in the verb "to be".' },
    { q: 'We _____ from Vietnam.', opts: '["am","is","are","be"]', ans: 'are', exp: '"We" uses "are" in the verb "to be".' },
    { q: 'He _____ to school every day.', opts: '["go","goes","going","gone"]', ans: 'goes', exp: 'Third person singular takes -s in present simple.' },
    { q: 'They _____ football on weekends.', opts: '["play","plays","played","playing"]', ans: 'play', exp: '"They" uses the base form in present simple.' },
    { q: 'I _____ TV now.', opts: '["watch","watches","am watching","watched"]', ans: 'am watching', exp: '"Now" signals present continuous.' },
    { q: 'She _____ her homework yesterday.', opts: '["do","does","did","doing"]', ans: 'did', exp: '"Yesterday" signals past simple — use "did".' },
    { q: '_____ you speak English?', opts: '["Do","Does","Are","Is"]', ans: 'Do', exp: 'Questions with "I/you/we/they" use "Do".' },
    { q: 'There _____ a bank near here.', opts: '["am","is","are","be"]', ans: 'is', exp: '"There is" is used with singular nouns.' },
    { q: 'How _____ people are in your class?', opts: '["much","many","lot","any"]', ans: 'many', exp: '"How many" is used for countable nouns.' },
  ];
  for (const g of a1Grammar) insertQ.run('grammar', 'multiple_choice', g.q, g.opts, g.ans, g.exp, 'A1', 1, 1);

  const a2Grammar = [
    { q: 'I _____ in London since 2010.', opts: '["live","lived","have lived","am living"]', ans: 'have lived', exp: '"Since" with a period uses Present Perfect.' },
    { q: 'He told me that he _____ tired.', opts: '["is","was","were","be"]', ans: 'was', exp: 'Reported speech shifts present to past.' },
    { q: 'We _____ to Paris next week.', opts: '["go","went","are going","gone"]', ans: 'are going', exp: 'Future plans use "going to" or present continuous.' },
    { q: 'She _____ the book when I called.', opts: '["reads","read","was reading","has read"]', ans: 'was reading', exp: 'Past continuous for interrupted actions.' },
    { q: 'If it _____, we will stay home.', opts: '["rain","rains","rained","raining"]', ans: 'rains', exp: 'First conditional: if + present simple, will.' },
    { q: 'You _____ wear a seatbelt by law.', opts: '["can","may","must","should"]', ans: 'must', exp: '"Must" expresses legal obligation.' },
    { q: 'The film _____ already started.', opts: '["is","has","was","had"]', ans: 'has', exp: '"Already" in present perfect uses "has".' },
    { q: 'He is the _____ student in the class.', opts: '["tall","taller","tallest","most tall"]', ans: 'tallest', exp: 'Superlative adjective with "the".' },
    { q: 'She sang _____ than her sister.', opts: '["good","well","better","best"]', ans: 'better', exp: '"Better" is the comparative of "well".' },
    { q: 'I _____ to the cinema last Saturday.', opts: '["go","goes","went","have gone"]', ans: 'went', exp: '"Last Saturday" signals past simple.' },
  ];
  for (const g of a2Grammar) insertQ.run('grammar', 'multiple_choice', g.q, g.opts, g.ans, g.exp, 'A2', 1, 2);

  // ==================== B1-B2 GRAMMAR ====================
  const b1Grammar = [
    { q: 'She _____ to the gym every morning before work.', opts: '["goes","go","going","gone"]', ans: 'goes', exp: 'Third person singular present simple uses "goes".' },
    { q: 'If I _____ enough money, I would travel the world.', opts: '["had","have","has","having"]', ans: 'had', exp: 'Second conditional uses past simple in the if-clause.' },
    { q: 'The report _____ by the time the meeting started.', opts: '["had been finished","has been finished","was finishing","finished"]', ans: 'had been finished', exp: 'Past perfect passive for an action completed before another past action.' },
    { q: 'Neither the students nor the teacher _____ aware of the change.', opts: '["was","were","is","are"]', ans: 'was', exp: 'With neither...nor, the verb agrees with the nearest subject.' },
    { q: 'The manager insisted that he _____ the report immediately.', opts: '["submit","submits","submitted","would submit"]', ans: 'submit', exp: 'Subjunctive mood after "insisted that".' },
    { q: 'He asked me where I _____ the previous day.', opts: '["had been","have been","was being","went"]', ans: 'had been', exp: 'Reported speech shifts past simple to past perfect.' },
    { q: '_____ having studied all night, she still failed the exam.', opts: '["Despite","Although","However","Because"]', ans: 'Despite', exp: '"Despite" is followed by a gerund or noun phrase.' },
    { q: 'The new policy, _____ was introduced last month, has been very effective.', opts: '["which","that","what","whose"]', ans: 'which', exp: 'Non-defining relative clause uses "which" with commas.' },
    { q: 'By next July, she _____ at the company for ten years.', opts: '["will have been working","will be working","is working","has worked"]', ans: 'will have been working', exp: 'Future perfect continuous for duration up to a future point.' },
    { q: 'I wish I _____ more time to study last week.', opts: '["had had","have had","had","would have"]', ans: 'had had', exp: 'Wish + past perfect for regrets about the past.' },
  ];
  for (const g of b1Grammar) insertQ.run('grammar', 'multiple_choice', g.q, g.opts, g.ans, g.exp, 'B1', 1, 8);

  const b2Grammar = [
    { q: 'Scarcely _____ she arrived when the argument broke out.', opts: '["did","had","has","was"]', ans: 'had', exp: 'Inversion with "Scarcely had + subject + past participle".' },
    { q: 'The results were _____ than we expected.', opts: '["far more impressive","much impressive","more impressive","most impressive"]', ans: 'far more impressive', exp: '"Far more" emphasises the degree of comparison.' },
    { q: 'It is time we _____ a decision about this.', opts: '["make","made","will make","have made"]', ans: 'made', exp: '"It is time + past simple" expresses urgency.' },
    { q: 'She is said _____ the best scientist of her generation.', opts: '["to be","that she is","being","be"]', ans: 'to be', exp: '"Is said to be" is a passive reporting structure.' },
    { q: '_____ I known about the meeting, I would have attended.', opts: '["Had","If","Would","Should"]', ans: 'Had', exp: 'Inverted third conditional: "Had I known" = "If I had known".' },
    { q: 'The more you practice, _____ you become.', opts: '["the better","better","the best","best"]', ans: 'the better', exp: '"The more..., the more/better/etc." is a parallel comparison structure.' },
    { q: 'He denied _____ the money from the safe.', opts: '["to steal","stealing","stolen","steal"]', ans: 'stealing', exp: '"Deny" is followed by a gerund (-ing form).' },
    { q: 'Not only _____ she finish the report, but she also presented it.', opts: '["did","had","was","has"]', ans: 'did', exp: 'Inversion after "Not only" requires "did + subject".' },
    { q: 'The grant, without _____ the project could not have continued, was approved.', opts: '["which","that","whom","what"]', ans: 'which', exp: '"Without which" is a formal non-defining relative clause.' },
    { q: 'She would rather her son _____ a doctor.', opts: '["become","becomes","became","had become"]', ans: 'became', exp: '"Would rather + subject + past simple" for preferences.' },
  ];
  for (const g of b2Grammar) insertQ.run('grammar', 'multiple_choice', g.q, g.opts, g.ans, g.exp, 'B2', 1, 14);

  // ==================== READING: BC APTIS FORMAT ====================
  // Part 1: Sentence completion (3 options)
  const readingP1 = [
    { q: 'The new shopping centre will be located _____ the train station.', opts: '["near","nearly","nearly to"]', ans: 'near', exp: '"Near" (preposition) without "to" is used before a noun.', diff: 'A2' },
    { q: 'I usually _____ my lunch at my desk.', opts: '["eat","eating","to eat"]', ans: 'eat', exp: 'After "usually" we use the base form (present simple).' , diff: 'A2' },
    { q: 'She works _____ a hospital, not a school.', opts: '["at","in","for"]', ans: 'at', exp: '"Work at" a place — "at" is used for locations.', diff: 'A1' },
  ];
  for (const r of readingP1) insertQ.run('reading', 'multiple_choice', r.q, r.opts, r.ans, r.exp, r.diff, 1, 3);

  // Part 2: Reorder sentences
  const readingP2 = [
    { q: 'Put the sentences in order to make a story:\n\nA. He then called his friend to ask for help.\nB. The car broke down on the motorway.\nC. Finally, the mechanic arrived and fixed it.\nD. He pulled over to the side of the road.\n\nWhat is the correct order?', opts: '["B, D, A, C","A, B, C, D","D, A, B, C","C, B, D, A"]', ans: 'B, D, A, C', exp: 'Logical order: breakdown → pulled over → called for help → fixed.', diff: 'B1' },
    { q: 'Arrange these sentences about a job application:\n\nA. She attached her CV to the email.\nB. She saw a job advert online.\nC. She got an interview invitation.\nD. She wrote a cover letter.\n\nWhat is the correct order?', opts: '["B, D, A, C","A, B, C, D","D, B, A, C","B, A, D, C"]', ans: 'B, D, A, C', exp: 'Saw ad → wrote letter → attached CV → got invitation.', diff: 'B1' },
  ];
  for (const r of readingP2) insertQ.run('reading', 'multiple_choice', r.q, r.opts, r.ans, r.exp, r.diff, 2, 9);

  // Part 3: Gap fill in a passage
  const readingP3 = [
    { q: 'Complete the text: "Coffee is one of the world\'s most popular _____ . It is enjoyed by millions of people every day, often as part of their morning _____ ."', opts: '["drinks / routine","drink / routines","drinks / routines"]', ans: 'drinks / routines', exp: '"Drinks" (plural noun) and "routines" (plural) is the most natural combination here.', diff: 'A2' },
  ];
  for (const r of readingP3) insertQ.run('reading', 'multiple_choice', r.q, r.opts, r.ans, r.exp, r.diff, 3, 5);

  // Part 4: Long text comprehension
  const readingP4 = [
    { q: 'Read the article:\n\n"The city of Copenhagen has become a global leader in sustainable urban development. Over the past decade, the Danish capital has invested heavily in cycling infrastructure, with over 390 km of dedicated cycle lanes. Today, more residents commute by bike than by car. The city also generates 50% of its electricity from wind power and aims to be carbon neutral by 2025."\n\nWhat is the main topic of this article?', opts: '["Copenhagen\'s cycling culture","Copenhagen\'s climate commitments","Copenhagen\'s sustainable development","Denmark\'s energy policy"]', ans: "Copenhagen's sustainable development", exp: 'The article covers cycling, energy, and carbon targets — all aspects of sustainability.', diff: 'B2' },
    { q: 'Read the article above. What percentage of electricity does Copenhagen generate from wind power?', opts: '["25%","50%","75%","100%"]', ans: '50%', exp: 'The text explicitly states "50% of its electricity from wind power".', diff: 'B1' },
  ];
  for (const r of readingP4) insertQ.run('reading', 'multiple_choice', r.q, r.opts, r.ans, r.exp, r.diff, 4, 13);

  // ==================== LISTENING (Text-based simulation) ====================
  const listeningQs = [
    { q: '[Listening Part 1 - Numbers & Details]\nYou hear: "Please call us back on 07700 900 461."\nWhat is the phone number?', opts: '["07700 900 416","07700 900 461","07700 960 461","07700 900 641"]', ans: '07700 900 461', exp: 'Listen carefully for digit sequences.', diff: 'A1', part: 1 },
    { q: '[Listening Part 1 - Times]\nYou hear: "The museum opens at half past nine and closes at quarter to six."\nWhen does the museum close?', opts: '["5:15","5:45","6:15","6:45"]', ans: '5:45', exp: '"Quarter to six" means 15 minutes before 6:00 = 5:45.', diff: 'A2', part: 1 },
    { q: '[Listening Part 2 - Specific Information]\nYou hear a conversation: "I\'d like to book a table for two, please." "Certainly. For what time?" "Half eight on Friday."\nWhat table is being booked?', opts: '["A table for two","A table for four","A table for one","A table for three"]', ans: 'A table for two', exp: 'The customer specifically said "for two".', diff: 'A2', part: 2 },
    { q: '[Listening Part 3 - Inference]\nYou hear: "I just don\'t understand why they changed the schedule again. Last week it was Tuesday, now it\'s Thursday. I can never plan anything!"\nHow does the speaker feel?', opts: '["Excited","Frustrated","Confused","Happy"]', ans: 'Frustrated', exp: 'The tone and words ("I can never plan anything") suggest frustration.', diff: 'B1', part: 3 },
    { q: '[Listening Part 4 - Long Talk]\nYou hear a talk: "Remote work has grown enormously. While it offers flexibility, it also presents challenges for team building and communication."\nWhat is the speaker\'s main point about remote work?', opts: '["It is only positive","It has both benefits and challenges","It should be banned","It is the future of all work"]', ans: 'It has both benefits and challenges', exp: 'The speaker mentions both "flexibility" (benefit) and "challenges".', diff: 'B1', part: 4 },
  ];
  for (const l of listeningQs) insertQ.run('listening', 'multiple_choice', l.q, l.opts, l.ans, l.exp, l.diff, l.part, 7);

  // ==================== WRITING (BC 4-part format) ====================
  const writingQs = [
    { q: '[Writing Part 1 - Form Filling]\nComplete the registration form with YOUR information:\n\nFull name: ___\nDate of birth: ___\nCity: ___\nFirst language: ___\nInterests: ___\n\n(Write your actual details in the box above)', type: 'text_input', diff: 'A1', part: 1, session: 4 },
    { q: '[Writing Part 2 - Short Text]\nWrite 20-30 words about your favourite hobby.\n\nDescribe what it is, when you do it, and why you enjoy it.', type: 'text_input', diff: 'A2', part: 2, session: 4 },
    { q: '[Writing Part 3 - Social Network Response]\nA friend posted on social media: "What do you think about learning English online?"\n\nWrite 30-40 words in reply.', type: 'text_input', diff: 'B1', part: 3, session: 10 },
    { q: '[Writing Part 4a - Informal Email]\nYour English friend Jake has invited you to his birthday party next weekend.\n\nWrite an email to Jake (40-50 words):\n- Accept his invitation\n- Say what you will bring\n- Ask one question about the party', type: 'text_input', diff: 'B1', part: 4, session: 10 },
    { q: '[Writing Part 4b - Formal Email]\nYou saw this advertisement: "WANTED: English Teaching Assistants for our summer programme. Apply by email to director@language-school.com"\n\nWrite a formal email to apply for this position (120-150 words). Include:\n- Why you are interested\n- Your relevant experience\n- Your availability', type: 'text_input', diff: 'B2', part: 4, session: 16 },
  ];
  for (const w of writingQs) insertQ.run('writing', w.type, w.q, null, null, null, w.diff, w.part, w.session);

  // ==================== SPEAKING (BC 4-part format) ====================
  const speakingQs = [
    { q: '[Speaking Part 1 - Personal Information]\nAnswer this question in 20-30 seconds:\n\n"What do you do in your free time?"', diff: 'A2', part: 1, session: 4 },
    { q: '[Speaking Part 1 - Personal Information]\nAnswer this question in 20-30 seconds:\n\n"Tell me about your family."', diff: 'A1', part: 1, session: 1 },
    { q: '[Speaking Part 2 - Describe a Photo]\nLook at this description and respond:\n\n[Imagine a photo of a busy city street with people walking, shops open, and buses passing]\n\nDescribe what you see and answer: "What time of day do you think this is? Why?" (Speak for 45 seconds)', diff: 'B1', part: 2, session: 9 },
    { q: '[Speaking Part 3 - Compare Photos]\nCompare these two situations:\n\nSituation A: A person studying alone at home.\nSituation B: A group of students studying together in a library.\n\n"Which method do you think is more effective for studying? Give reasons." (Speak for 45 seconds)', diff: 'B1', part: 3, session: 11 },
    { q: '[Speaking Part 4 - Abstract Topic Discussion]\nYou have 1 minute to prepare and 2 minutes to speak:\n\nTopic: "Technology has made the world a better place."\n\nDiscuss this topic. Consider both sides and give your own opinion with examples.', diff: 'B2', part: 4, session: 17 },
  ];
  for (const s of speakingQs) insertQ.run('speaking', 'audio_response', s.q, null, null, null, s.diff, s.part, s.session);

  // ==================== VOCABULARY LIBRARY (themed) ====================
  const themes = {
    'Work & Career': [
      { w: 'colleague', def: 'A person you work with', ex: 'She discussed the project with her colleagues.', pos: 'noun', level: 'A2' },
      { w: 'deadline', def: 'The time by which something must be done', ex: 'We must meet the project deadline.', pos: 'noun', level: 'B1' },
      { w: 'promotion', def: 'A move to a higher rank at work', ex: 'She received a promotion after 2 years.', pos: 'noun', level: 'B1' },
      { w: 'negotiate', def: 'To discuss to reach an agreement', ex: 'They negotiated a better salary.', pos: 'verb', level: 'B2' },
      { w: 'implement', def: 'To start using a plan or system', ex: 'We need to implement the new policy.', pos: 'verb', level: 'B2' },
      { w: 'initiative', def: 'A new plan or action', ex: 'The manager launched a new initiative.', pos: 'noun', level: 'B2' },
    ],
    'Travel & Transport': [
      { w: 'departure', def: 'The act of leaving a place', ex: 'The departure was delayed by two hours.', pos: 'noun', level: 'A2' },
      { w: 'itinerary', def: 'A plan of a journey', ex: 'She checked her itinerary at the airport.', pos: 'noun', level: 'B1' },
      { w: 'commute', def: 'To travel regularly between work and home', ex: 'He commutes to London every day by train.', pos: 'verb', level: 'B1' },
      { w: 'destination', def: 'The place you are travelling to', ex: 'Paris was our final destination.', pos: 'noun', level: 'A2' },
      { w: 'transit', def: 'Passing through a place', ex: 'We were in transit at Dubai Airport.', pos: 'noun', level: 'B2' },
    ],
    'Education': [
      { w: 'curriculum', def: 'The subjects studied at school', ex: 'Maths is part of the national curriculum.', pos: 'noun', level: 'B1' },
      { w: 'semester', def: 'Half of a school or university year', ex: 'The exam is at the end of the semester.', pos: 'noun', level: 'B1' },
      { w: 'graduate', def: 'To successfully finish a degree course', ex: 'She will graduate next summer.', pos: 'verb', level: 'B2' },
      { w: 'scholarship', def: 'Money given to study', ex: 'He won a scholarship to Cambridge.', pos: 'noun', level: 'B2' },
      { w: 'tuition', def: 'Teaching; or fees paid for teaching', ex: 'University tuition fees are very high.', pos: 'noun', level: 'B2' },
    ],
    'Health & Lifestyle': [
      { w: 'symptom', def: 'A sign of illness', ex: 'A cough is a common symptom of a cold.', pos: 'noun', level: 'B1' },
      { w: 'nutrition', def: 'The food and drink needed for health', ex: 'Good nutrition is essential for children.', pos: 'noun', level: 'B1' },
      { w: 'recovery', def: 'The process of getting better after illness', ex: 'His recovery from the operation was quick.', pos: 'noun', level: 'B2' },
      { w: 'awareness', def: 'Knowledge or understanding of something', ex: 'There is growing awareness of mental health.', pos: 'noun', level: 'B2' },
    ],
    'Environment': [
      { w: 'pollution', def: 'Damage to air, water or land by chemicals', ex: 'Air pollution is a serious problem in cities.', pos: 'noun', level: 'A2' },
      { w: 'sustainable', def: 'Able to continue without damaging the environment', ex: 'We need more sustainable energy sources.', pos: 'adjective', level: 'B1' },
      { w: 'renewable', def: 'Energy from natural sources that never runs out', ex: 'Solar power is a renewable energy source.', pos: 'adjective', level: 'B1' },
      { w: 'biodiversity', def: 'The variety of life in a habitat', ex: 'The rainforest has incredible biodiversity.', pos: 'noun', level: 'B2' },
      { w: 'carbon footprint', def: 'The amount of CO₂ released by an activity', ex: 'Flying increases your carbon footprint.', pos: 'noun', level: 'B2' },
    ],
    'Technology': [
      { w: 'software', def: 'Programs used on a computer', ex: 'You need to update the software.', pos: 'noun', level: 'A2' },
      { w: 'algorithm', def: 'A set of rules for solving a problem', ex: 'Social media uses algorithms to show content.', pos: 'noun', level: 'B2' },
      { w: 'interface', def: 'A way of connecting systems or people', ex: 'The new interface is very user-friendly.', pos: 'noun', level: 'B1' },
      { w: 'automation', def: 'Using machines to do tasks automatically', ex: 'Automation is changing the workplace.', pos: 'noun', level: 'B2' },
    ],
    'Social Life': [
      { w: 'community', def: 'A group of people living in the same area', ex: 'She is very active in her local community.', pos: 'noun', level: 'A2' },
      { w: 'volunteer', def: 'To offer to do something without payment', ex: 'He volunteers at the local food bank.', pos: 'verb', level: 'B1' },
      { w: 'prejudice', def: 'An unfair opinion not based on facts', ex: 'We must challenge racial prejudice.', pos: 'noun', level: 'B2' },
      { w: 'perspective', def: 'A point of view or way of thinking', ex: 'Consider the problem from a different perspective.', pos: 'noun', level: 'B2' },
    ],
  };

  const insertV = db.prepare(`INSERT INTO vocabulary (word, definition, example_sentence, part_of_speech, level, theme) VALUES (?, ?, ?, ?, ?, ?)`);
  for (const [theme, words] of Object.entries(themes)) {
    for (const v of words) {
      insertV.run(v.w, v.def, v.ex, v.pos, v.level, theme);
    }
  }

  // ==================== ROADMAP A1-A2 (Sessions 1-14) ====================
  const a1a2Sessions = [
    { n: 1, title: 'Greetings & Introductions', skill: 'speaking', desc: 'Learn to introduce yourself: name, age, nationality.', stage: 'A1-A2', obj: 'Say your name, age, where you are from, and what you do.', bc: 'Speaking Part 1: Personal Questions' },
    { n: 2, title: 'Core: Grammar Basics (A1)', skill: 'grammar', desc: 'Verb to be (am/is/are), personal pronouns, and simple nouns.', stage: 'A1-A2', obj: 'Use the verb "to be" correctly in positive and negative sentences.', bc: 'Core Component: Grammar' },
    { n: 3, title: 'Vocabulary: Home & Family', skill: 'vocabulary', desc: 'Learn words for home, family members, and places around town.', stage: 'A1-A2', obj: 'Know at least 20 everyday words for home and family life.', bc: 'Core Component: Vocabulary' },
    { n: 4, title: 'Writing: Form Filling & Short Texts', skill: 'writing', desc: 'Practice completing forms and writing 20-30 word descriptions.', stage: 'A1-A2', obj: 'Fill in a registration form and write a 25-word personal description.', bc: 'Writing Part 1 & 2' },
    { n: 5, title: 'Reading: Sentence Completion (A2)', skill: 'reading', desc: 'Choose the right word to complete short sentences.', stage: 'A1-A2', obj: 'Complete 6 sentences with correct vocabulary and grammar.', bc: 'Reading Part 1' },
    { n: 6, title: 'Core: Grammar (A2) – Tenses', skill: 'grammar', desc: 'Present simple, past simple, and going-to future.', stage: 'A1-A2', obj: 'Use present simple, past simple, and basic future correctly.', bc: 'Core Component: Grammar' },
    { n: 7, title: 'Listening: Numbers & Specific Info', skill: 'listening', desc: 'Identify numbers, times, and key facts from short recordings.', stage: 'A1-A2', obj: 'Correctly identify times, dates, and phone numbers from listening.', bc: 'Listening Part 1 & 2' },
    { n: 8, title: 'Vocabulary: Travel & Everyday Life', skill: 'vocabulary', desc: 'Words for shopping, transport, and common social situations.', stage: 'A1-A2', obj: 'Use at least 15 vocabulary words correctly in sentences.', bc: 'Core Component: Vocabulary' },
    { n: 9, title: 'Speaking: Describe a Photo (Part 2)', skill: 'speaking', desc: 'Practise describing what you see in a photo for 45 seconds.', stage: 'A1-A2', obj: 'Describe a photo using "there is/are" and simple adjectives.', bc: 'Speaking Part 2' },
    { n: 10, title: 'Writing: Social Media Response (B1)', skill: 'writing', desc: 'Respond to a friend\'s post or comment (30-40 words).', stage: 'A1-A2', obj: 'Write a relevant and clear 30-40 word social media response.', bc: 'Writing Part 3' },
    { n: 11, title: 'Speaking: Comparing Options (Part 3)', skill: 'speaking', desc: 'Compare two photos or situations and express preference.', stage: 'A1-A2', obj: 'Use comparison language ("more...than", "I prefer... because").', bc: 'Speaking Part 3' },
    { n: 12, title: 'Reading: Reorder Sentences (Part 2)', skill: 'reading', desc: 'Arrange shuffled sentences into a logical paragraph.', stage: 'A1-A2', obj: 'Correctly reorder 7 sentences into a logical narrative.', bc: 'Reading Part 2' },
    { n: 13, title: 'Listening: Infer Attitude & Feeling', skill: 'listening', desc: 'Go beyond the words — understand how the speaker feels.', stage: 'A1-A2', obj: 'Identify the speaker\'s attitude (happy, frustrated, uncertain) from context clues.', bc: 'Listening Part 3' },
    { n: 14, title: 'A1-A2 Mock Review', skill: 'grammar', desc: 'Review all A1-A2 skills and take a short progress quiz.', stage: 'A1-A2', obj: 'Score at least 70% on the A1-A2 review test.', bc: 'All Components' },
  ];

  // ==================== ROADMAP B1-B2 (Sessions 15-40) ====================
  const b1b2Sessions = [
    { n: 15, title: 'Core: Grammar (B1-B2) – Conditionals', skill: 'grammar', desc: 'Master 1st, 2nd and 3rd conditionals in British English.', stage: 'B1-B2', obj: 'Use all three conditionals accurately in writing and speaking.', bc: 'Core Component: Grammar' },
    { n: 16, title: 'Writing: Formal Email (Part 4b)', skill: 'writing', desc: 'Write a formal email of 120-150 words.', stage: 'B1-B2', obj: 'Write a structured formal email with correct register and vocabulary.', bc: 'Writing Part 4b' },
    { n: 17, title: 'Speaking: Abstract Topic Discussion (Part 4)', skill: 'speaking', desc: 'Discuss complex topics for 2 minutes with clear arguments.', stage: 'B1-B2', obj: 'Speak for 2 minutes on an abstract topic using discourse markers.', bc: 'Speaking Part 4' },
    { n: 18, title: 'Vocabulary: Work & Career', skill: 'vocabulary', desc: 'Build professional vocabulary for work and career topics.', stage: 'B1-B2', obj: 'Use 10 professional vocabulary words correctly in context.', bc: 'Core Component: Vocabulary' },
    { n: 19, title: 'Reading: Long Article (Part 4)', skill: 'reading', desc: 'Read and match headings to paragraphs in a 750-word text.', stage: 'B1-B2', obj: 'Correctly match 5 headings to text paragraphs.', bc: 'Reading Part 4' },
    { n: 20, title: 'Core: Grammar – Passive Voice & Reporting', skill: 'grammar', desc: 'Passive structures and complex reported speech.', stage: 'B1-B2', obj: 'Transform 8 active sentences to passive and correctly report 5 statements.', bc: 'Core Component: Grammar' },
    { n: 21, title: 'Vocabulary: Environment & Society', skill: 'vocabulary', desc: 'Topics: pollution, sustainability, social issues.', stage: 'B1-B2', obj: 'Use environmental vocabulary in a writing task accurately.', bc: 'Core Component: Vocabulary' },
    { n: 22, title: 'Listening: Academic Talk (Part 4)', skill: 'listening', desc: 'Answer detailed questions about a formal talk or lecture.', stage: 'B1-B2', obj: 'Answer 6 comprehension questions from a 3-minute spoken text.', bc: 'Listening Part 4' },
    { n: 23, title: 'Writing: For/Against Essay', skill: 'writing', desc: 'Write a balanced essay: arguments for and against a topic.', stage: 'B1-B2', obj: 'Write a 150-word balanced essay with clear introduction and conclusion.', bc: 'Writing Part 4b' },
    { n: 24, title: 'Core: Vocabulary – Collocations & Synonyms', skill: 'vocabulary', desc: 'Master British collocation patterns: make/do/take/have + noun.', stage: 'B1-B2', obj: 'Correctly use 15 collocations in sentences.', bc: 'Core Component: Vocabulary' },
    { n: 25, title: 'Speaking: Full Mock Speaking Test', skill: 'speaking', desc: 'Complete a timed APTIS-style speaking test (all 4 parts).', stage: 'B1-B2', obj: 'Complete all 4 speaking parts within the allocated time.', bc: 'Full Speaking Component' },
    { n: 26, title: 'Grammar: Advanced Structures (B2)', skill: 'grammar', desc: 'Inversions, subjunctives, wish/if only, and cleft sentences.', stage: 'B1-B2', obj: 'Use 5 advanced grammar structures accurately.', bc: 'Core Component: Grammar' },
    { n: 27, title: 'Vocabulary: Technology & Media', skill: 'vocabulary', desc: 'Modern vocabulary for digital life and media.', stage: 'B1-B2', obj: 'Use 10 technology-related words accurately.', bc: 'Core Component: Vocabulary' },
    { n: 28, title: 'Reading: Full Mock Reading Test', skill: 'reading', desc: 'Complete a timed APTIS reading test (all 4 parts, 30 minutes).', stage: 'B1-B2', obj: 'Score 35+ out of 50 in the reading mock.', bc: 'Full Reading Component' },
    { n: 29, title: 'Listening: Full Mock Listening Test', skill: 'listening', desc: 'Complete a timed APTIS listening test (all 4 parts, 30 minutes).', stage: 'B1-B2', obj: 'Score 35+ out of 50 in the listening mock.', bc: 'Full Listening Component' },
    { n: 30, title: 'Writing: Full Mock Writing Test', skill: 'writing', desc: 'Complete a full APTIS writing test under exam conditions (50 minutes).', stage: 'B1-B2', obj: 'Complete all 4 writing parts within 50 minutes.', bc: 'Full Writing Component' },
    { n: 31, title: 'B2 Final Exam Simulation', skill: 'grammar', desc: 'Full APTIS mock exam covering all 5 components. Targets C level performance.', stage: 'B1-B2', obj: 'Achieve a minimum score of 40/50 across all components.', bc: 'Complete APTIS Test' },
  ];

  const insertR = db.prepare(`INSERT INTO roadmap (session_number, title, skill, description, stage, objectives, bc_ref, unlocked) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  
  for (let i = 0; i < a1a2Sessions.length; i++) {
    const s = a1a2Sessions[i];
    insertR.run(s.n, s.title, s.skill, s.desc, s.stage, s.obj, s.bc, i === 0 ? 1 : 0); // only first session unlocked
  }
  for (const s of b1b2Sessions) {
    insertR.run(s.n, s.title, s.skill, s.desc, s.stage, s.obj, s.bc, 0); // B1-B2 all locked initially
  }
  } // End of if (count.c === 0)

  // ==================== NEW: SUCCEED IN APTIS MOCK DATA ====================
  const succeedCount = db.prepare("SELECT COUNT(*) as c FROM practice_questions WHERE question LIKE '%[Succeed in APTIS]%'").get();
  if (succeedCount.c === 0) {
    const insertQ = db.prepare(
      `INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, part, roadmap_session) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const succeedInAptisQs = [
      // Listening Part 1
      { skill: 'listening', type: 'multiple_choice', q: '[Succeed in APTIS] Your friend calls to arrange your trip to London. What time does the train you will catch leave?\nYou will catch the ______.', opts: '["09:05 train", "08:30 train", "09:30 train"]', ans: '09:30 train', exp: 'Simulated answer from Succeed in APTIS Listening Test 2', diff: 'B1', part: 1 },
      { skill: 'listening', type: 'multiple_choice', q: '[Succeed in APTIS] Listen to the man talking about cycling. How far did he cycle on Sunday?\nHe cycled ______.', opts: '["10 miles", "12 miles", "8 miles"]', ans: '12 miles', exp: 'Simulated answer from Succeed in APTIS', diff: 'B1', part: 1 },
      { skill: 'listening', type: 'multiple_choice', q: '[Succeed in APTIS] A woman has lost her son. Listen to her describe him. What does he look like?\nHer son is ______.', opts: '["tall with short black hair", "slim with long brown hair", "tall and slim with long black hair"]', ans: 'tall and slim with long black hair', exp: 'Simulated answer from Succeed in APTIS', diff: 'B1', part: 1 },
      { skill: 'listening', type: 'multiple_choice', q: '[Succeed in APTIS] You ask for directions to the coffee shop. Where is the coffee shop?\nThe coffee shop is next to ______.', opts: '["the bridge", "the railway station", "the supermarket"]', ans: 'the railway station', exp: 'Simulated answer from Succeed in APTIS', diff: 'B1', part: 1 },
      { skill: 'listening', type: 'multiple_choice', q: '[Succeed in APTIS] Listen to an announcement at the airport. Why are the flights delayed?\nThe flights are delayed because ______.', opts: '["it is foggy", "there is a lot of snow", "the winds are very strong"]', ans: 'the winds are very strong', exp: 'Simulated answer from Succeed in APTIS', diff: 'B1', part: 1 },
      
      // Reading Part 3
      { skill: 'reading', type: 'multiple_choice', q: '[Succeed in APTIS - Reading Part 3] Four people were interviewed for Teens Now magazine about their weekend jobs. Who works outside even if it’s windy and raining?\n\nAndrew: Every Saturday and Sunday, I have to get up early because I deliver newspapers for my local shop... I do my deliveries on my bicycle in all weathers.\nJane: On Saturdays I work in one of the coffee shops in town...\nFred: Now I work in a large supermarket putting products on the shelves...\nMary: My Saturday job is cleaning shops after they close...', opts: '["Andrew", "Jane", "Fred", "Mary"]', ans: 'Andrew', exp: 'Andrew says he does deliveries in all weathers.', diff: 'B1', part: 3 },
      { skill: 'reading', type: 'multiple_choice', q: '[Succeed in APTIS - Reading Part 3] Who can take things home from work?\n\nAndrew: I deliver newspapers...\nJane: The best thing about my job is that I can take home any cakes that are left over.\nFred: I work in a large supermarket...\nMary: My Saturday job is cleaning shops...', opts: '["Andrew", "Jane", "Fred", "Mary"]', ans: 'Jane', exp: 'Jane says she can take home cakes.', diff: 'B1', part: 3 },
      { skill: 'reading', type: 'multiple_choice', q: '[Succeed in APTIS - Reading Part 3] Who has to wait at work before going home?\n\nAndrew: I deliver newspapers...\nJane: I work in a coffee shop...\nFred: The main problem is that I have to wait an hour after work for the first train home.\nMary: My Saturday job is cleaning shops...', opts: '["Andrew", "Jane", "Fred", "Mary"]', ans: 'Fred', exp: 'Fred waits an hour for the train.', diff: 'B1', part: 3 },
      { skill: 'reading', type: 'multiple_choice', q: '[Succeed in APTIS - Reading Part 3] Who can use earphones while they work?\n\nAndrew: I deliver newspapers...\nJane: I work in a coffee shop...\nFred: I work in a supermarket...\nMary: I love this job because I can listen to my iPod/MP3 player while I work.', opts: '["Andrew", "Jane", "Fred", "Mary"]', ans: 'Mary', exp: 'Mary listens to her MP3 player.', diff: 'B1', part: 3 },
      
      // Additional Grammar for completeness
      { skill: 'grammar', type: 'multiple_choice', q: '[Succeed in APTIS - Grammar] My parents _____ let me stay out late when I was a teenager.', opts: '["didn\'t", "wouldn\'t", "shouldn\'t", "haven\'t"]', ans: 'wouldn\'t', exp: '"Wouldn\'t let" describes past habits and permissions.', diff: 'B2', part: 1 },
      { skill: 'grammar', type: 'multiple_choice', q: '[Succeed in APTIS - Grammar] I wish I _____ studied harder for the exam.', opts: '["had", "have", "would", "did"]', ans: 'had', exp: '"Wish" + past perfect describes regrets about the past.', diff: 'B1', part: 1 },
      { skill: 'grammar', type: 'multiple_choice', q: '[Succeed in APTIS - Grammar] By this time next year, I _____ graduated from university.', opts: '["will have", "will be", "would have", "have"]', ans: 'will have', exp: 'Future perfect for an action that will be completed before a certain time in the future.', diff: 'B2', part: 1 },
      
      // Writing
      { skill: 'writing', type: 'text_input', q: '[Succeed in APTIS - Writing]\nYou are members of a photography club. The club manager wants to know what themes members would like to explore this year. Write your suggestions (30-40 words).', opts: null, ans: null, exp: null, diff: 'B1', part: 3 },
      { skill: 'writing', type: 'text_input', q: '[Succeed in APTIS - Writing]\nA friend wrote: "I am thinking about buying a new digital camera but I do not know which one to choose." Write a short advice (30-40 words).', opts: null, ans: null, exp: null, diff: 'B1', part: 3 },

      // Speaking
      { skill: 'speaking', type: 'audio_response', q: '[Succeed in APTIS - Speaking]\n"Tell me a little about the town where you live." (Speak for 30 seconds)', opts: null, ans: null, exp: null, diff: 'A2', part: 1 },
      { skill: 'speaking', type: 'audio_response', q: '[Succeed in APTIS - Speaking]\n"Look at the picture of people reading. Compare a physical book with reading on an electronic device." (Speak for 45 seconds)', opts: null, ans: null, exp: null, diff: 'B1', part: 3 }
    ];
    for (const q of succeedInAptisQs) {
      insertQ.run(q.skill, q.type, q.q, q.opts, q.ans, q.exp, q.diff, q.part, 10);
    }
  }

  // ==================== NEW: APTIS PRACTICE TEST DATA ====================
  const practiceCount = db.prepare("SELECT COUNT(*) as c FROM practice_questions WHERE question LIKE '%[Aptis Practice Test]%'").get();
  if (practiceCount.c === 0) {
    const insertQ = db.prepare(
      `INSERT INTO practice_questions (skill, type, question, options, correct_answer, explanation, difficulty, part, roadmap_session) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const aptisPracticeQs = [
      // Grammar
      { skill: 'grammar', type: 'multiple_choice', q: '[Aptis Practice Test] The woman _________ sold me those flowers spent twenty minutes wrapping them.', opts: '["what", "that", "which"]', ans: 'that', exp: 'Relative pronoun for people.', diff: 'B1', part: 1 },
      { skill: 'grammar', type: 'multiple_choice', q: '[Aptis Practice Test] A: I’ve just seen Mark. B: You _________ have seen him. He’s on holiday at the moment.', opts: '["can\'t", "shouldn\'t", "needn\'t"]', ans: 'can\'t', exp: 'Deduction in the past.', diff: 'B2', part: 1 },
      { skill: 'grammar', type: 'multiple_choice', q: '[Aptis Practice Test] He emphasised in his speech that __________ education he received when younger had been excellent.', opts: '["(-)", "an", "the"]', ans: 'the', exp: 'Specific education.', diff: 'B2', part: 1 },
      { skill: 'grammar', type: 'multiple_choice', q: '[Aptis Practice Test] She takes the bus to work _________ day.', opts: '["early", "many", "every"]', ans: 'every', exp: 'Frequency.', diff: 'A2', part: 1 },
      { skill: 'grammar', type: 'multiple_choice', q: '[Aptis Practice Test] I’ll call you when I ________ home.', opts: '["get", "will get", "getting"]', ans: 'get', exp: 'First conditional time clause.', diff: 'B1', part: 1 },

      // Vocabulary
      { skill: 'vocabulary', type: 'multiple_choice', q: '[Aptis Practice Test] Synonym matching: choose', opts: '["train", "look after", "make", "decide"]', ans: 'decide', exp: 'Synonym of choose is decide.', diff: 'A2', part: 1 },
      { skill: 'vocabulary', type: 'multiple_choice', q: '[Aptis Practice Test] Synonym matching: close', opts: '["take", "shut", "propose"]', ans: 'shut', exp: 'Synonym of close is shut.', diff: 'A2', part: 1 },
      { skill: 'vocabulary', type: 'multiple_choice', q: '[Aptis Practice Test] Synonym matching: improve', opts: '["believe", "develop", "worry"]', ans: 'develop', exp: 'Synonym of improve is develop.', diff: 'B1', part: 1 },
      { skill: 'vocabulary', type: 'multiple_choice', q: '[Aptis Practice Test] Synonym matching: care', opts: '["train", "look after", "make"]', ans: 'look after', exp: 'Look after means to care for.', diff: 'B1', part: 1 },
      { skill: 'vocabulary', type: 'multiple_choice', q: '[Aptis Practice Test] Synonym matching: practise', opts: '["train", "look after", "decide"]', ans: 'train', exp: 'Synonym of practise is train.', diff: 'B1', part: 1 },
    ];
    for (const q of aptisPracticeQs) {
      insertQ.run(q.skill, q.type, q.q, q.opts, q.ans, q.exp, q.diff, q.part, 10);
    }
  }

  console.log('✅ Database seeded successfully with BC-aligned content.');
}

module.exports = { seedDatabase };
