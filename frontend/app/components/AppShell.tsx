"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { FloatingCart } from "@/app/components/FloatingCart";
import { MobileDock } from "@/app/components/MobileDock";
import { QuickViewModal } from "@/app/components/QuickViewModal";
import { RecentlyViewedPanel } from "@/app/components/RecentlyViewedPanel";
import { WishlistDrawer } from "@/app/components/WishlistDrawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

const hideLayout = [
  "/login",
  "/register",
  "/checkout",
  "/admin"
].includes(pathname);

  return (
    <>
      {!hideLayout && <SiteHeader />}

      {children}

      {!hideLayout && (
        <>
          <SiteFooter />
          <QuickViewModal />
          <WishlistDrawer />
          <RecentlyViewedPanel />
          <MobileDock />
          <FloatingCart />
        </>
      )}
    </>
  );
}