"use client";

import { money } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { addAddress, checkout, getAddresses } from "@/app/lib/api";
import type { Address } from "@/app/lib/types";
import { PageReveal } from "@/app/components/PageReveal";
import { useStore } from "@/app/providers/StoreProvider";

export default function CheckoutPage() {
  const { token, cartItems = [], subtotal, refreshCart } = useStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    city: "",
    street: "",
  });

  useEffect(() => {
    if (!token) return;

    getAddresses(token)
      .then((data) => {
        setAddresses(data);
        setSelectedAddress(data?.[0]?.id ?? null);
      })
      .catch(() => setAddresses([]));
  }, [token]);

  useEffect(() => {
    if (!message) return;

    const t = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(t);
  }, [message]);

  async function handleAddAddress() {
    if (!token) return;

    if (!addressForm.full_name || !addressForm.phone || !addressForm.city || !addressForm.street) {
      setMessage("Please fill in all address fields.");
      return;
    }

    await addAddress(token, addressForm);

    const refreshed = await getAddresses(token);
    setAddresses(refreshed);

    setSelectedAddress(refreshed?.[refreshed.length - 1]?.id ?? null);

    setAddressForm({
      full_name: "",
      phone: "",
      city: "",
      street: "",
    });

    setMessage("Address saved.");
  }

  async function handleCheckout() {
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    if (!cartItems.length) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      setMessage("Please select a delivery address.");
      return;
    }

    try {
      setLoading(true);

      const response = await checkout(
        token,
        selectedAddress,
        coupon || undefined,
        paymentMethod
      );

      await refreshCart();

      setMessage(response.message);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Checkout failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">
          Secure checkout
        </p>
        <h1 className="section-heading mt-4 text-5xl">
          Complete your order with confidence.
        </h1>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr,420px]">
        {/* LEFT */}
        <div className="space-y-6">

          {/* ADDRESS FORM */}
          <div className="luxury-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Shipping details
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["full_name", "Full name"],
                ["phone", "Phone"],
                ["city", "City"],
                ["street", "Street address"],
              ].map(([key, placeholder]) => (
                <input
                  key={key}
                  value={addressForm[key as keyof typeof addressForm]}
                  onChange={(e) =>
                    setAddressForm((c) => ({
                      ...c,
                      [key]: e.target.value,
                    }))
                  }
                  placeholder={placeholder}
                  className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2"
                />
              ))}
            </div>

            <button
              onClick={handleAddAddress}
              className="gold-button mt-5 rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em]"
            >
              Save address
            </button>
          </div>

          {/* ADDRESSES */}
          <div className="luxury-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Delivery address
            </p>

            <div className="mt-5 space-y-4">
              {!addresses.length && (
                <p className="text-sm text-[var(--muted)]">
                  No saved addresses yet.
                </p>
              )}

              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-[24px] border p-4 ${
                    selectedAddress === address.id
                      ? "border-[rgba(212,175,55,0.54)] bg-white/90"
                      : "border-[rgba(143,108,29,0.14)] bg-white/60"
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedAddress === address.id}
                    onChange={() => setSelectedAddress(address.id)}
                  />

                  <div>
                    <p className="font-medium">{address.full_name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {address.street}, {address.city}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="luxury-card h-fit rounded-[34px] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            Order summary
          </p>

          <div className="mt-5 space-y-3">
            {!cartItems.length && (
              <p className="text-sm text-[var(--muted)]">
                Your cart is empty.
              </p>
            )}

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  {money(Number(item.product.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* COUPON */}
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Gift card or coupon code"
            className="mt-6 w-full rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none"
          />

          {/* PAYMENT */}
          <div className="mt-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Payment
            </p>

            {[
              ["cod", "Cash on delivery"],
              ["card", "Card payment"],
              ["bank", "Bank transfer"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-3 ${
                  paymentMethod === value
                    ? "border-[rgba(212,175,55,0.54)] bg-white/90"
                    : "border-[rgba(143,108,29,0.14)] bg-white/60"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mt-6 flex items-center justify-between text-sm text-[var(--muted)]">
            <span>Total</span>
            <span className="text-xl text-[var(--foreground)]">
              {money(subtotal)}
            </span>
          </div>

          {/* CHECKOUT */}
          <button
            onClick={handleCheckout}
            disabled={loading || !cartItems.length}
            className="gold-button mt-6 w-full rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place order"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-[var(--muted)]">{message}</p>
          )}
        </aside>
      </section>
    </PageReveal>
  );
}