"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";
import { ProductCard } from "@/app/components/ProductCard";
import type { Product } from "@/app/lib/types";
import { commerceCategories } from "@/app/lib/categories";

type ProductResponse = Awaited<ReturnType<typeof getProducts>>;

function readProducts(response: ProductResponse) {
  return Array.isArray(response) ? response : response.results;
}

export function ProductsClientPage({
  initialSearch,
  initialCategory,
}: {
  initialSearch: string;
  initialCategory: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  const [category, setCategory] = useState(initialCategory ?? "");
  const [price, setPrice] = useState<[number, number]>([0, 500]);

  const [availability, setAvailability] = useState("all");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);

  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [openFilters, setOpenFilters] = useState(false);

  /* ---------------- Debounce search ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- Fetch products ---------------- */
  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      ordering,
    });

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category__slug", category);

    params.set("min_price", String(price[0]));
    params.set("max_price", String(price[1]));

    if (availability === "in_stock") params.set("in_stock", "true");
    if (availability === "sold_out") params.set("in_stock", "false");

    getProducts(`?${params.toString()}`)
      .then((response) => {
        setProducts(readProducts(response));
        setHasNext(Boolean(!Array.isArray(response) && response.next));
        setHasPrev(Boolean(!Array.isArray(response) && response.previous));
      })
      .catch(() => {
        setProducts([]);
        setHasNext(false);
        setHasPrev(false);
      });
  }, [page, debouncedSearch, category, price, availability, ordering]);

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-10">
      {/* HEADER */}
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.36em] text-[var(--gold-deep)]">
          The collection
        </p>

        <h1 className="section-heading mt-4 text-5xl">
          Discover your next favorite piece.
        </h1>
      </section>

      {/* MOBILE FILTER BUTTON */}
      <button
        onClick={() => setOpenFilters(true)}
        className="lg:hidden gold-button mt-4 w-full rounded-full py-3"
      >
        Filters & Sorting
      </button>

      {/* MAIN GRID */}
      <section className="mt-8 grid gap-8 lg:grid-cols-[320px,1fr]">
        {/* DESKTOP FILTER */}
        <aside className="luxury-card hidden h-fit rounded-[34px] p-5 lg:block">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Filters
          </p>

          <div className="mt-5 space-y-4">
            {/* CATEGORY SELECT */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-[18px] border px-4 py-3"
            >
              <option value="">All categories</option>
              {commerceCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* PRICE SLIDER */}
            <div>
              <p className="text-xs uppercase text-[var(--muted)]">
                Price range
              </p>

              <input
                type="range"
                min={0}
                max={500}
                value={price[1]}
                onChange={(e) =>
                  setPrice([price[0], Number(e.target.value)])
                }
                className="w-full"
              />

              <p className="text-sm">
                ${price[0]} - ${price[1]}
              </p>
            </div>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full rounded-[18px] border px-4 py-3"
            >
              <option value="all">All</option>
              <option value="in_stock">In stock</option>
              <option value="sold_out">Sold out</option>
            </select>

            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="w-full rounded-[18px] border px-4 py-3"
            >
              <option value="-created_at">Newest</option>
              <option value="price">Price ↑</option>
              <option value="-price">Price ↓</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setPrice([0, 500]);
                setAvailability("all");
                setOrdering("-created_at");
                setPage(1);
              }}
              className="w-full rounded-full border px-4 py-3"
            >
              Clear filters
            </button>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              No products found.
            </p>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* PAGINATION */}
      <div className="mt-10 flex justify-center gap-4">
        <button
          disabled={!hasPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-full border px-5 py-3 disabled:opacity-40"
        >
          Previous
        </button>

        <button
          disabled={!hasNext}
          onClick={() => setPage((p) => p + 1)}
          className="gold-button rounded-full px-5 py-3 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {openFilters && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-6">
            <button
              onClick={() => setOpenFilters(false)}
              className="mb-6 text-sm text-gray-500"
            >
              Close ✕
            </button>

            <div className="space-y-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full rounded-[16px] border px-4 py-3"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-[16px] border px-4 py-3"
              >
                <option value="">All categories</option>
                {commerceCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setOpenFilters(false)}
                className="gold-button w-full rounded-full py-3"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </PageReveal>
  );
}
