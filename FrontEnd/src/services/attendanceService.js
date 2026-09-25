// ============================================
// services/attendanceService.js
// ============================================
import api from './api';

const attendanceService = {
  checkIn: (data = {}) => api.post('/attendance/check-in', data),
  checkOut: (data = {}) => api.post('/attendance/check-out', data),
  getMyToday: () => api.get('/attendance/me/today'),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/attendance${query ? '?' + query : ''}`);
  },
};

export default attendanceService;
