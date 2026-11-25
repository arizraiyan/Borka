export type AbayaCategorySlug =
  | 'black-abayas'
  | 'open-abayas'
  | 'embroidered-abayas'
  | 'luxury-abayas'
  | 'plain-abayas'
  | 'stone-abayas';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  subtitle: string;
  category: string;
  categorySlug: AbayaCategorySlug;
  price: number; // Base price in BDT
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  description: string;
  fabric: string;
  materialDetails: string[];
  careInstructions: string;
  colors: ProductColor[];
  sizes: string[];
  stock: number;
  inStock: boolean;
  isNewArrival: boolean;
  isLuxury: boolean;
  popularity: number;
  rating: number;
  reviewCount: number;
  includesShayla: boolean;
  createdAt: string;
}

export interface Category {
  slug: AbayaCategorySlug;
  name: string;
  nameAr: string;
  description: string;
  image: string;
  count?: number;
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  date: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  selectedColor: ProductColor;
  selectedSize: string;
  availableColors: ProductColor[];
  availableSizes: string[];
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  city: string;
  area: string;
  address: string;
  notes?: string;
}

export interface OrderLineItem {
  productId: string;
  sku: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type PaymentMethod = 'cod' | 'manual_transfer';

export interface Order {
  orderId: string;
  createdAt: string;
  status: 'Confirmed' | 'Preparing Shipment';
  paymentMethod: PaymentMethod;
  customer: OrderCustomer;
  items: OrderLineItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
}

export type CurrencyCode = 'BDT';
export type LanguageCode = 'en' | 'ar';
