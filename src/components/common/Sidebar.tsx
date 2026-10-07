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
  LogOut,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    role,
    setRole,
    activeModule,
    setActiveModule,
    sidebarOpen,
    setSidebarOpen,
    resetToDemoData,
    pendingTickets,
  } = useApp();

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'metricas', label: 'Métricas y Ventas', icon: BarChart3 },
          { id: 'inventario', label: 'Inventario de Panadería', icon: Package },
          { id: 'insumos', label: 'Control de Insumos', icon: Layers },
          { id: 'cortes', label: 'Arqueos y Cortes', icon: DollarSign },
        ];
      case 'vendedor':
        return [
          { id: 'pos', label: 'Punto de Venta Mostrador', icon: Store },
          {
            id: 'tickets_vendedor',
            label: 'Tickets en Espera',
            icon: Receipt,
            badge: pendingTickets.length,
          },
        ];
      case 'cajera':
        return [
          {
            id: 'escaner',
            label: 'Escaneo y Cobro',
            icon: ScanLine,
            badge: pendingTickets.length,
          },
          { id: 'pagos_cajera', label: 'Tickets Cobrados', icon: History },
          { id: 'corte_caja', label: 'Corte de Caja', icon: DollarSign },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-[calc(100vh-4rem)]`}
      >
        {/* Top section: Mobile close & Module links */}
        <div>
          {/* Mobile Header inside drawer */}
          <div className="flex items-center justify-between p-4 border-b border-stone-200 lg:hidden">
            <span className="font-display font-bold text-stone-900 text-sm">Menú de Módulos</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg"
              title="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Links */}
          <div className="p-3">
            <div className="text-[11px] font-semibold text-stone-600 px-3 py-2 uppercase tracking-wider">
              Módulos del Rol
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white text-amber-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Reset data, Switch role, Session Logout */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/50 space-y-1.5">
          <button
            onClick={resetToDemoData}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Restaurar datos iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Datos Demo</span>
          </button>

          <button
            onClick={() => setRole(null)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span>Cambiar de Rol</span>
            </div>
          </button>

          <div className="px-3 pt-2 pb-1 text-[11px] text-stone-500 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Estilo La Esperanza CDMX</span>
          </div>
        </div>
      </aside>
    </>
  );
};
