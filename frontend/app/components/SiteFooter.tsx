import Link from "next/link";
import { commerceCategories } from "@/app/lib/categories";
import { BRAND_NAME } from "@/app/lib/brand";
import { BrandLogo } from "@/app/components/BrandLogo";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 max-w-7xl px-4 pb-28 sm:px-6 lg:px-10 lg:pb-12">
      <div className="luxury-card rounded-[36px] px-6 py-8 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr,0.9fr]">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--muted)]">
              {BRAND_NAME} is designed as a refined everything-store: fashion, beauty, accessories, and home pieces in one polished shopping experience.
            </p>
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
        </div>
        <div className="mt-8 border-t border-[rgba(143,108,29,0.12)] pt-5 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          {new Date().getFullYear()} {BRAND_NAME}. Full-stack e-commerce platform project.
        </div>
      </div>
    </footer>
  );
}
