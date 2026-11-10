import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { RegisterPage } from '@/modules/auth/pages/RegisterPage';
import { DashboardPage } from '@/modules/users/pages/DashboardPage';
import { UserProfilePage } from '@/modules/users/pages/UserProfilePage';
import { MyProfilePage } from '@/modules/users/pages/MyProfilePage';
import { SkillsExplorerPage } from '@/modules/skills/pages/SkillsExplorerPage';
import { SwapsHubPage } from '@/modules/swaps/pages/SwapsHubPage';
import { FavoritesPage } from '@/modules/favorites/pages/FavoritesPage';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '@/modules/auth/services/authStore';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Pages with Navbar Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<SkillsExplorerPage />} />
        <Route path="/explore" element={<SkillsExplorerPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/swaps"
          element={
            <ProtectedRoute>
              <SwapsHubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Public Pages (Two-column layout) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
