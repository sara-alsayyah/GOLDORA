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

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const { addProductToCart, addRecentlyViewed, toggleWishlist, isWishlisted } = useStore();
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

        const [feedback, relatedProducts] = await Promise.all([
          getReviews(detail.id),

         
         getProducts(`?category__slug=${detail.category?.slug ?? ""}&page=1`),
        ]);

        if (cancelled) return;

        setReviews(feedback || []);

        const safeRelated = Array.isArray(relatedProducts)
          ? relatedProducts
          : relatedProducts?.results ?? [];

        setRelated(
          safeRelated
            .filter((item) => item.slug !== detail.slug)
            .slice(0, 4)
        );

        addRecentlyViewedRef.current(detail);
      } catch (err) {
        console.error("Product load failed:", err);
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

  /* LOADING STATE */
  if (loading) {
    return (
      <PageReveal className="page-shell mx-auto max-w-6xl px-4 py-16">
        <div className="luxury-card rounded-[34px] p-10 text-center">
          <p className="text-lg text-[var(--muted)]">
            Loading product...
          </p>
        </div>
      </PageReveal>
    );
  }

  /* ERROR STATE */
  if (!product) {
    return (
      <PageReveal className="page-shell mx-auto max-w-6xl px-4 py-16">
        <div className="luxury-card rounded-[34px] p-10 text-center">
          <p className="font-[var(--font-display)] text-3xl">
            Product not found.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block text-[var(--gold-deep)]"
          >
            Back to products
          </Link>
        </div>
      </PageReveal>
    );
  }

  const imageSrc = resolveMediaUrl(product.image);

  const stockLabel =
    product.stock > 12
      ? "In stock"
      : product.stock > 0
      ? "Low stock"
      : "Sold out";

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-16 pt-6">

      <section className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">

        {/* IMAGE */}
        <div className="luxury-card rounded-[38px] p-5">
          <div className="overflow-hidden rounded-[30px]">
            {imageSrc ? (
              <img
                ref={imageRef}
                src={imageSrc}
                alt={product.name}
                className="h-[520px] w-full object-cover"
              />
            ) : (
              <div className="h-[520px] bg-gray-100" />
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6">

          <div className="luxury-card rounded-[38px] p-8">

            <h1 className="section-heading text-4xl sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 text-[var(--muted)] leading-7">
              {product.description}
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <span className="rounded-full border px-4 py-2 text-xs">
                {product.category?.name ?? "Uncategorized"}
              </span>

              <span className="rounded-full border px-4 py-2 text-xs">
                {stockLabel}
              </span>
            </div>

            <p className="mt-6 text-3xl text-[var(--gold-deep)]">
              {money(product.price)}
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-4">

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  addProductToCart(product, imageRef.current)
                }
                className="gold-button rounded-full px-6 py-3 text-sm uppercase"
              >
                Add to cart
              </motion.button>

              <button
                onClick={() => void toggleWishlist(product)}
                className="rounded-full border px-6 py-3 text-sm uppercase"
              >
                {isWishlisted(product.id) ? "Saved" : "Wishlist"}
              </button>

              <Link
                href="/checkout"
                className="rounded-full border px-6 py-3 text-sm uppercase"
              >
                Checkout
              </Link>

            </div>
          </div>

          {/* REVIEWS */}
          <div className="luxury-card rounded-[38px] p-8">

            <p className="text-xs uppercase text-[var(--muted)]">
              Reviews ({reviews.length})
            </p>

            <div className="mt-5 space-y-4">

              {reviews.length ? (
                reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-[24px] border p-5"
                  >
                    <p className="text-sm font-medium">
                      ⭐ {r.rating}/5
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {r.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  No reviews yet.
                </p>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="mt-12">

          <h2 className="section-heading text-3xl">
            You may also like
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>

        </section>
      )}

    </PageReveal>
  );
}
