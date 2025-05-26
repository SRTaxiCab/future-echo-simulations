
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to the new auth page
  return <Navigate to="/auth" replace />;
};

export default Login;
