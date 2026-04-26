import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { BoutiqueIntro } from "@/app/components/BoutiqueIntro";
import { BRAND_NAME } from "@/app/lib/brand";
import { AppShell } from "@/app/components/AppShell";
export const metadata: Metadata = {
  title: BRAND_NAME,
  description: "A luxury everything-store experience built with Next.js and Django REST Framework.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
  <BoutiqueIntro />
  <AppShell>
    {children}
  </AppShell>
</StoreProvider>
      </body>
    </html>
  );
}
