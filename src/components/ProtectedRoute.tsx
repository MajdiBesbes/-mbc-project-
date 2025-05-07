import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading?: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  isLoading = false,
  redirectPath = '/login'
}) => {
  const location = useLocation();

  if (isLoading) {
    return <Loader size="large" className="loader-fullscreen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default React.memo(ProtectedRoute); 