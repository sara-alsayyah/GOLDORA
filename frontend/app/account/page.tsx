"use client";

import { useEffect, useState } from "react";
import { getAddresses, getOrders, getProfile, updateProfile } from "@/app/lib/api";
import type { Address, Order, UserProfile } from "@/app/lib/types";
import { PageReveal } from "@/app/components/PageReveal";
import { money } from "@/app/lib/api";
import { useStore } from "@/app/providers/StoreProvider";
import { asArray } from "@/app/lib/api";

type AccountTab = "overview" | "profile" | "addresses" | "orders";

export default function AccountPage() {
  const { token } = useStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);
  const [activeTab, setActiveTab] = useState<AccountTab>("overview");

  useEffect(() => {
    if (!token) return;
    void Promise.all([getProfile(token), getOrders(token), getAddresses(token)])
      .then(([user, userOrders, userAddresses]) => {
        setProfile(user);
        setOrders(asArray(userOrders));
        setAddresses(userAddresses);
      })
      .catch(() => setMessage("Login to view your account dashboard."));
  }, [token]);

  async function saveProfile() {
    if (!token || !profile) return;
    const updated = await updateProfile(token, profile);
    setProfile(updated);
    setMessage("Profile updated.");
  }

  const tabs: { id: AccountTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "profile", label: "Profile" },
    { id: "addresses", label: "Addresses" },
    { id: "orders", label: "Orders" },
  ];

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">Account dashboard</p>
        <h1 className="section-heading mt-4 text-5xl">Profile, addresses, and orders in one calm place.</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Orders</p>
            <p className="mt-2 font-[var(--font-display)] text-3xl">{orders.length}</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Addresses</p>
            <p className="mt-2 font-[var(--font-display)] text-3xl">{addresses.length}</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Status</p>
            <p className="mt-2 font-[var(--font-display)] text-3xl">
  {isMounted && (token ? "Active" : "Guest")}
</p>
          </div>
        </div>
      </section>

      {!token ? (
        <div className="luxury-card mt-8 rounded-[34px] p-10 text-center">
          <p className="font-[var(--font-display)] text-3xl">Please login to access your account.</p>
        </div>
      ) : (
        <section className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-3 text-sm uppercase tracking-[0.16em] ${
                  activeTab === tab.id
                    ? "gold-button"
                    : "border border-[rgba(143,108,29,0.14)] bg-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" ? (
            <div className="grid gap-8 lg:grid-cols-[1fr,0.95fr]">
              <div className="luxury-card rounded-[34px] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Member snapshot</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Customer</p>
                    <p className="mt-2 text-lg font-medium">{profile?.first_name} {profile?.last_name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{profile?.email}</p>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Primary phone</p>
                    <p className="mt-2 text-lg font-medium">{profile?.phone || "Not added yet"}</p>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Latest order</p>
                    <p className="mt-2 text-lg font-medium">{orders[0] ? `#${orders[0].id}` : "No orders yet"}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{orders[0] ? orders[0].status : "Place your first order"}</p>
                  </div>
                  <div className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Saved addresses</p>
                    <p className="mt-2 text-lg font-medium">{addresses.length}</p>
                  </div>
                </div>
              </div>

              <div className="luxury-card rounded-[34px] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Recent order activity</p>
                <div className="mt-5 space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="rounded-[22px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm uppercase tracking-[0.16em] text-[var(--gold-deep)]">{order.status}</p>
                          <p className="mt-1 text-sm">{money(order.total_price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!orders.length ? <p className="text-sm text-[var(--muted)]">Orders will appear here after checkout.</p> : null}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "profile" ? (
            <div className="luxury-card rounded-[34px] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Profile</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input value={profile?.first_name ?? ""} onChange={(event) => setProfile((current) => (current ? { ...current, first_name: event.target.value } : current))} placeholder="First name" className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none" />
                <input value={profile?.last_name ?? ""} onChange={(event) => setProfile((current) => (current ? { ...current, last_name: event.target.value } : current))} placeholder="Last name" className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none" />
                <input value={profile?.email ?? ""} onChange={(event) => setProfile((current) => (current ? { ...current, email: event.target.value } : current))} placeholder="Email" className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2" />
                <input value={profile?.phone ?? ""} onChange={(event) => setProfile((current) => (current ? { ...current, phone: event.target.value } : current))} placeholder="Phone" className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2" />
              </div>
              <button type="button" onClick={() => void saveProfile()} className="gold-button mt-5 rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em]">
                Save changes
              </button>
            </div>
          ) : null}

          {activeTab === "addresses" ? (
            <div className="luxury-card rounded-[34px] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Addresses</p>
              <div className="mt-5 space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">{address.full_name}</p>
                      {address.phone ? <p className="text-sm text-[var(--muted)]">{address.phone}</p> : null}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{address.street}, {address.city}</p>
                  </div>
                ))}
                {!addresses.length ? <p className="text-sm text-[var(--muted)]">Save an address during checkout to see it here.</p> : null}
              </div>
            </div>
          ) : null}

          {activeTab === "orders" ? (
            <div className="luxury-card rounded-[34px] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Orders</p>
              <h2 className="mt-2 font-[var(--font-display)] text-2xl">Your recent orders</h2>
              <div className="mt-5 space-y-4">
                {!orders.length ? (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[rgba(143,108,29,0.2)] bg-white/50 p-8 text-center">
                    <p className="text-lg font-medium">No orders yet</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">When you place your first order, it will appear here.</p>
                    <button type="button" onClick={() => (window.location.href = "/products")} className="gold-button mt-5 rounded-full px-6 py-2 text-xs uppercase tracking-[0.18em]">
                      Start shopping
                    </button>
                  </div>
                ) : (
                  orders.map((order) => {
                    const steps = ["pending", "paid", "shipped", "delivered"];
                    const activeIndex = steps.indexOf(order.status);
                    return (
                      <div key={order.id} className="rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/66 p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-[var(--font-display)] text-xl">Order #{order.id}</p>
                            <p className="mt-1 text-sm text-[var(--muted)]">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm uppercase tracking-[0.18em] text-[var(--gold-deep)]">{order.status}</p>
                            <p className="mt-1 text-lg font-medium">{money(order.total_price)}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
                          <span>{order.items?.length ?? 0} items</span>
                          <span>{order.payment_method?.replace("_", " ") ?? "payment at checkout"}</span>
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                          {steps.map((step, index) => {
                            const active = index <= activeIndex;
                            return (
                              <div key={step} className="flex flex-col items-center gap-1">
                                <span className={`h-3 w-3 rounded-full ${active ? "bg-[var(--gold)]" : "bg-[rgba(143,108,29,0.18)]"}`} />
                                <span className={`text-[10px] uppercase tracking-[0.1em] ${active ? "text-[var(--gold-deep)]" : "text-[var(--muted)]"}`}>{step}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}
        </section>
      )}

      {message ? <p className="mt-6 text-center text-sm text-[var(--muted)]">{message}</p> : null}
    </PageReveal>
  );
}
