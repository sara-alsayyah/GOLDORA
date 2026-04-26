"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { asArray, getProducts } from "@/app/lib/api";
import { inferVisualSearch } from "@/app/lib/search";
import type { Product } from "@/app/lib/types";
import { SearchIcon } from "./icons";

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [visualMessage, setVisualMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(searchParams.get("search") ?? "");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const nextQuery = deferredQuery.trim();
    if (nextQuery.length < 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      getProducts(`?search=${encodeURIComponent(nextQuery)}&page=1`)
        .then((response) => setSuggestions(asArray(response).slice(0, 5)))
        .catch(() => setSuggestions([]));
    }, 180);

    return () => window.clearTimeout(timer);
  }, [deferredQuery]);

  function goToSearch(nextSearch: string, nextCategory = "") {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set("search", nextSearch.trim());
    if (nextCategory.trim()) params.set("category", nextCategory.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowSuggestions(false);
    goToSearch(query);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const inferred = inferVisualSearch(file.name);
    const message = inferred.category
      ? `Visual search guessed ${inferred.category.replace("-", " ")} from ${file.name}.`
      : `Visual search used ${file.name} as a keyword hint.`;

    setVisualMessage(message);
    setQuery(inferred.search || query);
    setShowSuggestions(false);
    goToSearch(inferred.search || query, inferred.category);
    event.target.value = "";
  }

  return (
    <div ref={containerRef} className="relative flex flex-1 items-center gap-2 lg:max-w-[34rem]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 items-center gap-2 rounded-full border border-[rgba(143,108,29,0.14)] bg-white/82 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
      >
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={pathname === "/products" ? "Search by product name" : "Search the collection"}
          className="min-w-0 flex-1 bg-transparent px-3 py-1 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
        />
        <button type="submit" className="gold-button rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em]">
         <SearchIcon className="h-4 w-4" />
        </button>
      </form>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {showSuggestions && suggestions.length ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-[rgba(255,255,255,0.95)] shadow-[0_24px_70px_rgba(44,31,11,0.16)] backdrop-blur-lg">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={() => setShowSuggestions(false)}
              className="flex items-center justify-between gap-4 border-b border-[rgba(143,108,29,0.08)] px-4 py-3 last:border-b-0 hover:bg-[rgba(255,250,238,0.95)]"
            >
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{product.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{product.category.name}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.14em] text-[var(--gold-deep)]">View</span>
            </Link>
          ))}
        </div>
      ) : null}
      {visualMessage ? (
        <p className="hidden text-xs text-[var(--muted)] xl:block">{visualMessage}</p>
      ) : null}
    </div>
  );
}
