import React, { useState } from 'react';
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
  Trash2,
  AlertTriangle,
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
    clearAllData,
    isDemoCleared,
    pendingTickets,
  } = useApp();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

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

  const handleConfirmClear = async () => {
    await clearAllData();
    setShowClearConfirm(false);
  };

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FCF1D5]/90 backdrop-blur-md border-r border-[#562914]/15 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-[calc(100vh-5rem)]`}
      >
        {/* Top section: Mobile close & Module links */}
        <div>
          {/* Mobile Header inside drawer */}
          <div className="flex items-center justify-between p-4 border-b border-[#562914]/15 lg:hidden bg-white/50">
            <div className="flex items-center gap-2">
              <img
                src="https://appdesignproyectos.com/panaderiaicono.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/panaderiaicono.png';
                }}
                alt="Icono Panadería"
                className="w-6 h-6 object-contain"
              />
              <span className="font-display font-bold text-[#562914] text-sm">Menú Panadería Pos</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-[#562914] hover:bg-[#562914]/10 rounded-lg"
              title="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Links */}
          <div className="p-3">
            <div className="text-[11px] font-bold text-[#562914]/70 px-3 py-2 uppercase tracking-wider">
              Módulos del Sistema
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#562914] text-white shadow-sm'
                        : 'text-[#562914] hover:bg-[#C58847]/15 hover:text-[#000000]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#FCF1D5]' : 'text-[#C58847]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-black ${
                          isActive
                            ? 'bg-[#C58847] text-white'
                            : 'bg-[#C58847]/20 text-[#562914]'
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

        {/* Bottom Section: Clear demo data, Reset data, Switch role */}
        <div className="p-3 border-t border-[#562914]/15 bg-white/40 space-y-2">
          {/* 
            Botón para borrar datos de muestra del todo el sistema:
            "Activa botón para poder borrar datos de muestra del todo el sistema, activa la función para que el navegador no muestre los datos de muestra nuevamente y se puedan borrar los registros en supabase cuando se configure."
          */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100/90 border border-red-200 transition-colors cursor-pointer"
            title="Borrar todos los datos de muestra permanentemente"
          >
            <Trash2 className="w-4 h-4 shrink-0 text-red-600" />
            <span className="truncate">Borrar Datos de Muestra</span>
          </button>

          {isDemoCleared && (
            <button
              onClick={resetToDemoData}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#562914] hover:bg-[#562914]/10 transition-colors cursor-pointer"
              title="Restaurar datos de muestra para pruebas"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C58847]" />
              <span className="truncate">Cargar Datos Demo</span>
            </button>
          )}

          <button
            onClick={() => setRole(null)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#562914] hover:bg-[#562914]/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-[#C58847]" />
              <span>Cambiar de Rol</span>
            </div>
          </button>

          <div className="px-3 pt-2 text-[11px] text-[#562914]/80 flex items-center gap-2">
            <img
              src="https://appdesignproyectos.com/panaderiaicono.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/panaderiaicono.png';
              }}
              alt="Icono Panadería"
              className="w-4 h-4 object-contain"
            />
            <span className="font-semibold">Panadería Pos v1.2</span>
          </div>
        </div>
      </aside>

      {/* Confirmation Modal to Clear Demo Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#562914]/20 text-[#000000] animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-center text-[#562914]">
              ¿Borrar Datos de Muestra?
            </h3>
            <p className="text-xs text-stone-600 text-center mt-2">
              Esta acción eliminará todos los panes, insumos, tickets y cortes de muestra. El navegador <strong>no volverá a cargar los datos de muestra</strong> al recargar la página.
            </p>
            <p className="text-[11px] text-[#C58847] bg-[#FCF1D5] p-2.5 rounded-xl border border-[#C58847]/30 mt-3 text-center font-medium">
              Cuando conectes Supabase, también limpiará los registros en la base de datos remota.
            </p>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Sí, Borrar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
