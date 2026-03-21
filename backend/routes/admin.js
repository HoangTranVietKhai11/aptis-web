const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Tất cả admin routes đều cần auth + admin role
router.use(requireAuth, requireAdmin);

// GET /api/admin/users — danh sách tất cả users
router.get('/users', async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id — xóa user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  if (id === req.user.id) {
    return res.status(400).json({ error: 'Không thể xóa chính mình.' });
  }

  try {
    const result = await req.db.query('SELECT id, role FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Không thể xóa tài khoản admin.' });

    await req.db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/users/:id/role — đổi role của user
router.patch('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role không hợp lệ. Chỉ chấp nhận: user, admin.' });
  }
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Không thể tự thay đổi role của mình.' });
  }

  try {
    const result = await req.db.query('SELECT id FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });

    await req.db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats — thống kê toàn hệ thống
router.get('/stats', async (req, res) => {
  try {
    const uResult = await req.db.query('SELECT COUNT(*) as count FROM users');
    const qResult = await req.db.query('SELECT COUNT(*) as count FROM practice_questions');
    const aResult = await req.db.query('SELECT COUNT(*) as count FROM user_answers');
    const mResult = await req.db.query('SELECT COUNT(*) as count FROM mock_tests');
    const cResult = await req.db.query('SELECT COUNT(*) as count FROM user_answers WHERE is_correct = 1');

    const totalAnswers = parseInt(aResult.rows[0].count);
    const correctAnswers = parseInt(cResult.rows[0].count);

    res.json({
      total_users: parseInt(uResult.rows[0].count),
      total_questions: parseInt(qResult.rows[0].count),
      total_answers: totalAnswers,
      total_mock_tests: parseInt(mResult.rows[0].count),
      accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
