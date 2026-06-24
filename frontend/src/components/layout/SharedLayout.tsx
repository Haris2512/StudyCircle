// Komponen ini merupakan bagian dari antarmuka pengguna
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AppLayout } from './AppLayout';
import { GuestLayout } from './GuestLayout';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { OfflineAlert } from '../common/OfflineAlert';

export function SharedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <AppLayout>
          <Outlet />
        </AppLayout>
      ) : (
        <GuestLayout>
          <Outlet />
        </GuestLayout>
      )}
      <OfflineAlert />
    </>
  );
};
