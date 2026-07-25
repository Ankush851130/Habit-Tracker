import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SkeletonLoader } from '../components/Common/SkeletonLoader';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <SkeletonLoader count={4} height="h-28" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
