import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { GroupsPage } from '../pages/GroupsPage';
import { GroupDetailPage } from '../pages/GroupDetailPage';
import { SessionDetailPage } from '../pages/SessionDetailPage';
import { ProgressPage } from '../pages/ProgressPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

import { GuestRoute } from './GuestRoute';

// ---------------------------------------------------------------------------
// Landing placeholder (kept inline — no dedicated page needed)
// ---------------------------------------------------------------------------

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to StudyCircle</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Collaborate, learn, and grow together with your study groups.
      </p>
      <a
        href="/login"
        className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        Get Started
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest routes (only accessible if not logged in) */}
        <Route element={<GuestRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes wrapped in AppLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />
            <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
