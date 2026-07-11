"use client";

import { Bell, Menu } from "lucide-react";
import { useSidebar } from "./NotaryShell";

export default function Navbar() {
  const { toggle } = useSidebar();

  return (
    <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between gap-3 px-4 sm:px-8 sticky top-0 z-30 shrink-0">
      <button
        type="button"
        onClick={toggle}
        aria-label="Open navigation"
        className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3 sm:gap-6">
        <button className="relative p-2 text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2c49df] border-2 border-white" />
        </button>

        <div className="w-px h-8 bg-zinc-100 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-zinc-900 leading-none">Sterling MX</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700 mt-1">Notary</p>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=SterlingMX"
              alt="Sterling MX"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}