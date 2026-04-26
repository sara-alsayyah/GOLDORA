"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND_NAME } from "@/app/lib/brand";
import { BrandLogo } from "@/app/components/BrandLogo";

const STORAGE_KEY = "Goldora-intro";

export function BoutiqueIntro() {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      setShowIntro(!seen);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function closeIntro() {
    window.localStorage.setItem(STORAGE_KEY, "seen");
    setShowIntro(false);
  }

  if (showIntro === null) return null;

  return (
    <AnimatePresence>
      {showIntro ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeOut" } }}
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[rgba(244,236,223,0.48)] backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,182,89,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.82),rgba(238,224,197,0.48))]"
          />

          <div className="relative flex flex-col items-center gap-10 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <BrandLogo />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl text-xs uppercase tracking-[0.42em] text-[var(--gold-deep)]"
            >
              {BRAND_NAME} opens into a golden souk of fashion, beauty, home, and everyday luxuries
            </motion.p>

            <div className="relative h-[440px] w-[280px] sm:h-[540px] sm:w-[340px]">
              <div className="absolute inset-[24px] overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#fef8ec,#e9d3a0)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.74),transparent_26%),linear-gradient(180deg,rgba(143,108,29,0.08),transparent_45%)]" />
                <div className="absolute inset-0 grid grid-cols-3 gap-3 p-4 opacity-95">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0.2, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.04, duration: 0.35 }}
                      className={`rounded-[16px] border border-white/40 ${
                        index % 4 === 0
                          ? "bg-[linear-gradient(180deg,#fffef9,#d8b35b)]"
                          : index % 3 === 0
                            ? "bg-[linear-gradient(180deg,#fff2d6,#c89a37)]"
                            : "bg-[linear-gradient(180deg,#fffdf4,#f0d58f)]"
                      }`}
                    >
                      <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_32%)]" />
                    </motion.div>
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(143,108,29,0.2))]" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.82, 0.4] }}
                transition={{ duration: 2.6, times: [0, 0.65, 1] }}
                className="absolute -left-10 top-8 h-[88%] w-[140%] rounded-full bg-[radial-gradient(circle,rgba(232,190,72,0.45),rgba(232,190,72,0)_70%)] blur-3xl"
              />
              <div className="absolute inset-0 rounded-[34px] bg-white/65 shadow-[0_40px_120px_rgba(47,35,13,0.18)]">
                <div className="absolute inset-[14px] rounded-[26px] border border-[rgba(212,175,55,0.54)]" />
                <div className="absolute inset-[26px] overflow-hidden rounded-[20px]">
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -115 }}
                    transition={{ duration: 2.6, ease: [0.23, 1, 0.32, 1], delay: 0.55 }}
                    style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                    className="absolute inset-y-0 left-0 w-1/2 rounded-l-[20px] border border-[rgba(212,175,55,0.45)] bg-[linear-gradient(180deg,#fdfaf3,#ebd7af)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(96,67,14,0.12)_0,rgba(96,67,14,0.12)_8%,transparent_8%,transparent_16%,rgba(96,67,14,0.12)_16%,rgba(96,67,14,0.12)_24%,transparent_24%,transparent_32%,rgba(96,67,14,0.12)_32%,rgba(96,67,14,0.12)_40%,transparent_40%,transparent_48%,rgba(96,67,14,0.12)_48%,rgba(96,67,14,0.12)_56%,transparent_56%,transparent_64%,rgba(96,67,14,0.12)_64%,rgba(96,67,14,0.12)_72%,transparent_72%)]" />
                  </motion.div>
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 115 }}
                    transition={{ duration: 2.6, ease: [0.23, 1, 0.32, 1], delay: 0.55 }}
                    style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
                    className="absolute inset-y-0 right-0 w-1/2 rounded-r-[20px] border border-[rgba(212,175,55,0.45)] bg-[linear-gradient(180deg,#fdfaf3,#ebd7af)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(96,67,14,0.12)_0,rgba(96,67,14,0.12)_8%,transparent_8%,transparent_16%,rgba(96,67,14,0.12)_16%,rgba(96,67,14,0.12)_24%,transparent_24%,transparent_32%,rgba(96,67,14,0.12)_32%,rgba(96,67,14,0.12)_40%,transparent_40%,transparent_48%,rgba(96,67,14,0.12)_48%,rgba(96,67,14,0.12)_56%,transparent_56%,transparent_64%,rgba(96,67,14,0.12)_64%,rgba(96,67,14,0.12)_72%,transparent_72%)]" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: [0.15, 0.95, 0.56] }}
                    transition={{ duration: 2.4, delay: 0.8 }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(243,214,123,0.8),rgba(243,214,123,0.06)_45%,transparent_68%)]"
                  />
                </div>
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              onClick={closeIntro}
              className="rounded-full border border-[rgba(143,108,29,0.24)] bg-white/72 px-6 py-3 text-sm uppercase tracking-[0.24em] text-[var(--gold-deep)] transition hover:bg-white"
            >
              Enter the souk
            </motion.button>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "10rem" }}
              transition={{ duration: 2.2, delay: 0.8 }}
              className="h-px bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.9),transparent)]"
            />
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            onClick={closeIntro}
            className="absolute bottom-8 text-xs uppercase tracking-[0.28em] text-[var(--muted)]"
          >
            Skip intro
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
