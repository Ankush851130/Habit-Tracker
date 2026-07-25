import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  googleLogin: async (googleData) => {
    const response = await api.post('/auth/google', googleData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.get('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (resetToken, password) => {
    const response = await api.put(`/auth/reset-password/${resetToken}`, { password });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  uploadAvatar: async (formData) => {
    const response = await api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  changePassword: async (passwords) => {
    const response = await api.put('/user/change-password', passwords);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/user/account');
    localStorage.removeItem('token');
    return response.data;
  },
};
