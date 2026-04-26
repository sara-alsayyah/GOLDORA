"use client";

import Link from "next/link";
import { PageReveal } from "@/app/components/PageReveal";
import { money, resolveMediaUrl } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";

export default function CartPage() {
  const { cartItems, subtotal, changeQuantity, deleteItem } = useStore();
  const numericSubtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  const shipping = cartItems.length ? 7.5 : 0;
  const taxes = cartItems.length ? numericSubtotal * 0.04 : 0;
  const total = numericSubtotal + shipping + taxes;

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.36em] text-[var(--gold-deep)]">Shopping bag</p>
        <h1 className="section-heading mt-4 text-5xl">Review your bag before checkout.</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Items</p>
            <p className="mt-2 font-[var(--font-display)] text-3xl">{cartItems.length}</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Estimated delivery</p>
            <p className="mt-2 text-sm text-[var(--muted)]">3-6 business days</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Protection</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Secure order tracking and checkout</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr,390px]">
        <div className="space-y-5">
          {cartItems.length ? (
            cartItems.map((item) => {
              const imageSrc = resolveMediaUrl(item.product.image);
              return (
                <div key={item.id} className="luxury-card rounded-[30px] p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="h-40 w-full overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#fff7e0,#d5b04e)] sm:w-36">
                      {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt={item.product.name} className="h-full w-full object-contain bg-[linear-gradient(180deg,#fffdf8,#f6eddc)]" />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{item.product.category.name}</p>
                          <h2 className="mt-2 font-[var(--font-display)] text-3xl">{item.product.name}</h2>
                        </div>
                        <p className="text-xl text-[var(--gold-deep)]">{money(item.product.price)}</p>
                      </div>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">{item.product.description}</p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 rounded-full border border-[rgba(143,108,29,0.18)] px-3 py-2">
                          <button type="button" onClick={() => void changeQuantity(item.id, item.quantity - 1)} className="px-2">-</button>
                          <span className="min-w-6 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => void changeQuantity(item.id, item.quantity + 1)} className="px-2">+</button>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[var(--muted)]">Line total</span>
                          <span className="font-medium">{money(Number(item.product.price) * item.quantity)}</span>
                        </div>
                        <button type="button" onClick={() => void deleteItem(item.id)} className="text-sm text-[var(--muted)]">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="luxury-card rounded-[34px] p-10 text-center">
              <p className="font-[var(--font-display)] text-3xl">Your cart is empty.</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Browse the collection and add products to begin your checkout flow.</p>
              <Link href="/products" className="gold-button mt-6 inline-flex rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]">
                Explore products
              </Link>
            </div>
          )}
        </div>

        <aside className="luxury-card h-fit rounded-[34px] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Order summary</p>
          <div className="mt-6 space-y-4 rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Subtotal</span>
              <span>{subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Estimated shipping</span>
              <span>{money(shipping)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Estimated taxes</span>
              <span>{money(taxes)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[rgba(143,108,29,0.12)] pt-4 text-sm text-[var(--muted)]">
              <span>Total</span>
              <span className="text-xl text-[var(--foreground)]">{money(total)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-[linear-gradient(135deg,#fffdf4,#f0dfb8)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold-deep)]">Checkout note</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Shipping, address details, and payment method will be confirmed on the next step.</p>
          </div>

          <Link href="/checkout" className="gold-button mt-8 flex items-center justify-center rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em]">
            Continue to checkout
          </Link>
        </aside>
      </section>
    </PageReveal>
  );
}
