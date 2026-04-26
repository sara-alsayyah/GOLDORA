"use client";

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CartItem, Product, WishlistItem } from "@/app/lib/types";
import {
  addCartItem,
  addWishlistItem,
  getCart,
  getWishlist,
  money,
  removeCartItem,
  removeWishlistItem,
  updateCartItem,
} from "@/app/lib/api";

type StoreContextValue = {
  token: string | null;
  cartItems: CartItem[];
  savedForLater: CartItem[];
  wishlistItems: WishlistItem[];
  recentlyViewed: Product[];
  cartCount: number;
  wishlistCount: number;
  subtotal: string;
  isCartOpen: boolean;
  cartPulse: number;
  statusMessage: string | null;
  themeMode: "light" | "dark";
  quickViewProduct: Product | null;
  isWishlistOpen: boolean;
  isRecentlyViewedOpen: boolean;
  setCartTarget: (element: HTMLElement | null) => void;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleRecentlyViewed: () => void;
  saveToken: (access: string, refresh?: string | null) => void;
  logout: () => void;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  addProductToCart: (product: Product, imageElement?: HTMLImageElement | null, quantity?: number) => Promise<void>;
  changeQuantity: (itemId: number, quantity: number) => Promise<void>;
  deleteItem: (itemId: number) => Promise<void>;
  saveItemForLater: (itemId: number) => void;
  restoreSavedItem: (itemId: number) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  addRecentlyViewed: (product: Product) => void;
  setQuickViewProduct: (product: Product | null) => void;
  toggleThemeMode: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const SAVED_FOR_LATER_KEY = "goldora-saved-later";
const RECENTLY_VIEWED_KEY = "goldora-recently-viewed";
const THEME_MODE_KEY = "goldora-theme-mode";

type ApiError = {
  detail?: string;
  error?: string;
  message?: string;
};

function isInvalidTokenError(error: unknown) {
  const message = getErrorMessage(error, "").toLowerCase();
  return (
    message.includes("given token not valid") ||
    message.includes("token is invalid") ||
    message.includes("token not valid") ||
    message.includes("token is expired")
  );
}

function readStoredValue<T>(key: string, fallback: T) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string") return error;
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object") {
    const apiError = error as ApiError;
    return apiError.detail ?? apiError.error ?? apiError.message ?? fallback;
  }
  return fallback;
}

function getSubtotal(items: CartItem[]) {
  const total = items.reduce((sum, item) => {
    const price = Number.parseFloat(String(item.product.price));
    return sum + price * item.quantity;
  }, 0);

  return money(total);
}

function uniqueRecentProducts(items: Product[]) {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("access");
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() =>
    readStoredValue(SAVED_FOR_LATER_KEY, []),
  );
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() =>
    readStoredValue(RECENTLY_VIEWED_KEY, []),
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() =>
    readStoredValue(THEME_MODE_KEY, "light"),
  );
  const [cartPulse, setCartPulse] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const cartTargetRef = useRef<HTMLElement | null>(null);
  function setCartTarget(element: HTMLElement | null) {
    cartTargetRef.current = element;
  }

  function clearAuthState(message?: string) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
    setCartItems([]);
    setWishlistItems([]);
    if (message) {
      setStatusMessage(message);
    }
  }

  useEffect(() => {
    window.localStorage.setItem(SAVED_FOR_LATER_KEY, JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    window.localStorage.setItem(THEME_MODE_KEY, JSON.stringify(themeMode));
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  useEffect(() => {
    if (!statusMessage) return;

    const timer = window.setTimeout(() => {
      setStatusMessage(null);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  async function refreshCart(activeToken?: string | null) {
    if (!activeToken) return;
    try {
      const items = await getCart(activeToken);
      setCartItems(items);
    } catch (error: unknown) {
      if (isInvalidTokenError(error)) {
        clearAuthState("Your session expired. Please sign in again.");
        return;
      }
      console.log("CART ERROR FULL:", error);
      setStatusMessage(getErrorMessage(error, "Unable to load cart"));
    }
  }

  async function refreshWishlist(activeToken?: string | null) {
    if (!activeToken) return;
    try {
      const items = await getWishlist(activeToken);
      setWishlistItems(items);
    } catch (error: unknown) {
      if (isInvalidTokenError(error)) {
        clearAuthState("Your session expired. Please sign in again.");
        return;
      }
      setWishlistItems([]);
    }
  }

  const syncStoreSession = useEffectEvent((activeToken: string) => {
    void refreshCart(activeToken);
    void refreshWishlist(activeToken);
  });

  useEffect(() => {
    if (token) {
      queueMicrotask(() => {
        syncStoreSession(token);
      });
    }
  }, [token]);

  async function addProductToCart(
    product: Product,
    _imageElement?: HTMLImageElement | null,
    quantity = 1,
  ) {
    if (!token) {
      setStatusMessage("Login required");
      window.location.href = "/login";
      return;
    }

    try {
      await addCartItem(token, product.id, quantity);
      setStatusMessage(
        quantity > 1
          ? `${quantity} ${product.name} pieces added to cart`
          : `${product.name} added to cart`,
      );
      setCartPulse((current) => current + 1);
      void refreshCart(token);
    } catch (error: unknown) {
      if (isInvalidTokenError(error)) {
        clearAuthState("Your session expired. Please sign in again.");
        window.location.href = "/login";
        return;
      }
      setStatusMessage(getErrorMessage(error, "Error adding product"));
    }
  }

  async function toggleWishlist(product: Product) {
    if (!token) {
      setStatusMessage("Login required");
      window.location.href = "/login";
      return;
    }

    const exists = wishlistItems.some((item) => item.product.id === product.id);

    try {
      if (exists) {
        setWishlistItems((prev) => prev.filter((item) => item.product.id !== product.id));
        await removeWishlistItem(token, product.id);
        return;
      }

      await addWishlistItem(token, product.id);
      void refreshWishlist(token);
    } catch (error: unknown) {
      if (isInvalidTokenError(error)) {
        clearAuthState("Your session expired. Please sign in again.");
        window.location.href = "/login";
        return;
      }
      setStatusMessage(getErrorMessage(error, "Unable to update wishlist"));
    }
  }

  function isWishlisted(productId: number) {
    return wishlistItems.some((item) => item.product.id === productId);
  }

  async function changeQuantity(itemId: number, quantity: number) {
    if (!token) return;

    if (quantity <= 0) {
      await deleteItem(itemId);
      return;
    }

    try {
      await updateCartItem(token, itemId, quantity);
      await refreshCart(token);
    } catch (error: unknown) {
      if (isInvalidTokenError(error)) {
        clearAuthState("Your session expired. Please sign in again.");
        return;
      }
      setStatusMessage(getErrorMessage(error, "Unable to update cart"));
    }
  }

  async function deleteItem(itemId: number) {
    if (!token) return;

    try {
      await removeCartItem(token, itemId);
      setCartItems((current) => current.filter((item) => item.id !== itemId));
    } catch (error: unknown) {
      if (isInvalidTokenError(error)) {
        clearAuthState("Your session expired. Please sign in again.");
        return;
      }
      setStatusMessage(getErrorMessage(error, "Unable to remove item"));
    }
  }

  function saveItemForLater(itemId: number) {
    const item = cartItems.find((entry) => entry.id === itemId);
    if (!item) return;

    setCartItems((current) => current.filter((entry) => entry.id !== itemId));
    setSavedForLater((current) => [item, ...current.filter((entry) => entry.id !== itemId)]);

    if (token) {
      void removeCartItem(token, itemId).catch((error: unknown) => {
        setStatusMessage(getErrorMessage(error, "Unable to save item for later"));
        void refreshCart(token);
      });
    }
  }

  async function restoreSavedItem(itemId: number) {
    const item = savedForLater.find((entry) => entry.id === itemId);
    if (!item || !token) return;

    try {
      await addCartItem(token, item.product.id, item.quantity);
      setSavedForLater((current) => current.filter((entry) => entry.id !== itemId));
      setCartPulse((current) => current + 1);
      await refreshCart(token);
    } catch (error: unknown) {
      if (isInvalidTokenError(error)) {
        clearAuthState("Your session expired. Please sign in again.");
        return;
      }
      setStatusMessage(getErrorMessage(error, "Unable to restore item"));
    }
  }

  function addRecentlyViewed(product: Product) {
    setRecentlyViewed((current) =>
      uniqueRecentProducts([product, ...current]).slice(0, 8),
    );
  }

  const value: StoreContextValue = {
    token,
    cartItems,
    savedForLater,
    wishlistItems,
    recentlyViewed,
    cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    wishlistCount: wishlistItems.length,
    subtotal: getSubtotal(cartItems),
    isCartOpen,
    cartPulse,
    statusMessage,
    themeMode,
    quickViewProduct,
    isWishlistOpen,
    isRecentlyViewedOpen,
    setCartTarget,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    openWishlist: () => setIsWishlistOpen(true),
    closeWishlist: () => setIsWishlistOpen(false),
    toggleRecentlyViewed: () =>
      setIsRecentlyViewedOpen((current) => !current),
    saveToken: (access, refresh) => {
      localStorage.setItem("access", access);
      if (refresh) {
        localStorage.setItem("refresh", refresh);
      }
      setToken(access);
      void refreshCart(access);
      void refreshWishlist(access);
    },
    logout: () => {
      clearAuthState();
      setSavedForLater([]);
    },
    refreshCart: async () => {
      const current = localStorage.getItem("access");
      return refreshCart(current);
    },
    refreshWishlist: async () => {
      const current = localStorage.getItem("access");
      return refreshWishlist(current);
    },
    addProductToCart,
    changeQuantity,
    deleteItem,
    saveItemForLater,
    restoreSavedItem,
    toggleWishlist,
    isWishlisted,
    addRecentlyViewed,
    setQuickViewProduct,
    toggleThemeMode: () =>
      setThemeMode((prev) => (prev === "light" ? "dark" : "light")),
  };

  return (
    <StoreContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow"
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
