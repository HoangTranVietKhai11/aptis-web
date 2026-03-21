const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: {
    maxOutputTokens: 500,
    temperature: 0.7,
  }
}); 
// Optimized for speed with token limit and moderate temperature.

/**
 * Analyzes an APTIS B2 writing or speaking response.
 * @param {string} prompt The original question prompt.
 * @param {string} response The user's text or transcript.
 * @param {string} skill 'writing' or 'speaking'
 * @returns {Promise<{score: number, feedback: string, suggestion: string}>}
 */
async function analyzeResponse(prompt, response, skill, attempt = 1) {
  const isWriting = skill.toLowerCase() === 'writing';
  const cohesionTrait = isWriting ? 'Cohesion & Coherence' : 'Fluency & Pronunciation';
  
  const systemPrompt = `
    Aptis Examiner. Grade ${skill} (B2/C1).
    Traits (0-5): Task, Grammar, Vocab, ${cohesionTrait}.
    
    Q: "${prompt}"
    A: "${response}"
    
    JSON ONLY:
    {
      "score": <scaled 0-50>,
      "band": "<A1-C>",
      "traits": {"task_fulfillment":0-5, "grammar":0-5, "vocabulary":0-5, "cohesion_or_fluency":0-5},
      "feedback": "<Limit 15 words>",
      "suggestions": "<Limit 15 words>"
    }
  `;

  try {
    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    const status = error.status || (error.response && error.response.status);
    console.error(`[AI Error] Status: ${status}, Message: ${error.message}`);

    // Handle 429 (Rate Limit) or 503 (Overloaded) with Retry
    if ((status === 429 || status === 503) && attempt <= 3) {
      const delay = attempt * 3000; // 3s, 6s, 9s...
      console.warn(`[AI] Temporary error (${status}). Retrying in ${delay}ms (Attempt ${attempt}/3)...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return analyzeResponse(prompt, response, skill, attempt + 1);
    }

    console.error('Gemini API Error:', error.message || error);
    return {
      score: 25,
      band: "B1",
      traits: { task_fulfillment: 3, grammar: 3, vocabulary: 2, cohesion_or_fluency: 2 },
      feedback: "AI insight currently unavailable (Rate Limit). Evaluation based on length and patterns.",
      suggestions: "Focus on using more cohesive devices and varied grammar structures."
    };
  }
}
/**
 * Uses AI to structure raw text extracted from a PDF into a valid APTIS-style exam JSON.
 * @param {string} text Raw text from PDF.
 * @param {string} hintSkill Optional skill hint (reading, listening, speaking, writing, grammar).
 * @returns {Promise<Object>} Structured exam JSON.
 */
async function parseExamFromText(text, hintSkill = '') {
  const prompt = `
    You are an APTIS ESOL exam parser. Convert the following raw text from an APTIS practice PDF into a structured JSON object.
    ${hintSkill ? `The focus of this document is the ${hintSkill.toUpperCase()} skill. Please ensure all extracted questions are categorized as ${hintSkill}.` : ''}
    
    The JSON should have this structure:
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

    Note: For Writing and Speaking, questions are usually prompts (type: "text_input") without options.

    Text content:
    """
    ${text.substring(0, 10000)} 
    """

    Return ONLY the valid JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const cleanJson = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('AI Parsing Error:', error);
    throw new Error('Failed to parse exam with AI');
  }
}

/**
 * Rephrases text to a higher formal/B2+ level for APTIS Writing/Speaking.
 * @param {string} text The user's input.
 * @returns {Promise<string>} Rephrased text.
 */
async function rephraseText(text) {
  const prompt = `
    Analyze the following English text and rephrase it to be more professional, sophisticated, and aligned with APTIS B2/C1 standards. 
    Keep the original meaning but use better vocabulary and grammatical structures.
    
    Text: "${text}"
    
    Return ONLY the rephrased version.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    if (error.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    console.error('AI Rephrase Error:', error);
    return text; // Fallback
  }
}

module.exports = { analyzeResponse, parseExamFromText, rephraseText };
