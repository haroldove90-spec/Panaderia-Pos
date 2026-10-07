import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderTicket, PaymentMethod } from '../../types';
import { BarcodeVisual } from '../common/BarcodeVisual';
import {
  ScanLine,
  Camera,
  Search,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Wallet,
  ArrowRight,
  Printer,
  History,
  AlertCircle,
  Wheat,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CajeroModule: React.FC = () => {
  const {
    pendingTickets,
    paidTickets,
    payTicket,
    activeModule,
    setActiveModule,
    cashCuts,
    createCashCut,
  } = useApp();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<OrderTicket | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [lastPaidReceipt, setLastPaidReceipt] = useState<OrderTicket | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Cash cut state
  const [cajeraNameCut, setCajeraNameCut] = useState('Carmen V. (Caja 1)');
  const [actualCashCut, setActualCashCut] = useState('');
  const [cutNotes, setCutNotes] = useState('');
  const [cutResultModal, setCutResultModal] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Auto focus barcode input for quick scanning
  useEffect(() => {
    if (activeModule === 'escaner' && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [activeModule]);

  // Set default received amount when ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      setReceivedAmount(selectedTicket.total.toString());
      setPaymentError(null);
    }
  }, [selectedTicket]);

  // Handle Barcode / Folio submission
  const handleBarcodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = barcodeInput.trim();
    if (!query) return;

    // Search in pending tickets
    const clean = query.toUpperCase();
    const found = pendingTickets.find(
      (t) =>
        t.folio.toUpperCase() === clean ||
        t.folio.replace('TK-', '') === clean.replace('TK-', '')
    );

    if (found) {
      setSelectedTicket(found);
      setBarcodeInput('');
      setPaymentError(null);
    } else {
      // Check if already paid
      const alreadyPaid = paidTickets.find(
        (t) =>
          t.folio.toUpperCase() === clean ||
          t.folio.replace('TK-', '') === clean.replace('TK-', '')
      );
      if (alreadyPaid) {
        setPaymentError(`El ticket ${alreadyPaid.folio} ya fue cobrado previamente.`);
      } else {
        setPaymentError(`No se encontró ticket pendiente con folio "${query}".`);
      }
    }
  };

  // Camera scanner handling
  const startCamera = async () => {
    setCameraActive(true);
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Cámara no compatible con este navegador.');
      }
    } catch (err) {
      setCameraError('Permiso de cámara denegado o dispositivo sin cámara.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  const handleSimulateScan = (ticket: OrderTicket) => {
    stopCamera();
    setSelectedTicket(ticket);
    setPaymentError(null);
  };

  // Payment Calculation
  const parsedReceived = parseFloat(receivedAmount) || 0;
  const ticketTotal = selectedTicket ? selectedTicket.total : 0;
  const changeDue = Math.max(0, parsedReceived - ticketTotal);
  const isAmountSufficient =
    paymentMethod !== 'efectivo' || parsedReceived >= ticketTotal;

  const handleCompleteSale = () => {
    if (!selectedTicket) return;
    const finalAmount =
      paymentMethod === 'efectivo' ? parsedReceived : selectedTicket.total;

    const result = payTicket(
      selectedTicket.id,
      paymentMethod,
      finalAmount,
      'Carmen V. (Caja 1)'
    );

    if (result.success && result.ticket) {
      setLastPaidReceipt(result.ticket);
      setSelectedTicket(null);
      setReceivedAmount('');
      setPaymentError(null);
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    } else if (result.error) {
      setPaymentError(result.error);
    }
  };

  // Perform cut
  const handlePerformCut = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseFloat(actualCashCut) || 0;
    const cut = createCashCut(cajeraNameCut, count, cutNotes);
    setCutResultModal(cut);
    setActualCashCut('');
    setCutNotes('');
  };

  // RENDER: Paid Tickets Tab
  if (activeModule === 'pagos_cajera') {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-6 pb-20 lg:pb-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">Tickets Cobrados del Turno</h2>
            <p className="text-xs text-stone-500">Historial completo de ventas registradas en caja</p>
          </div>
          <button
            onClick={() => setActiveModule('escaner')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 cursor-pointer"
          >
            Volver a Escaneo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <th className="p-3 font-semibold">Folio</th>
                <th className="p-3 font-semibold">Hora Cobro</th>
                <th className="p-3 font-semibold">Mostrador</th>
                <th className="p-3 font-semibold">Piezas</th>
                <th className="p-3 font-semibold">Método</th>
                <th className="p-3 font-semibold text-right">Total</th>
                <th className="p-3 font-semibold text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paidTickets.map((tk) => (
                <tr key={tk.id} className="hover:bg-stone-50/80">
                  <td className="p-3 font-mono-nums font-bold text-stone-900">{tk.folio}</td>
                  <td className="p-3 font-mono-nums text-stone-600">{tk.paidAt || tk.timestamp}</td>
                  <td className="p-3 text-stone-700">{tk.counterId}</td>
                  <td className="p-3 font-mono-nums text-stone-700">{tk.totalPieces} pzas</td>
                  <td className="p-3 capitalize">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-100 text-stone-800">
                      {tk.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 font-mono-nums font-bold text-amber-800 text-right">
                    ${tk.total.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setLastPaidReceipt(tk)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                    >
                      Ver Recibo
                    </button>
                  </td>
                </tr>
              ))}
              {paidTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No hay ventas registradas aún en este turno.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // RENDER: Cash Cut Tab
  if (activeModule === 'corte_caja') {
    const cashSalesTotal = paidTickets
      .filter((t) => t.paymentMethod === 'efectivo')
      .reduce((a, b) => a + b.total, 0);
    const cardSalesTotal = paidTickets
      .filter((t) => t.paymentMethod === 'tarjeta')
      .reduce((a, b) => a + b.total, 0);
    const voucherSalesTotal = paidTickets
      .filter((t) => t.paymentMethod === 'vales')
      .reduce((a, b) => a + b.total, 0);
    const grandTotal = cashSalesTotal + cardSalesTotal + voucherSalesTotal;
    const initialCash = 1000.00;
    const expectedDrawerCash = initialCash + cashSalesTotal;

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-6 pb-20 lg:pb-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">Arqueo y Corte de Caja</h2>
            <p className="text-xs text-stone-500">Cierre de turno y verificación de efectivo en gaveta</p>
          </div>
          <button
            onClick={() => setActiveModule('escaner')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 cursor-pointer"
          >
            Volver a Cobro
          </button>
        </div>

        {/* Current Shift Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] text-stone-500 font-medium">Fondo Inicial:</span>
            <div className="text-base font-black font-mono-nums text-stone-900">${initialCash.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] text-emerald-800 font-medium">Efectivo Cobrado:</span>
            <div className="text-base font-black font-mono-nums text-emerald-900">${cashSalesTotal.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-[11px] text-blue-800 font-medium">Tarjetas:</span>
            <div className="text-base font-black font-mono-nums text-blue-900">${cardSalesTotal.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] text-amber-800 font-medium">Vales:</span>
            <div className="text-base font-black font-mono-nums text-amber-900">${voucherSalesTotal.toFixed(2)}</div>
          </div>
        </div>

        {/* Expected drawer cash */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-900 font-bold uppercase tracking-wider">Efectivo Esperado en Gaveta</div>
            <div className="text-xs text-amber-700">Fondo inicial ($1,000) + Ventas en efectivo</div>
          </div>
          <div className="text-2xl font-black font-mono-nums text-amber-800">
            ${expectedDrawerCash.toFixed(2)}
          </div>
        </div>

        {/* Cut Form */}
        <form onSubmit={handlePerformCut} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Nombre de Cajera:</label>
            <input
              type="text"
              value={cajeraNameCut}
              onChange={(e) => setCajeraNameCut(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Efectivo Físico Contado en Gaveta ($MXN):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500">$</span>
              <input
                type="number"
                step="0.50"
                min="0"
                value={actualCashCut}
                onChange={(e) => setActualCashCut(e.target.value)}
                placeholder={expectedDrawerCash.toString()}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 text-base font-mono-nums font-bold text-stone-900"
                required
              />
            </div>
            {actualCashCut && (
              <div className="mt-1.5 text-xs font-mono-nums">
                Diferencia:{' '}
                {parseFloat(actualCashCut) - expectedDrawerCash === 0 ? (
                  <span className="font-bold text-emerald-700">Exacto ($0.00)</span>
                ) : parseFloat(actualCashCut) - expectedDrawerCash > 0 ? (
                  <span className="font-bold text-emerald-700">
                    Sobrante: +${(parseFloat(actualCashCut) - expectedDrawerCash).toFixed(2)}
                  </span>
                ) : (
                  <span className="font-bold text-red-700">
                    Faltante: -${Math.abs(parseFloat(actualCashCut) - expectedDrawerCash).toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Notas u Observaciones:</label>
            <textarea
              rows={2}
              value={cutNotes}
              onChange={(e) => setCutNotes(e.target.value)}
              placeholder="Ej. Cambio de billete falso detectado, retiro parcial de fondo..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm cursor-pointer shadow-sm transition-colors"
          >
            Registrar Corte de Turno
          </button>
        </form>

        {/* Cut Result Modal */}
        {cutResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900">
              <div className="text-center pb-3 border-b border-stone-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg text-stone-900">Corte de Caja Registrado</h3>
                <p className="text-xs text-stone-500 font-mono-nums">{cutResultModal.timestamp}</p>
              </div>
              <div className="py-4 space-y-2 text-xs font-mono-nums">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Ventas Turno:</span>
                  <span className="font-bold text-stone-900">${cutResultModal.totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Esperado en Gaveta:</span>
                  <span className="font-bold text-stone-900">${cutResultModal.expectedInDrawer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Contado Físicamente:</span>
                  <span className="font-bold text-stone-900">${cutResultModal.actualInDrawer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 font-bold">
                  <span>Diferencia:</span>
                  <span className={cutResultModal.actualInDrawer - cutResultModal.expectedInDrawer >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                    ${(cutResultModal.actualInDrawer - cutResultModal.expectedInDrawer).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCutResultModal(null)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT VIEW: Escáner y Cobro
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 pb-20 lg:pb-4">
      {/* LEFT SECTION: Escáner de Recibos y Cola de Tickets Pendientes */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-[#562914]/20 shadow-xs overflow-hidden">
        {/* Scanner Barcode Search Header */}
        <div className="p-4 border-b border-[#562914]/15 bg-[#FCF1D5]/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#562914] text-white flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-[#C58847]" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-[#562914] font-display">
                  Escáner de Recibos de Compra
                </h2>
                <p className="text-xs text-stone-500">
                  Digita el folio, usa pistola lectora o activa la cámara
                </p>
              </div>
            </div>

            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs ${
                cameraActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-white border border-[#562914]/20 text-[#562914] hover:bg-[#FCF1D5]'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#C58847]" />
              <span>{cameraActive ? 'Apagar Cámara' : 'Escanear con Cámara'}</span>
            </button>
          </div>

          {/* Barcode Search Form */}
          <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <ScanLine className="w-4 h-4 text-[#C58847] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Escanea código de barras o escribe ej: TK-4820"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#562914]/20 bg-white text-sm text-[#000000] font-mono-nums placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C58847] focus:border-[#C58847] uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#562914] hover:bg-[#C58847] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Buscar Folio
            </button>
          </form>

          {/* Camera Viewport (if active) */}
          {cameraActive && (
            <div className="relative w-full max-w-sm mx-auto h-48 bg-stone-900 rounded-xl overflow-hidden border-2 border-emerald-500 flex flex-col items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-red-500 animate-pulse shadow-sm" />
              <div className="absolute bottom-2 bg-black/70 text-white text-[11px] px-2.5 py-1 rounded-full">
                Apunta al código de barras del ticket
              </div>
              {cameraError && (
                <div className="absolute inset-0 bg-stone-900/90 text-white p-4 flex flex-col items-center justify-center text-center text-xs">
                  <AlertCircle className="w-6 h-6 text-amber-400 mb-2" />
                  <p>{cameraError}</p>
                  <p className="text-stone-400 text-[11px] mt-1">
                    Puedes hacer clic en cualquiera de los tickets pendientes abajo para simular el escaneo instantáneo.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error notification */}
          {paymentError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{paymentError}</span>
            </div>
          )}
        </div>

        {/* Live Pending Tickets Queue from Vendedores */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Tickets Pendientes de Cobro ({pendingTickets.length})
            </span>
            <span className="text-[11px] text-stone-600">
              Clic para cargar ticket
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {pendingTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => handleSimulateScan(ticket)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-200'
                      : 'border-stone-200 hover:border-emerald-400 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono-nums font-black text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                      {ticket.folio}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-mono-nums">
                      <Clock className="w-3 h-3" />
                      {ticket.timestamp}
                    </span>
                  </div>

                  <div className="text-xs text-stone-700 font-medium truncate mb-2">
                    {ticket.vendedorName}
                  </div>

                  {/* Summary of items */}
                  <div className="text-xs text-stone-500 space-y-0.5 line-clamp-2">
                    {ticket.items.map((it, idx) => (
                      <span key={idx}>
                        {it.quantity}x {it.name}
                        {idx < ticket.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">
                      {ticket.totalPieces} piezas
                    </span>
                    <span className="font-mono-nums font-black text-base text-emerald-800">
                      ${ticket.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {pendingTickets.length === 0 && (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-stone-500 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
              <p className="text-sm font-bold text-stone-800">No hay tickets pendientes</p>
              <p className="text-xs text-stone-500 mt-1">
                Cuando los vendedores de mostrador emitan tickets de pan, aparecerán aquí para cobro inmediato.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Panel de Cobro y Registro de Venta */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden shrink-0">
        <div className="p-3.5 sm:p-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 font-display">
                Registro de Venta
              </h3>
              <p className="text-xs text-stone-500">Caja Central Mostrador</p>
            </div>
          </div>

          {selectedTicket && (
            <button
              onClick={() => setSelectedTicket(null)}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Selected Ticket Details */}
        <div className="p-3.5 sm:p-4 flex-1 overflow-y-auto space-y-4">
          {!selectedTicket ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-stone-500 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
              <ScanLine className="w-8 h-8 text-stone-400 mb-2" />
              <p className="text-xs sm:text-sm font-medium text-stone-700">Ningún ticket seleccionado</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Escanea o selecciona un ticket pendiente a la izquierda para procesar el pago.
              </p>
            </div>
          ) : (
            <>
              {/* Ticket Breakdown Card */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 font-mono-nums">
                  <span className="font-black text-sm text-stone-900">{selectedTicket.folio}</span>
                  <span className="text-xs text-stone-500">{selectedTicket.counterId}</span>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto text-xs">
                  {selectedTicket.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-stone-700">
                      <span>
                        <span className="font-mono-nums font-bold text-emerald-800">{it.quantity}x</span>{' '}
                        {it.name}
                      </span>
                      <span className="font-mono-nums text-stone-900 font-semibold">
                        ${it.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-stone-600">Total a Pagar:</span>
                  <span className="font-mono-nums text-2xl font-black text-emerald-700">
                    ${selectedTicket.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                  Método de Pago:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('efectivo');
                      setReceivedAmount(selectedTicket.total.toString());
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      paymentMethod === 'efectivo'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    <span>Efectivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      paymentMethod === 'tarjeta'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-700" />
                    <span>Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vales')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      paymentMethod === 'vales'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-amber-700" />
                    <span>Vales Despensa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      paymentMethod === 'transferencia'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 text-purple-700" />
                    <span>SPEI / Transf.</span>
                  </button>
                </div>
              </div>

              {/* Cash Denominations and Change calculation */}
              {paymentMethod === 'efectivo' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-bold text-stone-700">Monto Recibido ($MXN):</label>
                    <button
                      type="button"
                      onClick={() => setReceivedAmount(selectedTicket.total.toString())}
                      className="text-xs text-emerald-700 font-bold hover:underline"
                    >
                      Exacto (${selectedTicket.total.toFixed(2)})
                    </button>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-500">$</span>
                    <input
                      type="number"
                      step="0.50"
                      min={selectedTicket.total}
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 font-mono-nums font-black text-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Mexican Bill Shortcuts */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[50, 100, 200, 500].map((bill) => (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => setReceivedAmount(bill.toString())}
                        className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-emerald-50 hover:border-emerald-400 text-xs font-mono-nums font-bold text-stone-800 cursor-pointer"
                      >
                        ${bill}
                      </button>
                    ))}
                  </div>

                  {/* Change / Feria */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">Cambio a Entregar:</span>
                    <span className="font-mono-nums text-xl font-black text-emerald-800">
                      ${changeDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Complete Sale Button */}
              <button
                type="button"
                onClick={handleCompleteSale}
                disabled={!isAmountSufficient}
                className={`w-full py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isAmountSufficient
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Registrar Venta y Cobrar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* MODAL: Ticket de Venta Sellado con Logo Completo */}
      {lastPaidReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#562914]/20 text-[#000000] animate-in fade-in zoom-in-95 duration-150 relative">
            {/* Stamp "PAGADO" */}
            <div className="absolute top-6 right-6 border-2 border-emerald-600 text-emerald-700 font-black text-xs px-2.5 py-1 rounded-md rotate-12 uppercase tracking-widest pointer-events-none bg-emerald-50">
              PAGADO
            </div>

            <div className="text-center pb-3 border-b border-dashed border-stone-300">
              <img
                src="https://appdesignproyectos.com/panaderialogo.png"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/panaderialogo.png';
                }}
                alt="Logo Panadería"
                className="h-12 w-auto object-contain mx-auto mb-2"
              />
              <p className="text-xs text-stone-500 font-semibold">Comprobante de Venta y Pago</p>
              <div className="mt-1 text-xs font-mono-nums font-bold text-[#562914]">
                FOLIO: {lastPaidReceipt.folio}
              </div>
            </div>

            {/* Meta */}
            <div className="py-2 text-xs text-stone-600 border-b border-stone-200 space-y-0.5 font-mono-nums">
              <div className="flex justify-between">
                <span>Caja: {lastPaidReceipt.cajeraName || 'Caja 1'}</span>
                <span>Hora: {lastPaidReceipt.paidAt || lastPaidReceipt.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span>Despacho: {lastPaidReceipt.counterId}</span>
                <span className="capitalize">Método: {lastPaidReceipt.paymentMethod}</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="py-3 space-y-1.5 max-h-40 overflow-y-auto border-b border-dashed border-stone-300 text-xs">
              {lastPaidReceipt.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    <span className="font-mono-nums font-bold text-[#C58847]">{it.quantity}x</span> {it.name}
                  </span>
                  <span className="font-mono-nums font-semibold">${it.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals & Change */}
            <div className="py-3 space-y-1 text-xs border-b border-stone-200 font-mono-nums">
              <div className="flex justify-between font-bold text-sm text-[#562914]">
                <span>TOTAL:</span>
                <span>${lastPaidReceipt.total.toFixed(2)}</span>
              </div>
              {lastPaidReceipt.paymentMethod === 'efectivo' && (
                <>
                  <div className="flex justify-between text-stone-600">
                    <span>Recibido:</span>
                    <span>${(lastPaidReceipt.amountReceived || lastPaidReceipt.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-800">
                    <span>Cambio:</span>
                    <span>${(lastPaidReceipt.changeGiven || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <p className="text-[10px] text-center text-stone-500 my-3">
              ¡Gracias por su preferencia! Pan horneado diariamente.
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl border border-[#562914]/25 hover:bg-[#FCF1D5]/40 text-[#562914] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-[#C58847]" />
                <span>Imprimir Ticket Pagado</span>
              </button>
              <button
                onClick={() => setLastPaidReceipt(null)}
                className="w-full py-2.5 rounded-xl bg-[#562914] hover:bg-[#C58847] text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Cobrar Siguiente Recibo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
