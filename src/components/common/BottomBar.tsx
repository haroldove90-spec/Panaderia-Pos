import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Package,
  Layers,
  Store,
  Receipt,
  ScanLine,
  History,
  DollarSign,
} from 'lucide-react';

export const BottomBar: React.FC = () => {
  const { role, activeModule, setActiveModule, pendingTickets } = useApp();

  const getTabs = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'metricas', label: 'Métricas', icon: BarChart3 },
          { id: 'inventario', label: 'Inventario', icon: Package },
          { id: 'insumos', label: 'Insumos', icon: Layers },
          { id: 'cortes', label: 'Cortes', icon: DollarSign },
        ];
      case 'vendedor':
        return [
          { id: 'pos', label: 'Mostrador', icon: Store },
          {
            id: 'tickets_vendedor',
            label: 'Tickets',
            icon: Receipt,
            badge: pendingTickets.length,
          },
        ];
      case 'cajera':
        return [
          {
            id: 'escaner',
            label: 'Cobro',
            icon: ScanLine,
            badge: pendingTickets.length,
          },
          { id: 'pagos_cajera', label: 'Historial', icon: History },
          { id: 'corte_caja', label: 'Corte', icon: DollarSign },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();
  if (tabs.length === 0) return null;

  return (
    <nav
      aria-label="Navegación inferior táctil"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 lg:hidden px-2 py-1 flex items-center justify-around shadow-lg"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeModule === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveModule(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[50px] transition-colors cursor-pointer rounded-lg ${
              isActive ? 'text-amber-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
              {tab.label}
            </span>
            {isActive && (
              <span className="w-6 h-0.5 bg-amber-600 rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
