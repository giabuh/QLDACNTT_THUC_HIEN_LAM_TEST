// ============================================
// services/authService.js — Authentication
// ============================================
import api from './api';

const authService = {
  /**
   * Đăng nhập
   * @param {string} email
   * @param {string} password
   * @returns {{ token, user }}
   */
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    if (data.success && data.token) {
      localStorage.setItem('nexus_token', data.token);
      localStorage.setItem('nexus_user', JSON.stringify(data.user));
    }
    return data;
  },

  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
  },

  /**
   * Lấy thông tin user hiện tại từ API
   */
  async getProfile() {
    return api.get('/auth/me');
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(currentPassword, newPassword) {
    return api.post('/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Lấy user từ localStorage (không gọi API)
   */
  getStoredUser() {
    const str = localStorage.getItem('nexus_user');
    return str ? JSON.parse(str) : null;
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated() {
    return !!localStorage.getItem('nexus_token');
  },
};

export default authService;
