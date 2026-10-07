import React from 'react';
import { UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { Shield, ShoppingBag, Receipt, Wheat } from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface RoleOption {
  id: UserRole;
  name: string;
  icon: React.ElementType;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'admin',
    name: 'Administrador',
    icon: Shield,
    accentBg: 'bg-stone-50 hover:bg-stone-100/90 active:bg-stone-200/90',
    accentBorder: 'border-stone-300 hover:border-stone-500',
    accentText: 'text-stone-900',
  },
  {
    id: 'vendedor',
    name: 'Vendedor',
    icon: ShoppingBag,
    accentBg: 'bg-amber-50 hover:bg-amber-100/90 active:bg-amber-200/90',
    accentBorder: 'border-amber-300 hover:border-amber-500',
    accentText: 'text-amber-950',
  },
  {
    id: 'cajera',
    name: 'Cajera',
    icon: Receipt,
    accentBg: 'bg-emerald-50 hover:bg-emerald-100/90 active:bg-emerald-200/90',
    accentBorder: 'border-emerald-300 hover:border-emerald-500',
    accentText: 'text-emerald-950',
  },
];

export const RoleSelector: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Top subtle bar for PWA quick install if user arrives on role select */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <PWAInstallButton compact />
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle Brand Logo Watermark (No header text, no descriptions) */}
        <div className="mb-8 sm:mb-12 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-600 flex items-center justify-center text-amber-50 shadow-md ring-4 ring-amber-100">
            <Wheat className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>
        </div>

        {/* 
          Grid layout matching requirement:
          Acceso por Roles en Inicio (Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio):
          Selector limpio con tarjetas independientes para cada rol. Sin header, sin descripciones, solo nombre del rol.
        */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center max-w-3xl">
          {ROLES.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center justify-center p-6 sm:p-10 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] ${r.accentBg} ${r.accentBorder} min-h-[160px] sm:min-h-[210px]`}
              >
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white shadow-xs flex items-center justify-center mb-4 sm:mb-5 border border-stone-200/60">
                  <Icon className={`w-7 h-7 sm:w-9 sm:h-9 ${r.accentText}`} />
                </div>
                <span className={`text-base sm:text-xl font-bold tracking-tight font-display text-center ${r.accentText}`}>
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
