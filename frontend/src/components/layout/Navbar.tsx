// Komponen ini merupakan bagian dari antarmuka pengguna
import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, Bell, Check, Trash2, Calendar, BookOpen, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from '../../hooks/useNotificationsQuery';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notificationsData } = useNotificationsQuery();
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header role="banner" className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 bg-[#0B0F19]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Hamburger – visible below lg */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Bell Icon & Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Notifikasi"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F1424]/95 border border-white/5 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl animate-in fade-in-50 slide-in-from-top-2 duration-200">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">Notifikasi</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsReadMutation.mutate()}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 bg-transparent border-none cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Tandai semua dibaca
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[350px] overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-xs">
                      Tidak ada notifikasi baru
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.read) markAsReadMutation.mutate(notif.id);
                          if (notif.link) {
                            navigate(notif.link);
                            setDropdownOpen(false);
                          }
                        }}
                        className={`px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors flex gap-3 items-start ${
                          !notif.read ? 'bg-primary-500/5' : ''
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 text-gray-400 shrink-0">
                          {notif.type === 'SESSION_CREATED' ? (
                            <Calendar className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-sky-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-semibold truncate ${notif.read ? 'text-gray-400' : 'text-white'}`}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-gray-500 shrink-0">
                              {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotificationMutation.mutate(notif.id);
                          }}
                          className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors shrink-0 bg-transparent border-none cursor-pointer"
                          aria-label="Hapus notifikasi"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="flex items-center gap-2 hidden sm:flex">
            <span className="text-sm text-gray-200">
              {user.fullName}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold border border-primary-500/30">
              Lv. {user.level || 1}
            </span>
          </div>
        )}
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
            aria-label="Admin Panel"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-lg transition-all duration-200"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
