import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Search,
  Settings,
  HelpCircle,
  X,
  Plus,
} from 'lucide-react';
import { Button } from '../common/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Beranda', icon: LayoutDashboard, end: true },
  { to: '/progress', label: 'Grup Saya', icon: Users, end: false }, // mapping Progress to Grup Saya for now, wait we should map to actual paths
  { to: '/groups', label: 'Cari Grup', icon: Search, end: false },
  { to: '/profile', label: 'Pengaturan', icon: Settings, end: false },
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
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#14141A] border-r border-dark-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-[72px] px-6 shrink-0">
          <div className="p-6 mb-2">
            <div className="flex items-center gap-3 mb-2">
              <img src="/icon.svg" alt="StudyCircle Logo" className="w-6 h-6" />
              <h1 className="text-2xl font-bold text-white tracking-tight">StudyCircle</h1>
            </div>
            <p className="text-sm text-gray-400">Platform Kolaborasi</p>
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

        {/* Primary Action */}
        <div className="px-5 mb-4 mt-2 shrink-0">
          <Button variant="primary" className="w-full justify-center">
            <Plus className="w-4 h-4" />
            Buat Grup Baru
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 border-l-2 ${
                  isActive
                    ? 'bg-white/5 text-primary-500 border-primary-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Help */}
        <div className="px-0 py-4 shrink-0">
          <NavLink
            to="/help"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 border-l-2 ${
                isActive
                  ? 'bg-white/5 text-primary-500 border-primary-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`
            }
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            Bantuan
          </NavLink>
        </div>
      </aside>
    </>
  );
};
