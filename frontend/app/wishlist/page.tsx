"use client";

import Link from "next/link";
import { PageReveal } from "@/app/components/PageReveal";
import { ProductCard } from "@/app/components/ProductCard";
import { useStore } from "@/app/providers/StoreProvider";

export default function WishlistPage() {
  const { wishlistItems, addProductToCart } = useStore();

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">Wishlist</p>
        <h1 className="section-heading mt-4 text-5xl">Your saved luxury picks.</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Saved items</p>
            <p className="mt-2 font-[var(--font-display)] text-3xl">{wishlistItems.length}</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Shopping mode</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Keep your favorites ready before sending them into the bag.</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Next step</p>
            <Link href="/products" className="mt-2 inline-block text-sm text-[var(--gold-deep)]">Continue browsing</Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {wishlistItems.length ? (
          wishlistItems.map((item) => (
            <div key={item.id} className="space-y-4">
              <ProductCard product={item.product} />
              <div className="flex items-center justify-between rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/68 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Ready to move this into your bag?</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Fast wishlist to cart</p>
                </div>
                <button
                  type="button"
                  onClick={() => void addProductToCart(item.product)}
                  className="gold-button rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em]"
                >
                  Add to bag
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="luxury-card rounded-[32px] p-8">
            <p className="font-[var(--font-display)] text-3xl">No saved items yet.</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Use the heart icon on any product card to build your wishlist.</p>
          </div>
        )}
      </section>
    </PageReveal>
  );
}
