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
    <header className="sticky top-0 z-40 bg-[#FCF1D5]/95 backdrop-blur-md border-b border-[#562914]/15 px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
      {/* Left: Brand Logo & Desktop Menu Trigger */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-1.5 -ml-1 text-[#562914] hover:bg-[#562914]/10 rounded-xl lg:hidden cursor-pointer"
          title="Abrir menú"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Unencapsulated logo scaled elegantly */}
        <div className="flex items-center">
          <img
            src="https://appdesignproyectos.com/panaderialogo.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/panaderialogo.png';
            }}
            alt="Panadería Pos Logo"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain max-w-[80px] sm:max-w-[95px] md:max-w-[115px]"
          />
        </div>
      </div>

      {/* Center/Right: Active Role badge, PWA install button, and Logout button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Role Identification */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-[#562914]/20 bg-white/80 text-[#562914] text-xs sm:text-sm font-bold shadow-xs">
          <RoleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C58847] shrink-0" />
          <span className="hidden xs:inline">{roleInfo.label}</span>
        </div>

        {/* Quick PWA Installation Button */}
        <PWAInstallButton compact />

        {/* Log Out Button */}
        <button
          onClick={() => setRole(null)}
          title="Cerrar sesión y volver al selector de roles"
          className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-[#562914]/20 bg-white/70 text-[#562914] hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};
