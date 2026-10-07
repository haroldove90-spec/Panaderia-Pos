import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  BakeryProduct,
  Insumo,
  OrderTicket,
  TicketItem,
  PaymentMethod,
  CashRegisterCut,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_INSUMOS,
  INITIAL_PENDING_TICKETS,
  INITIAL_PAID_TICKETS,
} from '../data/initialData';

interface AppContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  activeModule: string;
  setActiveModule: (mod: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  
  // Products
  products: BakeryProduct[];
  addProduct: (product: Omit<BakeryProduct, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<BakeryProduct>) => void;
  deleteProduct: (id: string) => void;
  
  // Insumos
  insumos: Insumo[];
  addInsumo: (insumo: Omit<Insumo, 'id'>) => void;
  updateInsumoStock: (id: string, changeQty: number, isEntry: boolean) => void;
  
  // Tickets & Sales
  pendingTickets: OrderTicket[];
  paidTickets: OrderTicket[];
  createTicket: (items: TicketItem[], counterId?: string, vendedorName?: string) => OrderTicket;
  checkoutDirectSale: (
    items: TicketItem[],
    paymentMethod: PaymentMethod,
    amountReceived: number,
    sellerName?: string
  ) => OrderTicket;
  payTicket: (
    ticketIdOrFolio: string,
    paymentMethod: PaymentMethod,
    amountReceived: number,
    cajeraName?: string
  ) => { success: boolean; ticket?: OrderTicket; error?: string };
  cancelTicket: (ticketId: string) => void;

  // Cash cuts
  cashCuts: CashRegisterCut[];
  createCashCut: (cajeraName: string, actualInDrawer: number, notes?: string) => CashRegisterCut;

  // Helpers
  resetToDemoData: () => void;
  clearAllData: () => Promise<void>;
  isDemoCleared: boolean;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'panaderia_role_v1',
  PRODUCTS: 'panaderia_products_v1',
  INSUMOS: 'panaderia_insumos_v1',
  PENDING_TICKETS: 'panaderia_pending_tickets_v1',
  PAID_TICKETS: 'panaderia_paid_tickets_v1',
  CASH_CUTS: 'panaderia_cash_cuts_v1',
  DEMO_CLEARED: 'panaderia_demo_cleared_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDemoCleared = localStorage.getItem(STORAGE_KEYS.DEMO_CLEARED) === 'true';

  const [role, setRoleState] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved ? (saved as UserRole) : null;
  });

  const [activeModule, setActiveModuleState] = useState<string>('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [products, setProducts] = useState<BakeryProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [insumos, setInsumos] = useState<Insumo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSUMOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_INSUMOS;
  });

  const [pendingTickets, setPendingTickets] = useState<OrderTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PENDING_TICKETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PENDING_TICKETS;
  });

  const [paidTickets, setPaidTickets] = useState<OrderTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAID_TICKETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PAID_TICKETS;
  });

  useEffect(() => {
    // If products ever became empty due to previous clear, auto-reactivate them
    if (products.length === 0) {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  const [cashCuts, setCashCuts] = useState<CashRegisterCut[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASH_CUTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage
  useEffect(() => {
    if (role) {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ROLE);
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSUMOS, JSON.stringify(insumos));
  }, [insumos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENDING_TICKETS, JSON.stringify(pendingTickets));
  }, [pendingTickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAID_TICKETS, JSON.stringify(paidTickets));
  }, [paidTickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASH_CUTS, JSON.stringify(cashCuts));
  }, [cashCuts]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const setRole = (newRole: UserRole | null) => {
    setRoleState(newRole);
    if (newRole === 'admin') setActiveModuleState('metricas');
    else if (newRole === 'vendedor') setActiveModuleState('pos');
    else if (newRole === 'cajera') setActiveModuleState('escaner');
  };

  const setActiveModule = (mod: string) => {
    setActiveModuleState(mod);
    setSidebarOpen(false);
  };

  // Product management
  const addProduct = (prodData: Omit<BakeryProduct, 'id'>) => {
    const newProd: BakeryProduct = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    showNotification(`Producto "${newProd.name}" agregado con éxito`);
  };

  const updateProduct = (id: string, updates: Partial<BakeryProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showNotification('Producto actualizado');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification('Producto eliminado');
  };

  // Insumo management
  const addInsumo = (insumoData: Omit<Insumo, 'id'>) => {
    const newInsumo: Insumo = {
      ...insumoData,
      id: `ins-${Date.now()}`,
    };
    setInsumos((prev) => [newInsumo, ...prev]);
    showNotification(`Insumo "${newInsumo.name}" registrado`);
  };

  const updateInsumoStock = (id: string, changeQty: number, isEntry: boolean) => {
    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === id) {
          const updatedStock = isEntry
            ? ins.currentStock + changeQty
            : Math.max(0, ins.currentStock - changeQty);
          return {
            ...ins,
            currentStock: updatedStock,
            lastRestock: isEntry ? new Date().toISOString().split('T')[0] : ins.lastRestock,
          };
        }
        return ins;
      })
    );
    showNotification(
      isEntry
        ? `Entrada de ${changeQty} unidades registrada`
        : `Salida de ${changeQty} unidades registrada al amasijo`
    );
  };

  // Ticket creation (Vendedor POS)
  const createTicket = (
    items: TicketItem[],
    counterId: string = 'Mostrador 1',
    vendedorName: string = 'Mateo R. (Mostrador 1)'
  ): OrderTicket => {
    // Generate consecutive folio
    const allFolios = [...pendingTickets, ...paidTickets]
      .map((t) => {
        const num = parseInt(t.folio.replace('TK-', ''), 10);
        return isNaN(num) ? 4800 : num;
      });
    const maxFolio = allFolios.length > 0 ? Math.max(...allFolios) : 4825;
    const nextFolioNum = maxFolio + 1;
    const folio = `TK-${nextFolioNum}`;

    const totalPieces = items.reduce((acc, item) => acc + item.quantity, 0);
    const total = items.reduce((acc, item) => acc + item.subtotal, 0);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newTicket: OrderTicket = {
      id: `tk-${Date.now()}`,
      folio,
      timestamp: timeStr,
      vendedorId: 'vend-1',
      vendedorName,
      counterId,
      items,
      totalPieces,
      total,
      status: 'pendiente',
    };

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const matchedItem = items.find((i) => i.productId === prod.id);
        if (matchedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - matchedItem.quantity),
          };
        }
        return prod;
      })
    );

    setPendingTickets((prev) => [newTicket, ...prev]);
    showNotification(`Ticket de Despacho ${folio} emitido con éxito`);
    return newTicket;
  };

  // Direct checkout / payment from POS
  const checkoutDirectSale = (
    items: TicketItem[],
    paymentMethod: PaymentMethod,
    amountReceived: number,
    sellerName: string = 'Vendedor Mostrador'
  ): OrderTicket => {
    const totalPieces = items.reduce((acc, i) => acc + i.quantity, 0);
    const total = items.reduce((acc, i) => acc + i.subtotal, 0);
    const changeGiven = Math.max(0, amountReceived - total);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const folio = `TK-${randomSuffix}`;

    const paidTicket: OrderTicket = {
      id: `tk-${Date.now()}`,
      folio,
      timestamp: timeStr,
      paidAt: timeStr,
      vendedorId: 'vend-1',
      vendedorName: sellerName,
      counterId: 'Mostrador POS',
      items,
      totalPieces,
      total,
      status: 'cobrado',
      cajeraId: 'pos-direct',
      cajeraName: sellerName,
      paymentMethod,
      amountReceived,
      changeGiven,
    };

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const matchedItem = items.find((i) => i.productId === prod.id);
        if (matchedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - matchedItem.quantity),
          };
        }
        return prod;
      })
    );

    setPaidTickets((prev) => [paidTicket, ...prev]);
    showNotification(`¡Venta completada! Cobro de $${total.toFixed(2)} registrado con éxito.`);
    return paidTicket;
  };

  // Ticket payment (Cajera)
  const payTicket = (
    ticketIdOrFolio: string,
    paymentMethod: PaymentMethod,
    amountReceived: number,
    cajeraName: string = 'Carmen V. (Caja 1)'
  ): { success: boolean; ticket?: OrderTicket; error?: string } => {
    const cleanSearch = ticketIdOrFolio.trim().toUpperCase();
    const ticketIndex = pendingTickets.findIndex(
      (t) =>
        t.id === ticketIdOrFolio ||
        t.folio.toUpperCase() === cleanSearch ||
        t.folio.replace('TK-', '') === cleanSearch.replace('TK-', '')
    );

    if (ticketIndex === -1) {
      // Check if it was already paid
      const alreadyPaid = paidTickets.find(
        (t) =>
          t.id === ticketIdOrFolio ||
          t.folio.toUpperCase() === cleanSearch ||
          t.folio.replace('TK-', '') === cleanSearch.replace('TK-', '')
      );
      if (alreadyPaid) {
        return {
          success: false,
          error: `El ticket ${alreadyPaid.folio} ya fue cobrado previamente a las ${alreadyPaid.paidAt}.`,
        };
      }
      return {
        success: false,
        error: `No se encontró ningún ticket pendiente con el código o folio "${ticketIdOrFolio}".`,
      };
    }

    const pendingTicket = pendingTickets[ticketIndex];
    if (amountReceived < pendingTicket.total) {
      return {
        success: false,
        error: `Monto recibido insuficiente. El total es $${pendingTicket.total.toFixed(
          2
        )} y se ingresó $${amountReceived.toFixed(2)}.`,
      };
    }

    const changeGiven = amountReceived - pendingTicket.total;
    const now = new Date();
    const paidAt = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const completedTicket: OrderTicket = {
      ...pendingTicket,
      status: 'cobrado',
      paidAt,
      cajeraId: 'caj-1',
      cajeraName,
      paymentMethod,
      amountReceived,
      changeGiven,
    };

    setPendingTickets((prev) => prev.filter((_, idx) => idx !== ticketIndex));
    setPaidTickets((prev) => [completedTicket, ...prev]);
    showNotification(`¡Cobro exitoso! Ticket ${completedTicket.folio} registrado.`);

    return { success: true, ticket: completedTicket };
  };

  const cancelTicket = (ticketId: string) => {
    const target = pendingTickets.find((t) => t.id === ticketId);
    if (!target) return;

    // Restore product stock
    setProducts((prev) =>
      prev.map((prod) => {
        const item = target.items.find((i) => i.productId === prod.id);
        if (item) {
          return {
            ...prod,
            stock: prod.stock + item.quantity,
          };
        }
        return prod;
      })
    );

    setPendingTickets((prev) => prev.filter((t) => t.id !== ticketId));
    showNotification(`Ticket ${target.folio} cancelado y producto devuelto al inventario.`);
  };

  // Perform cash cut
  const createCashCut = (
    cajeraName: string,
    actualInDrawer: number,
    notes?: string
  ): CashRegisterCut => {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('es-MX')} ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const cashSales = paidTickets
      .filter((t) => t.paymentMethod === 'efectivo')
      .reduce((acc, t) => acc + t.total, 0);

    const cardSales = paidTickets
      .filter((t) => t.paymentMethod === 'tarjeta')
      .reduce((acc, t) => acc + t.total, 0);

    const voucherSales = paidTickets
      .filter((t) => t.paymentMethod === 'vales')
      .reduce((acc, t) => acc + t.total, 0);

    const initialCash = 1000.00; // fondo de caja habitual en CDMX
    const expectedInDrawer = initialCash + cashSales;
    const totalSales = cashSales + cardSales + voucherSales;

    const newCut: CashRegisterCut = {
      id: `cut-${Date.now()}`,
      timestamp,
      cajeraName,
      initialCash,
      totalSales,
      cashSales,
      cardSales,
      voucherSales,
      expectedInDrawer,
      actualInDrawer,
      notes,
    };

    setCashCuts((prev) => [newCut, ...prev]);
    showNotification(`Corte de caja registrado para ${cajeraName}`);
    return newCut;
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.DEMO_CLEARED);
    setProducts(INITIAL_PRODUCTS);
    setInsumos(INITIAL_INSUMOS);
    setPendingTickets(INITIAL_PENDING_TICKETS);
    setPaidTickets(INITIAL_PAID_TICKETS);
    setCashCuts([]);
    showNotification('Datos de demostración restaurados');
  };

  const clearAllData = async () => {
    // 1. Mark demo as permanently cleared in browser localStorage
    localStorage.setItem(STORAGE_KEYS.DEMO_CLEARED, 'true');

    // 2. Clear state in memory
    setProducts([]);
    setInsumos([]);
    setPendingTickets([]);
    setPaidTickets([]);
    setCashCuts([]);

    // 3. Clear stored arrays in localStorage
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INSUMOS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PENDING_TICKETS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PAID_TICKETS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CASH_CUTS, JSON.stringify([]));

    // 4. Hook for future Supabase configuration:
    // If window.supabase or custom client is present, wipe remote tables
    try {
      const globalAny = window as any;
      if (globalAny.supabase) {
        await Promise.allSettled([
          globalAny.supabase.from('products').delete().neq('id', 'null'),
          globalAny.supabase.from('insumos').delete().neq('id', 'null'),
          globalAny.supabase.from('tickets').delete().neq('id', 'null'),
          globalAny.supabase.from('cash_cuts').delete().neq('id', 'null'),
        ]);
        console.info('[Supabase] Tablas limpiadas exitosamente.');
      }
    } catch (err) {
      console.warn('[Supabase] Error al borrar registros remotos:', err);
    }

    showNotification('¡Datos de muestra eliminados! El sistema ahora está completamente limpio.');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeModule,
        setActiveModule,
        sidebarOpen,
        setSidebarOpen,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        insumos,
        addInsumo,
        updateInsumoStock,
        pendingTickets,
        paidTickets,
        createTicket,
        checkoutDirectSale,
        payTicket,
        cancelTicket,
        cashCuts,
        createCashCut,
        resetToDemoData,
        clearAllData,
        isDemoCleared,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
