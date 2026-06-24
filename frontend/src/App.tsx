/**
 * Komponen root utama untuk aplikasi React.
 */
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router/AppRouter';
import { ReloadPrompt } from './components/common/ReloadPrompt';
import { GooeyToaster } from 'goey-toast';
import '@aejkatappaja/phantom-ui';
import 'goey-toast/styles.css';

function App() {
  const [position, setPosition] = useState<'bottom-right' | 'top-center'>(
    window.innerWidth >= 768 ? 'bottom-right' : 'top-center'
  );

  useEffect(() => {
    const handleResize = () => {
      setPosition(window.innerWidth >= 768 ? 'bottom-right' : 'top-center');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AuthProvider>
      <AppRouter />
      <ReloadPrompt />
      <GooeyToaster 
        position={position}
        theme="dark"
        toastOptions={{
          fillColor: '#161621',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      />
    </AuthProvider>
  );
}

export default App;
