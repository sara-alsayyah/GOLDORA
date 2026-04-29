"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  getProduct,
  getProducts,
  getReviews,
  money,
  resolveMediaUrl,
} from "@/app/lib/api";
import type { Product, Review } from "@/app/lib/types";
import { PageReveal } from "@/app/components/PageReveal";
import { useStore } from "@/app/providers/StoreProvider";
import { ProductCard } from "@/app/components/ProductCard";
import { HeartIcon } from "@/app/components/icons";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const { addProductToCart, addRecentlyViewed, toggleWishlist, openWishlist } = useStore();
  const addRecentlyViewedRef = useRef(addRecentlyViewed);
  const params = useParams<{ slug: string }>();

  useEffect(() => {
    addRecentlyViewedRef.current = addRecentlyViewed;
  }, [addRecentlyViewed]);

  useEffect(() => {
    const slug = String(params.slug || "");
    let cancelled = false;

    if (!slug) return;

    void (async () => {
      try {
        const detail = await getProduct(params.slug);
        if (cancelled) return;

        if (!detail) {
          setProduct(null);
          return;
        }

        setProduct(detail);
        setSelectedColor(null);
        setSelectedSize(null);
        setSelectedQuantity(1);

        const [feedback, relatedProducts] = await Promise.all([
          getReviews(detail.id),
          getProducts(`?category__slug=${detail.category?.slug ?? ""}&page=1`),
        ]);

        if (cancelled) return;

        setReviews(feedback || []);

        const safeRelated = Array.isArray(relatedProducts)
          ? relatedProducts
          : relatedProducts?.results ?? [];

        setRelated(safeRelated.filter((item) => item.slug !== detail.slug).slice(0, 4));
        addRecentlyViewedRef.current(detail);
      } catch (error) {
        console.error("Product load failed:", error);
        if (cancelled) return;
        setProduct(null);
        setReviews([]);
        setRelated([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <PageReveal className="page-shell mx-auto max-w-6xl px-4 py-16">
        <div className="luxury-card rounded-[34px] p-10 text-center">
          <p className="text-lg text-[var(--muted)]">Loading product...</p>
        </div>
      </PageReveal>
    );
  }

  if (!product) {
    return (
      <PageReveal className="page-shell mx-auto max-w-6xl px-4 py-16">
        <div className="luxury-card rounded-[34px] p-10 text-center">
          <p className="font-[var(--font-display)] text-3xl">Product not found.</p>
          <Link href="/products" className="mt-6 inline-block text-[var(--gold-deep)]">
            Back to products
          </Link>
        </div>
      </PageReveal>
    );
  }

  const imageSrc = resolveMediaUrl(product.image);
  const stockLabel = product.stock > 12 ? "In stock" : product.stock > 0 ? "Low stock" : "Sold out";
  const colorOptionsByCategory: Record<string, { name: string; swatch: string }[]> = {
    women: [
      { name: "Champagne", swatch: "#d7be93" },
      { name: "Midnight", swatch: "#252840" },
      { name: "Rose dust", swatch: "#c79ea1" },
    ],
    beauty: [
      { name: "Glow", swatch: "#f0cf8f" },
      { name: "Soft nude", swatch: "#d8b6a1" },
      { name: "Pearl", swatch: "#efe8df" },
    ],
    bags: [
      { name: "Espresso", swatch: "#5f4637" },
      { name: "Cream", swatch: "#e7dbc6" },
      { name: "Onyx", swatch: "#1f1f1f" },
    ],
    shoes: [
      { name: "Jet black", swatch: "#111111" },
      { name: "Latte", swatch: "#c5a987" },
      { name: "Ruby", swatch: "#8f2136" },
    ],
    jewelry: [
      { name: "Gold", swatch: "#d4af37" },
      { name: "Silver", swatch: "#c4c9cf" },
      { name: "Rose gold", swatch: "#d59d84" },
    ],
  };
  const sizeOptionsByCategory: Record<string, string[]> = {
    women: ["XS", "S", "M", "L"],
    shoes: ["36", "37", "38", "39", "40"],
    bags: ["Mini", "Medium", "Large"],
    beauty: ["30 ml", "50 ml", "100 ml"],
    jewelry: ["Adjustable", "Standard"],
    home: ["Single", "Set of 2"],
  };
  const colorOptions = colorOptionsByCategory[product.category?.slug] ?? [
    { name: "Signature", swatch: "#d4af37" },
    { name: "Stone", swatch: "#d2cab9" },
  ];
  const sizeOptions = sizeOptionsByCategory[product.category?.slug] ?? ["Standard"];
  const activeColor = selectedColor ?? colorOptions[0].name;
  const activeSize = selectedSize ?? sizeOptions[0];
  const effectiveQuantity = selectedQuantity;

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-16 pt-6">
      <section className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="luxury-card rounded-[38px] p-5">
          <div className="overflow-hidden rounded-[30px]">
            {imageSrc ? (
              <img
                ref={imageRef}
                src={imageSrc}
                alt={product.name}
                className="h-[520px] w-full object-contain bg-[linear-gradient(180deg,#fffdf8,#f6eddc)]"
              />
            ) : (
              <div className="h-[520px] bg-gray-100" />
            )}
          </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/64 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Current edit</p>
                <p className="mt-2 text-sm">{activeColor}</p>
              </div>
            <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/64 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Chosen size</p>
              <p className="mt-2 text-sm">{activeSize}</p>
              </div>
              <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/64 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Quantity</p>
                <p className="mt-2 text-sm">{effectiveQuantity} piece{effectiveQuantity > 1 ? "s" : ""}</p>
              </div>
            </div>
        </div>

        <div className="space-y-6">
          <div className="luxury-card rounded-[38px] p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-deep)]">
              {product.category?.name ?? "Curated drop"}
            </p>
            <h1 className="section-heading mt-3 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-[var(--muted)] leading-7">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border px-4 py-2 text-xs">{stockLabel}</span>
              <span className="rounded-full border px-4 py-2 text-xs">Boutique finish</span>
              <span className="rounded-full border px-4 py-2 text-xs">Fast dispatch</span>
            </div>

            <p className="mt-6 text-3xl text-[var(--gold-deep)]">{money(product.price)}</p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Color</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {colorOptions.map((option) => {
                    const active = activeColor === option.name;
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setSelectedColor(option.name)}
                        className={`flex items-center gap-3 rounded-full border px-4 py-2 text-sm ${
                          active
                            ? "border-[rgba(212,175,55,0.54)] bg-white/90"
                            : "border-[rgba(143,108,29,0.14)] bg-white/60"
                        }`}
                      >
                        <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: option.swatch }} />
                        {option.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Size</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {sizeOptions.map((size) => {
                    const active = activeSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-4 py-2 text-sm ${
                          active
                            ? "border-[rgba(212,175,55,0.54)] bg-white/90 text-[var(--gold-deep)]"
                            : "border-[rgba(143,108,29,0.14)] bg-white/60"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-[rgba(143,108,29,0.16)] px-3 py-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuantity((current) => Math.max(1, current - 1))}
                  className="px-2"
                >
                  -
                </button>
                <span className="min-w-8 text-center text-sm">{selectedQuantity}</span>
                <button
                  type="button"
                  onClick={() => setSelectedQuantity((current) => Math.min(product.stock, current + 1))}
                  className="px-2"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-[var(--muted)]">
                Ready to add: <span className="font-medium text-[var(--foreground)]">{effectiveQuantity}</span>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => addProductToCart(product, imageRef.current, effectiveQuantity)}
                className="gold-button rounded-full px-6 py-3 text-sm uppercase"
              >
                Add {effectiveQuantity > 1 ? `${effectiveQuantity} pieces` : "to cart"}
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  void toggleWishlist(product);
                  openWishlist();
                }}
                className="rounded-full border px-6 py-3 text-sm uppercase"
                aria-label="Save to wishlist"
              >
                <HeartIcon className="h-4 w-4" />
              </button>

              <Link href="/checkout" className="rounded-full border px-6 py-3 text-sm uppercase">
                Checkout
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/64 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Estimated delivery</p>
                <p className="mt-2 text-sm">3-6 business days</p>
              </div>
              <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/64 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Returns</p>
                <p className="mt-2 text-sm">Easy return window on unused items</p>
              </div>
              <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/64 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Secure promise</p>
                <p className="mt-2 text-sm">Protected checkout and tracking</p>
              </div>
            </div>
          </div>

          <div className="luxury-card rounded-[38px] p-8">
            <p className="text-xs uppercase text-[var(--muted)]">Reviews ({reviews.length})</p>
            <div className="mt-5 space-y-4">
              {reviews.length ? (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-[24px] border p-5">
                    <p className="text-sm font-medium">
                      {"★".repeat(Math.max(1, Math.min(5, review.rating)))} {review.rating}/5
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="section-heading text-3xl">You may also like</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </PageReveal>
  );
}
