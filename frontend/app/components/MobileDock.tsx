"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { CartIcon, DiscoverIcon, HeartIcon, SearchIcon, UserIcon } from "@/app/components/icons";
import { useStore } from "@/app/providers/StoreProvider";
import { BrandLogo } from "@/app/components/BrandLogo";

export function MobileDock() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, openCart, openWishlist } = useStore();

  const links = [
    { href: "/", label: "Home", icon: <BrandLogo compact /> },
    { href: "/products", label: "Search", icon: <SearchIcon className="h-5 w-5" /> },
    { href: "/products?category=women", label: "Discover", icon: <DiscoverIcon className="h-5 w-5" /> },
    { href: "/account", label: "Profile", icon: <UserIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 lg:hidden">
      <div className="mb-3 flex items-center justify-between rounded-[26px] border border-[rgba(143,108,29,0.14)] bg-[rgba(255,255,255,0.84)] px-4 py-3 shadow-[0_18px_50px_rgba(51,38,11,0.14)] backdrop-blur-lg">
        <button
          onClick={openWishlist}
          className="relative flex items-center gap-2 rounded-full border border-[rgba(143,108,29,0.14)] px-4 py-2 text-sm text-[var(--gold-deep)]"
        >
          <HeartIcon className="h-5 w-5" />
          <span>Wishlist</span>
          {wishlistCount ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] text-white">
              {wishlistCount}
            </span>
          ) : null}
        </button>
        <button
          onClick={openCart}
          className="relative flex items-center gap-2 rounded-full border border-[rgba(143,108,29,0.14)] px-4 py-2 text-sm text-[var(--gold-deep)]"
        >
          <CartIcon className="h-5 w-5" />
          <span>Cart</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] text-white">
            {cartCount}
          </span>
        </button>
      </div>
      <div className="flex items-center justify-between rounded-full border border-[rgba(143,108,29,0.16)] bg-[rgba(255,255,255,0.88)] px-5 py-3 shadow-[0_18px_50px_rgba(51,38,11,0.16)] backdrop-blur-lg">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]));
          return (
            <motion.div key={link.label} whileTap={{ scale: 0.96 }}>
              <Link
                href={link.href}
                className={`flex min-w-16 flex-col items-center gap-1 rounded-full px-3 py-1 text-xs ${
                  active ? "bg-[rgba(255,249,234,0.95)] text-[var(--gold-deep)]" : "text-[var(--muted)]"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
