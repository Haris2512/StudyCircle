// Komponen ini merupakan bagian dari antarmuka pengguna
import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineAlert() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <WifiOff className="w-5 h-5" />
        <span className="text-sm font-medium">Anda sedang offline. Beberapa fitur mungkin tidak tersedia.</span>
      </div>
    </div>
  );
}
