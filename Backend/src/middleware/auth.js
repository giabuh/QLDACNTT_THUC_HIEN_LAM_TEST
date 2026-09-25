// ============================================
// middleware/auth.js — JWT Authentication + RBAC
// ============================================
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Middleware: Xác thực JWT token
 * - Đọc token từ header: Authorization: Bearer <token>
 * - Verify token → gắn req.user = { userId, employeeId, roleCode, email }
 * - Nếu không hợp lệ → 401 Unauthorized
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn thông tin user vào request
    req.user = {
      userId: decoded.userId,
      employeeId: decoded.employeeId,
      roleCode: decoded.roleCode,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn, vui lòng đăng nhập lại',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ',
    });
  }
};

module.exports = { authenticate };
