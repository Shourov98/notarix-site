"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ClipboardList, Info, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { submitAccessRequest } from "@/store/sitePortalSlice";
import { useAppDispatch } from "@/store/hooks";
import NotarixBrand from "@/components/public/NotarixBrand";

const allowedContactTypes = ["client", "notary"];

export default function RequestAccessForm() {
  const searchParams = useSearchParams();
  const initialContactType = String(searchParams.get("contactType") || "").toLowerCase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactType, setContactType] = useState(
    allowedContactTypes.includes(initialContactType) ? initialContactType : "client"
  );
  const dispatch = useAppDispatch();

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      companyName: String(formData.get("companyName") || "").trim(),
      contactType: contactType === "client" ? "Client" : "Notary",
      requestType: "Access Request",
      state: String(formData.get("state") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.contactType) {
      toast.error("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(submitAccessRequest(payload)).unwrap();
      form.reset();
      toast.success("Request submitted successfully. Our team will review it shortly.");
    } catch (error) {
      toast.error(error.message || "Unable to submit your request right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#f7f9ff_0%,#ffffff_42%,#f8fbff_100%)] px-6 py-10 text-zinc-900 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-8 text-center">
          <NotarixBrand compact />
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e0fb] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#3152c7] shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Internal Review Required
            </div>
            <h1 className="text-5xl font-black tracking-[-0.04em] text-[#1f2637] md:text-6xl">
              Request Access
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-zinc-600">
              Complete the form below and our team will review your request and guide you through the next steps.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-[38px] border border-[#cfd8ee] bg-white p-6 shadow-[0_28px_80px_rgba(42,78,160,0.1)] md:p-8 lg:p-10">
          <form className="space-y-10" onSubmit={onSubmit}>
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#d9e1f3] pb-4">
                <UserRound className="h-6 w-6 text-[#2349db]" />
                <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#1f2637]">
                  User Information
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Full Name*" name="name" placeholder="John Doe" />
                <Field label="Email Address*" name="email" type="email" placeholder="john@example.com" />
                <Field label="Phone Number" name="phone" placeholder="+1 (555) 000-0000" />
                <Field label="Company Name" name="companyName" placeholder="Acme Corp" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#d9e1f3] pb-4">
                <ClipboardList className="h-6 w-6 text-[#2349db]" />
                <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#1f2637]">
                  Request Details
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-zinc-700">Contact Type</span>
                  <select
                    name="contactType"
                    value={contactType}
                    onChange={(event) => setContactType(event.target.value)}
                    className="w-full rounded-2xl border border-[#d4dbef] bg-[#f6f7ff] px-4 py-4 text-lg text-zinc-900 outline-none transition focus:border-[#2349db] focus:bg-white"
                  >
                    <option value="client">Client</option>
                    <option value="notary">Notary</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-zinc-700">Request Type</span>
                  <input
                    readOnly
                    value="Access Request"
                    className="w-full rounded-2xl border border-[#d4dbef] bg-[#f6f7ff] px-4 py-4 text-lg text-zinc-900 outline-none"
                  />
                </label>

                <Field
                  label="State / Coverage Area"
                  name="state"
                  placeholder={contactType === "client" ? "e.g. New York, NY" : "e.g. Florida, Georgia"}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#d9e1f3] pb-4">
                <ShieldCheck className="h-6 w-6 text-[#2349db]" />
                <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#1f2637]">
                  Additional Information
                </h2>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-700">Message</span>
                <textarea
                  name="message"
                  rows={6}
                  placeholder={
                    contactType === "client"
                      ? "Tell us more about your team, volume, and onboarding needs..."
                      : "Tell us about your notary experience, commission state, and service coverage..."
                  }
                  className="w-full resize-none rounded-2xl border border-[#d4dbef] bg-[#f6f7ff] px-4 py-4 text-lg text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-[#2349db] focus:bg-white"
                />
              </label>
            </div>

            <div className="rounded-[24px] border border-[#d8e2fb] bg-[#edf2ff] px-5 py-4 text-sm font-medium leading-6 text-[#2743d6]">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  All requests are subject to internal review before approval. Our compliance team ensures all legal requirements are met for secure digital notarization.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <button
                disabled={isSubmitting}
                className="flex-1 rounded-2xl bg-[#2743d6] px-8 py-4 text-lg font-bold text-white shadow-[0_18px_32px_rgba(39,67,214,0.26)] transition hover:bg-[#1e35ad] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
              <Link
                href="/"
                className="flex-1 rounded-2xl border border-[#2743d6] px-8 py-4 text-center text-lg font-bold text-[#2743d6] transition hover:bg-[#f5f7ff]"
              >
                Return to Home
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-[32px] border border-[#d3dbef] bg-[#fbfcff] p-8 shadow-[0_18px_44px_rgba(42,78,160,0.06)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#2349db] shadow-sm">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-[-0.03em] text-[#1f2637]">
                Secure & Legally Valid
              </h3>
              <p className="mt-2 max-w-3xl text-lg leading-8 text-zinc-600">
                Every notarization via Notarix is backed by state-of-the-art encryption and adheres to the strictest legal compliance frameworks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-zinc-700">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#d4dbef] bg-[#f6f7ff] px-4 py-4 text-lg text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-[#2349db] focus:bg-white"
      />
    </label>
  );
}
