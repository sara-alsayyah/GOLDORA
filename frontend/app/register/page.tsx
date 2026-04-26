"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";
import { useStore } from "@/app/providers/StoreProvider";
import { EyeIcon } from "@/app/components/icons";

type Errors = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
};

type ErrorWithOptionalMessage = {
  detail?: string;
  message?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { saveToken } = useStore();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const countries = [
    { code: "LB", name: "Lebanon", dial: "+961", flag: "🇱🇧" },
    { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
    { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
    { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const phoneRegex = /^(\+?\d{7,15})$/;

  function getPasswordStrength(password: string) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", width: "33%", color: "bg-red-400" };
    if (score === 2) return { label: "Medium", width: "66%", color: "bg-yellow-400" };
    return { label: "Strong", width: "100%", color: "bg-green-500" };
  }

  const strength = getPasswordStrength(form.password);

  function validate() {
    const newErrors: Errors = {};

    if (!form.first_name) newErrors.first_name = "First name is required";
    if (!form.last_name) newErrors.last_name = "Last name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (form.phone) {
      const fullPhone = selectedCountry.dial + form.phone;
      if (!phoneRegex.test(fullPhone)) {
        newErrors.phone = "Enter a valid phone number";
      }
    }

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms";
    }

    return newErrors;
  }

  function safeErrorMessage(error: unknown) {
    if (!error) return "Something went wrong";

    if (typeof error === "string") return error;

    const maybeError = error as ErrorWithOptionalMessage;

    if (maybeError.detail) return maybeError.detail;

    if (maybeError.message) return maybeError.message;

    return "Something went wrong";
  }

  async function handleRegister() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: selectedCountry.dial + form.phone,
        password: form.password,
      });

      const tokens = await login(form.email, form.password);

      if (!tokens?.access) {
        throw new Error("Login failed after registration");
      }

      saveToken(tokens.access, tokens.refresh);
      router.push("/account");

    } catch (error: unknown) {
      console.log("REGISTER ERROR:", error);

      setErrors({
        general: safeErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageReveal className="page-shell mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">

        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">
          Create account
        </p>

        <h1 className="section-heading mt-4 text-5xl">
          Join and start shopping.
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          <input
            value={form.first_name}
            onChange={(e) => setForm(c => ({ ...c, first_name: e.target.value }))}
            placeholder="First name"
            className="w-full rounded-[18px] border px-4 py-3"
          />

          <input
            value={form.last_name}
            onChange={(e) => setForm(c => ({ ...c, last_name: e.target.value }))}
            placeholder="Last name"
            className="w-full rounded-[18px] border px-4 py-3"
          />

          <div className="sm:col-span-2">
            <input
              value={form.email}
              onChange={(e) => setForm(c => ({ ...c, email: e.target.value }))}
              placeholder="Email"
              className="w-full rounded-[18px] border px-4 py-3"
            />
          </div>

          <div className="sm:col-span-2 flex rounded-[18px] border overflow-hidden">
            <select
              value={selectedCountry.code}
              onChange={(e) => {
                const country = countries.find(c => c.code === e.target.value);
                if (country) setSelectedCountry(country);
              }}
              className="bg-white px-3"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.dial}
                </option>
              ))}
            </select>

            <input
              value={form.phone}
              onChange={(e) => setForm(c => ({ ...c, phone: e.target.value }))}
              placeholder="Phone"
              className="flex-1 px-4 py-3"
            />
          </div>

          <div className="sm:col-span-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm(c => ({ ...c, password: e.target.value }))}
              placeholder="Password"
              className="w-full rounded-[18px] border px-4 py-3 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <EyeIcon className="h-5 w-5" />
            </button>

            <div className="mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-[rgba(143,108,29,0.14)]">
                <div className={`h-full ${strength.color}`} style={{ width: strength.width }} />
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Password strength: {strength.label}
              </p>
            </div>
          </div>

          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm(c => ({ ...c, confirmPassword: e.target.value }))}
            placeholder="Confirm password"
            className="w-full rounded-[18px] border px-4 py-3 sm:col-span-2"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="gold-button mt-6 w-full rounded-full px-6 py-3 text-sm uppercase"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <label className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms((current) => !current)}
          />
          I agree to the terms and privacy expectations.
        </label>

        {errors.terms && (
          <p className="mt-2 text-sm text-red-500">
            {errors.terms}
          </p>
        )}

        {errors.general && (
          <p className="mt-4 text-center text-red-500 text-sm">
            {errors.general}
          </p>
        )}

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--gold-deep)]">
            Sign in
          </Link>
        </p>

      </section>
    </PageReveal>
  );
}
