"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="p-8">
      <div className="border border-indigo-100 rounded-[24px] p-8 space-y-8">
        <h2 className="text-xl font-bold text-zinc-900">Security &amp; Authentication</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[
            ["Current Password", "********", showCurrentPassword, setShowCurrentPassword],
            ["New Password", "Enter new password", showNewPassword, setShowNewPassword],
          ].map(([label, value, visible, setVisible]) => (
            <div key={label} className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
              <div className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl border border-zinc-300 focus-within:border-[#2c49df]">
                <input
                  type={visible ? "text" : "password"}
                  defaultValue={value}
                  className="w-full text-gray-700 placeholder:text-gray-700 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setVisible((current) => !current)}
                  aria-label={visible ? "Hide password" : "Show password"}
                  className="text-gray-700 transition hover:text-[#2c49df]"
                >
                  {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-zinc-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-zinc-900">Two-Factor Authentication</p>
            <p className="text-sm font-medium text-gray-700 mt-1">Add an extra layer of security to your account.</p>
          </div>
          <div className="w-12 h-7 rounded-full bg-[#2c49df] relative">
            <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white"></div>
          </div>
        </div>
        <div className="border border-zinc-200 rounded-[24px] p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Login Activity</p>
            <p className="text-base font-bold text-zinc-900 mt-3">Chrome on MacOS</p>
            <p className="text-sm font-medium text-gray-700 mt-1">New York, USA • Active now</p>
          </div>
          <button className="text-[#2c49df] font-bold">Log out device</button>
        </div>
      </div>
    </div>
  );
}
