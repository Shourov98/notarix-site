"use client";

import { Menu, Search } from "lucide-react";
import { useSidebar } from "./ClientShell";

export default function Navbar() {
  const { toggle } = useSidebar();

  return (
    <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between gap-3 px-4 sm:px-8 sticky top-0 z-30">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Open navigation"
        className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search Bar Placeholder */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#1a4fdb] transition-colors" />
          <input
            type="text"
            placeholder="Search orders, documents..."
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
          />
        </div>
      </div>

      {/* Right Actions (notifications now live in PortalHeader.js, just below this) */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-zinc-900 leading-none mb-1">
              Alex Sterling
            </p>
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
              Client
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}