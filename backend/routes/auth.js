const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Register attempt for:', email);

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên, email và mật khẩu.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự.' });
  }

  try {
    const result = await req.db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'Email này đã được đăng ký.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = uuidv4();

    await req.db.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      [id, name, email, hashedPassword, 'user']
    );

    const token = jwt.sign({ id, name, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    console.log('Registration successful for:', email);
    res.status(201).json({
      token,
      user: { id, name, email, role: 'user' },
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Lỗi đăng ký: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu.' });
  }

  try {
    const result = await req.db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
    }

    // Update last_active_date and calculate streak
    const today = new Date().toISOString().split('T')[0];
    let newStreak = user.streak_count || 0;
    
    // Note: in PG, columns like last_active_date might be TIMESTAMP, so we handle both
    const lastActive = user.last_active_date ? new Date(user.last_active_date).toISOString().split('T')[0] : null;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; 
      }
      // Update streak and last_active in a generic way (we'll ensure daily_stats tracks this better later)
      // For now, mirroring previous logic but with PG syntax
      // In PG, we'll store it as a simple timestamp or date
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        xp: user.xp || 0,
        streak_count: newStreak
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT id, name, email, role, xp, created_at FROM users WHERE id = $1', 
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
