// ============================================
// middleware/auth.js — JWT Authentication + RBAC
// ============================================
const jwt = require('jsonwebtoken');
const db = require('../db');

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

/**
 * Middleware Factory: Kiểm tra quyền theo vai trò
 * @param {...string} allowedRoles - Danh sách role_code được phép
 * 
 * Ví dụ:
 *   router.get('/payroll', authenticate, authorize('CEO', 'HR_DIRECTOR'), handler);
 *   router.get('/me', authenticate, handler); // Tất cả role đều truy cập được
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực',
      });
    }

    if (!allowedRoles.includes(req.user.roleCode)) {
      return res.status(403).json({
        success: false,
        message: `Vai trò "${req.user.roleCode}" không có quyền truy cập chức năng này`,
        required: allowedRoles,
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
