"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { money, resolveMediaUrl } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addProductToCart } = useStore();

  return (
    <AnimatePresence>
      {quickViewProduct ? (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 z-[80] bg-[rgba(27,20,14,0.28)] backdrop-blur-sm"
            aria-label="Close quick view"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="fixed left-1/2 top-1/2 z-[82] w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[34px] border border-[rgba(143,108,29,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,237,222,0.96))] p-5 shadow-[0_30px_90px_rgba(44,31,11,0.2)]"
          >
            <div className="grid gap-6 md:grid-cols-[0.9fr,1.1fr]">
              <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#fff6dd,#ddb75b)]">
                {quickViewProduct.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrl(quickViewProduct.image) ?? ""}
                    alt={quickViewProduct.name}
                    className="h-[380px] w-full object-cover"
                  />
                ) : (
                  <div className="h-[380px]" />
                )}
              </div>
              <div className="flex flex-col justify-between gap-6 p-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-deep)]">{quickViewProduct.category.name}</p>
                  <h3 className="section-heading mt-3 text-4xl">{quickViewProduct.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{quickViewProduct.description}</p>
                  <div className="mt-5 flex items-center gap-4">
                    <span className="text-2xl text-[var(--gold-deep)]">{money(quickViewProduct.price)}</span>
                    <span className="rounded-full border border-[rgba(143,108,29,0.14)] px-4 py-2 text-sm text-[var(--muted)]">
                      {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} available` : "Sold out"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void addProductToCart(quickViewProduct)}
                    className="gold-button rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]"
                  >
                    Add to cart
                  </button>
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="rounded-full border border-[rgba(143,108,29,0.18)] px-6 py-3 text-sm uppercase tracking-[0.18em]"
                  >
                    Full details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
