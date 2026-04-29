"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addAddress, checkout, getAddresses, money } from "@/app/lib/api";
import type { Address } from "@/app/lib/types";
import { PageReveal } from "@/app/components/PageReveal";
import { useStore } from "@/app/providers/StoreProvider";

export default function CheckoutPage() {
  const { token, cartItems = [], refreshCart } = useStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    country: "Lebanon",
    notes: "",
  });
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
        if (data?.[0]?.phone) {
          setContact((current) => ({ ...current, phone: data[0].phone ?? current.phone }));
        }
      })
      .catch(() => setAddresses([]));
  }, [token]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(timer);
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
    setSelectedAddress(refreshed.at(-1)?.id ?? null);
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

    if (!contact.email) {
      setMessage("Please enter your email for delivery updates.");
      return;
    }

    if (paymentMethod === "card" && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) {
      setMessage("Please complete the card details.");
      return;
    }

    try {
      setLoading(true);
      const response = await checkout(token, selectedAddress, coupon || undefined, paymentMethod);
      await refreshCart();
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  const numericSubtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  const estimatedShipping = cartItems.length ? 7.5 : 0;
  const estimatedTax = cartItems.length ? numericSubtotal * 0.04 : 0;
 const orderTotal = numericSubtotal + estimatedShipping + estimatedTax - discount;
  const orderSteps = ["Bag", "Address", "Payment", "Review"];

  return (
    <PageReveal className="page-shell mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[38px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">
          Secure checkout
        </p>
        <h1 className="section-heading mt-4 text-5xl">
          Complete your order with confidence.
        </h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {orderSteps.map((step, index) => (
            <div
              key={step}
              className={`rounded-[22px] border px-4 py-3 text-sm ${
                index < 3
                  ? "border-[rgba(212,175,55,0.34)] bg-white/86 text-[var(--gold-deep)]"
                  : "border-[rgba(143,108,29,0.14)] bg-white/62 text-[var(--muted)]"
              }`}
            >
              <span className="text-xs uppercase tracking-[0.18em]">Step {index + 1}</span>
              <p className="mt-1 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr,420px]">
        <div className="space-y-6">
          <div className="luxury-card rounded-[34px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Express options
                </p>
                <h2 className="mt-2 font-[var(--font-display)] text-3xl">
                  Fast lane checkout
                </h2>
              </div>
              <div className="rounded-full border border-[rgba(143,108,29,0.14)] bg-white/72 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--gold-deep)]">
                Encrypted session
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["PayPal", "Apple Pay", "Saved card"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className="rounded-[20px] border border-[rgba(143,108,29,0.14)] bg-white/72 px-4 py-4 text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="luxury-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Contact information
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                value={contact.email}
                onChange={(e) => setContact((current) => ({ ...current, email: e.target.value }))}
                placeholder="Email address"
                className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2"
              />
              <input
                value={contact.phone}
                onChange={(e) => setContact((current) => ({ ...current, phone: e.target.value }))}
                placeholder="Mobile number"
                className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none"
              />
              <select
                value={contact.country}
                onChange={(e) => setContact((current) => ({ ...current, country: e.target.value }))}
                className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none"
              >
                <option>Lebanon</option>
                <option>United Arab Emirates</option>
                <option>Saudi Arabia</option>
                <option>France</option>
              </select>
              <textarea
                value={contact.notes}
                onChange={(e) => setContact((current) => ({ ...current, notes: e.target.value }))}
                placeholder="Delivery notes, landmark, or building instructions"
                rows={3}
                className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2"
              />
            </div>
          </div>

          <div className="luxury-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Add a new address
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
                    setAddressForm((current) => ({
                      ...current,
                      [key]: e.target.value,
                    }))
                  }
                  placeholder={placeholder}
                  className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddAddress}
              className="gold-button mt-5 rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em]"
            >
              Save address
            </button>
          </div>

          <div className="luxury-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Delivery address
            </p>

            <div className="mt-5 space-y-4">
              {!addresses.length ? (
                <p className="text-sm text-[var(--muted)]">
                  No saved addresses yet.
                </p>
              ) : null}

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
                    {address.phone ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--gold-deep)]">
                        {address.phone}
                      </p>
                    ) : null}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="luxury-card rounded-[34px] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Payment method
            </p>

            <div className="mt-5 space-y-3">
              {[
                ["cod", "Cash on delivery", "Pay once the package reaches your door."],
                ["card", "Credit or debit card", "Use a secure card checkout with verification."],
                ["bank", "Bank transfer", "We will send transfer details after the order is placed."],
              ].map(([value, label, description]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-[20px] border px-4 py-4 ${
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
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === "card" ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails((current) => ({ ...current, number: e.target.value }))}
                  placeholder="Card number"
                  className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2"
                />
                <input
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails((current) => ({ ...current, name: e.target.value }))}
                  placeholder="Name on card"
                  className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2"
                />
                <input
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails((current) => ({ ...current, expiry: e.target.value }))}
                  placeholder="MM/YY"
                  className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none"
                />
                <input
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails((current) => ({ ...current, cvv: e.target.value }))}
                  placeholder="CVV"
                  className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none"
                />
              </div>
            ) : null}
          </div>
        </div>

        <aside className="luxury-card h-fit rounded-[34px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Order summary
              </p>
              <h2 className="mt-2 font-[var(--font-display)] text-3xl">Review your bag</h2>
            </div>
            <Link href="/cart" className="text-sm text-[var(--gold-deep)]">Edit</Link>
          </div>

          <div className="mt-5 space-y-3">
            {!cartItems.length ? (
              <p className="text-sm text-[var(--muted)]">
                Your cart is empty.
              </p>
            ) : null}

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[20px] border border-[rgba(143,108,29,0.12)] bg-white/64 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span>{money(Number(item.product.price) * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
          

          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Gift card or coupon code"
            className="mt-6 w-full rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none"
          />
          <button
  type="button"
  onClick={() => {
  if (!coupon.trim()) {
    setMessage("Enter a coupon code");
    return;
  }

  setMessage("Coupon will be applied at checkout");
}}

  className="gold-button mt-5 rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em]"
>
  Apply coupon
</button>

          <div className="mt-6 rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-white/64 p-4">
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Subtotal</span>
              <span>{money(numericSubtotal)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Estimated shipping</span>
              <span>{money(estimatedShipping)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Estimated taxes</span>
              <span>{money(estimatedTax)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[rgba(143,108,29,0.12)] pt-4 text-sm text-[var(--muted)]">
              <span>Total due today</span>
              <span className="text-xl text-[var(--foreground)]">{money(orderTotal)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-[rgba(143,108,29,0.14)] bg-[linear-gradient(135deg,#fffdf4,#f1dfb9)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold-deep)]">
              Delivery promise
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Estimated arrival in 3-6 business days, with order updates sent to your email and mobile number.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading || !cartItems.length}
            className="gold-button mt-6 w-full rounded-full px-5 py-3 text-sm uppercase tracking-[0.18em] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place order"}
          </button>

          {message ? (
            <p className="mt-4 text-sm text-[var(--muted)]">{message}</p>
          ) : null}
        </aside>
      </section>
    </PageReveal>
  );
}
