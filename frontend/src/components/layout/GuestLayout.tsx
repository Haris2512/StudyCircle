import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '../common/Button';

export const GuestLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-primary-500/30">
      {/* Minimal Navbar for Guests */}
      <header className="sticky top-0 z-30 h-16 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 shadow-sm">
        <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-primary-500/20">
            <BookOpen className="w-5 h-5 text-dark-bg" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-colors">
            StudyCircle
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Masuk
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">
              Daftar
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};
