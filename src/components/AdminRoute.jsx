import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
