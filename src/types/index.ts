export type CollectionCategory =
  | 'Everyday Cotton'
  | 'Traditional Wear'
  | 'Festive Collection'
  | 'Contemporary Designs'
  | 'New Arrivals';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Product {
  id: string;
  name: string;
  tamil: string;
  subtitle: string;
  category: string;
  collectionCategory: CollectionCategory;
  price: string;
  priceNumber: number;
  originalPrice?: string;
  image: string;
  secondaryImage?: string;
  color: string;
  stock: string;
  stockStatus: StockStatus;
  sizes: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  salesCount?: number;
  description: string;
  fabric: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  tamilName?: string;
  slug: string;
  description: string;
  signatureFabrics?: string[];
  isVisible?: boolean;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'store_manager' | 'editor';
  lastLogin?: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

export interface StoreSettings {
  storeName: string;
  brandTagline: string;
  whatsAppPhone: string;
  whatsAppRawNumber: string;
  currencySymbol: string;
  notificationEmail: string;
}
