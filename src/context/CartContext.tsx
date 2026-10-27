'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';

export interface CartItem {
  id: string;
  title: string;
  /** so'm/p.m. | null = narx noma'lum */
  price: number | null;
  quantity: number;
  imgSrc: string;
  unit: string;
  sku?: string;
  katalog?: string;
  olcham?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'elit_dekor_cart_v3';
const CHANGE_EVENT = 'elit-cart-change';
const EMPTY: CartItem[] = [];

let cacheRaw = '__unset__';
let cache: CartItem[] = EMPTY;

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return EMPTY;
    const items = data.filter(
      (i): i is CartItem =>
        Boolean(i) &&
        typeof (i as CartItem).id === 'string' &&
        typeof (i as CartItem).title === 'string' &&
        typeof (i as CartItem).quantity === 'number' &&
        (i as CartItem).quantity > 0
    );
    return items.length ? items : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartItem[] {
  if (typeof window === 'undefined') return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const key = raw ?? '';
  if (key === cacheRaw) return cache;
  cacheRaw = key;
  cache = parseCart(raw);
  return cache;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function subscribe(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

function writeCart(items: CartItem[]): void {
  cache = items.length ? items : EMPTY;
  cacheRaw = items.length ? JSON.stringify(items) : '';
  try {
    if (items.length) window.localStorage.setItem(STORAGE_KEY, cacheRaw);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage blocked — in-memory cache still works for this tab
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function mutate(updater: (prev: CartItem[]) => CartItem[]): void {
  writeCart(updater(getSnapshot()));
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((newItem: CartItem) => {
    const qty = Math.max(1, Math.round(newItem.quantity) || 1);
    mutate((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, ...newItem, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...newItem, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    mutate((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    mutate((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  }, []);

  const clearCart = useCallback(() => {
    writeCart([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice: number | null = items.some((i) => i.price === null)
    ? null
    : items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

  const value = useMemo(
    () => ({ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }),
    [items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
