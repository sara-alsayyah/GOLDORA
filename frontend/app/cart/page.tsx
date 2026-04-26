"use client";

import Link from "next/link";
import { PageReveal } from "@/app/components/PageReveal";
import { money, resolveMediaUrl } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";

export default function CartPage() {
  const { cartItems, subtotal, changeQuantity, deleteItem } = useStore();

  return (
    <PageReveal className="page-shell mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.36em] text-[var(--gold-deep)]">Cart experience</p>
        <h1 className="section-heading mt-4 text-5xl">A refined checkout staging area.</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Your cart is presented like a boutique fitting room, with calm spacing, clear quantity controls, and a premium handoff into checkout.
        </p>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr,360px]">
        <div className="space-y-5">
          {cartItems.length ? (
            cartItems.map((item) => {
              const imageSrc = resolveMediaUrl(item.product.image);
              return (
                <div key={item.id} className="luxury-card flex flex-col gap-5 rounded-[30px] p-5 sm:flex-row sm:items-center">
                  <div className="h-36 w-full overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#fff7e0,#d5b04e)] sm:w-32">
                    {imageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageSrc} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{item.product.category.name}</p>
                    <h2 className="mt-2 font-[var(--font-display)] text-3xl">{item.product.name}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">{item.product.description}</p>
                  </div>

                  <div className="flex flex-col items-start gap-4 sm:items-end">
                    <p className="text-xl text-[var(--gold-deep)]">{money(item.product.price)}</p>
                    <div className="flex items-center gap-3 rounded-full border border-[rgba(143,108,29,0.18)] px-3 py-2">
                      <button onClick={() => changeQuantity(item.id, item.quantity - 1)} className="px-2">
                        -
                      </button>
                      <span className="min-w-6 text-center">{item.quantity}</span>
                      <button onClick={() => changeQuantity(item.id, item.quantity + 1)} className="px-2">
                        +
                      </button>
                    </div>
                    <button onClick={() => deleteItem(item.id)} className="text-sm text-[var(--muted)]">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="luxury-card rounded-[34px] p-10 text-center">
              <p className="font-[var(--font-display)] text-3xl">Your cart is empty.</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Browse the collection and add products to see the luxury drawer and checkout flow in motion.</p>
              <Link href="/products" className="gold-button mt-6 inline-flex rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]">
                Explore products
              </Link>
            </div>
          )}
        </div>

        <aside className="luxury-card h-fit rounded-[34px] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Order summary</p>
          <div className="mt-6 flex items-center justify-between text-sm text-[var(--muted)]">
            <span>Subtotal</span>
            <span className="text-xl text-[var(--foreground)]">{subtotal}</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <Link href="/checkout" className="gold-button mt-8 flex items-center justify-center rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em]">
            Continue to checkout
          </Link>
        </aside>
      </section>
    </PageReveal>
  );
}
