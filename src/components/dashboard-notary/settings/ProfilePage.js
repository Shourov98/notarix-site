"use client";

import { BadgeCheck, Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold text-zinc-900">Profile Settings</h2>
        <button className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100">
          Save Changes
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=NadiaJackson" alt="Nadia Jackson" className="w-full h-full" />
          </div>
          <button className="absolute -right-1 bottom-1 w-9 h-9 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-[#2c49df]">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-zinc-900">Nadia Jackson</p>
            <BadgeCheck className="w-6 h-6 text-[#2c49df]" />
          </div>
          <p className="text-gray-700 font-semibold uppercase tracking-[0.2em] mt-2">Notary</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[
          ["Full Name", "Nadia Jackson"],
          ["Email", "n.jackson@notarymail.com"],
          ["Phone", "(555) 982-1142"],
          ["Coverage Areas", "e.g. Manhattan, Brooklyn"],
        ].map(([label, value]) => (
          <div key={label} className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
            <input defaultValue={value} className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
          </div>
        ))}
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700">Business Address</p>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Address Line 1</label>
          <input defaultValue="742 Evergreen Terrace" className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Address Line 2</label>
            <input defaultValue="Suite, Apt" className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">City</label>
            <input defaultValue="New York" className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">State</label>
            <input defaultValue="New York" className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Zip Code</label>
            <input defaultValue="10001" className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]" />
          </div>
        </div>
      </div>
    </div>
  );
}
