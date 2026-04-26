"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CartIcon } from "@/app/components/icons";
import { money, resolveMediaUrl } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";

export function FloatingCart() {
  const {
    cartItems,
    cartCount,
    subtotal,
    isCartOpen,
    cartPulse,
    openCart,
    closeCart,
    setCartTarget,
    changeQuantity,
    deleteItem,
    savedForLater,
    saveItemForLater,
    restoreSavedItem,
  } = useStore();

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setCartTarget(buttonRef.current);
    return () => setCartTarget(null);
  }, [setCartTarget]);

  return (
    <>
      <motion.button
        ref={buttonRef}
        onClick={openCart}
        animate={cartPulse ? { scale: [1, 1.08, 0.96, 1] } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 right-6 z-50 hidden h-16 w-16 items-center justify-center rounded-full border border-[rgba(212,175,55,0.36)] bg-[rgba(255,255,255,0.82)] text-[var(--gold-deep)] shadow-[0_18px_45px_rgba(102,72,9,0.18)] backdrop-blur-md transition hover:shadow-[0_22px_55px_rgba(201,155,35,0.24)] lg:flex"
        aria-label="Open cart"
      >
        <CartIcon className="h-7 w-7" />
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-xs text-white">
          {cartCount}
        </span>
      </motion.button>

      <AnimatePresence>
        {isCartOpen ? (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 z-[58] bg-[rgba(31,24,16,0.22)] backdrop-blur-sm"
              aria-label="Close cart"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col border-l border-[rgba(143,108,29,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,237,222,0.94))] px-6 py-6 shadow-[0_20px_80px_rgba(43,30,10,0.18)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">Your selections</p>
                  <h2 className="font-[var(--font-display)] text-3xl">Cart</h2>
                </div>
                <button onClick={closeCart} className="rounded-full border border-[rgba(143,108,29,0.16)] px-4 py-2 text-sm">
                  Close
                </button>
              </div>

              <div className="mt-8 flex-1 space-y-6 overflow-y-auto pr-1">
                <div className="space-y-4">
                  {cartItems.length ? (
                    cartItems.map((item) => {
                      const imageSrc = resolveMediaUrl(item.product.image);
                      return (
                        <div key={item.id} className="flex gap-4 rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/72 p-4">
                          <div className="h-24 w-20 overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#fff6d9,#d4af37)]">
                            {imageSrc ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imageSrc} alt={item.product.name} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="mt-1 text-sm text-[var(--gold-deep)]">{money(item.product.price)}</p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2 rounded-full border border-[rgba(143,108,29,0.16)] px-2 py-1">
                                <button onClick={() => changeQuantity(item.id, item.quantity - 1)} className="px-2">
                                  -
                                </button>
                                <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                                <button onClick={() => changeQuantity(item.id, item.quantity + 1)} className="px-2">
                                  +
                                </button>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                                <button onClick={() => saveItemForLater(item.id)}>Save for later</button>
                                <button onClick={() => deleteItem(item.id)}>Remove</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="luxury-card mt-10 rounded-[28px] p-6 text-center">
                      <p className="font-[var(--font-display)] text-2xl">The bag is still empty</p>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                        Your boutique selection will appear here as soon as you add a piece.
                      </p>
                    </div>
                  )}
                </div>

                {savedForLater.length ? (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Saved for later</p>
                      <p className="text-xs text-[var(--gold-deep)]">{savedForLater.length} pieces</p>
                    </div>
                    <div className="space-y-3">
                      {savedForLater.map((item) => (
                        <div key={item.id} className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/72 p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="mt-1 text-sm text-[var(--gold-deep)]">{money(item.product.price)}</p>
                            </div>
                            <button onClick={() => void restoreSavedItem(item.id)} className="text-sm text-[var(--gold-deep)]">
                              Move to cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 rounded-[28px] border border-[rgba(143,108,29,0.16)] bg-white/74 p-5">
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Subtotal</span>
                  <span className="text-lg text-[var(--foreground)]">{subtotal}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="gold-button mt-4 flex items-center justify-center rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em]"
                >
                  Proceed to checkout
                </Link>
                <Link href="/cart" onClick={closeCart} className="mt-3 block text-center text-sm text-[var(--gold-deep)]">
                  View full cart
                </Link>
                <Link href="/wishlist" onClick={closeCart} className="mt-2 block text-center text-sm text-[var(--muted)]">
                  Open wishlist
                </Link>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
