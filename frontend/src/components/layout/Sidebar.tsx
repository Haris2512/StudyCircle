import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  TrendingUp,
  UserCircle,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/groups', label: 'Groups', icon: Users, end: false },
  { to: '/progress', label: 'Progress', icon: TrendingUp, end: false },
  { to: '/profile', label: 'Profile', icon: UserCircle, end: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-60 bg-[#0B0F19]/60 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5 group">
            <GraduationCap className="h-7 w-7 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span className="text-lg font-bold text-white tracking-tight">
              StudyCircle
            </span>
          </div>
          {/* Close button – mobile only */}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border border-indigo-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer hint */}
        <div className="px-5 py-4 border-t border-white/5 shrink-0">
          <p className="text-xs text-gray-500 font-medium">© 2026 StudyCircle</p>
        </div>
      </aside>
    </>
  );
};
