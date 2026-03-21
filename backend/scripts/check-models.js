const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const result = await genAI.listModels();
    console.log('--- AVAILABLE MODELS ---');
    result.models.forEach(m => {
      console.log(`- ${m.name} (Methods: ${m.supportedMethods.join(', ')})`);
    });
    console.log('------------------------');
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
