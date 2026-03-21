const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Tất cả admin routes đều cần auth + admin role
router.use(requireAuth, requireAdmin);

// GET /api/admin/users — danh sách tất cả users
router.get('/users', (req, res) => {
  const users = req.db.prepare(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  ).all();
  res.json(users);
});

// DELETE /api/admin/users/:id — xóa user
router.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  if (id === req.user.id) {
    return res.status(400).json({ error: 'Không thể xóa chính mình.' });
  }

  const user = req.db.prepare('SELECT id, role FROM users WHERE id = ?').get(id);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Không thể xóa tài khoản admin.' });

  req.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ success: true });
});

// PATCH /api/admin/users/:id/role — đổi role của user
router.patch('/users/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role không hợp lệ. Chỉ chấp nhận: user, admin.' });
  }
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Không thể tự thay đổi role của mình.' });
  }

  const user = req.db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });

  req.db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
  res.json({ success: true });
});

// GET /api/admin/stats — thống kê toàn hệ thống
router.get('/stats', (req, res) => {
  const totalUsers = req.db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalQuestions = req.db.prepare('SELECT COUNT(*) as count FROM practice_questions').get().count;
  const totalAnswers = req.db.prepare('SELECT COUNT(*) as count FROM user_answers').get().count;
  const totalMockTests = req.db.prepare('SELECT COUNT(*) as count FROM mock_tests').get().count;
  const correctAnswers = req.db.prepare('SELECT COUNT(*) as count FROM user_answers WHERE is_correct = 1').get().count;

  res.json({
    total_users: totalUsers,
    total_questions: totalQuestions,
    total_answers: totalAnswers,
    total_mock_tests: totalMockTests,
    accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
  });
});

module.exports = router;
