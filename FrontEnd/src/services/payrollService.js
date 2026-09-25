// ============================================
// services/payrollService.js
// ============================================
import api from './api';

const payrollService = {
  getPeriods: () => api.get('/payroll/periods'),
  getPayslips: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/payroll/payslips${query ? '?' + query : ''}`);
  },
  getMyPayslips: () => api.get('/payroll/me'),
  calculate: (period) => api.post('/payroll/calculate', { period }),
};

export default payrollService;
