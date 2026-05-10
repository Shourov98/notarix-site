"use client";

import { Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Profile Information</h2>
      </div>

      <div className="p-8 space-y-12">
        {/* Profile Header */}
        <div className="flex items-center gap-8">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-50 shadow-md">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" 
                alt="James R. Wilson" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1">James R. Wilson</h3>
            <p className="text-xs font-medium text-zinc-400 mb-2">Member since January 2024 • <span className="text-[#1a4fdb]">Verified Professional</span></p>
            <button className="text-sm font-bold text-[#1a4fdb] hover:underline">Change photo</button>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              defaultValue="James R. Wilson"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              defaultValue="james.wilson@corporate.com"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone Number</label>
            <input 
              type="text" 
              defaultValue="+1 (555) 012-3456"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Company Name</label>
            <input 
              type="text" 
              defaultValue="Wilson & Partners Legal"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-8 border-t border-zinc-50 flex justify-end">
          <button className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
