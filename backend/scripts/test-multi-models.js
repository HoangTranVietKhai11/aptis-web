const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testModels() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  for (const modelName of models) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`✅ ${modelName} works! Response: ${result.response.text().trim()}`);
      return; // Stop if one works
    } catch (error) {
      console.error(`❌ ${modelName} failed: ${error.message}`);
    }
  }
}

testModels();
