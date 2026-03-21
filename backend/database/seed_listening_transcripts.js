/**
 * seed_listening_transcripts.js
 * Adds proper Aptis-format listening dialogues/transcripts to all 10 mock tests.
 * Each question gets a unique transcript (passage) that the TTS will read aloud.
 * Structure: Part 1 (13q info recall) + Part 2 (4q monologue matching) + Part 3 (8q opinion inference)
 */
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'aptis.db'));

// 10 themes, one per mock test
const THEMES = [
  'Technology & Digital Life',       // Mock 1
  'Environment & Sustainability',    // Mock 2
  'Education & Learning',            // Mock 3
  'Work & Career',                   // Mock 4
  'Travel & Tourism',                // Mock 5
  'Health & Fitness',                // Mock 6
  'Society & Culture',               // Mock 7
  'Arts & Media',                    // Mock 8
  'Science & Innovation',            // Mock 9
  'Business & Economy'               // Mock 10
];

// ------------------------------------------------------------------
// Transcript templates per theme
// Part 1: Short info messages (phone numbers, times, names, prices)
// Part 2: Monologues from 4 different speakers on the same topic
// Part 3: Man/woman discussion expressing opinions
// ------------------------------------------------------------------

const TRANSCRIPTS = {
  'Technology & Digital Life': {
    part1: [
      // Q1-Q13: Short info messages
      "Hello, you've reached TechSupport. Our office opens at nine thirty in the morning and closes at six in the evening, Monday to Friday. We are closed on weekends. Please leave your name and contact number after the beep.",
      "Hi, this is customer service at DigiStore. The new SmartPhone model X is now available. The price is three hundred and forty-nine pounds. You can collect your order from store number four on the third floor.",
      "Good afternoon. This is a reminder for your appointment with our IT consultant, Doctor Sarah Williams, on Tuesday the fifteenth at two fifteen pm. Please call us on oh-eight-hundred-three-four-five-six if you need to reschedule.",
      "Welcome to the Tech Expo. Registration desk B is now open. Please bring your ID and ticket number. The keynote speech begins at eleven o'clock in Hall Three. Wi-Fi password is TechExpo2026.",
      "Hi, this message is for James Parker. Your laptop repair is ready for collection. The total cost is eighty-seven pounds and fifty pence. We are open until five thirty today. Please bring your receipt.",
      "Thank you for calling CyberSafe Security. To report a technical issue, press one. For billing enquiries, press two. For all other services, press three, or hold to speak to an advisor.",
      "This is an automated message from your internet provider. Your bill of forty-two pounds is due on the twenty-second of this month. To pay now, please visit our website or call the number on your bill.",
      "Hello, you've reached the Digital Library. The library will be closed on Monday for maintenance. We reopen Tuesday at nine am. All online services remain available twenty-four hours a day, seven days a week.",
      "Hi there! This is a voicemail from your delivery service. Your online order, item number DL-seven-eight-nine, will arrive tomorrow between two and four pm. Someone must be home to sign for it.",
      "Good morning. This is an update from CloudStore. Your free storage allowance of fifteen gigabytes is almost full. To upgrade to fifty gigabytes, the monthly fee is two pounds ninety-nine.",
      "Hello, the Tech Club meeting this Thursday is moved from Room Twelve to the conference suite on the ground floor. The new start time is six forty-five pm. Refreshments will be provided.",
      "This is a reminder from AppBank. Your subscription renews in three days on the twenty-ninth. The renewal cost is nine pounds ninety-nine per month. If you wish to cancel, please do so before midnight on the twenty-eighth.",
      "Hi, calling from the IT department. We'll be updating the server between midnight and three am on Saturday. During this time, email and internal systems will be unavailable. Please save your work before leaving on Friday."
    ],
    part2: [
      // Q14-Q17: 4 monologues on Technology
      "I've been working in software development for twelve years now. What excites me most about technology today is artificial intelligence. The way machine learning can analyse data and find patterns that humans would miss is truly remarkable. I believe AI will fundamentally change how we solve complex problems in medicine, climate science, and education.",
      "As a secondary school teacher, I have mixed feelings about technology in the classroom. On one hand, interactive tools and online resources make lessons more engaging. But I worry that students are becoming too dependent on their devices. Many of them struggle to concentrate without a screen in front of them. We need a balance.",
      "I run a small online business, and honestly, technology has been a lifeline. I sell handmade jewellery through social media and an e-commerce website. Without these platforms, I'd never reach customers internationally. Digital marketing tools have allowed me to grow my business from my kitchen table to a global audience.",
      "I'm a retired engineer, and I find some aspects of modern technology quite alarming. People share too much personal information online without thinking about the consequences. Privacy is being eroded, and I don't think enough people understand the risks. Companies and governments have enormous power through the data they collect about us."
    ],
    part3: [
      // Q18-Q25: Man and woman discussing Technology
      "Man: So what do you think about working from home becoming permanent for so many people?\nWoman: Honestly, I love it. I save two hours a day just on commuting. My productivity has gone up massively.\nMan: Really? I find it harder to switch off. My home has become my office, and I never truly relax.\nWoman: I see your point, but I think it's about setting boundaries. I have a dedicated workspace and I stick to my hours.\nMan: That's easier said than done when your manager expects you to be available all evening on messaging apps.\nWoman: That's a management problem, not a technology problem. With the right culture, remote work is fantastic.\nMan: Maybe. But I do miss the spontaneous conversations you get in an office. Things you'd never discuss over email.\nWoman: True, but video calls have improved so much. A lot of teams actually communicate better now than they did before."
    ]
  },
  'Environment & Sustainability': {
    part1: [
      "Hello, this is Greenfield Council. Your recycling collection takes place every other Tuesday. Please put your blue bin out by seven am. Cardboard, glass, and plastic are accepted. No food waste in this bin.",
      "Thank you for calling the National Park visitor centre. We are open seven days a week from eight am to six pm in summer. Guided wildlife walks leave at nine thirty each morning. Booking is required. Call oh-one-seven-three-four-eight-eight-two-two.",
      "Hi, this is Emily from EcoEnergy. Your solar panel installation is booked for Friday the eighteenth at ten am. The team will arrive between ten and ten thirty. Please ensure access to your loft and roof is clear.",
      "Good morning. This message is for residents of Maple Street. The new electric vehicle charging point outside number forty-two is now active. It costs eleven pence per kilowatt hour. The council app will tell you when it's free.",
      "Hello, you've reached the Environmental Helpline. To report fly-tipping, press one. For air quality information press two. To report flooding, press three. For all other queries please hold or visit our website.",
      "This is a voicemail from the Community Garden Project. Our next volunteer planting day is Sunday the third. Meet at the main gate at nine o'clock. Please bring gloves and wear comfortable, weather-appropriate clothing.",
      "Hi there. This is CleanOcean calling about your donation. We received your contribution of twenty pounds. Your gift helps fund three beach clean-up operations per month. Thank you for your support.",
      "Good afternoon. This is the Natural History Museum. Your tickets for the Climate Change Exhibition on Saturday are confirmed. Please arrive by the time printed on your ticket. The exhibition opens at ten am.",
      "Hello, this is a message from EcoBuild. Your delivery of forty recycled breeze blocks will arrive on Wednesday, between eight and noon. Please ensure your driveway is clear. The delivery vehicle is large.",
      "This is an alert from the Environment Agency. Air quality in your area is forecast to be moderate tomorrow due to high traffic levels. People with asthma or breathing conditions are advised to limit time outdoors.",
      "Hi, you've reached SustainableFoods. Your veg box subscription starts next week. Your first box, containing potatoes, carrots, spinach, and tomatoes, will arrive on Thursday. The cost is sixteen pounds fifty.",
      "Good morning. The Green Energy Fair is this weekend in City Park. Events run from ten to five on Saturday and eleven to four on Sunday. Entry is free. Over sixty sustainable brands will be exhibiting.",
      "Hello from WildlifeTrust. We are pleased to inform you that your adoption of an otter is confirmed. Your certificate and information pack will be posted to you within five working days. Thank you for your kindness."
    ],
    part2: [
      "I'm a marine biologist and I've spent twenty years studying coral reefs. The changes I've witnessed are devastating. Bleaching events that used to occur every decades now happen every few years. Ocean warming and acidification are destroying ecosystems that took thousands of years to develop. Urgent action is not optional — it's critical.",
      "As a farmer, I'm deeply worried about unpredictable weather patterns. Last summer we had three weeks of drought, then flooding in September. That combination ruined a third of my crops. I've had to completely rethink how I manage my land. I'm now using drought-resistant seed varieties and conserving water wherever I can.",
      "I work for a sustainability consultancy advising businesses on reducing their carbon footprint. The shift I'm seeing is genuinely encouraging. More companies now understand that going green is also good business. Energy efficiency saves money, and customers increasingly choose brands with strong environmental credentials.",
      "I'm a climate activist, and while I'm glad awareness is growing, I'm frustrated by how slowly governments are acting. We've had decades of reports, pledges, and summits — but emissions keep rising. Young people are angry because the generation making decisions won't live to see the worst consequences. We need radical, urgent change now."
    ],
    part3: [
      "Woman: Did you cycle to work today? I noticed your new bike outside.\nMan: I did. I decided to try cutting out the car for a month. It's actually brilliant — I feel much more energetic.\nWoman: That's great. I've been thinking about doing the same. The bus takes forever and cycling would be faster.\nMan: Definitely. And you save money on petrol. Do you have a safe route?\nWoman: Not really. The main road is quite dangerous. There's nowhere for cyclists on the main section.\nMan: I go through the park and the back streets. It adds five minutes but it's much safer and quite scenic.\nWoman: That's good to know. I might give it a try next week. Have you noticed any change in fitness?\nMan: I've only been doing it for ten days but yes. I feel less stressed at the end of the day as well."
    ]
  },
  'Education & Learning': {
    part1: [
      "Hello, this is Westbrook College. Your application for the September intake has been received. You will hear about the outcome within ten working days. If you have questions, please call admissions on oh-one-six-two-three-four-five-one.",
      "Good morning. This is a reminder that the school's open evening is on Thursday the second at six thirty pm. All parents and prospective students are welcome. Please enter through the main gates on Station Road.",
      "Hi, you've reached the university library. Books can be borrowed for three weeks. DVDs and journals are a one-week loan. You may renew items online up to three times if they haven't been requested by another student.",
      "This is a message for students enrolled on the Advanced Mathematics course. Your exam has been rescheduled from Room four to the Sports Hall. The start time remains two pm. Please arrive fifteen minutes early.",
      "Hello. This is a reminder that the deadline for your coursework submission is this Friday at four pm. All work must be uploaded to the student portal. If you experience technical issues, contact IT support immediately.",
      "Good afternoon. The after-school drama club meeting has been cancelled this week due to the teacher being unwell. It will resume next Tuesday at three thirty. Students who travel by bus should make alternative arrangements.",
      "Hello, this is the Student Finance team. Your maintenance loan payment of one thousand and twelve pounds will be transferred to your account on the fifth of October. Please ensure your bank details are up to date.",
      "Hi there. This is a message for the parents of Year Seven pupils. School photos will be taken next Wednesday. Please make sure your child is in full school uniform. Order forms are available from the school office.",
      "Good morning. You have reached the Language Centre. Our new Italian evening class starts on Wednesday the ninth at seven pm. There are still four places remaining. The fee is one hundred and fifty pounds for twelve sessions.",
      "This is an automated reminder from the education authority. Your child missed school on four occasions last half-term without an authorised reason. Please contact the school attendance officer to discuss this matter.",
      "Hello, this message is for Mr and Mrs Harrison. Your son James has been selected for the regional junior science competition in March. Please confirm his attendance by calling the school office before the twenty-third.",
      "Good morning. This is Northfield School. Due to the extreme weather forecast, school will open one hour late tomorrow. Gates will open at nine fifteen. Parents who cannot make alternative arrangements should contact the office.",
      "Hi, you've reached the Careers Service. Drop-in appointments are available every Tuesday between eleven and one. Alternatively, you can book a forty-five minute consultation online through the student hub on our website."
    ],
    part2: [
      "I've been a secondary school teacher for eighteen years, and I believe the biggest challenge students face today is information overload. The internet gives them access to everything, but they struggle to evaluate what's reliable. Critical thinking is the skill I try to develop above all else. Facts change — the ability to analyse never goes out of date.",
      "I'm in my second year of a medical degree, and honestly, the workload is immense. I study for around twelve hours a day, including weekends. People assume university is mostly social — and there are good times — but the academic pressure is intense. I'm doing it because I genuinely want to help people. That motivation keeps me going.",
      "As a primary school teaching assistant, I see huge variation in how children learn. Some children pick things up just by listening. Others need to see it drawn out or to physically do something with their hands. The best teachers adapt their approach constantly. Unfortunately, large class sizes make that incredibly difficult in practice.",
      "I left school at sixteen with very few qualifications and went straight into construction work. In my forties I decided to go back to college. It was terrifying at first — I felt completely out of place. But I got my degree at forty-seven, and now I work as a civil engineer. It's never too late to learn something new."
    ],
    part3: [
      "Man: I'm thinking of going back to do a master's degree next year. What do you think?\nWoman: What made you decide that now? You're already in a fairly senior role.\nMan: I want to move into strategy consulting, and everyone in that field seems to have a postgraduate qualification.\nWoman: True. But have you thought about how you'd manage it alongside your job?\nMan: I'd probably do a part-time online programme. Most good universities offer them now.\nWoman: That's less disruptive. What subjects are you leaning towards?\nMan: Business analytics. It combines data science with management. Very in-demand at the moment.\nWoman: That sounds like a smart choice. The ROI on a degree like that could be significant. I'd go for it."
    ]
  },
  'Work & Career': {
    part1: [
      "Hello, this is the HR department at Meridian Solutions. We would like to invite you to an interview for the Marketing Manager position on Wednesday the eleventh at ten thirty am. Please confirm by calling oh-two-oh-seven-eight-nine-one.",
      "Good afternoon. This is a voicemail from your recruitment agency. We've found a potential match for your profile — a full-time project coordinator role in central London. The salary range is thirty-two to thirty-eight thousand. Are you interested?",
      "Hi there. This is a message for all staff. The all-company meeting will take place in the main boardroom on Friday at three pm. Attendance is mandatory. Please wrap up your current tasks by two forty-five to be on time.",
      "Hello. This is the payroll department. Your salary for October will be transferred on the twenty-seventh, not the usual twenty-fifth, due to the bank holiday. Your payslip will be available on the company portal 48 hours in advance.",
      "Good morning. You've reached the Occupational Health team. Your appointment with Dr Patterson is on Thursday the sixteenth at nine am. The clinic is on the second floor of the North Wing. Please bring your employee ID.",
      "This is a message for Sarah Jenkins from Admin. Your travel expenses claim form, submitted on the third, has been approved. Payment of two hundred and sixty-four pounds will be included in your next salary.",
      "Hello, this is the Learning and Development team. Your enrolment on the Leadership Essentials course has been confirmed. The first session runs on Tuesday the fourteenth from nine to five. Lunch is provided.",
      "Hi, calling to remind you about the performance review with your line manager on Monday at two pm. Please complete your self-assessment form on the staff portal before the meeting. It should take approximately thirty minutes.",
      "Good afternoon. This is a message from the Facilities team. The car park behind the office will be closed for resurfacing on Thursday and Friday. Alternative parking is available at the Queensway NCP, and your parking costs will be reimbursed.",
      "Hello. You've reached the employee assistance helpline. We are available twenty-four hours a day, seven days a week, to provide confidential support on personal, health, and work-related matters. All calls are completely confidential.",
      "This is a reminder from the IT Security team. You are required to reset your company password before the end of this week. Passwords must be at least twelve characters and include a number and a special symbol.",
      "Good morning. This is the building manager. Please note that fire evacuation drills will be conducted tomorrow at eleven am and again at two thirty pm. Use the nearest emergency exit and assemble at the green meeting point.",
      "Hi, calling from Talent Acquisition. We wanted to let you know that the position you applied for has now been filled internally. We have kept your CV on file and will be in touch if a suitable role becomes available in the next six months."
    ],
    part2: [
      "I've worked in nursing for twenty-two years and the job has changed enormously. When I started, we had much more time with patients. Now the wards are understaffed and we're constantly rushing. I love what I do, but the emotional and physical strain is real. Burnout is a growing crisis in healthcare that simply isn't addressed honestly.",
      "I quit my corporate job three years ago to start a food business. People thought I was mad. But I'd spent fifteen years climbing the ladder in banking and I was deeply unhappy. Now I run a small artisan bakery and yes, I earn less — but I have purpose. Every morning I wake up looking forward to the day. I'd never go back.",
      "I'm a construction site manager and the work is challenging but rewarding. There's real satisfaction in watching a building go up from nothing — knowing your team made it happen. The biggest frustration is paperwork and compliance. We spend nearly as much time on documentation as we do on actual building, which seems wrong.",
      "As a freelance graphic designer, I manage my own time and choose my clients. The freedom is wonderful, but the inconsistency is stressful. Some months I'm overwhelmed with work; other months there's almost nothing. I've learned to save aggressively during good periods and maintain a strong network. It takes discipline and confidence."
    ],
    part3: [
      "Woman: I've been offered a job in Edinburgh. It pays fifteen percent more than my current salary.\nMan: Edinburgh! That's a big move. Are you seriously considering it?\nWoman: I am. It's a great company. Better prospects, more responsibility. I'd be leading a team for the first time.\nMan: That sounds really exciting. What's holding you back?\nWoman: Everything. My flat, my friends, my parents live twenty minutes away. Starting completely fresh terrifies me.\nMan: I understand. But this kind of opportunity doesn't come along that often. You'd adapt — people always do.\nWoman: I know. I just keep thinking about all the things I'd be leaving behind.\nMan: Those things will still exist. You can visit. And Edinburgh is an incredible city. Give it serious thought."
    ]
  },
  'Travel & Tourism': {
    part1: [
      "Good morning. You've reached Sunshine Travel. Your holiday booking to Tenerife is confirmed for the fourteenth of August, departing from Manchester Airport at six fifty am. Please check in at least two hours before departure.",
      "Hello. This is International Transfers. Your driver will collect you from Terminal Two at eight thirty pm. The vehicle registration is NX22 KLP. The driver will be holding a sign with your name. Please call us on arrival.",
      "Hi, this is the Grand Plaza Hotel. Your reservation for a superior double room from the third to the eighth of July is confirmed. Breakfast is included from seven to ten thirty am. Check-in is from two pm.",
      "This is a message from your travel insurer. Your policy number is TRV-eight-eight-four-one. For medical emergencies abroad, call our twenty-four-hour helpline on plus-four-four-one-six-two-three-nine-nine-nine. Keep your policy number safe.",
      "Hello, calling from Explore Tours. Your place on the three-day tour of the Scottish Highlands is confirmed. The coach departs from Waverley Station at eight fifteen am on Saturday. Please be there by eight o'clock.",
      "Good afternoon. This is Edinburgh Visitor Centre. The next available slot for the castle tour is at two thirty pm. Tickets are sixteen pounds fifty for adults and twelve pounds for concessions. Book online to avoid queuing.",
      "Hi, this is Eurostar customer services. Your journey from London St Pancras to Paris Gare du Nord on the twenty-second is confirmed. Your departure time is nine forty-three am. Please arrive thirty minutes before for security.",
      "This is a reminder that your passport application has been received. Standard processing takes approximately ten working weeks. If your travel date is sooner, you may wish to apply for the premium six-week service at an additional cost.",
      "Hello, this message is from City Cycle Tours. Your guided bike tour of Amsterdam leaves from the Dam Square at ten am. Please arrive by nine forty-five. Helmets and bikes are provided. Comfortable shoes are advised.",
      "Good morning. You have reached the Visa Application Centre. Your appointment is on Thursday the ninth at eleven am. Please bring your completed application form, recent passport photograph, and all supporting documents.",
      "Hi there. This is LuxAir. Your flight LA-four-eight-one to Rome has been delayed by approximately ninety minutes. New departure time is fifteen thirty. We apologise for any inconvenience. Complimentary refreshment vouchers are available at Gate Six.",
      "Hello, calling from Backpackers World. Your hostel bed in Lisbon is booked for five nights from the twelfth. You are in a six-person mixed dormitory in room sixteen. Check-in is from three pm. Lockers are available.",
      "This is the National Rail information service. Due to engineering works, there will be no trains between Birmingham and Coventry this Sunday. Replacement bus services will operate from the station forecourt every thirty minutes."
    ],
    part2: [
      "I've visited over sixty countries as a travel writer, and my view is that authentic travel is becoming harder to find. Mass tourism has transformed many beautiful places into theme parks. You turn up in a village that was once remote and there are fifteen tour buses and a gift shop. But if you venture off the beaten path, genuine magic still exists.",
      "I work for an airline as cabin crew, and I genuinely love my job. Every day is different — you meet fascinating people from all over the world. The challenging part is the irregular hours. Your body never fully adjusts to the time zone changes. Sleep deprivation is the hardest part of the career, but the adventure makes it worth it.",
      "I'm a hotel manager in a coastal resort. Summer is extraordinary — absolutely full, incredible atmosphere. But winters are very quiet and we have to make difficult decisions about staffing. We've invested heavily in events and packages to extend the season, but it's a constant challenge to keep revenue stable throughout the year.",
      "I run a small eco-lodge in Costa Rica. We focus on sustainable tourism — minimal footprint, maximum local benefit. All our staff are from the surrounding villages. Guests come specifically because they don't want a resort experience. They want to wake up in the jungle, see wildlife, and understand that travel can support conservation rather than damage it."
    ],
    part3: [
      "Man: I'm planning a trip to Japan next spring. Have you been?\nWoman: I went two years ago. Honestly, it's one of the most amazing places I've ever visited.\nMan: What was the highlight for you?\nWoman: Kyoto without question. The temples, the bamboo forests, the food. It felt completely different from anywhere I'd been before.\nMan: I've read the food is incredible. I'm a bit nervous about the language barrier though.\nWoman: I was too, but the Japanese signage has English translations in most tourist areas. And people there are incredibly helpful.\nMan: Good to know. What time of year would you recommend? I'm thinking April.\nWoman: Cherry blossom season. Perfect timing. Just book everything early because it gets very busy. Hotels fill up months in advance."
    ]
  },
  'Health & Fitness': {
    part1: [
      "Hello, this is Southside Medical Centre. Your appointment with Doctor Chen is confirmed for Monday the eighth at ten forty-five am. Please arrive ten minutes early. Bring any current medication you are taking.",
      "Good morning. This is an automated reminder from your dentist. You are due for a routine check-up. Please call us on oh-one-two-three-four-four-five-six-seven to book an appointment at your convenience.",
      "Hi, calling from the PhysioPlus clinic. Your first physiotherapy session is on Thursday at three thirty pm. The session lasts fifty minutes. Please wear comfortable sports clothing. The clinic is on the second floor, opposite the lift.",
      "This is the NHS blood test department. Your blood test results from the sixth are ready to discuss with your GP. Please call to arrange a telephone appointment. There is no need to come into the surgery for this.",
      "Good afternoon. This is FitCity Gym. Your membership renewal is due on the twenty-first. The current annual fee is four hundred and eighty pounds. If you auto-renew online, you receive a ten percent loyalty discount.",
      "Hello, this is a healthy eating reminder from your programme coordinator. Your next check-in appointment is on Wednesday at nine am. Please weigh yourself that morning and record your food diary for the past week.",
      "Hi there. This is MindfulApp. You've completed your first week of the eight-week stress management programme. Well done! Your next session — on breathing techniques — will unlock tomorrow morning.",
      "Good morning. This is the sleep clinic confirming your overnight sleep study on Friday the third. Please arrive at the unit by nine pm. Bring comfortable pyjamas and any usual medication. A light snack will be provided.",
      "Hello. You've reached the community mental health team. If you are in crisis, please call nine nine nine or go to your nearest A and E. For all other enquiries, please call back during office hours, Monday to Friday, nine to five.",
      "Hi, this is your optician. Your contact lens supply is running low based on your order history. Your next box will be dispatched automatically on the fifteenth unless you wish to change your prescription. Please call to update your details.",
      "Good afternoon. This is St Thomas' Hospital pharmacy. Your prescription is ready for collection. The pharmacy is open until seven pm today and from nine am tomorrow. You'll need to bring your ID and prescription reference number.",
      "Hello, this is the smoking cessation team. Your next counselling session is on Tuesday at two pm. Please complete the mood and craving diary we gave you and bring it to the appointment. You're making excellent progress.",
      "Hi there. This is Sunrise Fitness. Your three-month personal training package begins Monday. Your trainer is Marcus, and sessions run on Monday, Wednesday, and Friday at seven am. Please eat a light meal at least an hour before."
    ],
    part2: [
      "I'm a GP and over the last decade I've seen a significant rise in lifestyle-related conditions. Type two diabetes, hypertension, and anxiety are all increasing. What concerns me is how much of this is preventable. Diet, exercise, sleep — these aren't just lifestyle choices. They are medicine. But reaching patients before they get ill is genuinely difficult.",
      "I became a personal trainer after my own health transformation. I was overweight and exhausted at thirty-two. I changed my diet, started exercising, and lost twenty-three kilograms. That experience gave me the empathy to really understand my clients. Fitness isn't about punishment — it's about energy, confidence, and feeling good in your own body.",
      "I'm a nutritionist specialising in sports performance. Athletes often ask me about supplements, but the truth is, most gains come from the basics — consistent protein, hydration, quality carbohydrates before training, and good sleep. People always want a shortcut. But the foundations matter more than any powder you can buy.",
      "I work as a mental health nurse and the demand for our services has never been higher. The wait times in many areas are simply too long. People contact us in real distress and we can't always see them quickly enough. I'm proud of the work we do, but the gap between what people need and what the system can provide is deeply concerning."
    ],
    part3: [
      "Woman: I've started going to a yoga class on Tuesday evenings. You should try it.\nMan: Yoga? I'm not exactly flexible. I'd probably embarrass myself.\nWoman: That's the point — you're not supposed to be flexible at the start. It's about progress, not perfection.\nMan: What kind of yoga is it? I know there are lots of different types.\nWoman: It's called Hatha. Very gentle and focused on breathing and basic postures. Perfect for beginners.\nMan: How long have you been going?\nWoman: Six weeks. My back pain has almost completely gone. And I sleep so much better now. It's been transformative.\nMan: You've convinced me. What time does the class start?\nWoman: Seven thirty. I can send you the instructor's contact details if you want to book a trial session."
    ]
  },
  'Society & Culture': {
    part1: [
      "Hello, this is the local council. Your application for a community events permit for the summer festival on the park has been approved. Please collect your permit from the council offices before the twenty-fourth.",
      "Good morning. This is the City Museum. We are delighted to inform you that you have been selected as a volunteer guide for our Viking and Roman exhibition. Induction training begins on Saturday at ten am.",
      "Hi, this is the Community Centre. The salsa dancing class on Thursdays at seven thirty is now full. However, we have opened a new class on Tuesday evenings at eight. Would you like us to add your name to the list?",
      "This is a message from the neighbourhood watch coordinator. There have been reports of suspicious behaviour in the area this week. Please ensure your home is secure, keep valuables out of sight, and report anything unusual to the police.",
      "Hello, you've reached the Citizens Advice Bureau. We are open Monday to Friday nine to five and Saturday nine to twelve. Our advisors can help with housing, benefits, employment rights, and debt. No appointment is necessary on Wednesday mornings.",
      "Good afternoon. This is the electoral registration office. The annual canvass form for your address has not yet been returned. Please complete it online using the code on the form, or return the paper copy by the thirtieth.",
      "Hi there. This is the public library. Your reserved copy of the biography you requested is now available. It will be held for seven days. The library is open until eight pm on Thursdays for your convenience.",
      "Hello. This is a message from Shelter. Thank you for your donation of fifty pounds. It will help fund a week of support for a family at risk of homelessness. Your generosity truly makes a difference. A receipt will be posted to you.",
      "Good morning. You've reached the marriage registry office. Your appointment to register your marriage intention is confirmed for Tuesday the twenty-first at eleven am. Please bring photo ID and proof of address for both parties.",
      "This is the local housing association. Your maintenance request has been assigned to our repairs team. An engineer will visit on Thursday between eight and twelve. Please ensure an adult is present at the property during this time.",
      "Hello, calling from the multicultural arts festival. Your stall application has been successful! You will be allocated a space in the main square. Please arrive to set up from eight am on Saturday. Stalls must be ready by ten.",
      "Good afternoon. This is the foodbank coordinator. Your donation of tinned goods and pasta has been received. We are particularly short of cooking oil, coffee, and breakfast cereal at the moment. Thank you for your continued generosity.",
      "Hi, this is a message from the local interfaith council. The community dialogue evening on the topic of social cohesion is this Thursday at seven pm, in the town hall. All members of the public are warmly welcomed."
    ],
    part2: [
      "I'm a sociologist and I've researched inequality for over fifteen years. What strikes me about contemporary society is that despite growing prosperity, the gap between the richest and poorest is widening. Access to quality education, healthcare, and housing remains deeply unequal. We talk about meritocracy, but background still predicts outcome far too powerfully.",
      "I grew up in a small village and moved to London in my twenties. The culture shock was significant. Everything is faster, more anonymous, and more competitive. But I've also found incredible diversity and opportunity here. I think both rural and urban life have things to offer — the key is choosing consciously, not just drifting.",
      "I work for a refugee resettlement charity, and the stories I hear are both heartbreaking and inspiring. The courage it takes to rebuild your life in a completely foreign country is extraordinary. Language is often the biggest barrier. But once people find their feet, the contribution they make to communities is remarkable.",
      "I'm a retired police officer, and I've seen communities change enormously over three decades. When I started, I knew the families on every street of my patch. Now there's much more transience — people moving frequently, less rootedness. Building trust between police and communities takes more effort than it used to, but it's more important than ever."
    ],
    part3: [
      "Man: Have you been following the debate about lowering the voting age to sixteen?\nWoman: Yes. I find it a complex one. I can see arguments on both sides.\nMan: I'm fairly supportive of it. Young people are affected by political decisions — climate policy, university fees — but have no say.\nWoman: That's a fair point. But I worry about whether the maturity is there to weigh complex policies objectively.\nMan: Adults who are uninformed still vote. Maturity isn't a requirement at eighteen either.\nWoman: True. And citizenship education at sixteen is much stronger than it was. Perhaps they'd be more engaged voters than many adults.\nMan: Exactly. Countries like Scotland and Austria already allow it, and there's no evidence it has caused problems.\nWoman: You've nudged me a bit. I think I'm cautiously in favour, with the right education programme in schools."
    ]
  },
  'Arts & Media': {
    part1: [
      "Hello, this is the Royal Theatre box office. Your tickets for the Friday evening performance of Macbeth on the twelfth are ready for collection. Please bring a photo ID. The show starts at seven thirty pm. Doors open at seven.",
      "Good morning. This is the photography studio. Your portrait session is booked for Saturday at eleven am. The session lasts ninety minutes. Please wear a change of outfits. Prints are available in small, medium, and large formats.",
      "Hi, calling from the BBC Radio Drama department. We're delighted to inform you that your submitted short play, The Last Signal, has been shortlisted for our new voices prize. Further details will follow by email within three days.",
      "This is a voicemail from the art gallery. The new exhibition, Futures Unseen, opens to the public on Thursday. Private view invitations were sent last week. Gallery hours are Tuesday to Sunday, ten am to six pm. Admission is free.",
      "Hello, you've reached the film festival helpdesk. Accreditation passes can be collected from the venue box office from nine am on Wednesday. Please bring the confirmation email and a photo ID. Lanyards will be provided.",
      "Good afternoon. This message is for members of the local choir. Rehearsals for the Christmas concert begin on Tuesday the fourth at seven thirty pm. Please download the sheet music from our online members area before attending.",
      "Hi. This is your pottery class instructor. Term two begins on Monday the eighteenth. Please bring your own apron and a small flat-bottomed bowl you'd like to repair using the Japanese Kintsugi technique. All other materials are provided.",
      "Good morning. This is the creative writing workshop. Unfortunately, next week's Tuesday session is cancelled as the facilitator is unwell. We will reschedule and email all attendees shortly. We apologise for the inconvenience.",
      "Hello. This is the Children's Theatre. Your family booking for the Saturday two thirty performance of The Jungle Book is confirmed. Four tickets — two adult, two child — for Row D. Please collect from the box office on arrival.",
      "This is a message from MediaWorks. Your internship application for the summer film production programme has been reviewed. We'd like to invite you for a portfolio review on the fifth at three pm. Please bring ten examples of your work.",
      "Hi, this is the Animation Festival. Your short film has been accepted into the student showcase section. Your screening slot is eleven forty-five am on Saturday in Studio Three. You will have five minutes for questions afterward.",
      "Good afternoon. This is the National Orchestra. The rehearsal on Thursday evening will now take place in rehearsal room seven, not the main hall. Please use the stage door on Park Street. Parking is free after six pm.",
      "Hello. You've reached the public art commission. Your proposal for the city centre mural has been approved by the committee. The installation budget is eight thousand pounds. A meeting to discuss timelines is scheduled for next week."
    ],
    part2: [
      "I'm a novelist and I published my first book at fifty-three, after twenty years of trying. The publishing world is remarkably difficult to break into — there are thousands of talented writers and very few mainstream publishing slots. The rise of digital self-publishing has changed everything. Now the challenge isn't getting published: it's getting noticed.",
      "I run a YouTube channel about film history, and what started as a hobby now gets a hundred thousand views per month. I never expected that. The internet has democratised arts criticism completely. In the past, a handful of critics in major newspapers decided what was worth seeing. Now, a teenager in a small town can build a global audience for their ideas.",
      "I'm a professional musician — mostly session work for TV commercials and film scores. It's not glamorous, but it's steady. What worries me is artificial intelligence. There are now algorithms that can compose background music on demand. If that becomes widespread, musicians like me could find our work disappearing. It's not science fiction — it's already happening.",
      "I work as a museum curator focusing on digital art. There's huge institutional resistance from traditional museums who see digital work as somehow lesser. But audiences — especially younger ones — are deeply engaged with interactive and screen-based art. The future of museums depends on their willingness to evolve. The ones that don't will empty."
    ],
    part3: [
      "Woman: I finally watched that film you recommended. The one that won the award at Cannes.\nMan: Oh brilliant! What did you think?\nWoman: Honestly? I found it beautiful but very slow. I kept wondering if something was about to happen and then... it didn't.\nMan: I think that's intentional. It's very much about the atmosphere and the performance rather than the plot.\nWoman: The lead actress was extraordinary, I'll give you that. But I felt it needed editing. At two hours forty it was too long.\nMan: Fair criticism. Though I'd argue every scene has a purpose if you read the director's interpretation.\nWoman: Maybe I need to watch it again. But on first viewing I felt a bit frustrated.\nMan: That's completely valid. Art films provoke different reactions. I found it meditative rather than slow."
    ]
  },
  'Science & Innovation': {
    part1: [
      "Hello, you've reached the science museum education department. Your school's visit on the twenty-third is confirmed for one hundred and twelve students. Coaches should use the North car park. Your group will be met by a guide at nine thirty.",
      "Good morning. This is MedTech Innovations. Your participation in the vision correction clinical trial has been accepted. The first session is on Monday at two pm at the research centre. A travel subsidy of twenty pounds is available.",
      "Hi, this is the university engineering department. The robotics workshop on Saturday is now fully booked. However, we are running an additional session on Sunday from ten to four. Would you like to be added to the list?",
      "This is a message from the Space Observatory. The solar observation session you booked is weather-dependent. We will confirm by six pm on Friday whether the Saturday event can proceed. A full refund is available if cancelled.",
      "Good afternoon. This is the chemistry laboratory coordinator. New safety regulations mean all students must complete the online lab induction module before the twelfth. Access the module through your university learning portal.",
      "Hello. You've reached the inventor's mentorship programme. Your application has been reviewed. We'd like to offer you a place in Cohort Seven. The programme runs for six months. Please confirm your acceptance by the fifteenth.",
      "Hi, this is ZeroGravity Adventures. Your zero-gravity flight experience is booked for the second of December. The flight lasts two hours and includes eight to ten periods of weightlessness. Full briefing documentation will be sent next week.",
      "Good morning. This is the Genome Research Centre. Your results from the ancestry DNA analysis are ready to download from your secure account. An explanatory booklet has been posted to you. Please store the documents securely.",
      "Hello. This is a reminder from the science fair committee. Your project submission deadline is the thirty-first. Please submit your entry form, a three-hundred-word abstract, and four photographs to the online portal.",
      "This is the Robotics Society. Our next build session is Tuesday at six pm in the engineering lab. We'll be assembling the line-follower robot from last week. Please bring your laptop. Tea and biscuits will be provided.",
      "Good afternoon. This is the nanotechnology research team. We have a vacancy for a voluntary research assistant starting in January for six months. No prior experience required but enthusiasm for science is essential. Please email your CV.",
      "Hi, calling from the science podcast studio. Your interview about climate modelling is scheduled for Wednesday at four pm. The studio is in the Media Centre, Room nine. Please arrive ten minutes early. The interview will be forty-five minutes.",
      "Hello. You've reached the patent registration office. Your preliminary search for your invention title, EcoPrint, has been completed. The report is available to download. Please call to discuss next steps with an advisor."
    ],
    part2: [
      "I'm a particle physicist at CERN, and the work we do here is often described as beautiful by non-scientists, which surprises many people. Science at the deepest level is an aesthetic pursuit as much as a practical one. We're asking fundamental questions about the nature of reality — not to build anything, not for commercial gain — simply to understand. That motivation is deeply human.",
      "I work in biomedical engineering, designing prosthetic limbs with neural feedback. We can now create hands that actually allow amputees to feel texture and temperature. When I see someone using one of our prototypes and experiencing sensation for the first time in years, the emotion in the room is extraordinary. Science changes individual lives in profound ways.",
      "I'm a science communicator — I write books, give talks, and maintain a social media presence aimed at making science accessible to everyone. The funding for pure science is under constant pressure. If the public don't understand why it matters, they won't support it politically. My job is persuasion as much as explanation.",
      "I lead a team researching antibiotic resistance, and I want to be honest: this is one of the most serious health threats facing our species. If we lose the ability to treat bacterial infections, routine operations become life-threatening. The scientific community understands this. The political will to act — to fund research and regulate antibiotic use globally — is much weaker than it needs to be."
    ],
    part3: [
      "Man: Have you seen the news about the new Mars mission launching next year?\nWoman: Yes! I find it extraordinary. But I always wonder — with so many problems on Earth, should we really be spending all that money on space?\nMan: I understand the argument, but I think it's a false choice. Space research has given us GPS, satellite weather forecasting, scratch-resistant lenses...\nWoman: True. The spinoffs are often overlooked. But colonising Mars feels more like billionaire adventure tourism than genuine science.\nMan: The science is real though. Understanding other planets is crucial for understanding our own. And eventual colonisation may be necessary for species survival.\nWoman: I accept that in principle. I just wish the communication from space agencies was clearer about the actual tangible benefits to ordinary people.\nMan: That's fair. There's definitely a public relations gap. People would support it more if they understood what they were actually getting.\nWoman: Exactly. I'm pro-science. I just want the case made more clearly."
    ]
  },
  'Business & Economy': {
    part1: [
      "Hello, you've reached FirstNational Bank business banking. Your loan application reference BL-six-seven-one-two has been received. A decision will be made within five working days. Please have your most recent accounts ready if we call you.",
      "Good morning. This is a message from the Chambers of Commerce. The annual business awards dinner is on the twenty-eighth of November at the Riverside Hotel. Tables of eight are available at twelve hundred pounds. Book before the fifteenth.",
      "Hi, calling from AccountsPlus. Your quarterly VAT return for the period July to September is due by the thirty-first. If you need assistance, our tax advisory team is available Monday to Friday, nine to five.",
      "This is a voicemail from your supplier, Axiom Wholesale. Due to increased raw material costs, our prices will be revised from the first of January. Updated price lists will be emailed in two weeks. We appreciate your continued partnership.",
      "Good afternoon. This is the Enterprise Support helpline. You've been approved for a twelve-thousand-pound small business grant from the regional growth fund. Please call us to arrange an appointment to receive your formal offer letter.",
      "Hello. This is a reminder from CompanyHouse. Your annual confirmation statement is due by the fourteenth. You can file online in approximately five minutes using your authentication code. Failure to file on time may result in penalties.",
      "Hi there. This message is for the business development team at Sterling Logistics. Your pitch to Greenfield Retail Ltd is confirmed for Tuesday at two pm in their headquarters in Bristol. They are expecting a forty-five minute presentation.",
      "This is your commercial property agent. I have a new listing that may be of interest — a four-hundred-square-metre office space in Canary Wharf available from January. Asking rent is forty-two pounds per square foot. Shall I arrange a viewing?",
      "Good morning. This is the export licensing department. Your application to export goods to the UAE market has been approved. Documents will be dispatched within three working days. Please retain them for all shipments to that territory.",
      "Hello. You've reached StartUp Hub. Your mentoring session with the business advisor is on Thursday at eleven am, in Meeting Room Two. Please bring your business plan and three months of financial projections to the session.",
      "Hi, calling from InsurePro. Your commercial liability policy renewal is due on the nineteenth. The premium has increased by four percent to two thousand and eighty pounds. Please advise whether you'd like to renew or explore alternatives.",
      "Good afternoon. This is the market research team at TrendAnalytics. Your questionnaire responses have been received. These will contribute to a sector analysis published in January. A complimentary copy will be emailed to all participants.",
      "Hello. This is a voicemail from the trade union representative. The ballot on proposed changes to shift patterns closes on Friday at five pm. All members eligible to vote will have received their ballot by post or email. Please exercise your vote."
    ],
    part2: [
      "I started my first company at twenty-four with three thousand pounds saved from waitressing. That business failed within eighteen months. My second business — a digital marketing agency — is now twenty people strong and turning over two million a year. The failure taught me more than the success. Don't avoid mistakes. Make them early, and learn from them fast.",
      "I'm an economist specialising in global trade, and the past decade has fundamentally reshaped my views. The assumption that free trade delivers widespread prosperity has been tested severely. The gains are real, but they are enormously concentrated. The communities and workers displaced by cheap imports have often been failed by politics that offered no credible alternative.",
      "I've worked in investment banking for eighteen years, and I left because the culture was increasingly something I'm not proud of. The obsession with short-term returns drives behaviour that is harmful to businesses, workers, and society. I now work with a social impact fund supporting businesses that measure success more broadly than quarterly earnings.",
      "I run an independent bookshop that has survived against all odds. The secret is community. We host author events, book clubs, children's storytelling hours. We are not just selling books — we are providing something the internet simply cannot replicate: human connection and a shared space. People pay for that, even in difficult economic times."
    ],
    part3: [
      "Woman: I've been offered equity in a startup in exchange for some consulting work. It's risky but potentially very lucrative.\nMan: How much equity are we talking?\nWoman: Three percent of the company for three months of work. The valuation is currently two million.\nMan: So three percent of two million is sixty thousand on paper. But startups often fail, so...\nWoman: Exactly. It could be worthless. But they have a solid product and have already attracted seed funding.\nMan: That is a positive sign. What's the sector?\nWoman: Sustainable packaging. Growing rapidly. Several large retailers are already looking at them.\nMan: Hmm. The timing and sector sound right. Do you believe in the founders?\nWoman: Genuinely, yes. They're experienced and transparent.\nMan: Then I'd probably do it. With three percent, even a modest exit could be very significant."
    ]
  }
};

console.log('🌟 Updating 10 Mock Tests with proper Aptis Listening transcripts...');

try {
  // Find all mock tests we seeded
  const mocks = db.prepare("SELECT id, title FROM mock_tests WHERE title LIKE 'Aptis ESOL Mock Test%' ORDER BY id").all();
  
  if (mocks.length === 0) {
    console.log('❌ No mock tests found. Run seed_10_mocks.js first.');
    process.exit(1);
  }

  const updateTranscript = db.prepare('UPDATE practice_questions SET transcript = ? WHERE id = ?');

  let totalUpdated = 0;

  db.transaction(() => {
    mocks.forEach((mock, testIdx) => {
      const theme = THEMES[testIdx % THEMES.length];
      const themeData = TRANSCRIPTS[theme];
      if (!themeData) return;

      // Get all listening questions for this mock test
      const listeningQs = db.prepare(`
        SELECT pq.id, pq.part FROM practice_questions pq
        JOIN mock_test_questions mtq ON mtq.question_id = pq.id
        WHERE mtq.mock_test_id = ? AND pq.skill = 'listening'
        ORDER BY pq.part, pq.id
      `).all(mock.id);

      // Group by part
      const byPart = { 1: [], 2: [], 3: [] };
      listeningQs.forEach(q => {
        const p = q.part <= 3 ? q.part : 3;
        byPart[p].push(q);
      });

      // Assign Part 1 transcripts (info recognition)
      byPart[1].forEach((q, i) => {
        const t = themeData.part1[i % themeData.part1.length];
        updateTranscript.run(t, q.id);
        totalUpdated++;
      });

      // Assign Part 2 transcripts (monologue matching)
      byPart[2].forEach((q, i) => {
        const t = themeData.part2[i % themeData.part2.length];
        updateTranscript.run(t, q.id);
        totalUpdated++;
      });

      // Assign Part 3 transcripts (discussion/inference)
      byPart[3].forEach((q, i) => {
        const t = themeData.part3[i % themeData.part3.length];
        updateTranscript.run(t, q.id);
        totalUpdated++;
      });

      console.log(`✅ Mock Test ${testIdx + 1} (${theme}): Updated ${listeningQs.length} listening questions`);
    });
  })();

  console.log(`\n🎉 Done! Total updated: ${totalUpdated} listening questions with English transcripts.`);
} catch (e) {
  console.error('❌ Error:', e);
} finally {
  db.close();
}
