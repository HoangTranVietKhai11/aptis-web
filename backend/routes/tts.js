const express = require('express');
const router = express.Router();
const googleTTS = require('google-tts-api');

// GET /api/tts?text=...
const handleTTS = async (req, res) => {
  const { text, lang = 'en' } = req.query;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for TTS' });
  }

  try {
    const results = await googleTTS.getAllAudioBase64(text, {
      lang,
      slow: false,
      host: 'https://translate.google.com',
      splitPunct: ',.?'
    });

    res.json({ audio: results });
  } catch (error) {
    console.error('[TTS] Error generating audio:', error.message);
    res.status(500).json({ error: 'Failed to generate TTS audio' });
  }
};

router.get('/', handleTTS);
router.get('/*', handleTTS);

module.exports = router;
