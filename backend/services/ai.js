const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile'; // Best free Groq model

/**
 * Helper: Call Groq chat completion
 */
async function callGroq(prompt, maxTokens = 700) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || '';
}

/**
 * Analyzes an APTIS speaking or writing response.
 * @param {string} prompt The original question prompt.
 * @param {string} response The user's text or transcript.
 * @param {string} skill 'writing' or 'speaking'
 * @returns {Promise<{score: number, band: string, traits: object, feedback: string, suggestions: string}>}
 */
async function analyzeResponse(prompt, response, skill, attempt = 1) {
  const isWriting = skill.toLowerCase() === 'writing';
  const cohesionTrait = isWriting ? 'Cohesion & Coherence' : 'Fluency & Pronunciation';

  const systemPrompt = `
    You are an encouraging and friendly Aptis Examiner. Grade this ${skill} response (B2/C1 target).
    Traits (0-5): Task Fulfillment, Grammar, Vocabulary, ${cohesionTrait}.
    
    Question: "${prompt}"
    User's Answer: "${response}"
    
    Respond STRICTLY in JSON format only. No extra text outside the JSON.
    {
      "score": <scaled 0-50, where 50 is perfect>,
      "band": "<A1, A2, B1, B2, or C>",
      "traits": {
        "task_fulfillment": <0-5>, 
        "grammar": <0-5>, 
        "vocabulary": <0-5>, 
        "cohesion_or_fluency": <0-5>
      },
      "feedback": "<Friendly, encouraging feedback in 1-2 short sentences with an emoji ✨>",
      "suggestions": "<One actionable, positive tip to improve in 10-15 words>"
    }
  `;

  try {
    const text = await callGroq(systemPrompt, 600);
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const start = cleanJson.indexOf('{');
    const end = cleanJson.lastIndexOf('}') + 1;
    return JSON.parse(cleanJson.substring(start, end));
  } catch (error) {
    const status = error.status || (error.response && error.response.status);
    console.error(`[Groq Error] Status: ${status}, Message: ${error.message}`);

    // Handle 429 with retry
    if (status === 429 && attempt <= 3) {
      const delay = attempt * 5000;
      console.warn(`[Groq] Rate limit. Retrying in ${delay}ms (Attempt ${attempt}/3)...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return analyzeResponse(prompt, response, skill, attempt + 1);
    }

    return {
      score: 25,
      band: 'B1',
      traits: { task_fulfillment: 3, grammar: 3, vocabulary: 2, cohesion_or_fluency: 2 },
      feedback: 'AI insight temporarily unavailable. Keep practicing! 💪',
      suggestions: 'Focus on using more cohesive devices and varied grammar structures.'
    };
  }
}

/**
 * Uses AI to structure raw text extracted from a PDF into a valid APTIS-style exam JSON.
 */
async function parseExamFromText(text, hintSkill = '') {
  const prompt = `
    You are an APTIS ESOL exam parser. Convert the following raw text from an APTIS practice PDF into a structured JSON object.
    ${hintSkill ? `The focus is the ${hintSkill.toUpperCase()} skill.` : ''}
    
    The JSON structure:
    {
      "title": "Exam Title",
      "questions": [
        {
          "skill": "grammar" | "vocabulary" | "reading" | "listening" | "writing" | "speaking",
          "type": "multiple_choice" | "text_input",
          "question": "Full question text",
          "options": ["A", "B", "C", "D"] | null,
          "correct_answer": "Correct choice or null for open-ended",
          "explanation": "Brief explanation",
          "difficulty": "B1" | "B2" | "C1",
          "part": 1-4
        }
      ]
    }

    Text content:
    """
    ${text.substring(0, 8000)} 
    """

    Return ONLY the valid JSON object, no extra text.
  `;

  try {
    const text2 = await callGroq(prompt, 2000);
    const cleanJson = text2.replace(/```json|```/g, '').trim();
    const start = cleanJson.indexOf('{');
    const end = cleanJson.lastIndexOf('}') + 1;
    return JSON.parse(cleanJson.substring(start, end));
  } catch (error) {
    console.error('Groq Parsing Error:', error);
    throw new Error('Failed to parse exam with AI');
  }
}

/**
 * Rephrases text to a higher formal/B2+ level for APTIS Writing/Speaking.
 */
async function rephraseText(text) {
  const prompt = `
    Rephrase the following English text to be more professional and sophisticated, aligned with APTIS B2/C1 standards. Keep the original meaning but use better vocabulary and grammatical structures.
    
    Text: "${text}"
    
    Return ONLY the rephrased version, nothing else.
  `;

  try {
    const result = await callGroq(prompt, 500);
    return result.trim();
  } catch (error) {
    if (error.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    console.error('Groq Rephrase Error:', error);
    return text; // Fallback
  }
}

/**
 * Uses AI to generate fresh APTIS-style practice questions for a given skill.
 */
async function generatePracticeQuestions(skill, difficulty = 'B1', limit = 20) {
  const skillGuide = {
    grammar: 'Aptis ESOL 2026 Core format: 3-option or 4-option multiple-choice sentence completion. Focus on everyday language. Include 4 options (A, B, C, D).',
    vocabulary: 'Aptis ESOL 2026 Core format: Synonym matching, collocation, or word definition multiple-choice. Include 4 options (A, B, C, D).',
    reading: 'Aptis ESOL 2026 format: Part 1 (Sentence comprehension) or Part 2 (Text cohesion) style. Include a short 3-5 sentence text/paragraph in the question, followed by a comprehension gap fill or question. Include 4 options (A, B, C, D).',
    listening: `Aptis ESOL 2026 format (25 questions total, 4 options A, B, C, D). You MUST provide a "transcript" (the audio dialogue/monologue) and a "question" based on it. Generate questions randomly spreading across these 4 parts:
    - Part 1: Information Recognition (Short conversations, specific info like numbers, times, names).
    - Part 2: Information Matching (Short monologues/dialogues, matching context like what to buy, where to go).
    - Part 3: Inference - Discussion (2-person discussions, inferring attitude, intention, or opinion).
    - Part 4: Inference - Long Monologues (Longer monologues, deep understanding of attitude/viewpoint).`,
    writing: 'Aptis ESOL 2026 format open-ended prompts: Part 2 (short personal writing), Part 3 (social network chat replies), or Part 4 (informal/formal emails). Generate the prompt only, no options or answer needed.',
    speaking: 'Aptis ESOL 2026 format open-ended prompts: Part 1 (personal info), Part 2 (describe picture), Part 3 (compare 2 pictures), or Part 4 (abstract topic). Generate the detailed scenario prompt, no options.'
  };

  const isSpeakingOrWriting = skill === 'speaking' || skill === 'writing';

  const prompt = `
    You are an expert test developer for the latest British Council APTIS ESOL 2026 exam. 
    Generate exactly ${limit} brand new, highly realistic practice questions for the "${skill}" skill targeting the "${difficulty}" CEFR level.

    Question type guidelines for "${skill}": ${skillGuide[skill] || 'General English practice questions.'}

    Output a single valid JSON array with exactly ${limit} objects, each with this structure:
    {
${skill === 'listening' ? '      "transcript": "A realistic dialogue or monologue transcript for the audio",\n' : ''}      "question": "Full question text",
${isSpeakingOrWriting ? '' : '      "options": ["option A text", "option B text", "option C text", "option D text"],\n      "correct_answer": "The exact text of the correct option",\n      "explanation": "A short clear explanation",\n'}      "difficulty": "${difficulty}",
      "part": <1, 2, 3, or 4 as integer>
    }

    CRITICAL RULES:
    - Return ONLY the valid JSON array. No markdown, no extra text, no backticks.
    - Ensure all ${limit} questions are unique and varied.
${isSpeakingOrWriting ? '    - DO NOT include options, correct_answer, or explanation.' : '    - always include 4 options and a correct_answer that matches exactly one of the options.'}
  `;

  try {
    const text = await callGroq(prompt, 4000);
    const cleanText = text.replace(/```json|```/g, '').trim();
    const start = cleanText.indexOf('[');
    const end = cleanText.lastIndexOf(']') + 1;
    const questions = JSON.parse(cleanText.substring(start, end));
    return questions.map(q => ({
      ...q,
      skill,
      type: skill === 'speaking' ? 'audio_response' : skill === 'writing' ? 'text_input' : 'multiple_choice',
      transcript: skill === 'listening' ? (q.transcript || '') : null,
      options: isSpeakingOrWriting ? null : (q.options ? JSON.stringify(q.options) : null),
      correct_answer: isSpeakingOrWriting ? null : q.correct_answer,
      explanation: isSpeakingOrWriting ? null : q.explanation,
    }));
  } catch (error) {
    console.error('[Groq] Generate questions error:', error.message);
    throw new Error('Failed to generate questions with AI');
  }
}

module.exports = { analyzeResponse, parseExamFromText, rephraseText, generatePracticeQuestions };
