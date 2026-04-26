"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";
import { useStore } from "@/app/providers/StoreProvider";
import { EyeIcon } from "@/app/components/icons";

type Errors = {
  email?: string;
  password?: string;
  general?: string;
};

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "detail" in error) {
    const detail = error.detail;
    if (typeof detail === "string") return detail;
  }
  return "Invalid email or password. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const { saveToken } = useStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // 📧 email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const newErrors: Errors = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password) newErrors.password = "Password is required";

    return newErrors;
  }

  async function handleLogin() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const tokens = await login(form.email, form.password);

      if (remember) {
        localStorage.setItem("remember_email", form.email);
      }

      saveToken(tokens.access, tokens.refresh);
      router.push("/account");

    } catch (error: unknown) {
      try {
        const parsed = JSON.parse(getErrorMessage(error)) as Record<string, unknown>;

        const backendErrors: Errors = {};

        Object.keys(parsed).forEach((key) => {
          const value = parsed[key];
          if (Array.isArray(value) && typeof value[0] === "string") {
            backendErrors[key as keyof Errors] = value[0];
          }
        });

        setErrors(backendErrors);
      } catch {
        setErrors({
          general: getErrorMessage(error),
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageReveal className="page-shell mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">

        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">
          Client login
        </p>

        <h1 className="section-heading mt-4 text-5xl">
         Welcome back to  <span className= "text-[var(--gold-deep)]">GOLDORA</span>
        </h1>

        <div className="mt-8 space-y-4">

          {/* EMAIL */}
          <div>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((c) => ({ ...c, email: e.target.value }))
              }
              placeholder="Email"
              className="w-full rounded-[18px] border px-4 py-3"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) =>
                setForm((c) => ({ ...c, password: e.target.value }))
              }
              placeholder="Password"
              className="w-full rounded-[18px] border px-4 py-3 pr-12"
            />

            {/* 👁 ICON */}
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon className="h-5 w-5 opacity-70" />
            </button>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* REMEMBER + FORGOT */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember((v) => !v)}
              />
              Remember me
            </label>

            <Link href="/forgot-password" className="text-[var(--gold-deep)]">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="gold-button mt-6 w-full rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* GENERAL ERROR */}
        {errors.general && (
          <p className="mt-4 text-red-500 text-sm text-center">
            {errors.general}
          </p>
        )}

        <p className="mt-4 text-sm text-center text-[var(--muted)]">
          New here?{" "}
          <Link href="/register" className="text-[var(--gold-deep)]">
            Create an account
          </Link>
        </p>
      </section>
    </PageReveal>
  );
}
