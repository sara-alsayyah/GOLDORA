"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { money, resolveMediaUrl } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";

export function WishlistDrawer() {
  const { wishlistItems, isWishlistOpen, closeWishlist, toggleWishlist } = useStore();

  return (
    <AnimatePresence>
      {isWishlistOpen ? (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 z-[58] bg-[rgba(31,24,16,0.18)] backdrop-blur-sm"
            aria-label="Close wishlist"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45 }}
            className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col border-l border-[rgba(143,108,29,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,237,222,0.94))] px-6 py-6 shadow-[0_20px_80px_rgba(43,30,10,0.18)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">Wishlist</p>
                <h2 className="font-[var(--font-display)] text-3xl">Saved pieces</h2>
              </div>
              <button onClick={closeWishlist} className="rounded-full border border-[rgba(143,108,29,0.16)] px-4 py-2 text-sm">
                Close
              </button>
            </div>
            <div className="mt-8 flex-1 space-y-4 overflow-y-auto pr-1">
              {wishlistItems.length ? (
                wishlistItems.map((item) => {
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
                        <div className="flex items-center justify-between">
                          <Link href={`/products/${item.product.slug}`} onClick={closeWishlist} className="text-sm text-[var(--gold-deep)]">
                            Open
                          </Link>
                          <button onClick={() => void toggleWishlist(item.product)} className="text-sm text-[var(--muted)]">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="luxury-card rounded-[28px] p-6 text-center">
                  <p className="font-[var(--font-display)] text-2xl">No saved pieces yet</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Tap the heart on any product to build your wishlist.</p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
