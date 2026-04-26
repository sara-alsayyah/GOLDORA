"use client";

import { PageReveal } from "@/app/components/PageReveal";
import { ProductCard } from "@/app/components/ProductCard";
import { useStore } from "@/app/providers/StoreProvider";

export default function WishlistPage() {
  const { wishlistItems } = useStore();

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">Wishlist</p>
        <h1 className="section-heading mt-4 text-5xl">Your saved luxury picks.</h1>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {wishlistItems.length ? (
          wishlistItems.map((item) => <ProductCard key={item.id} product={item.product} />)
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
