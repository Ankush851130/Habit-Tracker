import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <HabitProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  fontSize: '13px',
                },
              }}
            />
            <AppRoutes />
          </HabitProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
