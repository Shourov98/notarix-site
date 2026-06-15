"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Trust Center", href: "/trust" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white border-b border-zinc-100 sticky top-0 z-50">
      <div className="flex items-center justify-between py-4 px-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] ring-1 ring-[#dbe6ff] shadow-sm shrink-0">
            <Image
              src="/logo.svg"
              alt="Notarix"
              width={30}
              height={30}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>
          <div className="min-w-0">
            <Image
              src="/text_2.svg"
              alt="Notarix"
              width={140}
              height={41}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
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
          <Link href="/request-access?contactType=client" className="bg-[#1a4fdb] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold hover:bg-[#1541b8] transition-colors text-sm md:text-base">
            Get Started
          </Link>
          
          {/* Mobile Menu Icon */}
          <button 
            className="md:hidden text-zinc-600 p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 py-4 px-6 space-y-4 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-semibold py-2 ${
                  isActive ? "text-[#1a4fdb]" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-4">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="text-zinc-600 font-medium text-base py-2"
            >
              Log In
            </Link>
            <Link
              href="/request-access?contactType=client"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#1a4fdb] px-4 py-3 text-center text-base font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
