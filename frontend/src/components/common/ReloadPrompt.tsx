// Komponen ini merupakan bagian dari antarmuka pengguna
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './Button';

export const ReloadPrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error: Error | any) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-dark-card border border-white/10 shadow-2xl rounded-xl p-4 max-w-sm w-full" role="alert">
        <div className="mb-3">
          {offlineReady ? (
            <span className="text-sm text-gray-200">
              Aplikasi siap digunakan secara offline.
            </span>
          ) : (
            <span className="text-sm text-gray-200">
              Versi baru tersedia! Klik tombol muat ulang untuk memperbarui.
            </span>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          {needRefresh && (
            <Button size="sm" onClick={() => updateServiceWorker(true)}>
              Muat Ulang
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => close()}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};
