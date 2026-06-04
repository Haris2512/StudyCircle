import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AppLayout } from './AppLayout';
import { GuestLayout } from './GuestLayout';

export const SharedLayout: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <AppLayout />;
  }

  return <GuestLayout />;
};
