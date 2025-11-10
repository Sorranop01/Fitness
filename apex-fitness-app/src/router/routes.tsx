import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { HomePage } from '@/pages/HomePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ChangePasswordPage } from '@/pages/ChangePasswordPage';
import { ClassesPage } from '@/pages/ClassesPage';
import { ClassDetailPage } from '@/pages/ClassDetailPage';
import { MyBookingsPage } from '@/pages/MyBookingsPage';
import { CheckInPage } from '@/pages/CheckInPage';
import { SaunaPage } from '@/pages/SaunaPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes (redirect to / if already logged in) */}
      <Route
        path="/login"
        element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute requireAuth={false}>
            <RegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Protected routes (require authentication) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChangePasswordPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ClassesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ClassDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyBookingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/check-in"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CheckInPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sauna"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SaunaPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
