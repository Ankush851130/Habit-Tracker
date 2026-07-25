import api from './api';

export const extraService = {
  getExtraData: async () => {
    const response = await api.get('/extra');
    return response.data;
  },

  logPomodoro: async (data) => {
    const response = await api.post('/extra/pomodoro', data);
    return response.data;
  },

  logMood: async (data) => {
    const response = await api.post('/extra/mood', data);
    return response.data;
  },

  logWater: async (data) => {
    const response = await api.post('/extra/water', data);
    return response.data;
  },

  addJournalEntry: async (data) => {
    const response = await api.post('/extra/journal', data);
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get('/extra/leaderboard');
    return response.data;
  },
};
