import React from 'react';
import { UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { Shield, ShoppingBag, Receipt, UserCheck } from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface RoleOption {
  id: UserRole;
  name: string;
  icon: React.ElementType;
}

const ROLES: RoleOption[] = [
  {
    id: 'admin',
    name: 'Administrador',
    icon: Shield,
  },
  {
    id: 'vendedor',
    name: 'Vendedor',
    icon: ShoppingBag,
  },
  {
    id: 'cajera',
    name: 'Cajera',
    icon: Receipt,
  },
  {
    id: 'admin',
    name: 'Supervisor',
    icon: UserCheck,
  },
];

export const RoleSelector: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div className="min-h-screen bg-[#FCF1D5] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Top action bar: PWA Install Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <PWAInstallButton compact />
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* 
          Logo del sistema a tamaño completo sin encapsular (reducido para proporción elegante):
        */}
        <div className="w-full flex justify-center mb-3 sm:mb-4 lg:mb-5 px-2">
          <img
            src="https://appdesignproyectos.com/panaderialogo.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/panaderialogo.png';
            }}
            alt="Panadería Pos Logo"
            className="h-11 sm:h-14 md:h-16 lg:h-20 w-auto max-w-[85px] sm:max-w-[110px] md:max-w-[125px] lg:max-w-[145px] object-contain transition-transform duration-200"
          />
        </div>

        {/* 
          Acceso por Roles en Inicio (Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio):
          Selector limpio con tarjetas independientes para cada rol. Sin header, sin descripciones, solo nombre del rol.
          Colores: #C58847, #562914, #FCF1D5, #000000
        */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {ROLES.map((r, idx) => {
            const Icon = r.icon;
            return (
              <button
                key={`${r.name}-${idx}`}
                onClick={() => setRole(r.id)}
                className="group flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-[#562914]/25 bg-white/90 hover:bg-white text-[#562914] hover:border-[#C58847] hover:shadow-xl active:scale-[0.98] transition-all duration-200 cursor-pointer min-h-[160px] sm:min-h-[200px]"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FCF1D5] flex items-center justify-center mb-4 sm:mb-5 border border-[#C58847]/40 group-hover:bg-[#C58847] transition-colors duration-200">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#562914] group-hover:text-white transition-colors duration-200" />
                </div>
                <span className="text-base sm:text-xl font-bold tracking-tight font-display text-center text-[#562914] group-hover:text-[#000000]">
                  {r.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
