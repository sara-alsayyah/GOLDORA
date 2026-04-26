"use client";

import { PageReveal } from "@/app/components/PageReveal";

const notifications = [
  {
    id: 1,
    label: "Order update",
    title: "Your latest order is being prepared",
    body: "Packaging has started and your pieces will be ready for dispatch soon.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    label: "Wishlist alert",
    title: "A saved item is almost sold out",
    body: "One of your wishlist picks is running low, so this is a good time to check it again.",
    time: "19 min ago",
    unread: true,
  },
  {
    id: 3,
    label: "Private offer",
    title: "A members-only promotion just opened",
    body: "Selected categories now have limited-time pricing inspired by shopping apps like Shein, but styled for your storefront.",
    time: "Today",
    unread: false,
  },
  {
    id: 4,
    label: "Style note",
    title: "Fresh arrivals were added to your favorite categories",
    body: "New fashion, beauty, and accessory pieces were added to the collection.",
    time: "Yesterday",
    unread: false,
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <PageReveal className="page-shell mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">
          Inbox
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="section-heading text-5xl">Notifications</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              A GOLDORA activity center for order updates, wishlist alerts, and fresh offers.
            </p>
          </div>
          <div className="rounded-full border border-[rgba(143,108,29,0.16)] bg-white/80 px-5 py-3 text-sm text-[var(--gold-deep)]">
            {unreadCount} unread
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {notifications.map((item) => (
          <article
            key={item.id}
            className={`luxury-card rounded-[30px] p-5 sm:p-6 ${
              item.unread ? "border-[rgba(212,175,55,0.42)]" : ""
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[rgba(255,248,230,0.96)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--gold-deep)]">
                  {item.label}
                </span>
                {item.unread ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
                ) : null}
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                {item.time}
              </span>
            </div>

            <h2 className="mt-4 font-[var(--font-display)] text-3xl">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </section>
    </PageReveal>
  );
}
