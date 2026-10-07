import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketItem, BakeryProduct, OrderTicket } from '../../types';
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
} from 'lucide-react';

export const POSModule: React.FC = () => {
  const { products, createTicket, pendingTickets, activeModule, setActiveModule } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [trayItems, setTrayItems] = useState<TicketItem[]>([]);
  const [counterId, setCounterId] = useState('Mostrador 1');
  const [vendedorName, setVendedorName] = useState('Mateo R.');
  const [activeTicketModal, setActiveTicketModal] = useState<OrderTicket | null>(null);

  // Category filters with requested palette
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

  const handleEmitTicket = () => {
    if (trayItems.length === 0) return;
    const ticket = createTicket(trayItems, counterId, `${vendedorName} (${counterId})`);
    setActiveTicketModal(ticket);
    setTrayItems([]);
  };

  // Button styling based on requested palette: #C58847, #562914, #FCF1D5, #000000
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
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
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
                  <Clock className="w-3 h-3" />
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
                <span className="font-mono-nums font-black text-lg text-amber-700">${tk.total.toFixed(2)}</span>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setActiveTicketModal(tk)}
                  className="flex-1 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-xs font-semibold text-stone-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
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

  return (
    <div className="flex flex-col xl:flex-row h-full gap-4 pb-20 lg:pb-4">
      {/* LEFT SECTION: Products Grid with Big Colorful Touch Buttons */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Top Controls: Search & Category selector */}
        <div className="p-3 sm:p-4 border-b border-stone-200 bg-stone-50/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar pan dulce, bolillo, pastel, código..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Counter info */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 shrink-0">
              <span className="text-stone-500">Mostrador:</span>
              <select
                value={counterId}
                onChange={(e) => setCounterId(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium text-stone-800 focus:outline-none"
              >
                <option value="Mostrador 1">Mostrador 1 (Pan Dulce)</option>
                <option value="Mostrador 2">Mostrador 2 (Bolillos / Pan Blanco)</option>
                <option value="Vitrina 1">Vitrina Pasteles Especiales</option>
              </select>
            </div>
          </div>

          {/* Category Pills (Touch friendly scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? `${cat.color} shadow-xs`
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 
          Big Colorful POS Buttons:
          "rol vendedor: Sistema pos con botones grandes y de colores para poder vender pan, pasteles, pan de dulce, etc."
        */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto max-h-[calc(100vh-22rem)] xl:max-h-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-3.5">
            {filteredProducts.map((prod) => {
              const theme = getProductButtonTheme(prod.category);
              const inTray = trayItems.find((t) => t.productId === prod.id);

              return (
                <button
                  key={prod.id}
                  onClick={() => addToTray(prod, 1)}
                  className={`group relative flex flex-col justify-between text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md active:scale-98 ${theme.bg} ${theme.border} min-h-[110px] sm:min-h-[125px]`}
                >
                  {/* Top line: Code badge + In-tray counter */}
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono-nums text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-stone-900/10 text-stone-800">
                      {prod.code}
                    </span>
                    {inTray && (
                      <span className="flex items-center gap-1 font-mono-nums text-xs font-black px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-xs">
                        <Check className="w-3 h-3" />
                        {inTray.quantity}
                      </span>
                    )}
                  </div>

                  {/* Middle: Bread/Cake Title */}
                  <div className="my-1">
                    <div className="font-bold text-sm sm:text-base text-stone-950 leading-snug line-clamp-2">
                      {prod.name}
                    </div>
                  </div>

                  {/* Bottom: Price in bold banner */}
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-stone-900/10">
                    <span className="text-[11px] text-stone-600 font-medium">
                      Disp: {prod.stock}
                    </span>
                    <span className="font-mono-nums text-sm sm:text-base font-extrabold text-stone-900">
                      ${prod.price.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-[#FCF1D5]/40 rounded-2xl border-2 border-dashed border-[#562914]/20">
              <Wheat className="w-10 h-10 text-[#C58847] mb-2" />
              <p className="text-sm font-bold text-[#562914]">
                {products.length === 0 ? 'No hay productos en inventario' : `No se encontraron productos con "${searchTerm}"`}
              </p>
              <p className="text-xs text-stone-600 mt-1 max-w-sm">
                {products.length === 0
                  ? 'Los datos de muestra fueron eliminados. Puedes registrar nuevos panes en el módulo de Administrador o cargar datos demo de prueba.'
                  : 'Prueba buscando con otro término o selecciona otra categoría.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Charola Digital (Customer Tray) */}
      <div className="w-full xl:w-96 flex flex-col bg-white rounded-2xl border border-[#562914]/20 shadow-xs overflow-hidden shrink-0">
        {/* Tray Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#562914]/15 bg-[#FCF1D5]/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#562914] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C58847]" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-[#562914] font-display">Charola de Despacho</h2>
              <div className="text-xs text-stone-500">
                {totalPieces} piezas en bandeja
              </div>
            </div>
          </div>

          {trayItems.length > 0 && (
            <button
              onClick={clearTray}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md font-bold transition-colors cursor-pointer"
            >
              Vaciar
            </button>
          )}
        </div>

        {/* Tray Items List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-72 xl:max-h-96 min-h-[160px]">
          {trayItems.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-[#562914]/70 border border-dashed border-[#562914]/20 rounded-xl bg-[#FCF1D5]/30">
              <Sparkles className="w-6 h-6 text-[#C58847] mb-2" />
              <p className="text-xs sm:text-sm font-bold text-[#562914]">Charola vacía</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Presiona los botones de pan para agregar a la charola del cliente
              </p>
            </div>
          ) : (
            trayItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#562914]/15 bg-[#FCF1D5]/20 hover:bg-[#FCF1D5]/40"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-bold text-xs sm:text-sm text-[#562914] truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-stone-600 font-mono-nums">
                    ${item.price.toFixed(2)} c/u
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
                  <span className="w-7 text-center font-bold font-mono-nums text-sm text-[#000000]">
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
                    className="p-1 text-stone-400 hover:text-red-600 rounded-md ml-1 cursor-pointer"
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
          <div className="px-3 py-2 border-t border-[#562914]/15 bg-[#FCF1D5]/30 flex items-center gap-1.5 text-xs">
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

        {/* Tray Summary & Emit Ticket CTA */}
        <div className="p-3.5 sm:p-4 border-t border-[#562914]/15 bg-white space-y-3">
          <div className="space-y-1 text-xs sm:text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Total piezas:</span>
              <span className="font-bold font-mono-nums text-[#000000]">{totalPieces} pzas</span>
            </div>
            <div className="flex justify-between items-baseline pt-1 border-t border-[#562914]/10">
              <span className="font-bold text-[#562914] text-base">Total a Cobrar:</span>
              <span className="font-mono-nums text-2xl font-black text-[#562914]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Emit Ticket Button */}
          <button
            onClick={handleEmitTicket}
            disabled={trayItems.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              trayItems.length > 0
                ? 'bg-[#562914] hover:bg-[#C58847] active:scale-98 text-white hover:shadow-md'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Printer className="w-5 h-5 text-[#FCF1D5]" />
            <span>Emitir Ticket para Caja</span>
          </button>
        </div>
      </div>

      {/* MODAL: Ticket de Despacho Emitido con Logo unencapsulated */}
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
