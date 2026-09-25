// ============================================
// services/api.js — Axios-like Fetch wrapper + JWT
// ============================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Lấy JWT token từ localStorage
 */
const getToken = () => localStorage.getItem('nexus_token');

/**
 * Core fetch wrapper với JWT auto-attach
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  // Nếu có body, stringify
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // Token hết hạn → logout
    if (response.status === 401) {
      const data = await response.json().catch(() => ({}));
      if (data.message?.includes('hết hạn') || data.message?.includes('không hợp lệ')) {
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_user');
        window.location.href = '/login';
        return;
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, ...data };
    }

    return data;
  } catch (error) {
    if (error.status) throw error; // API error — re-throw
    console.error(`❌ API Error [${endpoint}]:`, error);
    throw { success: false, message: 'Không thể kết nối server' };
  }
}

// Convenience methods
const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
