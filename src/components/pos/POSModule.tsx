import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketItem, BakeryProduct, OrderTicket, PaymentMethod } from '../../types';
import { BarcodeVisual } from '../common/BarcodeVisual';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  ShoppingBag,
  Check,
  Wheat,
  Clock,
  Sparkles,
  CreditCard,
  Banknote,
  DollarSign,
  X,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

export const POSModule: React.FC = () => {
  const {
    products,
    createTicket,
    checkoutDirectSale,
    pendingTickets,
    activeModule,
    setActiveModule,
    resetToDemoData,
    showNotification,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [trayItems, setTrayItems] = useState<TicketItem[]>([]);
  const [counterId, setCounterId] = useState('Mostrador 1');
  const [vendedorName, setVendedorName] = useState('Mateo R.');
  
  // Modals state
  const [activeTicketModal, setActiveTicketModal] = useState<OrderTicket | null>(null);
  const [paidReceiptModal, setPaidReceiptModal] = useState<OrderTicket | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [mobileTrayOpen, setMobileTrayOpen] = useState(false);

  // Checkout payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [cashAmountGiven, setCashAmountGiven] = useState<string>('');

  // Auto-restore products if somehow empty
  useEffect(() => {
    if (products.length === 0) {
      resetToDemoData();
    }
  }, [products.length, resetToDemoData]);

  // Category filters with institutional palette
  const categories = [
    { id: 'todos', label: 'Todo el Pan', color: 'bg-[#562914] text-white' },
    { id: 'pan_dulce', label: 'Pan Dulce', color: 'bg-[#C58847] text-white' },
    { id: 'pan_blanco', label: 'Pan Blanco (Bolillos)', color: 'bg-[#562914] text-white' },
    { id: 'pasteleria', label: 'Pastelería Vitrina', color: 'bg-[#C58847] text-white' },
    { id: 'gelatinas', label: 'Gelatinas & Flan', color: 'bg-[#562914] text-white' },
    { id: 'cafeteria', label: 'Cafetería & Bebidas', color: 'bg-[#C58847] text-white' },
  ];

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'todos' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Tray management
  const addToTray = (product: BakeryProduct, qtyToAdd: number = 1) => {
    setTrayItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + qtyToAdd;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * product.price,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            code: product.code,
            name: product.name,
            price: product.price,
            quantity: qtyToAdd,
            subtotal: qtyToAdd * product.price,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setTrayItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.price,
            };
          }
          return item;
        })
        .filter(Boolean) as TicketItem[]
    );
  };

  const removeItem = (productId: string) => {
    setTrayItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearTray = () => {
    setTrayItems([]);
  };

  const totalPieces = trayItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = trayItems.reduce((acc, i) => acc + i.subtotal, 0);

  // Simulate Bread Purchase feature
  const simulateBreadPurchase = () => {
    if (products.length === 0) {
      resetToDemoData();
    }

    const conchaVainilla = products.find((p) => p.code === 'PD01') || {
      id: 'prod-1',
      code: 'PD01',
      name: 'Concha de Vainilla',
      price: 14.0,
    };
    const conchaChoco = products.find((p) => p.code === 'PD02') || {
      id: 'prod-2',
      code: 'PD02',
      name: 'Concha de Chocolate',
      price: 14.0,
    };
    const bolillo = products.find((p) => p.code === 'PB01') || {
      id: 'prod-5',
      code: 'PB01',
      name: 'Bolillo Tradicional',
      price: 3.0,
    };
    const oreja = products.find((p) => p.code === 'PD03') || {
      id: 'prod-3',
      code: 'PD03',
      name: 'Oreja de Hojaldre',
      price: 15.5,
    };
    const cuerno = products.find((p) => p.code === 'PD04') || {
      id: 'prod-4',
      code: 'PD04',
      name: 'Cuerno de Mantequilla',
      price: 16.0,
    };

    const simulatedItems: TicketItem[] = [
      {
        productId: conchaVainilla.id,
        code: conchaVainilla.code,
        name: conchaVainilla.name,
        price: conchaVainilla.price,
        quantity: 2,
        subtotal: conchaVainilla.price * 2,
      },
      {
        productId: conchaChoco.id,
        code: conchaChoco.code,
        name: conchaChoco.name,
        price: conchaChoco.price,
        quantity: 2,
        subtotal: conchaChoco.price * 2,
      },
      {
        productId: bolillo.id,
        code: bolillo.code,
        name: bolillo.name,
        price: bolillo.price,
        quantity: 4,
        subtotal: bolillo.price * 4,
      },
      {
        productId: oreja.id,
        code: oreja.code,
        name: oreja.name,
        price: oreja.price,
        quantity: 1,
        subtotal: oreja.price * 1,
      },
      {
        productId: cuerno.id,
        code: cuerno.code,
        name: cuerno.name,
        price: cuerno.price,
        quantity: 1,
        subtotal: cuerno.price * 1,
      },
    ];

    setTrayItems(simulatedItems);
    const simTotal = simulatedItems.reduce((acc, i) => acc + i.subtotal, 0);
    setCashAmountGiven('100');
    showNotification(`🥖 ¡Compra simulada de pan cargada! 10 piezas en charola ($${simTotal.toFixed(2)})`);
  };

  // Open Checkout Modal
  const openCheckout = () => {
    if (trayItems.length === 0) return;
    setCashAmountGiven(totalPrice.toString());
    setCheckoutModalOpen(true);
  };

  // Direct checkout
  const handleDirectPayment = () => {
    if (trayItems.length === 0) return;
    const numGiven = paymentMethod === 'efectivo'
      ? parseFloat(cashAmountGiven) || totalPrice
      : totalPrice;

    if (numGiven < totalPrice) {
      showNotification(`El monto recibido ($${numGiven.toFixed(2)}) es menor al total ($${totalPrice.toFixed(2)})`);
      return;
    }

    const receipt = checkoutDirectSale(trayItems, paymentMethod, numGiven, vendedorName);
    setPaidReceiptModal(receipt);
    setTrayItems([]);
    setCheckoutModalOpen(false);
    setMobileTrayOpen(false);
  };

  // Emit dispatch ticket for cashier
  const handleEmitTicket = () => {
    if (trayItems.length === 0) return;
    const ticket = createTicket(trayItems, counterId, `${vendedorName} (${counterId})`);
    setActiveTicketModal(ticket);
    setTrayItems([]);
    setCheckoutModalOpen(false);
    setMobileTrayOpen(false);
  };

  // Button styling based on palette: #C58847, #562914, #FCF1D5, #000000
  const getProductButtonTheme = (cat: BakeryProduct['category']) => {
    switch (cat) {
      case 'pan_dulce':
        return {
          bg: 'bg-[#FCF1D5]/90 hover:bg-[#FCF1D5] active:bg-[#FCF1D5]',
          border: 'border-[#C58847]',
          badge: 'bg-[#C58847] text-white',
          priceText: 'text-[#562914]',
        };
      case 'pan_blanco':
        return {
          bg: 'bg-white hover:bg-[#FCF1D5]/40 active:bg-[#FCF1D5]/70',
          border: 'border-[#562914]/40',
          badge: 'bg-[#562914] text-white',
          priceText: 'text-[#562914]',
        };
      case 'pasteleria':
        return {
          bg: 'bg-[#562914]/5 hover:bg-[#562914]/15 active:bg-[#562914]/25',
          border: 'border-[#562914]',
          badge: 'bg-[#562914] text-white',
          priceText: 'text-[#562914]',
        };
      case 'gelatinas':
        return {
          bg: 'bg-[#C58847]/10 hover:bg-[#C58847]/20 active:bg-[#C58847]/30',
          border: 'border-[#C58847]',
          badge: 'bg-[#C58847] text-white',
          priceText: 'text-[#562914]',
        };
      case 'cafeteria':
        return {
          bg: 'bg-[#FCF1D5] hover:bg-white active:bg-[#FCF1D5]',
          border: 'border-[#562914]/30',
          badge: 'bg-[#562914] text-white',
          priceText: 'text-[#562914]',
        };
      default:
        return {
          bg: 'bg-white hover:bg-[#FCF1D5]/50 active:bg-[#FCF1D5]',
          border: 'border-[#562914]/30',
          badge: 'bg-[#562914] text-white',
          priceText: 'text-[#562914]',
        };
    }
  };

  // If active module is tickets_vendedor, show the list of pending tickets
  if (activeModule === 'tickets_vendedor') {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-6 pb-20 lg:pb-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">Tickets de Despacho en Espera</h2>
            <p className="text-xs text-stone-500">Tickets generados por mostrador pendientes de cobro en caja</p>
          </div>
          <button
            onClick={() => setActiveModule('pos')}
            className="px-3.5 py-1.5 rounded-xl bg-[#562914] hover:bg-[#C58847] text-white font-bold text-xs cursor-pointer"
          >
            Volver al Mostrador
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {pendingTickets.map((tk) => (
            <div key={tk.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono-nums font-black text-base text-stone-900">{tk.folio}</span>
                <span className="text-xs text-stone-500 font-mono-nums flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C58847]" />
                  {tk.timestamp}
                </span>
              </div>
              <div className="text-xs text-stone-600 font-medium">
                {tk.vendedorName} · {tk.counterId}
              </div>
              <div className="py-2 border-y border-stone-200 space-y-1 text-xs">
                {tk.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-mono-nums font-semibold">${it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-bold text-stone-700">Total ({tk.totalPieces} pzas):</span>
                <span className="font-mono-nums font-black text-lg text-[#562914]">${tk.total.toFixed(2)}</span>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setActiveTicketModal(tk)}
                  className="flex-1 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-xs font-semibold text-stone-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C58847]" />
                  <span>Ver / Reimprimir</span>
                </button>
              </div>
            </div>
          ))}

          {pendingTickets.length === 0 && (
            <div className="col-span-full h-48 flex flex-col items-center justify-center text-center text-stone-400">
              <Check className="w-8 h-8 text-emerald-600 mb-2" />
              <p className="text-sm font-bold text-stone-700">No hay tickets pendientes</p>
              <p className="text-xs text-stone-500">Todos los tickets de despacho han sido cobrados en caja.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const numGivenParsed = parseFloat(cashAmountGiven) || 0;
  const changeCalculated = Math.max(0, numGivenParsed - totalPrice);

  return (
    <div className="flex flex-col xl:flex-row h-full min-h-0 gap-3 sm:gap-4 pb-24 xl:pb-2 relative">
      {/* LEFT SECTION: Products Grid with Big Colorful Touch Buttons */}
      <div className="flex-1 min-w-0 flex flex-col bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden h-full">
        {/* Top Controls: Search, Simulate Bread Purchase button, and Category selector */}
        <div className="p-3 sm:p-4 border-b border-stone-200 bg-[#FCF1D5]/40 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar pan dulce, bolillo, pastel, código..."
                className="w-full pl-10 pr-16 py-2 sm:py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#C58847]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer font-bold"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Quick Actions: Simulate Bread Purchase & Counter selection */}
            <div className="flex items-center gap-2 shrink-0">
              {/* BUTTON: Simular Compra de Pan */}
              <button
                onClick={simulateBreadPurchase}
                title="Simula una charola con selección de pan dulce y bolillos para probar venta y checkout"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#562914] hover:bg-[#C58847] active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer border border-[#C58847]/40"
              >
                <Sparkles className="w-4 h-4 text-[#FCF1D5] animate-pulse" />
                <span>Simular Compra de Pan</span>
              </button>

              {/* Counter info */}
              <select
                value={counterId}
                onChange={(e) => setCounterId(e.target.value)}
                className="bg-white border border-stone-300 rounded-xl px-2.5 py-2 text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="Mostrador 1">Mostrador 1 (Pan Dulce)</option>
                <option value="Mostrador 2">Mostrador 2 (Bolillos)</option>
                <option value="Vitrina 1">Vitrina Pasteles</option>
              </select>
            </div>
          </div>

          {/* Category Pills (Touch friendly scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? `${cat.color} shadow-xs`
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-[#FCF1D5]/60'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {products.length === 0 && (
              <button
                onClick={resetToDemoData}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold whitespace-nowrap shrink-0 hover:bg-amber-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Activar Productos Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* 
          Big Colorful POS Buttons:
          "rol vendedor: Sistema pos con botones grandes y de colores para poder vender pan, pasteles, pan de dulce, etc."
        */}
        <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-3.5">
            {filteredProducts.map((prod) => {
              const theme = getProductButtonTheme(prod.category);
              const inTray = trayItems.find((t) => t.productId === prod.id);

              return (
                <button
                  key={prod.id}
                  onClick={() => addToTray(prod, 1)}
                  className={`group relative flex flex-col justify-between text-left p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md active:scale-98 ${theme.bg} ${theme.border} min-h-[115px] sm:min-h-[125px]`}
                >
                  {/* Top line: Code badge + In-tray counter */}
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono-nums text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-stone-900/10 text-stone-800">
                      {prod.code}
                    </span>
                    {inTray && (
                      <span className="flex items-center gap-1 font-mono-nums text-xs font-black px-2 py-0.5 rounded-full bg-[#562914] text-white shadow-xs">
                        <Check className="w-3 h-3 text-[#C58847]" />
                        {inTray.quantity}
                      </span>
                    )}
                  </div>

                  {/* Middle: Bread/Cake Title */}
                  <div className="my-1">
                    <div className="font-bold text-sm sm:text-base text-stone-950 leading-snug line-clamp-2 font-display">
                      {prod.name}
                    </div>
                  </div>

                  {/* Bottom: Price in bold banner */}
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-stone-900/10">
                    <span className="text-[11px] text-stone-600 font-medium">
                      Disp: {prod.stock}
                    </span>
                    <span className="font-mono-nums text-sm sm:text-base font-black text-[#562914]">
                      ${prod.price.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#FCF1D5]/40 rounded-2xl border-2 border-dashed border-[#562914]/20 my-4">
              <Wheat className="w-12 h-12 text-[#C58847] mb-2" />
              <p className="text-base font-bold text-[#562914]">
                {products.length === 0 ? 'No hay productos en inventario' : `No se encontraron productos con "${searchTerm}"`}
              </p>
              <p className="text-xs text-stone-600 mt-1 max-w-sm">
                {products.length === 0
                  ? 'Activa los productos de muestra de la panadería para comenzar a vender inmediatamente.'
                  : 'Prueba buscando con otro término o selecciona otra categoría.'}
              </p>
              {products.length === 0 && (
                <button
                  onClick={resetToDemoData}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#562914] hover:bg-[#C58847] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-4 h-4 text-[#FCF1D5]" />
                  <span>Activar Panes de Muestra (20+ Productos)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Charola Digital (Customer Tray & Check Out Card) in Desktop/Fullscreen */}
      <div className="hidden xl:flex w-96 flex-col bg-white rounded-2xl border border-[#562914]/20 shadow-md overflow-hidden shrink-0 h-full">
        {/* Tray Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#562914]/15 bg-[#FCF1D5]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#562914] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C58847]" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-[#562914] font-display">Charola de Despacho</h2>
              <div className="text-xs text-stone-600 font-medium">
                {totalPieces} piezas en charola
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={simulateBreadPurchase}
              title="Simular compra de pan"
              className="text-xs text-[#562914] hover:bg-white px-2 py-1 rounded-lg font-bold border border-[#562914]/20 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#C58847]" />
              <span>Simular</span>
            </button>
            {trayItems.length > 0 && (
              <button
                onClick={clearTray}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer"
              >
                Vaciar
              </button>
            )}
          </div>
        </div>

        {/* Tray Items List (Scrollable) */}
        <div className="flex-1 min-h-0 p-3 overflow-y-auto space-y-2">
          {trayItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#562914]/70 border border-dashed border-[#562914]/20 rounded-xl bg-[#FCF1D5]/20">
              <Sparkles className="w-8 h-8 text-[#C58847] mb-2" />
              <p className="text-sm font-bold text-[#562914]">Charola vacía</p>
              <p className="text-xs text-stone-500 mt-1 max-w-[200px]">
                Presiona los botones de pan para agregar a la charola o pulsa &quot;Simular&quot;.
              </p>
              <button
                onClick={simulateBreadPurchase}
                className="mt-3 px-3 py-1.5 rounded-lg bg-[#562914] text-white text-xs font-bold hover:bg-[#C58847] cursor-pointer shadow-xs"
              >
                + Simular Compra de Pan
              </button>
            </div>
          ) : (
            trayItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#562914]/15 bg-[#FCF1D5]/20 hover:bg-[#FCF1D5]/40 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-bold text-xs sm:text-sm text-[#562914] truncate font-display">
                    {item.name}
                  </div>
                  <div className="text-xs text-stone-600 font-mono-nums">
                    ${item.price.toFixed(2)} c/u · <span className="font-bold text-[#562914]">${item.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#562914]/20 text-[#562914] hover:bg-[#FCF1D5] flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold font-mono-nums text-sm text-[#000000]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="w-7 h-7 rounded-lg bg-[#C58847] hover:bg-[#562914] text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded-md ml-0.5 cursor-pointer"
                    title="Eliminar de la charola"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Batch Quantity Buttons */}
        {trayItems.length > 0 && (
          <div className="px-3 py-1.5 border-t border-[#562914]/15 bg-[#FCF1D5]/30 flex items-center gap-1.5 text-xs shrink-0">
            <span className="text-[#562914]/70 font-bold">Rápido:</span>
            {[5, 10, 20].map((quick) => (
              <button
                key={quick}
                onClick={() => {
                  const last = trayItems[trayItems.length - 1];
                  if (last) updateQuantity(last.productId, quick);
                }}
                className="px-2 py-0.5 rounded-lg bg-white border border-[#562914]/20 hover:bg-[#FCF1D5] hover:border-[#C58847] font-mono-nums font-bold text-[#562914] cursor-pointer"
              >
                +{quick} último
              </button>
            ))}
          </div>
        )}

        {/* PINNED TRAY SUMMARY & DUAL CHECKOUT BUTTONS IN FULLSCREEN */}
        <div className="p-3.5 sm:p-4 border-t border-[#562914]/20 bg-white space-y-2.5 shrink-0 shadow-lg">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-stone-600">
              <span>Total piezas de pan:</span>
              <span className="font-bold font-mono-nums text-[#000000]">{totalPieces} pzas</span>
            </div>
            <div className="flex justify-between items-baseline pt-1 border-t border-[#562914]/10">
              <span className="font-black text-[#562914] text-sm uppercase tracking-wide">Total a Cobrar:</span>
              <span className="font-mono-nums text-2xl font-black text-[#562914]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Primary Action: Direct Check Out / Pagar */}
          <button
            onClick={openCheckout}
            disabled={trayItems.length === 0}
            className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              trayItems.length > 0
                ? 'bg-[#562914] hover:bg-[#C58847] text-white active:scale-98 shadow-md'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#FCF1D5]" />
            <span>PAGAR / CHECK OUT (${totalPrice.toFixed(2)})</span>
          </button>

          {/* Secondary Action: Emit Dispatch Ticket for Cashier */}
          <button
            onClick={handleEmitTicket}
            disabled={trayItems.length === 0}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              trayItems.length > 0
                ? 'border-[#562914]/30 bg-[#FCF1D5]/40 hover:bg-[#FCF1D5] text-[#562914]'
                : 'border-stone-200 text-stone-300 cursor-not-allowed'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-[#C58847]" />
            <span>Emitir Ticket de Despacho (Caja)</span>
          </button>
        </div>
      </div>

      {/* MOBILE & TABLET STICKY CHECK OUT DOCK (ALWAYS VISIBLE ABOVE BOTTOM BAR) */}
      <div className="xl:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-[#562914]/25 p-3 shadow-2xl flex items-center justify-between gap-2.5">
        <div
          className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
          onClick={() => setMobileTrayOpen(true)}
        >
          <div className="w-10 h-10 rounded-xl bg-[#562914] text-white flex items-center justify-center relative shrink-0">
            <ShoppingBag className="w-5 h-5 text-[#C58847]" />
            {totalPieces > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C58847] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                {totalPieces}
              </span>
            )}
          </div>
          <div className="truncate">
            <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wide">
              {totalPieces} {totalPieces === 1 ? 'pza' : 'pzas'} en charola
            </div>
            <div className="text-base sm:text-lg font-black font-mono-nums text-[#562914] truncate">
              ${totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setMobileTrayOpen(true)}
            className="px-3 py-2.5 rounded-xl border border-[#562914]/30 bg-[#FCF1D5] text-[#562914] font-bold text-xs hover:bg-[#FCF1D5]/80 cursor-pointer"
          >
            Charola
          </button>
          <button
            onClick={openCheckout}
            disabled={trayItems.length === 0}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${
              trayItems.length > 0
                ? 'bg-[#562914] hover:bg-[#C58847] text-white'
                : 'bg-stone-300 text-stone-400 cursor-not-allowed'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#FCF1D5]" />
            <span>PAGAR (${totalPrice.toFixed(2)})</span>
          </button>
        </div>
      </div>

      {/* MOBILE TRAY MODAL / DRAWER */}
      {mobileTrayOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-[#562914]/20 overflow-hidden">
            <div className="p-4 border-b border-[#562914]/15 bg-[#FCF1D5]/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#562914]" />
                <h3 className="font-bold text-base text-[#562914] font-display">Charola de Pan ({totalPieces} pzas)</h3>
              </div>
              <div className="flex items-center gap-2">
                {trayItems.length > 0 && (
                  <button
                    onClick={clearTray}
                    className="text-xs text-red-600 font-bold px-2 py-1 rounded-lg"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  onClick={() => setMobileTrayOpen(false)}
                  className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {trayItems.length === 0 ? (
                <div className="py-12 text-center text-stone-500 space-y-2">
                  <p className="font-bold">No hay piezas en la charola</p>
                  <button
                    onClick={() => {
                      simulateBreadPurchase();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#562914] text-white font-bold text-xs"
                  >
                    Simular Compra de Pan
                  </button>
                </div>
              ) : (
                trayItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#562914]/15 bg-[#FCF1D5]/20"
                  >
                    <div className="flex-1 pr-2">
                      <div className="font-bold text-sm text-[#562914]">{item.name}</div>
                      <div className="text-xs text-stone-600 font-mono-nums">
                        ${item.price.toFixed(2)} c/u · <span className="font-bold text-[#562914]">${item.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-8 h-8 rounded-lg bg-white border border-[#562914]/20 flex items-center justify-center font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold font-mono-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-8 h-8 rounded-lg bg-[#C58847] text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1 text-stone-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[#562914]/20 bg-white space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[#562914]">Total a Pagar:</span>
                <span className="text-2xl font-black font-mono-nums text-[#562914]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleEmitTicket}
                  disabled={trayItems.length === 0}
                  className="py-3 rounded-xl border border-[#562914]/30 bg-[#FCF1D5] text-[#562914] font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-[#C58847]" />
                  <span>Ticket Caja</span>
                </button>
                <button
                  onClick={openCheckout}
                  disabled={trayItems.length === 0}
                  className="py-3 rounded-xl bg-[#562914] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CreditCard className="w-4 h-4 text-[#FCF1D5]" />
                  <span>CHECK OUT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECK OUT MODAL: PASARELA DE COBRO Y PAGO DIRECTO */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-[#562914]/20 text-[#000000] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#562914]/15">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#562914] text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#C58847]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#562914] font-display">Check Out / Cobro en Mostrador</h3>
                  <p className="text-xs text-stone-500">Total: {totalPieces} piezas de pan</p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Highlight */}
            <div className="my-4 p-4 rounded-xl bg-[#FCF1D5]/70 border border-[#C58847]/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#562914] font-bold uppercase tracking-wider block">Total a Pagar</span>
                <span className="text-xs text-stone-600">{totalPieces} panes seleccionados</span>
              </div>
              <span className="font-mono-nums text-3xl font-black text-[#562914]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 block">Forma de Pago:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'efectivo'
                      ? 'border-[#562914] bg-[#562914] text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-xs font-bold">Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tarjeta')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'tarjeta'
                      ? 'border-[#562914] bg-[#562914] text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-bold">Tarjeta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('vales')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'vales'
                      ? 'border-[#562914] bg-[#562914] text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xs font-bold">Vales</span>
                </button>
              </div>

              {/* Cash Denominations and Change calculation */}
              {paymentMethod === 'efectivo' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700">Monto recibido del cliente:</span>
                    <button
                      type="button"
                      onClick={() => setCashAmountGiven(totalPrice.toFixed(2))}
                      className="text-[#562914] font-bold hover:underline cursor-pointer"
                    >
                      Pago Exacto (${totalPrice.toFixed(2)})
                    </button>
                  </div>

                  {/* Quick bill buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {[50, 100, 200, 500].map((bill) => (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => setCashAmountGiven(bill.toString())}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-[#FCF1D5] font-mono-nums font-bold text-xs text-[#562914] cursor-pointer"
                      >
                        ${bill}
                      </button>
                    ))}
                  </div>

                  {/* Cash input */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.5"
                      value={cashAmountGiven}
                      onChange={(e) => setCashAmountGiven(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-stone-300 bg-white font-mono-nums text-base font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C58847]"
                    />
                  </div>

                  {/* Change Result */}
                  <div className="flex justify-between items-center pt-1 border-t border-stone-200 text-xs">
                    <span className="font-bold text-stone-600">Cambio a Devolver:</span>
                    <span
                      className={`font-mono-nums font-black text-base ${
                        numGivenParsed < totalPrice ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      {numGivenParsed < totalPrice
                        ? `Faltan $${(totalPrice - numGivenParsed).toFixed(2)}`
                        : `$${changeCalculated.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'tarjeta' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 text-center space-y-1">
                  <CreditCard className="w-6 h-6 text-[#C58847] mx-auto" />
                  <p className="font-bold text-stone-800">Terminal Bancaria Lista</p>
                  <p>Inserte o acerque la tarjeta por el monto de ${totalPrice.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Check Out Action Buttons */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={handleDirectPayment}
                disabled={paymentMethod === 'efectivo' && numGivenParsed < totalPrice}
                className="w-full py-3.5 rounded-xl bg-[#562914] hover:bg-[#C58847] text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5 text-[#FCF1D5]" />
                <span>FINALIZAR COBRO & REGISTRAR VENTA</span>
              </button>

              <button
                type="button"
                onClick={handleEmitTicket}
                className="w-full py-2.5 rounded-xl border border-[#562914]/30 hover:bg-[#FCF1D5]/40 text-[#562914] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#C58847]" />
                <span>Emitir Ticket para Caja (Sin cobrar aquí)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TICKET PAGADO (COMPROBANTE DIRECTO POS) */}
      {paidReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#562914]/20 text-[#000000] animate-in fade-in zoom-in-95 duration-150 relative">
            {/* Stamp PAGADO */}
            <div className="absolute top-5 right-5 border-2 border-emerald-600 text-emerald-700 font-black text-xs px-2 py-0.5 rounded-md rotate-12 uppercase tracking-widest pointer-events-none bg-emerald-50">
              PAGADO
            </div>

            {/* Header Ticket with unencapsulated logo */}
            <div className="text-center pb-3 border-b border-dashed border-stone-300">
              <img
                src="https://appdesignproyectos.com/panaderialogo.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/panaderialogo.png';
                }}
                alt="Logo Panadería"
                className="h-8 sm:h-9 w-auto object-contain mx-auto mb-1.5"
              />
              <p className="text-xs text-stone-500 font-semibold">Comprobante de Venta POS</p>
              <div className="mt-1 inline-block px-3 py-1 bg-[#FCF1D5] text-[#562914] rounded-lg font-mono-nums font-black text-base border border-[#C58847]/40">
                FOLIO: {paidReceiptModal.folio}
              </div>
            </div>

            {/* Meta info */}
            <div className="py-2 text-xs text-stone-600 border-b border-stone-200 flex justify-between font-mono-nums">
              <span>{paidReceiptModal.vendedorName}</span>
              <span>{paidReceiptModal.timestamp}</span>
            </div>

            {/* Items */}
            <div className="py-2.5 space-y-1.5 max-h-40 overflow-y-auto border-b border-dashed border-stone-300 text-xs">
              {paidReceiptModal.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono-nums font-semibold">${it.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals & Change */}
            <div className="py-2.5 space-y-1 text-xs border-b border-stone-200">
              <div className="flex justify-between font-bold text-stone-700">
                <span>Total ({paidReceiptModal.totalPieces} pzas):</span>
                <span className="text-base text-[#562914] font-black font-mono-nums">${paidReceiptModal.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Método:</span>
                <span className="capitalize font-semibold">{paidReceiptModal.paymentMethod}</span>
              </div>
              {paidReceiptModal.amountReceived && (
                <div className="flex justify-between text-stone-500 font-mono-nums">
                  <span>Recibido:</span>
                  <span>${paidReceiptModal.amountReceived.toFixed(2)}</span>
                </div>
              )}
              {paidReceiptModal.changeGiven !== undefined && (
                <div className="flex justify-between font-bold text-emerald-700 font-mono-nums">
                  <span>Cambio devuelto:</span>
                  <span>${paidReceiptModal.changeGiven.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Barcode */}
            <div className="my-3 p-2 bg-[#FCF1D5]/40 rounded-xl border border-[#562914]/15">
              <BarcodeVisual value={paidReceiptModal.folio} />
            </div>

            {/* Modal Actions */}
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl border border-[#562914]/25 hover:bg-[#FCF1D5]/40 text-[#562914] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#C58847]" />
                <span>Imprimir Ticket</span>
              </button>
              <button
                onClick={() => setPaidReceiptModal(null)}
                className="w-full py-2.5 rounded-xl bg-[#562914] hover:bg-[#C58847] text-white font-bold text-xs cursor-pointer"
              >
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TICKET DE DESPACHO PARA CAJA */}
      {activeTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#562914]/20 text-[#000000] animate-in fade-in zoom-in-95 duration-150">
            {/* Header Ticket with unencapsulated logo */}
            <div className="text-center pb-3 border-b border-dashed border-stone-300">
              <img
                src="https://appdesignproyectos.com/panaderialogo.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/panaderialogo.png';
                }}
                alt="Logo Panadería"
                className="h-8 sm:h-9 w-auto object-contain mx-auto mb-1.5"
              />
              <p className="text-xs text-stone-500 font-semibold">Ticket de Despacho Mostrador</p>
              <div className="mt-2 inline-block px-3 py-1 bg-[#FCF1D5] text-[#562914] rounded-lg font-mono-nums font-black text-base border border-[#C58847]/40">
                FOLIO: {activeTicketModal.folio}
              </div>
            </div>

            {/* Meta info */}
            <div className="py-2.5 text-xs text-stone-600 border-b border-stone-200 flex justify-between font-mono-nums">
              <span>{activeTicketModal.counterId}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#C58847]" />
                {activeTicketModal.timestamp}
              </span>
            </div>

            {/* Items Breakdown */}
            <div className="py-3 space-y-1.5 max-h-48 overflow-y-auto border-b border-dashed border-stone-300">
              {activeTicketModal.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div className="font-medium text-stone-800">
                    <span className="font-mono-nums font-bold text-[#C58847]">{it.quantity}x</span>{' '}
                    {it.name}
                  </div>
                  <div className="font-mono-nums text-stone-900 font-semibold">
                    ${it.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="py-3 flex justify-between items-baseline border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-600">
                Total ({activeTicketModal.totalPieces} pzas):
              </span>
              <span className="font-mono-nums text-xl font-black text-[#562914]">
                ${activeTicketModal.total.toFixed(2)}
              </span>
            </div>

            {/* Barcode Visual */}
            <div className="my-4 p-2 bg-[#FCF1D5]/40 rounded-xl border border-[#562914]/15">
              <BarcodeVisual value={activeTicketModal.folio} />
              <p className="text-[10px] text-center text-stone-600 mt-1 font-bold">
                Pase a pagar a la caja con este código
              </p>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2.5 rounded-xl border border-[#562914]/25 hover:bg-[#FCF1D5]/40 text-[#562914] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#C58847]" />
                <span>Imprimir Ticket</span>
              </button>
              <button
                onClick={() => setActiveTicketModal(null)}
                className="w-full py-2.5 rounded-xl bg-[#562914] hover:bg-[#C58847] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Siguiente Despacho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
