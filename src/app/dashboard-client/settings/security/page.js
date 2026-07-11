"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changePortalPasswordThunk,
  selectSitePortal,
} from "@/store/sitePortalSlice";

const defaultForm = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

export default function SecurityPage() {
  const dispatch = useAppDispatch();
  const { changePasswordStatus } = useAppSelector(selectSitePortal);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [localError, setLocalError] = useState("");

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setLocalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      setLocalError("Please fill in all password fields.");
      return;
    }

    if (form.new_password.length < 8) {
      setLocalError("New password must be at least 8 characters.");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setLocalError("New password and confirmation don't match.");
      return;
    }

    if (form.current_password === form.new_password) {
      setLocalError("New password must be different from your current password.");
      return;
    }

    try {
      await dispatch(
        changePortalPasswordThunk({
          current_password: form.current_password,
          new_password: form.new_password,
        })
      ).unwrap();
      toast.success("Password updated successfully.");
      setForm(defaultForm);
    } catch (error) {
      toast.error(error || "Unable to update password.");
    }
  };

  const saving = changePasswordStatus === "loading";

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Security Settings</h2>
        <p className="text-gray-700 font-medium text-xs mt-1">Manage your password to keep your account secure.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Password Management</h3>
              <p className="text-xs font-medium text-gray-700">Change your password to keep your account secure.</p>
            </div>
          </div>

          {localError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {localError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-2">
            <PasswordField
              label="Current Password"
              value={form.current_password}
              onChange={(value) => update("current_password", value)}
              shown={showCurrentPassword}
              onToggle={() => setShowCurrentPassword((c) => !c)}
              autoComplete="current-password"
            />
            <div className="hidden md:block" />
            <PasswordField
              label="New Password"
              value={form.new_password}
              onChange={(value) => update("new_password", value)}
              shown={showNewPassword}
              onToggle={() => setShowNewPassword((c) => !c)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
            <PasswordField
              label="Confirm New Password"
              value={form.confirm_password}
              onChange={(value) => update("confirm_password", value)}
              shown={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((c) => !c)}
              autoComplete="new-password"
            />
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {saving ? "Updating…" : "Update Password"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

const PasswordField = ({ label, value, onChange, shown, onToggle, autoComplete, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{label}</label>
    <div className="flex items-center gap-3 w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-[#1a4fdb]/10 focus-within:border-[#1a4fdb] transition-all">
      <input
        type={shown ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || "••••••••"}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-gray-700 placeholder:text-gray-700 outline-none"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={shown ? "Hide password" : "Show password"}
        className="text-gray-700 transition hover:text-[#1a4fdb]"
      >
        {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);