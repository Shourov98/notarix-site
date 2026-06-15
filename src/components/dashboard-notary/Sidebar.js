"use client";

import {
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
import { usePathname, useRouter } from "next/navigation";
import { clearPortalSession } from "@/lib/portalSession";

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
  const router = useRouter();

  const handleSignOut = () => {
    clearPortalSession();
    router.replace("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col sticky top-0 h-screen shrink-0 z-50">
      <div className="px-5 py-5 h-20 border-b border-zinc-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#173fbe] flex items-center justify-center shadow-lg shadow-blue-100">
          <span className="text-white font-black text-lg">N</span>
        </div>
        <div>
          <p className="text-xl leading-none font-bold tracking-tight text-zinc-900">Notarix</p>
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-700 font-bold mt-1">Portal</p>
        </div>
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
        <Link href="/contact" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-600 hover:bg-zinc-50 transition-colors">
          <CircleHelp className="w-5 h-5" />
          <span className="text-sm font-medium">Help Center</span>
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
