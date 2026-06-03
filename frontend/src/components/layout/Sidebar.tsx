import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import { CreateGroupModal } from '../features/groups/CreateGroupModal';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        aria-label="Sidebar navigasi"
        className={`fixed top-0 left-0 z-50 h-full w-64 lg:h-[calc(100vh-2rem)] lg:top-4 lg:left-4 lg:rounded-3xl glass-panel border-r-0 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-[72px] px-6 shrink-0 pt-6">
          <div className="p-4 mb-2">
            <div className="flex items-center gap-3 mb-1 mt-2">
              <img src="/icon.svg" alt="StudyCircle Logo" className="w-8 h-8 animate-float" />
              <h1 className="text-xl font-bold text-gradient-animated tracking-tight">StudyCircle</h1>
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
          <Button variant="primary" className="w-full justify-center" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Buat Grup Baru
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-1" aria-label="Navigasi utama">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-300 mx-3 rounded-xl ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-400 shadow-[0_0_15px_rgba(203,166,247,0.15)] scale-[1.02]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
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
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-300 mx-3 rounded-xl ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 shadow-[0_0_15px_rgba(203,166,247,0.15)] scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            Bantuan
          </NavLink>
        </div>
      </aside>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setShowCreateModal(false);
          navigate('/groups');
        }}
      />
    </>
  );
};
