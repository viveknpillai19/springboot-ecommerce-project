// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    // If no user is logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.roles?.includes('ROLE_ADMIN')) {
    // If the route is admin-only and the user is not an admin, redirect to home
    return <Navigate to="/" />;
  }

  // If all checks pass, render the child component
  return <Outlet />;
}

export default ProtectedRoute;