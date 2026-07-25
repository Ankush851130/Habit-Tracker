import api from './api';

export const analyticsService = {
  getSummary: async () => {
    const response = await api.get('/analytics/summary');
    return response.data;
  },
};
