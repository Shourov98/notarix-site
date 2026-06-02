"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BrandLockup from "./BrandLockup";
import { requestJson } from "@/lib/portal-api";

const CONTACT_OPTIONS = ["Client", "Business", "Notary Agent"];
const REQUEST_OPTIONS = ["Access Request", "Platform Access", "Partnership", "General Inquiry"];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  contactType: "Client",
  requestType: "Access Request",
  state: "",
  message: "",
};

export default function RequestAccessPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const cardCopy = useMemo(
    () => [
      {
        title: "Secure & Legally Valid",
        body: "Every notarization via Notarix is designed for compliance, traceability, and secure digital handling.",
      },
      {
        title: "Reviewed Before Approval",
        body: "Access requests are screened by the operations team before credentials are issued to a client or notary account.",
      },
    ],
    []
  );

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const payload = await requestJson("/requests", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          email: form.email.trim().toLowerCase(),
          name: form.name.trim(),
        }),
      });

      setSuccess({
        requestId: payload.requestId,
        status: payload.status,
      });
      setForm(INITIAL_FORM);
    } catch (submitError) {
      setError(submitError.message || "Unable to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_50%,#ffffff_100%)] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <BrandLockup />
          <h1 className="mt-10 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Request Access
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Complete the form below and our team will review your request and guide you
            through the next steps.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[36px] border border-[#d9e1f2] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <form className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10" onSubmit={handleSubmit}>
            <section className="border-b border-slate-100 pb-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#2646c9]">
                  <span className="text-lg">◌</span>
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">User Information</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full Name*" value={form.name} onChange={updateField("name")} placeholder="John Doe" required />
                <Field label="Email Address*" type="email" value={form.email} onChange={updateField("email")} placeholder="john@example.com" required />
                <Field label="Phone Number" value={form.phone} onChange={updateField("phone")} placeholder="+1 (555) 000-0000" />
                <Field label="Company Name" value={form.companyName} onChange={updateField("companyName")} placeholder="Acme Corp" />
              </div>
            </section>

            <section className="border-b border-slate-100 py-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#2646c9]">
                  <span className="text-lg">□</span>
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">Request Details</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <SelectField label="Contact Type" value={form.contactType} onChange={updateField("contactType")} options={CONTACT_OPTIONS} />
                <SelectField label="Request Type" value={form.requestType} onChange={updateField("requestType")} options={REQUEST_OPTIONS} />
                <Field label="State / Coverage Area" value={form.state} onChange={updateField("state")} placeholder="e.g. New York, NY" />
              </div>
            </section>

            <section className="py-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#2646c9]">
                  <span className="text-lg">≡</span>
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">Additional Information</h2>
              </div>

              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={updateField("message")}
                rows={6}
                placeholder="Tell us more about your needs..."
                className="w-full rounded-[24px] border border-[#d6dcef] bg-[#f7f8ff] px-5 py-4 outline-none transition focus:border-[#5174ea] focus:bg-white focus:ring-4 focus:ring-[#cad5ff]"
              />

              <div className="mt-8 rounded-[24px] border border-[#d4ddff] bg-[#eef3ff] px-5 py-4 text-sm leading-7 text-[#2845c8]">
                All requests are subject to internal review before approval. Our compliance
                team ensures all legal requirements are met for secure digital notarization.
              </div>

              {error ? (
                <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="mt-6 rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                  Request submitted successfully. Request ID: <strong>{success.requestId}</strong>
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-[#2d48d6] px-8 text-lg font-semibold text-white shadow-[0_20px_45px_rgba(45,72,214,0.22)] transition hover:bg-[#233bc0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
                <Link
                  href="/"
                  className="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl border border-[#2d48d6] bg-white px-8 text-lg font-semibold text-[#2d48d6] transition hover:bg-[#f5f8ff]"
                >
                  Return to Home
                </Link>
              </div>
            </section>
          </form>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {cardCopy.map((item) => (
            <article
              key={item.title}
              className="rounded-[30px] border border-[#dce3f3] bg-white px-6 py-7 shadow-[0_20px_60px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f6ff] text-[#2646c9]">
                  <span className="text-2xl">◈</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 max-w-xl text-lg leading-8 text-slate-600">{item.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © 2026 Notarix Technologies Inc. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

function Field({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </label>
      <input
        type={type}
        className="w-full rounded-2xl border border-[#d6dcef] bg-[#f7f8ff] px-4 py-3.5 outline-none transition focus:border-[#5174ea] focus:bg-white focus:ring-4 focus:ring-[#cad5ff]"
        {...props}
      />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </label>
      <select
        className="w-full rounded-2xl border border-[#d6dcef] bg-[#f7f8ff] px-4 py-3.5 outline-none transition focus:border-[#5174ea] focus:bg-white focus:ring-4 focus:ring-[#cad5ff]"
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
