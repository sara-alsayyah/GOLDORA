"use client";

import { useState } from "react";
import { sendContact } from "@/app/lib/api";
import { PageReveal } from "@/app/components/PageReveal";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      const response = await sendContact(form);
      setStatus(response.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to send your message");
    }
  }

  return (
    <PageReveal className="page-shell mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-6 lg:px-10">
      <section className="luxury-card rounded-[40px] px-6 py-8 sm:px-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--gold-deep)]">Contact us</p>
        <h1 className="section-heading mt-4 text-5xl">Speak with the boutique concierge.</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
          This form is connected to your contact API so inquiries can be stored or routed into email workflows from the same elegant surface.
        </p>
      </section>

      <section className="luxury-card mt-8 rounded-[40px] p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Your name"
            className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none"
          />
          <input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Your email"
            className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none"
          />
          <input
            value={form.subject}
            onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
            placeholder="Subject"
            className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2"
          />
          <textarea
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            placeholder="Tell us what you need"
            rows={7}
            className="rounded-[18px] border border-[rgba(143,108,29,0.16)] bg-white/72 px-4 py-3 outline-none sm:col-span-2"
          />
        </div>
        <button onClick={handleSubmit} className="gold-button mt-5 rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]">
          Send message
        </button>
        {status ? <p className="mt-4 text-sm text-[var(--muted)]">{status}</p> : null}
      </section>
    </PageReveal>
  );
}
