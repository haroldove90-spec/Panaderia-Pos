export type UserRole = 'admin' | 'vendedor' | 'cajera';

export interface ProductCategory {
  id: string;
  name: string;
  colorClass: string;
  bgLightClass: string;
  icon: string;
}

export interface BakeryProduct {
  id: string;
  code: string;
  name: string;
  category: 'pan_dulce' | 'pan_blanco' | 'pasteleria' | 'gelatinas' | 'cafeteria' | 'galletas';
  price: number;
  stock: number;
  bakedToday: number;
  wasteYesterday: number;
  unit: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  popular?: boolean;
}

export interface Insumo {
  id: string;
  code: string;
  name: string;
  category: 'harinas' | 'endulzantes' | 'lacteos_grasas' | 'levaduras' | 'chocolates_frutas' | 'empaques';
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  lastRestock: string;
}

export interface TicketItem {
  productId: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type TicketStatus = 'pendiente' | 'cobrado' | 'cancelado';

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'vales' | 'transferencia';

export interface OrderTicket {
  id: string;
  folio: string; // e.g. TK-4821
  timestamp: string;
  vendedorId: string;
  vendedorName: string;
  counterId: string; // e.g. Mostrador 2
  items: TicketItem[];
  totalPieces: number;
  total: number;
  status: TicketStatus;
  paidAt?: string;
  cajeraId?: string;
  cajeraName?: string;
  paymentMethod?: PaymentMethod;
  amountReceived?: number;
  changeGiven?: number;
}

export interface CashRegisterCut {
  id: string;
  timestamp: string;
  cajeraName: string;
  initialCash: number;
  totalSales: number;
  cashSales: number;
  cardSales: number;
  voucherSales: number;
  expectedInDrawer: number;
  actualInDrawer: number;
  notes?: string;
}
