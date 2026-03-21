const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aptis-secret-key-change-in-production';

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, name, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Chưa xác thực.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Bạn không có quyền truy cập tính năng này.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, JWT_SECRET };
