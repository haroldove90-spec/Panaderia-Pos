import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BakeryProduct, Insumo } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Package,
  Layers,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Wheat,
  Clock,
  DollarSign,
  CheckCircle2,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    insumos,
    addInsumo,
    updateInsumoStock,
    paidTickets,
    pendingTickets,
    cashCuts,
  } = useApp();

  // Metrics Calculations
  const totalSalesAmount = paidTickets.reduce((acc, t) => acc + t.total, 0);
  const totalPiecesSold = paidTickets.reduce((acc, t) => acc + t.totalPieces, 0);
  const averageTicket =
    paidTickets.length > 0 ? totalSalesAmount / paidTickets.length : 0;

  const cashSales = paidTickets
    .filter((t) => t.paymentMethod === 'efectivo')
    .reduce((acc, t) => acc + t.total, 0);
  const cardSales = paidTickets
    .filter((t) => t.paymentMethod === 'tarjeta')
    .reduce((acc, t) => acc + t.total, 0);
  const voucherSales = paidTickets
    .filter((t) => t.paymentMethod === 'vales')
    .reduce((acc, t) => acc + t.total, 0);

  // Category breakdown calculation
  const categorySalesMap: Record<string, { count: number; total: number }> = {
    pan_dulce: { count: 0, total: 0 },
    pan_blanco: { count: 0, total: 0 },
    pasteleria: { count: 0, total: 0 },
    gelatinas: { count: 0, total: 0 },
    cafeteria: { count: 0, total: 0 },
    galletas: { count: 0, total: 0 },
  };

  paidTickets.forEach((ticket) => {
    ticket.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod?.category || 'pan_dulce';
      if (categorySalesMap[cat]) {
        categorySalesMap[cat].count += item.quantity;
        categorySalesMap[cat].total += item.subtotal;
      }
    });
  });

  // State for inventory modals
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('todos');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BakeryProduct | null>(null);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCode, setNewProdCode] = useState('');
  const [newProdCat, setNewProdCat] = useState<BakeryProduct['category']>('pan_dulce');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdBaked, setNewProdBaked] = useState('');

  // State for insumos
  const [insumoSearch, setInsumoSearch] = useState('');
  const [showAddInsumoModal, setShowAddInsumoModal] = useState(false);
  const [stockAdjustmentModal, setStockAdjustmentModal] = useState<{
    insumo: Insumo;
    isEntry: boolean;
  } | null>(null);
  const [adjustQty, setAdjustQty] = useState('');

  // New Insumo Form
  const [newInsName, setNewInsName] = useState('');
  const [newInsCode, setNewInsCode] = useState('');
  const [newInsCategory, setNewInsCategory] = useState<Insumo['category']>('harinas');
  const [newInsStock, setNewInsStock] = useState('');
  const [newInsMin, setNewInsMin] = useState('');
  const [newInsUnit, setNewInsUnit] = useState('bultos');
  const [newInsCost, setNewInsCost] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    addProduct({
      code: newProdCode || `PX${Math.floor(Math.random() * 90 + 10)}`,
      name: newProdName,
      category: newProdCat,
      price: parseFloat(newProdPrice) || 0,
      stock: parseInt(newProdStock, 10) || 50,
      bakedToday: parseInt(newProdBaked, 10) || 60,
      wasteYesterday: 0,
      unit: newProdCat === 'pasteleria' ? 'pza' : 'pza',
      bgColor: 'bg-amber-100 hover:bg-amber-200',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-950',
    });
    setNewProdName('');
    setNewProdCode('');
    setNewProdPrice('');
    setNewProdStock('');
    setNewProdBaked('');
    setShowAddProductModal(false);
  };

  const handleCreateInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsName || !newInsStock) return;
    addInsumo({
      code: newInsCode || `INS-${Math.floor(Math.random() * 90 + 10)}`,
      name: newInsName,
      category: newInsCategory,
      currentStock: parseFloat(newInsStock) || 0,
      minStock: parseFloat(newInsMin) || 5,
      unit: newInsUnit,
      costPerUnit: parseFloat(newInsCost) || 500,
      lastRestock: new Date().toISOString().split('T')[0],
    });
    setNewInsName('');
    setNewInsCode('');
    setNewInsStock('');
    setNewInsMin('');
    setNewInsCost('');
    setShowAddInsumoModal(false);
  };

  const handleApplyStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustmentModal) return;
    const qty = parseFloat(adjustQty) || 0;
    if (qty <= 0) return;
    updateInsumoStock(stockAdjustmentModal.insumo.id, qty, stockAdjustmentModal.isEntry);
    setStockAdjustmentModal(null);
    setAdjustQty('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* MODULE 1: MÉTRICAS Y REPORTES */}
      {activeModule === 'metricas' && (
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
                Métricas de Operación y Ventas
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">
                Monitoreo en tiempo real de despachos, cobros y rotación de panadería
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Reporte</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Ventas del Día
                </span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="font-mono-nums text-2xl sm:text-3xl font-black text-stone-900">
                ${totalSalesAmount.toFixed(2)}
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{paidTickets.length} tickets cobrados</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Piezas de Pan
                </span>
                <span className="p-2 rounded-xl bg-yellow-50 text-yellow-700">
                  <Wheat className="w-4 h-4" />
                </span>
              </div>
              <div className="font-mono-nums text-2xl sm:text-3xl font-black text-stone-900">
                {totalPiecesSold} pzas
              </div>
              <div className="mt-2 text-xs text-stone-500 font-medium">
                Pan dulce, blanco y vitrina
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Ticket Promedio
                </span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="font-mono-nums text-2xl sm:text-3xl font-black text-stone-900">
                ${averageTicket.toFixed(2)}
              </div>
              <div className="mt-2 text-xs text-stone-500 font-medium">
                Por cliente en caja
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Tickets en Fila
                </span>
                <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="font-mono-nums text-2xl sm:text-3xl font-black text-rose-700">
                {pendingTickets.length} pend.
              </div>
              <div className="mt-2 text-xs text-stone-500 font-medium">
                Por cobrar en caja
              </div>
            </div>
          </div>

          {/* Breakdown Section: Payment Methods + Hourly peaks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Payment Methods Breakdown */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-stone-900 font-display">
                Desglose por Método de Pago
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-stone-700">Efectivo (${cashSales.toFixed(2)})</span>
                    <span className="text-stone-500 font-mono-nums">
                      {totalSalesAmount > 0
                        ? `${Math.round((cashSales / totalSalesAmount) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${
                          totalSalesAmount > 0 ? (cashSales / totalSalesAmount) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-stone-700">Tarjetas Débito / Crédito (${cardSales.toFixed(2)})</span>
                    <span className="text-stone-500 font-mono-nums">
                      {totalSalesAmount > 0
                        ? `${Math.round((cardSales / totalSalesAmount) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          totalSalesAmount > 0 ? (cardSales / totalSalesAmount) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-stone-700">Vales de Despensa (${voucherSales.toFixed(2)})</span>
                    <span className="text-stone-500 font-mono-nums">
                      {totalSalesAmount > 0
                        ? `${Math.round((voucherSales / totalSalesAmount) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${
                          totalSalesAmount > 0 ? (voucherSales / totalSalesAmount) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200">
                💡 <strong>Dato de Panadería CDMX:</strong> Los vales de despensa (Sodexo/Edenred) representan una alta rotación en familias durante quincena.
              </div>
            </div>

            {/* Category Sales Breakdown */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-stone-900 font-display">
                Ventas por Categoría de Producto
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="font-bold text-amber-900">Pan Dulce</div>
                  <div className="text-lg font-black font-mono-nums text-amber-800 mt-1">
                    ${categorySalesMap.pan_dulce.total.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium">
                    {categorySalesMap.pan_dulce.count} piezas vendidas
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                  <div className="font-bold text-yellow-900">Pan Blanco (Bolillos)</div>
                  <div className="text-lg font-black font-mono-nums text-yellow-800 mt-1">
                    ${categorySalesMap.pan_blanco.total.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-yellow-700 font-medium">
                    {categorySalesMap.pan_blanco.count} piezas vendidas
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="font-bold text-rose-900">Pastelería & Vitrina</div>
                  <div className="text-lg font-black font-mono-nums text-rose-800 mt-1">
                    ${categorySalesMap.pasteleria.total.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-rose-700 font-medium">
                    {categorySalesMap.pasteleria.count} pasteles/rebanadas
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-900">Gelatinas & Flan</div>
                  <div className="text-lg font-black font-mono-nums text-emerald-800 mt-1">
                    ${categorySalesMap.gelatinas.total.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {categorySalesMap.gelatinas.count} postres
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: INVENTARIO DE PANADERÍA */}
      {activeModule === 'inventario' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Inventario de Panadería y Piso de Venta
              </h2>
              <p className="text-xs text-stone-500">
                Control de piezas producidas en el día, stock disponible y precios
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddProductModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Producto</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Buscar por nombre o código de pan..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <select
              value={productCatFilter}
              onChange={(e) => setProductCatFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 bg-white"
            >
              <option value="todos">Todas las categorías</option>
              <option value="pan_dulce">Pan Dulce</option>
              <option value="pan_blanco">Pan Blanco</option>
              <option value="pasteleria">Pastelería</option>
              <option value="gelatinas">Gelatinas</option>
              <option value="cafeteria">Cafetería</option>
            </select>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="p-3 font-semibold">Código</th>
                  <th className="p-3 font-semibold">Producto</th>
                  <th className="p-3 font-semibold">Categoría</th>
                  <th className="p-3 font-semibold text-right">Precio Venta</th>
                  <th className="p-3 font-semibold text-right">Stock Actual</th>
                  <th className="p-3 font-semibold text-right">Horneado Hoy</th>
                  <th className="p-3 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products
                  .filter((p) => {
                    const matchCat =
                      productCatFilter === 'todos' || p.category === productCatFilter;
                    const matchQ =
                      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.code.toLowerCase().includes(productSearch.toLowerCase());
                    return matchCat && matchQ;
                  })
                  .map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono-nums font-bold text-stone-900">{prod.code}</td>
                      <td className="p-3 font-bold text-stone-800">{prod.name}</td>
                      <td className="p-3 capitalize text-stone-600">
                        {prod.category.replace('_', ' ')}
                      </td>
                      <td className="p-3 font-mono-nums font-bold text-amber-800 text-right">
                        ${prod.price.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono-nums text-right">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md ${
                            prod.stock <= 10
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {prod.stock} {prod.unit}
                        </span>
                      </td>
                      <td className="p-3 font-mono-nums text-stone-600 text-right">
                        {prod.bakedToday} pzas
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer"
                            title="Editar producto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Modal Add Product */}
          {showAddProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
                <h3 className="font-bold text-lg text-stone-900 font-display mb-3">
                  Nuevo Producto de Panadería
                </h3>
                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nombre del Pan/Pastel:</label>
                    <input
                      type="text"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="Ej. Garibaldi con Chocho Blanco"
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Código Rápido:</label>
                      <input
                        type="text"
                        value={newProdCode}
                        onChange={(e) => setNewProdCode(e.target.value)}
                        placeholder="Ej. PD11"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Categoría:</label>
                      <select
                        value={newProdCat}
                        onChange={(e) => setNewProdCat(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-stone-300"
                      >
                        <option value="pan_dulce">Pan Dulce</option>
                        <option value="pan_blanco">Pan Blanco</option>
                        <option value="pasteleria">Pastelería</option>
                        <option value="gelatinas">Gelatinas</option>
                        <option value="cafeteria">Cafetería</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Precio ($MXN):</label>
                      <input
                        type="number"
                        step="0.50"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        placeholder="16.00"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Stock Inicial:</label>
                      <input
                        type="number"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        placeholder="60"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Horneado Hoy:</label>
                      <input
                        type="number"
                        value={newProdBaked}
                        onChange={(e) => setNewProdBaked(e.target.value)}
                        placeholder="80"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums"
                      />
                    </div>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                    >
                      Guardar Pan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Edit Product */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
                <h3 className="font-bold text-lg text-stone-900 font-display mb-3">
                  Editar {editingProduct.name}
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Precio ($MXN):</label>
                    <input
                      type="number"
                      step="0.50"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 rounded-xl border border-stone-300 font-mono-nums text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Stock en Piso:</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full p-2 rounded-xl border border-stone-300 font-mono-nums text-sm"
                    />
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="flex-1 py-2 rounded-xl border border-stone-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        updateProduct(editingProduct.id, {
                          price: editingProduct.price,
                          stock: editingProduct.stock,
                        });
                        setEditingProduct(null);
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: CONTROL DE INSUMOS (MATERIA PRIMA / AMASIJO) */}
      {activeModule === 'insumos' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Control de Insumos y Materias Primas
              </h2>
              <p className="text-xs text-stone-500">
                Almacén central, harina, manteca, levaduras, azúcar y empaques
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddInsumoModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Nuevo Insumo</span>
              </button>
            </div>
          </div>

          {/* Search Insumos */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={insumoSearch}
              onChange={(e) => setInsumoSearch(e.target.value)}
              placeholder="Buscar insumo (harina, levadura, azúcar...)"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-900"
            />
          </div>

          {/* Insumos Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="p-3 font-semibold">Código</th>
                  <th className="p-3 font-semibold">Insumo</th>
                  <th className="p-3 font-semibold text-right">Stock Actual</th>
                  <th className="p-3 font-semibold text-right">Mínimo</th>
                  <th className="p-3 font-semibold">Estado</th>
                  <th className="p-3 font-semibold text-right">Costo Unit.</th>
                  <th className="p-3 font-semibold text-center">Movimientos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {insumos
                  .filter((ins) =>
                    ins.name.toLowerCase().includes(insumoSearch.toLowerCase()) ||
                    ins.code.toLowerCase().includes(insumoSearch.toLowerCase())
                  )
                  .map((ins) => {
                    const isCritical = ins.currentStock < ins.minStock;
                    const isWarning =
                      ins.currentStock >= ins.minStock && ins.currentStock <= ins.minStock * 1.25;

                    return (
                      <tr key={ins.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono-nums font-bold text-stone-900">{ins.code}</td>
                        <td className="p-3 font-bold text-stone-800">{ins.name}</td>
                        <td className="p-3 font-mono-nums font-black text-right text-stone-900">
                          {ins.currentStock} {ins.unit}
                        </td>
                        <td className="p-3 font-mono-nums text-stone-500 text-right">
                          {ins.minStock} {ins.unit}
                        </td>
                        <td className="p-3">
                          {isCritical ? (
                            <span className="flex items-center gap-1 font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md text-[11px] w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              Crítico
                            </span>
                          ) : isWarning ? (
                            <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                              Bajo
                            </span>
                          ) : (
                            <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                              Óptimo
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono-nums text-right text-stone-700">
                          ${ins.costPerUnit.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() =>
                                setStockAdjustmentModal({ insumo: ins, isEntry: true })
                              }
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs cursor-pointer"
                              title="Registrar entrada de proveedor"
                            >
                              + Entrada
                            </button>
                            <button
                              onClick={() =>
                                setStockAdjustmentModal({ insumo: ins, isEntry: false })
                              }
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-xs cursor-pointer"
                              title="Salida a amasijo"
                            >
                              - Salida
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Modal Adjust Stock */}
          {stockAdjustmentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
                <h3 className="font-bold text-base text-stone-900 font-display mb-1">
                  {stockAdjustmentModal.isEntry ? 'Entrada de Mercancía' : 'Salida al Amasijo'}
                </h3>
                <p className="text-xs text-stone-500 mb-3 font-semibold">
                  {stockAdjustmentModal.insumo.name}
                </p>
                <form onSubmit={handleApplyStockAdjustment} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Cantidad en {stockAdjustmentModal.insumo.unit}:
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={adjustQty}
                      onChange={(e) => setAdjustQty(e.target.value)}
                      placeholder="Ej. 5"
                      className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums text-base font-bold text-stone-900"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStockAdjustmentModal(null)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 py-2.5 rounded-xl font-bold text-white ${
                        stockAdjustmentModal.isEntry
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-stone-800 hover:bg-stone-900'
                      }`}
                    >
                      Confirmar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Add Insumo */}
          {showAddInsumoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
                <h3 className="font-bold text-lg text-stone-900 font-display mb-3">
                  Registrar Materia Prima o Insumo
                </h3>
                <form onSubmit={handleCreateInsumo} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nombre del Insumo:</label>
                    <input
                      type="text"
                      value={newInsName}
                      onChange={(e) => setNewInsName(e.target.value)}
                      placeholder="Ej. Vainilla Líquida Concentrada (Galón)"
                      className="w-full p-2.5 rounded-xl border border-stone-300"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Código:</label>
                      <input
                        type="text"
                        value={newInsCode}
                        onChange={(e) => setNewInsCode(e.target.value)}
                        placeholder="INS-10"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Unidad de Medida:</label>
                      <input
                        type="text"
                        value={newInsUnit}
                        onChange={(e) => setNewInsUnit(e.target.value)}
                        placeholder="bultos, cajas, kg, galones"
                        className="w-full p-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Stock Inicial:</label>
                      <input
                        type="number"
                        value={newInsStock}
                        onChange={(e) => setNewInsStock(e.target.value)}
                        placeholder="10"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Stock Mínimo:</label>
                      <input
                        type="number"
                        value={newInsMin}
                        onChange={(e) => setNewInsMin(e.target.value)}
                        placeholder="5"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Costo Unitario:</label>
                      <input
                        type="number"
                        value={newInsCost}
                        onChange={(e) => setNewInsCost(e.target.value)}
                        placeholder="650"
                        className="w-full p-2.5 rounded-xl border border-stone-300 font-mono-nums"
                      />
                    </div>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddInsumoModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-300 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                    >
                      Guardar Insumo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 4: ARQUEOS Y CORTES */}
      {activeModule === 'cortes' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-6 space-y-4">
          <div className="pb-3 border-b border-stone-200">
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Historial de Arqueos y Cortes de Caja
            </h2>
            <p className="text-xs text-stone-500">
              Registros de cierres de turno y conciliación física de efectivo
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="p-3 font-semibold">Fecha y Hora</th>
                  <th className="p-3 font-semibold">Cajera</th>
                  <th className="p-3 font-semibold text-right">Venta Total</th>
                  <th className="p-3 font-semibold text-right">Efectivo Cobrado</th>
                  <th className="p-3 font-semibold text-right">Esperado Gaveta</th>
                  <th className="p-3 font-semibold text-right">Contado Gaveta</th>
                  <th className="p-3 font-semibold text-right">Diferencia</th>
                  <th className="p-3 font-semibold">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {cashCuts.map((cut) => {
                  const diff = cut.actualInDrawer - cut.expectedInDrawer;
                  return (
                    <tr key={cut.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono-nums font-bold text-stone-800">{cut.timestamp}</td>
                      <td className="p-3 text-stone-800">{cut.cajeraName}</td>
                      <td className="p-3 font-mono-nums font-bold text-amber-800 text-right">
                        ${cut.totalSales.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono-nums text-stone-700 text-right">
                        ${cut.cashSales.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono-nums text-stone-700 text-right">
                        ${cut.expectedInDrawer.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono-nums font-bold text-stone-900 text-right">
                        ${cut.actualInDrawer.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono-nums font-bold text-right">
                        <span
                          className={
                            diff === 0
                              ? 'text-emerald-700'
                              : diff > 0
                              ? 'text-emerald-600'
                              : 'text-red-700'
                          }
                        >
                          {diff >= 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`}
                        </span>
                      </td>
                      <td className="p-3 text-stone-500 text-xs">{cut.notes || 'Sin novedad'}</td>
                    </tr>
                  );
                })}
                {cashCuts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400">
                      No se han registrado cortes de caja en esta sesión aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
