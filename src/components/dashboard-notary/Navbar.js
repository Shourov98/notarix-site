import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-end px-8 sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-8">
        <button className="relative p-2 text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2c49df] border-2 border-white"></span>
        </button>

        <div className="w-px h-8 bg-zinc-100"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-900 leading-none">Sterling MX</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mt-1">Notary</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
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
