import React from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Wheat, LogOut, Menu, Shield, ShoppingBag, Receipt } from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, setSidebarOpen } = useApp();

  const getRoleInfo = () => {
    switch (role) {
      case 'admin':
        return { label: 'Administrador', icon: Shield, color: 'text-stone-800 bg-stone-100 border-stone-300' };
      case 'vendedor':
        return { label: 'Vendedor', icon: ShoppingBag, color: 'text-amber-800 bg-amber-100 border-amber-300' };
      case 'cajera':
        return { label: 'Cajera', icon: Receipt, color: 'text-emerald-800 bg-emerald-100 border-emerald-300' };
      default:
        return { label: 'Invitado', icon: Wheat, color: 'text-stone-700 bg-stone-100 border-stone-200' };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
      {/* Left: Brand Logo & Desktop Menu Trigger */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 -ml-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg lg:hidden"
          title="Abrir menú"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-600 flex items-center justify-center text-amber-50 shadow-xs">
            <Wheat className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-stone-900 whitespace-nowrap">
            Panadería Pos
          </span>
        </div>
      </div>

      {/* Center/Right: Active Role badge, PWA install button, and Logout button */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Active Role Identification */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-semibold ${roleInfo.color}`}>
          <RoleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="hidden xs:inline">{roleInfo.label}</span>
        </div>

        {/* Quick PWA Installation Button */}
        <PWAInstallButton compact />

        {/* Log Out Button */}
        <button
          onClick={() => setRole(null)}
          title="Cerrar sesión y cambiar de rol"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};
