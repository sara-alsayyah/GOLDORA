"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { megaCategoryGroups } from "@/app/lib/categories";

export function CategoryMegaMenu({
  open,
  onEnter,
  onLeave,
}: {
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22 }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 mx-auto hidden max-w-7xl rounded-[32px] border border-[rgba(143,108,29,0.14)] bg-[rgba(255,255,255,0.96)] p-6 shadow-[0_30px_80px_rgba(44,31,11,0.16)] backdrop-blur-lg lg:block"
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr,1.2fr,0.9fr,0.9fr]">
            {megaCategoryGroups.map((group, index) => (
              <div
                key={group.slug}
                className={`rounded-[26px] p-5 ${index === 0 ? "bg-[linear-gradient(135deg,#fffdf4,#f1dfb9)]" : "bg-white/72"}`}
              >
                <Link href={`/products?category=${group.slug}`} className="text-xs uppercase tracking-[0.22em] text-[var(--gold-deep)]">
                  {group.title}
                </Link>
                <p className="mt-3 font-[var(--font-display)] text-2xl">{group.spotlight}</p>
                <div className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
                  {group.links.map((link) => (
                    <Link key={link} href={`/products?category=${group.slug}&search=${encodeURIComponent(link)}`}>
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
