"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!uid || !token) {
      setMessage("Reset link is missing or invalid.");
      return;
    }

    if (!newPassword || newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await confirmPasswordReset({
        uid,
        token,
        new_password: newPassword,
      });
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">
      <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">New password</p>
      <h1 className="section-heading mt-4 text-5xl">Create a fresh password.</h1>

      <div className="mt-8 space-y-4">
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="New password"
          className="w-full rounded-[18px] border px-4 py-3"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm password"
          className="w-full rounded-[18px] border px-4 py-3"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="gold-button w-full rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </div>

      {message ? <p className="mt-4 text-sm text-[var(--muted)]">{message}</p> : null}

      <p className="mt-6 text-sm text-[var(--muted)]">
        Return to <Link href="/login" className="text-[var(--gold-deep)]">login</Link>
      </p>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <PageReveal className="page-shell mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <Suspense fallback={<section className="luxury-card rounded-[40px] px-6 py-8 sm:px-10"><p className="text-sm text-[var(--muted)]">Loading reset form...</p></section>}>
        <ResetPasswordContent />
      </Suspense>
    </PageReveal>
  );
}
