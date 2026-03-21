const express = require('express');
const router = express.Router();
const { analyzeResponse, rephraseText } = require('../services/ai');

// POST /api/ai/tutor - existing mock logic or bridge to Gemini
router.post('/tutor', async (req, res) => {
  const { prompt, response, skill } = req.body;
  try {
    const analysis = await analyzeResponse(prompt, response, skill);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: 'AI Error' });
  }
});

// POST /api/ai/rephrase
router.post('/rephrase', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  try {
    const rephrased = await rephraseText(text);
    res.json({ rephrased });
  } catch (err) {
    if (err.message === 'RATE_LIMIT') {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait 30 seconds.' });
    }
    res.status(500).json({ error: 'AI Rephrase Error' });
  }
});

module.exports = router;
