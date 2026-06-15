"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LockKeyhole, Mail } from "lucide-react";
import { loginPortalUser } from "@/lib/siteApi";
import { savePortalSession } from "@/lib/portalSession";
import NotarixBrand from "@/components/public/NotarixBrand";

const tabs = [
  { label: "Client", value: "client" },
  { label: "Notary", value: "notary" },
];

const fallbackDashboardPath = (role) =>
  role === "notary" ? "/dashboard-notary" : "/dashboard-client";

export default function PortalLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("client");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      role,
      email: String(formData.get("email") || "").trim().toLowerCase(),
      password: String(formData.get("password") || ""),
    };

    if (!payload.email || !payload.password) {
      toast.error("Email address and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await loginPortalUser(payload);
      savePortalSession(session);
      toast.success(`${role === "client" ? "Client" : "Notary"} login successful.`);
      const nextPath = session.passwordResetRequired
        ? `/first-login-reset?role=${role}`
        : session.dashboardPath || fallbackDashboardPath(role);
      router.replace(nextPath);
    } catch (error) {
      toast.error(error.message || "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestHref = `/request-access?contactType=${role}`;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f7f9ff_0%,#ffffff_42%,#f8fbff_100%)] px-6 py-10 text-zinc-900">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden lg:block">
            <div className="max-w-xl space-y-8">
              <span className="inline-flex rounded-full border border-[#d7e0fb] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#3152c7] shadow-sm">
                Secure Portal Access
              </span>
              <h1 className="text-6xl font-black leading-[1.02] tracking-[-0.04em] text-[#1f2637]">
                Sign in to manage notarization work without friction.
              </h1>
              <p className="max-w-lg text-lg leading-8 text-zinc-600">
                Clients track orders and documents. Notaries manage assignments, sessions, and payments from the same secure platform.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-[#dbe4fb] bg-white/90 p-6 shadow-[0_18px_40px_rgba(34,74,155,0.08)]">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#3152c7]">Client Portal</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    Order oversight, document status, session tracking, and billing in one view.
                  </p>
                </div>
                <div className="rounded-[28px] border border-[#dbe4fb] bg-white/90 p-6 shadow-[0_18px_40px_rgba(34,74,155,0.08)]">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#3152c7]">Notary Workspace</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    Assignment intake, availability management, secure sessions, and payout visibility.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-[540px] rounded-[36px] border border-[#ccd6f0] bg-white/95 p-8 shadow-[0_28px_80px_rgba(42,78,160,0.12)] sm:p-10">
            <div className="flex flex-col items-center gap-8">
              <NotarixBrand compact />

              <form className="w-full space-y-7" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-2 rounded-[20px] bg-[#e9edfb] p-1.5">
                  {tabs.map((tab) => {
                    const active = role === tab.value;
                    return (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setRole(tab.value)}
                        className={`rounded-[16px] px-4 py-4 text-lg font-semibold transition ${
                          active
                            ? "bg-white text-[#2349db] shadow-[0_8px_18px_rgba(35,73,219,0.12)]"
                            : "text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2.5 block text-sm font-bold uppercase tracking-[0.16em] text-zinc-600">
                      Email Address
                    </span>
                    <span className="flex items-center gap-3 rounded-2xl border border-[#d4dbef] bg-[#f6f7ff] px-4 py-4 focus-within:border-[#2349db] focus-within:bg-white">
                      <Mail className="h-5 w-5 text-[#6b7bb1]" />
                      <input
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        className="w-full bg-transparent text-lg text-zinc-900 outline-none placeholder:text-zinc-500"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-2.5 block text-sm font-bold uppercase tracking-[0.16em] text-zinc-600">
                      Password
                    </span>
                    <span className="flex items-center gap-3 rounded-2xl border border-[#d4dbef] bg-[#f6f7ff] px-4 py-4 focus-within:border-[#2349db] focus-within:bg-white">
                      <LockKeyhole className="h-5 w-5 text-[#6b7bb1]" />
                      <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="w-full bg-transparent text-lg text-zinc-900 outline-none placeholder:text-zinc-500"
                      />
                    </span>
                  </label>
                </div>

                <div className="space-y-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-[#2743d6] px-6 py-4 text-lg font-bold text-white shadow-[0_18px_32px_rgba(39,67,214,0.26)] transition hover:bg-[#1e35ad] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Signing In..." : "Login to Dashboard"}
                  </button>

                  <Link
                    href={requestHref}
                    className="flex w-full items-center justify-center rounded-2xl border border-[#c8d1ea] px-6 py-4 text-lg font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Create Account
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
