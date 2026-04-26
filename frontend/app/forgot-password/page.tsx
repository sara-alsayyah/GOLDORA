"use client";

import Link from "next/link";
import { useState } from "react";
import { requestPasswordReset } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await requestPasswordReset(email);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageReveal className="page-shell mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">Password recovery</p>
        <h1 className="section-heading mt-4 text-5xl">Reset your access.</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
          Enter the email linked to your account and we will send a secure reset link.
        </p>

        <div className="mt-8 space-y-4">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-[18px] border px-4 py-3"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="gold-button w-full rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </div>

        {message ? <p className="mt-4 text-sm text-[var(--muted)]">{message}</p> : null}

        <p className="mt-6 text-sm text-[var(--muted)]">
          Back to <Link href="/login" className="text-[var(--gold-deep)]">login</Link>
        </p>
      </section>
    </PageReveal>
  );
}
