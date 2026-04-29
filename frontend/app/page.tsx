"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { asArray, getProducts, money, resolveMediaUrl } from "@/app/lib/api";
import type { Product } from "@/app/lib/types";
import { PageReveal } from "@/app/components/PageReveal";
import { ProductCard } from "@/app/components/ProductCard";
import { commerceCategories } from "@/app/lib/categories";
import { BRAND_NAME } from "@/app/lib/brand";
import { useStore } from "@/app/providers/StoreProvider";
import {
  GiftIcon,
  HangerIcon,
  HeadsetIcon,
  HomeIcon,
  SparkleIcon,
  TrendUpIcon,
} from "@/app/components/icons";

const personalShoppingTiles = [
  { label: "Fashion", query: "dress", icon: HangerIcon },
  { label: "Gifts", query: "gift", icon: GiftIcon },
  { label: "Beauty", query: "serum", icon: SparkleIcon },
  { label: "Tech", query: "audio", icon: HeadsetIcon },
  { label: "Essentials", query: "daily", icon: HomeIcon },
  { label: "Trending", query: "new", icon: TrendUpIcon },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(7 * 60 * 60 + 22 * 60 + 18);
  const { recentlyViewed, wishlistItems } = useStore();

  useEffect(() => {
    getProducts("?page=1")
      .then((response) => setProducts(asArray(response)))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const heroProduct = products[0];
  const featured = products.slice(1, 5);
  const picks = products.slice(5, 8);
  const scrollEdit = products.slice(0, 10);
  const bestSellers = products.slice(0, 6);
  const shopTheLook = products.slice(0, 3);
  const flashDealProduct = products[1] ?? products[0];
  const recommended = useMemo(() => {
    const recentIds = new Set(recentlyViewed.map((item) => item.id));
    const wishlistIds = new Set(wishlistItems.map((item) => item.product.id));
    return products
      .filter((item) => recentIds.has(item.id) || wishlistIds.has(item.id))
      .concat(products)
      .filter((item, index, array) => array.findIndex((entry) => entry.id === item.id) === index)
      .slice(0, 4);
  }, [products, recentlyViewed, wishlistItems]);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <PageReveal className="page-shell pb-28">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1.2fr,0.8fr] lg:px-10 lg:pt-8">
        <div className="luxury-card relative overflow-hidden rounded-[40px] px-7 py-8 sm:px-10 sm:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.84),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.15),transparent_26%)]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
            <div className="min-w-0 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.38em] text-[var(--gold-deep)]">Luxury ease of use</p>
              <h1 className="section-heading text-balance mt-6 text-5xl leading-[1.02] sm:text-7xl">
                <span className="text-[var(--gold-deep)]">{BRAND_NAME}</span>  A luxury shopping world.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Fashion, beauty, accessories, and everyday essentials.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/products" className="gold-button rounded-full px-6 py-3 text-sm uppercase tracking-[0.2em]">
                  Shop all
                </Link>
                <Link href="/products?category=women" className="rounded-full border border-[rgba(143,108,29,0.18)] px-6 py-3 text-sm uppercase tracking-[0.2em]">
                  Discover trends
                </Link>
              </div>
            </div>

            <div className="relative md:justify-self-end">
              <div className="absolute -left-6 top-8 h-28 w-28 rounded-full bg-[rgba(212,175,55,0.18)] blur-3xl" />
              <div className="absolute -right-4 bottom-4 h-32 w-32 rounded-full bg-[rgba(143,108,29,0.12)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[34px] border border-[rgba(143,108,29,0.14)] bg-[linear-gradient(135deg,#fff8e8,#e6c36b_55%,#b88928)] p-3 shadow-[0_26px_70px_rgba(66,45,10,0.16)]">
                <div className="overflow-hidden rounded-[28px] bg-white/70">
                  {heroProduct?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(heroProduct.image) ?? ""}
                      alt={heroProduct.name}
                      className="h-[320px] w-full object-cover bg-[linear-gradient(180deg,#fffdf8,#f6eddc)] sm:h-[380px] md:w-[320px] lg:w-[380px]"
                    />
                  ) : (
                    <div className="h-[320px] w-full bg-[radial-gradient(circle_at_top,#fff7e6,#d8b14d_45%,#9d721e)] sm:h-[380px] md:w-[320px] lg:w-[380px]" />
                  )}
                </div>
                <div className="absolute bottom-8 left-8 rounded-full border border-white/40 bg-white/72 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--gold-deep)] backdrop-blur-sm">
                  Curated luxury picks
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          <div className="luxury-card overflow-hidden rounded-[34px] p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Today&apos;s spotlight</p>
                <p className="mt-2 font-[var(--font-display)] text-3xl">{heroProduct?.name ?? "Private Collection"}</p>
              </div>
              <p className="text-[var(--gold-deep)]">{heroProduct ? money(heroProduct.price) : "Curated"}</p>
            </div>
            <div className="mt-5 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#fffaef,#dcb85b_50%,#ab7c1f)]">
              {heroProduct?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveMediaUrl(heroProduct.image) ?? ""} alt={heroProduct.name} className="h-[360px] w-full object-cover" />
              ) : (
                <div className="h-[360px] w-full bg-[radial-gradient(circle_at_top,#fff7e6,#d8b14d_45%,#9d721e)]" />
              )}
            </div>
          </div>

          <div className="luxury-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Flash deals</p>
            <div className="mt-4 rounded-[26px] bg-[linear-gradient(135deg,#fffdf4,#ead39e)] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-[var(--font-display)] text-3xl">Private offer window</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Elegant limited-time pricing on selected pieces.</p>
                </div>
                <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/82 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Ends in</p>
                  <p className="mt-1 font-[var(--font-display)] text-2xl text-[var(--gold-deep)]">
                    {hours}:{minutes}:{seconds}
                  </p>
                </div>
              </div>
              {flashDealProduct ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-[120px,1fr]">
                  <div className="overflow-hidden rounded-[22px] bg-white/72 p-3">
                    {flashDealProduct.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(flashDealProduct.image) ?? ""}
                        alt={flashDealProduct.name}
                        className="h-28 w-full object-contain"
                      />
                    ) : (
                      <div className="h-28 rounded-[18px] bg-[radial-gradient(circle_at_top,#fff7e6,#d8b14d_45%,#9d721e)]" />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-[22px] border border-[rgba(143,108,29,0.12)] bg-white/66 p-4">
                    <div>
                      <p className="text-sm font-medium">{flashDealProduct.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{flashDealProduct.category.name}</p>
                      <p className="mt-2 text-lg text-[var(--gold-deep)]">{money(flashDealProduct.price)}</p>
                    </div>
                    <Link
                      href={`/products/${flashDealProduct.slug}`}
                      className="rounded-full border border-[rgba(143,108,29,0.16)] px-4 py-2 text-xs uppercase tracking-[0.16em]"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
        <div className="luxury-card rounded-[34px] px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">Personal shopping assistant</p>
              <h2 className="section-heading mt-2 text-3xl">What are you shopping for today?</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {personalShoppingTiles.map((tile, index) => {
              const TileIcon = tile.icon;
              return (
              <Link
                key={tile.label}
                href={`/products?search=${encodeURIComponent(tile.query)}`}
                className={`rounded-[24px] border border-[rgba(143,108,29,0.14)] p-5 ${index % 2 === 0 ? "bg-[linear-gradient(135deg,#fffdf4,#f2dfb6)]" : "bg-white/76"}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(143,108,29,0.14)] bg-white/76 text-[var(--gold-deep)]">
                  <TileIcon className="h-5 w-5" />
                </div>
                <p className="font-[var(--font-display)] text-2xl">{tile.label}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Curated shortcuts into the right category.</p>
              </Link>
            )})}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
        <div className="luxury-card rounded-[34px] px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">Shop by category</p>
              <h2 className="section-heading mt-2 text-3xl">A marketplace built around practical luxury</h2>
            </div>
            <Link href="/products" className="hidden text-sm uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
              See all
            </Link>
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {commerceCategories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className={`min-w-[180px] rounded-[26px] border border-[rgba(143,108,29,0.14)] p-5 ${
                  index % 3 === 0 ? "bg-[linear-gradient(135deg,#fffdf6,#f0dfb8)]" : "bg-white/76"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{category.name}</p>
                <p className="mt-3 font-[var(--font-display)] text-2xl text-[var(--foreground)]">{category.accent}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">Editor&apos;s picks</p>
            <h2 className="section-heading mt-3 text-4xl">Magazine-style curation with luxury rhythm</h2>
          </div>
          <Link href="/products" className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            View all products
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
          {heroProduct ? <ProductCard product={heroProduct} featured /> : null}
          <div className="grid gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
        <div className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Recommended for you</p>
              <h2 className="section-heading mt-3 text-4xl">Personalized by what you view and save</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(recommended.length ? recommended : bestSellers.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
        <div className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Shop the look</p>
              <h2 className="section-heading mt-3 text-4xl">Complete a full styled set in one move</h2>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[32px] border border-[rgba(143,108,29,0.14)] bg-[linear-gradient(135deg,#fffdf4,#ecd6a2)] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Evening capsule</p>
              <h3 className="mt-3 font-[var(--font-display)] text-4xl">A polished set for one-click inspiration</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">Pair signature fashion, accessories, and finishing details into one luxurious edit.</p>
              <Link href="/products" className="gold-button mt-6 inline-flex rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]">
                Shop the edit
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {shopTheLook.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
        <div className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Best sellers</p>
              <h2 className="section-heading mt-3 text-4xl">Dense browsing, but still elegant</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">Scroll and discover</p>
              <h2 className="section-heading mt-3 text-4xl">A horizontal row inspired by shopping apps, styled like a luxury house</h2>
            </div>
          </div>

          <div className="mt-8 flex gap-5 overflow-x-auto pb-3">
            {scrollEdit.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="min-w-[280px] max-w-[280px] rounded-[28px] border border-[rgba(143,108,29,0.14)] bg-white/74 p-4"
              >
                <div className="overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#fff6de,#e6cb7e_48%,#bb8f2f)]">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveMediaUrl(product.image) ?? ""} alt={product.name} className="h-[260px] w-full object-cover" />
                  ) : (
                    <div className="h-[260px]" />
                  )}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{product.category.name}</p>
                <p className="mt-2 font-[var(--font-display)] text-2xl">{product.name}</p>
                <p className="mt-2 text-sm text-[var(--gold-deep)]">{money(product.price)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-10">
        {picks.map((product, index) => (
          <div
            key={product.id}
            className={`luxury-card rounded-[32px] p-6 ${index === 1 ? "lg:-translate-y-8" : ""}`}
          >
            <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">Top picks of the week</p>
            <p className="mt-3 font-[var(--font-display)] text-3xl">{product.name}</p>
            <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--muted)]">{product.description}</p>
            <Link href={`/products/${product.slug}`} className="mt-8 inline-block text-sm uppercase tracking-[0.18em] text-[var(--gold-deep)]">
              Shop this piece
            </Link>
          </div>
        ))}
      </section>
    </PageReveal>
  );
}
