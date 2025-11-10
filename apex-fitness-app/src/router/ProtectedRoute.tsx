import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * Protected Route component
 * - If requireAuth is true: redirects to /login if user is not authenticated
 * - If requireAuth is false: redirects to / if user is authenticated (for login/register pages)
 */
export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users away from auth pages
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
