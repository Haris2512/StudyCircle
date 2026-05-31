import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from './ProtectedRoute';

// Placeholder pages for early routing
const DashboardPlaceholder = () => (
  <div className="min-h-screen bg-[#0B0F19] text-white p-8">
    <h1 className="text-2xl">Dashboard</h1>
  </div>
);

const LandingPlaceholder = () => (
  <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">Welcome to StudyCircle</h1>
    <a href="/login" className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700">Login</a>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPlaceholder />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          {/* We will add more protected routes here */}
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
