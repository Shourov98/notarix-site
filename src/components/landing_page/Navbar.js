"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Trust Center", href: "/trust" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white border-b border-zinc-100 sticky top-0 z-50">
      {/* Left: Logo placeholder */}
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-[#1a4fdb] text-white w-8 h-8 flex items-center justify-center rounded font-bold text-sm">
          NT
        </div>
        <span className="text-xl font-bold text-zinc-900 tracking-tight">Notarix™</span>
      </Link>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition-all pb-1 translate-y-[2px] ${
                isActive
                  ? "text-[#1a4fdb] border-b-2 border-[#1a4fdb]"
                  : "text-zinc-600 hover:text-zinc-900 border-b-2 border-transparent"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Right: Auth Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link 
          href="/login" 
          className="hidden sm:block text-zinc-600 font-medium hover:text-zinc-900 transition-colors text-sm"
        >
          Log In
        </Link>
        <button className="bg-[#1a4fdb] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold hover:bg-[#1541b8] transition-colors text-sm md:text-base">
          Get Started
        </button>
        {/* Mobile Menu Icon */}
        <button className="md:hidden text-zinc-600 p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </nav>
  );
}
