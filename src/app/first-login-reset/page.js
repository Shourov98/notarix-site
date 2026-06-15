"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import NotarixBrand from "@/components/public/NotarixBrand";
import { clearPortalSession, readPortalSession } from "@/lib/portalSession";
import { resetPortalFirstLoginPassword } from "@/lib/siteApi";

function FirstLoginResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "client";
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const session = readPortalSession();
    if (!session?.accessToken) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPortalFirstLoginPassword({ new_password: newPassword });
      clearPortalSession();
      toast.success("Password updated. Please sign in again.");
      router.replace(`/login?role=${role}`);
    } catch (error) {
      toast.error(error.message || "Unable to update password right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f7f9ff_0%,#ffffff_42%,#f8fbff_100%)] px-6 py-10 text-zinc-900">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <section className="w-full max-w-[540px] rounded-[36px] border border-[#ccd6f0] bg-white/95 p-8 shadow-[0_28px_80px_rgba(42,78,160,0.12)] sm:p-10">
          <div className="flex flex-col items-center gap-8">
            <NotarixBrand compact />
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-black tracking-[-0.04em] text-[#1f2637]">
                Reset your temporary password
              </h1>
              <p className="text-base leading-7 text-zinc-600">
                This is required on first sign-in before we open your {role} workspace.
              </p>
            </div>

            <form className="w-full space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2.5 block text-sm font-bold uppercase tracking-[0.16em] text-zinc-600">
                  New Password
                </span>
                <span className="flex items-center gap-3 rounded-2xl border border-[#d4dbef] bg-[#f6f7ff] px-4 py-4 focus-within:border-[#2349db] focus-within:bg-white">
                  <LockKeyhole className="h-5 w-5 text-[#6b7bb1]" />
                  <input
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    minLength={8}
                    placeholder="Choose a strong password"
                    className="w-full bg-transparent text-lg text-zinc-900 outline-none placeholder:text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((current) => !current)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    className="text-[#6b7bb1] transition hover:text-[#2349db]"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </span>
              </label>

              <label className="block">
                <span className="mb-2.5 block text-sm font-bold uppercase tracking-[0.16em] text-zinc-600">
                  Confirm Password
                </span>
                <span className="flex items-center gap-3 rounded-2xl border border-[#d4dbef] bg-[#f6f7ff] px-4 py-4 focus-within:border-[#2349db] focus-within:bg-white">
                  <LockKeyhole className="h-5 w-5 text-[#6b7bb1]" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    minLength={8}
                    placeholder="Re-enter your password"
                    className="w-full bg-transparent text-lg text-zinc-900 outline-none placeholder:text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="text-[#6b7bb1] transition hover:text-[#2349db]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#2743d6] px-6 py-4 text-lg font-bold text-white shadow-[0_18px_32px_rgba(39,67,214,0.26)] transition hover:bg-[#1e35ad] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Updating Password..." : "Save and Continue"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function FirstLoginResetPage() {
  return (
    <Suspense fallback={null}>
      <FirstLoginResetContent />
    </Suspense>
  );
}
