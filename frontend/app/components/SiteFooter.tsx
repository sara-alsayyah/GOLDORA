import Link from "next/link";
import { commerceCategories } from "@/app/lib/categories";
import { BRAND_NAME } from "@/app/lib/brand";
import { BrandLogo } from "@/app/components/BrandLogo";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 max-w-7xl px-4 pb-28 sm:px-6 lg:px-10 lg:pb-12">
      <div className="luxury-card overflow-hidden rounded-[36px] px-6 py-8 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr,0.85fr,0.95fr]">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--muted)]">
              {BRAND_NAME} is designed as a refined everything-store: fashion, beauty, accessories, and home pieces in one polished shopping experience.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] border border-[rgba(143,108,29,0.14)] bg-white/66 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Delivery</p>
                <p className="mt-1 text-sm">3-6 day dispatch</p>
              </div>
              <div className="rounded-[20px] border border-[rgba(143,108,29,0.14)] bg-white/66 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Support</p>
                <p className="mt-1 text-sm">Daily customer care</p>
              </div>
              <div className="rounded-[20px] border border-[rgba(143,108,29,0.14)] bg-white/66 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Checkout</p>
                <p className="mt-1 text-sm">Protected payment flow</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Explore</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {commerceCategories.slice(0, 8).map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="rounded-full border border-[rgba(143,108,29,0.14)] bg-white/70 px-3 py-2 text-xs text-[var(--muted)]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Quick links</p>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              <Link href="/products">All products</Link>
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/account">My account</Link>
              <Link href="/checkout">Checkout</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Customer care</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/68 p-4">
                <p className="text-sm font-medium">Need style help?</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Visit notifications, wishlist, and account to continue where you left off.</p>
              </div>
              <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-[linear-gradient(135deg,#fffdf4,#f0dfb8)] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold-deep)]">Boutique access</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Track orders, manage addresses, and shop new curated arrivals from one account space.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[rgba(143,108,29,0.12)] pt-5 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {new Date().getFullYear()} {BRAND_NAME}. Full-stack e-commerce platform project.
        </div>
      </div>
    </footer>
  );
}
