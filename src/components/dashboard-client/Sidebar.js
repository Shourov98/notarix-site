"use client";

import Image from "next/image";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Files, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearPortalSession } from "@/lib/portalSession";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard-client" },
  { icon: FileText, label: "Order", href: "/dashboard-client/orders" },
  { icon: Files, label: "Documents", href: "/dashboard-client/documents" },
  { icon: CreditCard, label: "Payments", href: "/dashboard-client/payments" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard-client/messages" },
  { icon: Settings, label: "Settings", href: "/dashboard-client/settings" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    clearPortalSession();
    router.replace("/login");
  };

  return (
    <aside 
      className={`bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col sticky top-0 h-screen shrink-0 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Area */}
      <div className="px-5 py-5 flex items-center gap-3 h-20 border-b border-zinc-50 bg-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff] shadow-sm ring-1 ring-[#dbe6ff] flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="Notarix"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
            priority
          />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <Image
              src="/text_2.svg"
              alt="Notarix"
              width={126}
              height={37}
              className="h-8 w-auto object-contain"
              priority
            />
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.32em] text-gray-700">
              Client Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors group ${
                isActive 
                  ? "bg-[#1a4fdb] text-white" 
                  : "text-gray-700 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "group-hover:text-[#1a4fdb]"}`} />
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              {isCollapsed && (
                 <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                 </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-zinc-100 space-y-1 bg-white">
        <Link href="/contact" className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-gray-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors group relative">
          <HelpCircle className="w-5 h-5 flex-shrink-0 group-hover:text-[#1a4fdb]" />
          {!isCollapsed && <span className="font-medium text-sm">Help Center</span>}
          {isCollapsed && (
             <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Help Center
             </div>
          )}
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors group relative">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
          {isCollapsed && (
             <div className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Sign Out
             </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-24 transform bg-white border border-zinc-200 rounded-full p-1 text-gray-700 hover:text-zinc-900 hover:shadow-md transition-all z-20 shadow-sm"
        style={{ left: isCollapsed ? '72px' : '248px' }}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
