import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <Navbar onMenuToggle={handleMenuToggle} />

      {/* Main content area – offset for fixed sidebar (lg+) and navbar */}
      <main className="pt-16 lg:pl-60 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
