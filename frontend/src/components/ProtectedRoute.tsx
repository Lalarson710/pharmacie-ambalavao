import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/store/authStore';

interface ProtectedRouteProps {
  permission?: string;
}

export function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && user?.permissions) {
    const hasPermission = user.permissions.some((p) => p.code === permission);
    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
