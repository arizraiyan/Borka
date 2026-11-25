import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  FREE_SHIPPING_THRESHOLD_BDT,
  STANDARD_SHIPPING_BDT,
} from '../lib/currency';
import type {
  CartItem,
  CurrencyCode,
  LanguageCode,
  Order,
  Product,
  ProductColor,
} from '../types';

const STORAGE_CART = 'qasida_cart_v1';
const STORAGE_WISHLIST = 'qasida_wishlist_v1';
const STORAGE_RECENT = 'qasida_recent_v1';
const STORAGE_ORDERS = 'qasida_orders_v1';
const STORAGE_CURRENCY = 'qasida_currency_v1';
const STORAGE_LANG = 'qasida_lang_v1';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  subtotalBdt: number;
  shippingBdt: number;
  totalBdt: number;
  wishlist: string[];
  recentlyViewed: string[];
  orderHistory: Order[];
  currency: CurrencyCode;
  language: LanguageCode;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  quickViewProductId: string | null;
  lastPlacedOrder: Order | null;
  toasts: ToastMessage[];
  setCurrency: (c: CurrencyCode) => void;
  setLanguage: (l: LanguageCode) => void;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
  addToCart: (
    product: Product,
    options?: {
      color?: ProductColor;
      size?: string;
      quantity?: number;
      openDrawer?: boolean;
    }
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItemVariant: (
    cartItemId: string,
    updates: { color?: ProductColor; size?: string }
  ) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, productName?: string) => void;
  isWishlisted: (productId: string) => boolean;
  trackRecentlyViewed: (productId: string) => void;
  recordOrder: (order: Order) => void;
  setLastPlacedOrder: (order: Order | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => safeReadStorage(STORAGE_CART, []));
  const [wishlist, setWishlist] = useState<string[]>(() => safeReadStorage(STORAGE_WISHLIST, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    safeReadStorage(STORAGE_RECENT, [])
  );
  const [orderHistory, setOrderHistory] = useState<Order[]>(() =>
    safeReadStorage(STORAGE_ORDERS, [])
  );
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = safeReadStorage<string>(STORAGE_CURRENCY, 'BDT');
    return saved === 'BDT' ? 'BDT' : 'BDT';
  });
  const [language, setLanguageState] = useState<LanguageCode>(() =>
    safeReadStorage(STORAGE_LANG, 'en')
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RECENT, JSON.stringify(recentlyViewed));
    } catch {
      // ignore
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orderHistory));
    } catch {
      // ignore
    }
  }, [orderHistory]);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_CURRENCY, JSON.stringify(c));
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = useCallback((l: LanguageCode) => {
    setLanguageState(l);
    try {
      localStorage.setItem(STORAGE_LANG, JSON.stringify(l));
    } catch {
      // ignore
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'error' = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      setTimeout(() => {
        dismissToast(id);
      }, 3400);
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    (
      product: Product,
      options?: {
        color?: ProductColor;
        size?: string;
        quantity?: number;
        openDrawer?: boolean;
      }
    ) => {
      if (!product.inStock) {
        showToast('This piece is currently out of stock.', 'info');
        return;
      }
      const chosenColor = options?.color ?? product.colors[0];
      const chosenSize = options?.size ?? product.sizes[Math.min(2, product.sizes.length - 1)] ?? product.sizes[0];
      const qty = Math.max(1, options?.quantity ?? 1);
      const itemKey = `${product.id}::${chosenColor.name}::${chosenSize}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((i) => i.cartItemId === itemKey);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          };
          return updated;
        }
        return [
          ...prev,
          {
            cartItemId: itemKey,
            productId: product.id,
            sku: product.sku,
            name: product.name,
            image: product.images[0],
            price: product.price,
            originalPrice: product.originalPrice,
            selectedColor: chosenColor,
            selectedSize: chosenSize,
            availableColors: product.colors,
            availableSizes: product.sizes,
            quantity: qty,
          },
        ];
      });

      showToast(`Added ${product.name} (Size ${chosenSize}) to your bag.`);
      if (options?.openDrawer !== false) {
        setIsCartOpen(true);
      }
    },
    [showToast]
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.min(20, quantity) } : item
      )
    );
  }, []);

  const updateCartItemVariant = useCallback(
    (cartItemId: string, updates: { color?: ProductColor; size?: string }) => {
      setCart((prev) => {
        const target = prev.find((i) => i.cartItemId === cartItemId);
        if (!target) return prev;
        const nextColor = updates.color ?? target.selectedColor;
        const nextSize = updates.size ?? target.selectedSize;
        const nextId = `${target.productId}::${nextColor.name}::${nextSize}`;
        if (nextId === cartItemId) return prev;

        const existingMatch = prev.find((i) => i.cartItemId === nextId);
        if (existingMatch) {
          return prev
            .filter((i) => i.cartItemId !== cartItemId)
            .map((i) =>
              i.cartItemId === nextId
                ? { ...i, quantity: Math.min(20, i.quantity + target.quantity) }
                : i
            );
        }

        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? {
                ...i,
                cartItemId: nextId,
                selectedColor: nextColor,
                selectedSize: nextSize,
              }
            : i
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string, productName?: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast(
            productName ? `Removed ${productName} from wishlist.` : 'Removed from wishlist.',
            'info'
          );
          return prev.filter((id) => id !== productId);
        }
        showToast(
          productName ? `Saved ${productName} to wishlist.` : 'Saved to wishlist.',
          'success'
        );
        return [productId, ...prev];
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const trackRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
  }, []);

  const recordOrder = useCallback((order: Order) => {
    setLastPlacedOrder(order);
    setOrderHistory((prev) => [order, ...prev]);
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotalBdt = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const shippingBdt = useMemo(() => {
    if (cart.length === 0) return 0;
    return subtotalBdt >= FREE_SHIPPING_THRESHOLD_BDT ? 0 : STANDARD_SHIPPING_BDT;
  }, [cart.length, subtotalBdt]);

  const totalBdt = subtotalBdt + shippingBdt;

  const value: StoreContextValue = {
    cart,
    cartCount,
    subtotalBdt,
    shippingBdt,
    totalBdt,
    wishlist,
    recentlyViewed,
    orderHistory,
    currency,
    language,
    isCartOpen,
    isSearchOpen,
    quickViewProductId,
    lastPlacedOrder,
    toasts,
    setCurrency,
    setLanguage,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
    openQuickView: (id) => setQuickViewProductId(id),
    closeQuickView: () => setQuickViewProductId(null),
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartItemVariant,
    clearCart,
    toggleWishlist,
    isWishlisted,
    trackRecentlyViewed,
    recordOrder,
    setLastPlacedOrder,
    showToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
