"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandLockup from "./BrandLockup";
import { requestJson, savePortalSession } from "@/lib/portal-api";

const ROLE_OPTIONS = [
  { label: "Client", value: "client", dashboard: "/dashboard-client" },
  { label: "Notary", value: "notary", dashboard: "/dashboard-notary" },
];

export default function PortalLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = await requestJson("/site/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      savePortalSession({
        role,
        email: payload.email,
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        uid: payload.uid,
        passwordResetRequired: Boolean(payload.passwordResetRequired),
      });

      const nextRoute =
        ROLE_OPTIONS.find((option) => option.value === role)?.dashboard || "/";
      router.push(nextRoute);
    } catch (submitError) {
      setError(submitError.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#eff4ff_0%,#ffffff_45%,#f8fafc_100%)] px-6 py-12 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col justify-between">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <p className="mb-4 inline-flex items-center rounded-full border border-[#c8d5ff] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#3157d6]">
                Secure Portal Access
              </p>
              <h1 className="text-5xl font-semibold leading-tight text-slate-950">
                Sign in to manage orders, documents, payouts, and conversations.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                The Notarix portal gives clients and notaries a single secure place to
                review assignments, track status changes, and keep signing work moving.
              </p>
              <div className="mt-10 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3157d6]">
                    Client Portal
                  </div>
                  <p className="mt-3 leading-7">
                    Create orders, upload documents, review progress, and track payment status.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3157d6]">
                    Notary Portal
                  </div>
                  <p className="mt-3 leading-7">
                    Accept assignments, complete signings, upload final packages, and manage payouts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-[32px] border border-[#dbe3f4] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
              <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] px-8 py-10">
                <div className="flex justify-center">
                  <BrandLockup compact />
                </div>
              </div>

              <div className="px-6 py-8 sm:px-8">
                <div className="mb-6 rounded-2xl bg-[#eef1ff] p-1">
                  <div className="grid grid-cols-2 gap-1">
                    {ROLE_OPTIONS.map((option) => {
                      const active = option.value === role;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRole(option.value)}
                          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                            active
                              ? "bg-white text-[#2448cf] shadow-sm"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-2xl border border-[#d6dcef] bg-[#f7f8ff] px-4 py-3.5 outline-none transition focus:border-[#5174ea] focus:bg-white focus:ring-4 focus:ring-[#cad5ff]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-[#d6dcef] bg-[#f7f8ff] px-4 py-3.5 outline-none transition focus:border-[#5174ea] focus:bg-white focus:ring-4 focus:ring-[#cad5ff]"
                      required
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-[#2d48d6] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(45,72,214,0.25)] transition hover:bg-[#233bc0] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Signing In..." : "Login to Dashboard"}
                  </button>

                  <Link
                    href="/request-access"
                    className="flex w-full items-center justify-center rounded-2xl border border-[#d5dced] bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[#9fb1ea] hover:text-slate-950"
                  >
                    Create Account
                  </Link>
                </form>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-10 border-t border-slate-200/80 pt-6 text-center text-sm text-slate-500">
          © 2026 Notarix Technologies Inc. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
