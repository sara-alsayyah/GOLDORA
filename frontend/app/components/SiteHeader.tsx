"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useStore } from "@/app/providers/StoreProvider";
import { commerceCategories } from "@/app/lib/categories";
import { HeaderSearch } from "@/app/components/HeaderSearch";
import { BrandLogo } from "@/app/components/BrandLogo";
import { CategoryMegaMenu } from "@/app/components/CategoryMegaMenu";
import {
  CloseIcon,
  HeartIcon,
  MailIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "@/app/components/icons";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/checkout", label: "Checkout" },
  { href: "/account", label: "Account" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { token, logout, openWishlist, wishlistCount, toggleThemeMode, themeMode } = useStore();
  const pathname = usePathname();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 28);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  function closeMenus() {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-40 px-3 transition-all duration-300 sm:px-6 lg:px-10 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={`luxury-panel relative rounded-[28px] transition-all duration-300 ${
            isScrolled ? "px-4 py-3 sm:px-5" : "px-4 py-4 sm:px-6 sm:py-5"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(143,108,29,0.16)] bg-white/80 text-[var(--gold-deep)] lg:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>

            <Link href="/" onClick={closeMenus} className="min-w-0 shrink">
              <BrandLogo />
            </Link>

            <nav className="ml-4 hidden items-center gap-8 text-sm tracking-wide xl:flex">
              <button
                type="button"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
                className="transition hover:text-[var(--gold-deep)]"
              >
                Categories
              </button>

              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setIsMegaMenuOpen(false)}
                  onClick={closeMenus}
                  className={`transition hover:text-[var(--gold-deep)] ${
                    pathname === item.href ? "text-[var(--gold-deep)]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto hidden min-w-0 flex-1 justify-center lg:flex xl:max-w-[30rem]">
              <Suspense
                fallback={
                  <div className="w-full rounded-full border border-[rgba(143,108,29,0.14)] bg-white/80 px-5 py-3 text-sm text-[var(--muted)]">
                    Search products...
                  </div>
                }
              >
                <HeaderSearch />
              </Suspense>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleThemeMode}
                className="hidden rounded-full border border-[rgba(143,108,29,0.16)] bg-white/80 p-3 md:flex"
                aria-label="Toggle theme"
              >
                {themeMode === "light" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
              </button>

              <Link
                href="/notifications"
                onClick={closeMenus}
                className="hidden rounded-full border border-[rgba(143,108,29,0.16)] bg-white/80 p-3 md:flex"
                aria-label="Open notifications"
              >
                <MailIcon className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={openWishlist}
                className="relative rounded-full border border-[rgba(143,108,29,0.16)] bg-white/80 p-3"
                aria-label="Open wishlist"
              >
                <HeartIcon className="h-4 w-4" />
                {wishlistCount ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] text-white">
                    {wishlistCount}
                  </span>
                ) : null}
              </button>

              {!isMounted ? (

  <div className="w-10 h-10" />
) : token ? (
  <>
    <Link
      href="/account"
      onClick={closeMenus}
      className="rounded-full border border-[rgba(143,108,29,0.16)] bg-white/80 p-3"
    >
      <UserIcon className="h-4 w-4" />
    </Link>

    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      onClick={logout}
      className="hidden rounded-full border border-[rgba(143,108,29,0.16)] bg-white/80 px-5 py-2 text-sm md:block"
    >
      Logout
    </motion.button>
  </>
) : (
  <div className="hidden items-center gap-2 md:flex">
    <Link href="/login" onClick={closeMenus} className="px-4 py-2 text-sm">
      Login
    </Link>
    <Link
      href="/register"
      onClick={closeMenus}
      className="gold-button rounded-full px-5 py-2 text-sm"
    >
      Join
    </Link>
  </div>
)}
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <Suspense
              fallback={
                <div className="w-full rounded-full border border-[rgba(143,108,29,0.14)] bg-white/80 px-5 py-3 text-sm text-[var(--muted)]">
                  Search products...
                </div>
              }
            >
              <HeaderSearch />
            </Suspense>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isScrolled ? "max-h-0 opacity-0" : "max-h-40 opacity-100"
            }`}
          >
            <div className="mt-4 hidden items-center justify-center gap-10 lg:flex xl:hidden">
              <nav className="flex items-center gap-10 text-sm tracking-wide">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className={`transition hover:text-[var(--gold-deep)] ${
                      pathname === item.href ? "text-[var(--gold-deep)]" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isScrolled ? "mt-0 max-h-0 opacity-0" : "mt-4 max-h-32 opacity-100"
            }`}
          >
            <div className="flex gap-3 overflow-x-auto pb-1">
              {commerceCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  onClick={closeMenus}
                  className="whitespace-nowrap rounded-full border bg-white/80 px-4 py-2 text-xs uppercase tracking-wider transition hover:border-[var(--gold)] hover:text-[var(--gold-deep)]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {isMobileMenuOpen ? (
            <div className="mt-4 rounded-[24px] border border-[rgba(143,108,29,0.12)] bg-white/80 p-4 lg:hidden">
              <div className="grid gap-3">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className={`rounded-[18px] px-4 py-3 text-sm transition ${
                      pathname === item.href
                        ? "bg-[rgba(255,248,230,0.92)] text-[var(--gold-deep)]"
                        : "bg-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <Link href="/notifications" onClick={closeMenus} className="rounded-[18px] px-4 py-3 text-sm">
                  Notifications
                </Link>

                <button
                  type="button"
                  onClick={toggleThemeMode}
                  className="flex items-center justify-between rounded-[18px] px-4 py-3 text-sm"
                >
                  <span>Switch theme</span>
                  {themeMode === "light" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
                </button>

                {isMounted && (token ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-[18px] px-4 py-3 text-left text-sm"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link href="/login" onClick={closeMenus} className="rounded-[18px] border px-4 py-3 text-center text-sm">
                      Login
                    </Link>
                    <Link href="/register" onClick={closeMenus} className="gold-button rounded-[18px] px-4 py-3 text-center text-sm">
                      Join
                    </Link>
                  </div>
                  )
                )}
              </div>
            </div>
          ) : null}
        </div>

        <CategoryMegaMenu
          open={isMegaMenuOpen}
          onEnter={() => setIsMegaMenuOpen(true)}
          onLeave={() => setIsMegaMenuOpen(false)}
        />
      </div>
    </header>
  );
}
