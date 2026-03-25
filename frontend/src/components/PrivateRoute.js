import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { token, role, isAdmin, loading } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (Array.isArray(roles) && roles.length > 0) {
    const effectiveRole = role || (isAdmin ? 'ADMIN' : 'USER');
    if (!effectiveRole || !roles.includes(effectiveRole)) {
      return <Navigate to={effectiveRole === 'ADMIN' ? '/admin' : '/dashboard'} />;
    }
  }

  return children;
};

export default PrivateRoute;
