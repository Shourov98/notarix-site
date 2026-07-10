"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { resetPortalFirstLoginPassword } from "@/lib/siteApi";

const strengthLabel = (password) => {
  if (!password) return { label: "", color: "bg-zinc-200" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return { label: "Weak", color: "bg-rose-500" };
  if (score === 2) return { label: "Fair", color: "bg-orange-500" };
  if (score === 3) return { label: "Good", color: "bg-blue-500" };
  return { label: "Strong", color: "bg-emerald-500" };
};

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const strength = strengthLabel(newPassword);

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill out both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      await resetPortalFirstLoginPassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password updated. Please sign in again with your new password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error?.message || "Unable to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-8">
      <form className="border border-indigo-100 rounded-[24px] p-8 space-y-8" onSubmit={handlePasswordSave}>
        <h2 className="text-xl font-bold text-zinc-900">Password &amp; Authentication</h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            visible={showCurrentPassword}
            onToggle={() => setShowCurrentPassword((current) => !current)}
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            visible={showNewPassword}
            onToggle={() => setShowNewPassword((current) => !current)}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((current) => !current)}
          />
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Password Strength</label>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-zinc-200 overflow-hidden">
                <div className={`h-full ${strength.color}`} style={{ width: `${newPassword ? Math.min(100, newPassword.length * 6) : 0}%` }}></div>
              </div>
              <span className="text-sm font-bold text-zinc-700 w-16 text-right">{strength.label}</span>
            </div>
            <p className="text-xs text-gray-700 mt-2">
              Use 8+ characters with a mix of letters, numbers, and symbols.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPassword}
            className="px-8 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100 disabled:opacity-60"
          >
            {savingPassword ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordField({ label, value, onChange, visible, onToggle }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
      <div className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl border border-zinc-300 focus-within:border-[#2c49df]">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
          className="w-full text-gray-700 placeholder:text-gray-700 outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-gray-700 transition hover:text-[#2c49df]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}