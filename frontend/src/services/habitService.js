import api from './api';

export const habitService = {
  getHabits: async (params = {}) => {
    const response = await api.get('/habits', { params });
    return response.data;
  },

  getHabitById: async (id) => {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  createHabit: async (habitData) => {
    const response = await api.post('/habits', habitData);
    return response.data;
  },

  updateHabit: async (id, habitData) => {
    const response = await api.put(`/habits/${id}`, habitData);
    return response.data;
  },

  deleteHabit: async (id) => {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },

  toggleArchiveHabit: async (id) => {
    const response = await api.patch(`/habits/${id}/archive`);
    return response.data;
  },

  toggleHabitStatus: async (id, date, status = 'completed') => {
    const response = await api.post(`/habits/${id}/toggle-status`, { date, status });
    return response.data;
  },
};
