// Komponen ini merupakan bagian dari antarmuka pengguna
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { socketService } from '../../utils/socket';
import { useAuth } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; visible: boolean } | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleMenuToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  useEffect(() => {
    if (user) {
      socketService.connect();
      socketService.joinUser(user.id);
    }
    
    socketService.onNotification((data: any) => {
      setNotification({ message: data.message, visible: true });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setTimeout(() => {
        setNotification((prev) => prev ? { ...prev, visible: false } : null);
      }, 5000);
    });

    return () => {
      socketService.offNotification();
    };
  }, [user, queryClient]);

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <Navbar onMenuToggle={handleMenuToggle} />

      {/* Main content area – offset for fixed sidebar (lg+) and navbar */}
      <main id="main-content" role="main" className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Simple Toast Notification */}
      {notification?.visible && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary-600 text-white px-4 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-5 fade-in">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-primary-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
