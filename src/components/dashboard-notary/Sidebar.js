"use client";

import {
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard-notary" },
  { icon: BriefcaseBusiness, label: "Assignments Orders", href: "/dashboard-notary/assignments-orders" },
  { icon: ClipboardList, label: "Assignments Requests", href: "/dashboard-notary/assignments-requests" },
  { icon: FileText, label: "Documents", href: "/dashboard-notary/documents" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard-notary/messages" },
  { icon: CreditCard, label: "Earnings / Payments", href: "/dashboard-notary/payments" },
  { icon: Settings, label: "Settings", href: "/dashboard-notary/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col sticky top-0 h-screen shrink-0 z-50">
      <div className="flex h-20 items-center gap-3 border-b border-zinc-100 px-5 py-5">
        <img
          src="/logo.svg"
          alt="Notarix"
          className="h-11 w-11 flex-shrink-0 object-contain"
        />
        <img
          src="/text_2.svg"
          alt="Notarix Signing Services"
          className="h-8 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard-notary" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                isActive
                  ? "bg-[#2c49df] text-white shadow-lg shadow-blue-100"
                  : "text-zinc-800 hover:bg-zinc-50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-700"}`} />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-5 space-y-2 border-t border-zinc-100 bg-white">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-600 hover:bg-zinc-50 transition-colors">
          <CircleHelp className="w-5 h-5" />
          <span className="text-sm font-medium">Help Center</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
