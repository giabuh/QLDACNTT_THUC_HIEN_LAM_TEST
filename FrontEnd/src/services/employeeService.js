// ============================================
// services/employeeService.js
// ============================================
import api from './api';

const employeeService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/employees${query ? '?' + query : ''}`);
  },
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
};

export default employeeService;
