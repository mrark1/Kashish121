export interface PriceHistoryEntry {
  timestamp: string;
  oldBuyPrice: number;
  newBuyPrice: number;
  oldSellPrice: number;
  newSellPrice: number;
  user: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  buyPrice: number;
  sellPrice: number;
  description: string;
  isDeleted: boolean;
  history: PriceHistoryEntry[];
  lastUpdated: string;
  status: 'ACTIVE' | 'DRAFT';
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  timestamp: string;
  items: SaleItem[];
  total: number;
  profit: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI';
}

export enum AppRoute {
  LOGIN = '/login',
  FORGOT_PASSWORD = '/forgot-password',
  DASHBOARD = '/',
  INVENTORY = '/inventory',
  POS = '/pos',
  REPORTS = '/reports',
  RECYCLE_BIN = '/recycle-bin',
  PUBLIC_PRICES = '/public-prices'
}

export type UserRole = 'OWNER' | 'PUBLIC';

export interface User {
  username: string;
  role: UserRole;
}
