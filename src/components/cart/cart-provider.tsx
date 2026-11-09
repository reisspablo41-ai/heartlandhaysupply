"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { PriceUnit } from "@/lib/types/database";

/**
 * The cart lives entirely in the browser — there are no customer accounts,
 * so there is nothing to tie a server-side cart to. Prices here are for
 * display only; the checkout action re-reads them from the database.
 *
 * localStorage is modelled as an external store and read through
 * useSyncExternalStore, which keeps the server render and the hydration
 * render identical, syncs across tabs for free, and avoids a
 * setState-in-effect hydration pass.
 */
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  unit: PriceUnit;
  image: string | null;
  quantity: number;
  maxQuantity: number;
}

const STORAGE_KEY = "heartlandhaysupply.cart.v1";
const EMPTY: CartItem[] = [];

// ─────────────────────── external store ───────────────────────

const listeners = new Set<() => void>();

/** Cached so getSnapshot returns a referentially stable value. */
let snapshot: CartItem[] = EMPTY;
let snapshotRaw: string | null = null;

function parse(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const items = parsed.filter(
      (i): i is CartItem =>
        typeof i === "object" &&
        i !== null &&
        typeof (i as CartItem).productId === "string" &&
        typeof (i as CartItem).quantity === "number",
    );
    return items.length > 0 ? items : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private browsing / blocked storage — behave as an empty cart.
    return EMPTY;
  }

  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = parse(raw);
  }
  return snapshot;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(next: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or blocked storage — keep the in-memory snapshot so the current
    // session still works, it just won't survive a reload.
    snapshotRaw = null;
    snapshot = next;
  }
  for (const listener of listeners) listener();
}

function mutate(fn: (current: CartItem[]) => CartItem[]) {
  write(fn(getSnapshot()));
}

/** True only after hydration, so storage-dependent UI can wait for it. */
function subscribeHydration(): () => void {
  return () => {};
}

// ─────────────────────── context ───────────────────────

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  isOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );

  const [isOpen, setIsOpen] = useState(false);

  // Lock page scroll while the drawer is open (effect → external system).
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    mutate((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId
            ? { ...i, ...item, quantity: Math.min(i.quantity + quantity, item.maxQuantity) }
            : i,
        );
      }
      return [...current, { ...item, quantity: Math.min(quantity, item.maxQuantity) }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    mutate((current) =>
      quantity <= 0
        ? current.filter((i) => i.productId !== productId)
        : current.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.maxQuantity) }
              : i,
          ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    mutate((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    if (getSnapshot().length > 0) write(EMPTY);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
    return {
      items,
      itemCount,
      subtotalCents,
      isOpen,
      isHydrated,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items, isOpen, isHydrated, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
