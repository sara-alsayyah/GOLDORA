"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { money, resolveMediaUrl } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";

export function RecentlyViewedPanel() {
  const { recentlyViewed, isRecentlyViewedOpen, toggleRecentlyViewed } = useStore();

  return (
    <>
      <button
        onClick={toggleRecentlyViewed}
        className="fixed bottom-28 left-4 z-30 hidden rounded-full border border-[rgba(143,108,29,0.16)] bg-[rgba(255,255,255,0.86)] px-4 py-3 text-sm text-[var(--gold-deep)] shadow-[0_14px_40px_rgba(44,31,11,0.12)] backdrop-blur-lg xl:block"
      >
        Recently viewed
      </button>
      <AnimatePresence>
        {isRecentlyViewedOpen ? (
          <motion.aside
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            className="fixed bottom-28 left-4 z-40 hidden w-80 rounded-[30px] border border-[rgba(143,108,29,0.16)] bg-[rgba(255,255,255,0.96)] p-4 shadow-[0_24px_80px_rgba(44,31,11,0.16)] backdrop-blur-lg xl:block"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Recently viewed</p>
                <h3 className="mt-1 font-[var(--font-display)] text-2xl">Back to what caught your eye</h3>
              </div>
              <button onClick={toggleRecentlyViewed} className="text-sm text-[var(--muted)]">
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {recentlyViewed.length ? (
                recentlyViewed.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="flex gap-3 rounded-[22px] border border-[rgba(143,108,29,0.12)] bg-white/72 p-3">
                    <div className="h-16 w-14 overflow-hidden rounded-[16px] bg-[linear-gradient(135deg,#fff6dd,#ddb75b)]">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={resolveMediaUrl(product.image) ?? ""} alt={product.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{product.category.name}</p>
                      <p className="mt-2 text-sm text-[var(--gold-deep)]">{money(product.price)}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">Recently viewed products will appear here.</p>
              )}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
