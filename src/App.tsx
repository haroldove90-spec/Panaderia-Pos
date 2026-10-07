import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelector } from './components/roles/RoleSelector';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomBar } from './components/common/BottomBar';
import { POSModule } from './components/pos/POSModule';
import { CajeroModule } from './components/cajero/CajeroModule';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WifiOff, CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role, notification } = useApp();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Clean Role Selector on Entry (No header, independent cards)
  if (!role) {
    return <RoleSelector />;
  }

  // 2. Main Authenticated Dashboard Layout
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FCF1D5] text-[#000000] flex flex-col">
      {/* Cabecera Institucional Unificada */}
      <Header />

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-4 lg:p-5 flex flex-col">
          <div className="w-full max-w-7xl mx-auto h-full flex-1 min-h-0 flex flex-col">
            {role === 'admin' && <AdminDashboard />}
            {role === 'vendedor' && <POSModule />}
            {role === 'cajera' && <CajeroModule />}
          </div>
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomBar />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 z-50 flex items-center gap-2 rounded-xl bg-[#562914] text-white px-4 py-2.5 text-xs font-bold shadow-2xl border border-[#C58847]/40 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C58847] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#562914] text-[#FCF1D5] px-3.5 py-1 text-xs font-bold shadow-lg border border-[#C58847]/40">
          <WifiOff className="w-3.5 h-3.5 text-[#C58847]" />
          <span>Modo Sin Conexión — Datos guardados localmente</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
