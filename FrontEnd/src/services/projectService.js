// ============================================
// services/projectService.js
// ============================================
import api from './api';

const projectService = {
  getAll: () => api.get('/projects'),
  getTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  updateTaskStage: (taskId, stage, note) =>
    api.patch(`/projects/tasks/${taskId}/stage`, { stage, note }),
  createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  createProject: (data) => api.post('/projects', data),
  getSquads: () => api.get('/projects/squads'),
};

export default projectService;
