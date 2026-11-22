import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from './ui/Loader.jsx';

// <ProtectedRoute />                 -> any signed-in user
// <ProtectedRoute roles={['admin']}/> -> only the listed roles
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullscreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
