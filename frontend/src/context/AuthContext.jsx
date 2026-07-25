import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}! 🚀`);
    return data;
  };

  const googleLogin = async (googleData) => {
    const data = await authService.googleLogin(googleData);
    setUser(data.user);
    toast.success(`Signed in with Google! Welcome ${data.user.name} 🚀`);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    toast.success(`Account created! Welcome to Habit Tracker, ${data.user.name}! 🎉`);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        googleLogin,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
