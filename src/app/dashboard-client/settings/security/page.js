"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Security Settings</h2>
        <p className="text-gray-700 font-medium text-xs mt-1">Manage your password to keep your account secure.</p>
      </div>

      <div className="p-8 space-y-8">

        {/* Password Management */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Current Password</label>
              <div className="flex items-center gap-3 w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-[#1a4fdb]/10 focus-within:border-[#1a4fdb] transition-all">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-gray-700 placeholder:text-gray-700 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((current) => !current)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  className="text-gray-700 transition hover:text-[#1a4fdb]"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="hidden md:block"></div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">New Password</label>
              <div className="flex items-center gap-3 w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-[#1a4fdb]/10 focus-within:border-[#1a4fdb] transition-all">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-gray-700 placeholder:text-gray-700 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((current) => !current)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  className="text-gray-700 transition hover:text-[#1a4fdb]"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Confirm New Password</label>
              <div className="flex items-center gap-3 w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-[#1a4fdb]/10 focus-within:border-[#1a4fdb] transition-all">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-gray-700 placeholder:text-gray-700 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="text-gray-700 transition hover:text-[#1a4fdb]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-start">
            <button className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
              Update Password
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}