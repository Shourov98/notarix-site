"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearPortalSession, readPortalSession } from "@/lib/portalSession";
import { logoutPortalUser } from "@/lib/siteApi";
import { useSidebar } from "./NotaryShell";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard-notary" },
  { icon: BriefcaseBusiness, label: "Assignments Orders", href: "/dashboard-notary/assignments-orders" },
  { icon: ClipboardList, label: "Assignments Requests", href: "/dashboard-notary/assignments-requests" },
  { icon: FileText, label: "Documents", href: "/dashboard-notary/documents" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard-notary/messages" },
  { icon: CreditCard, label: "Earnings / Payments", href: "/dashboard-notary/payments" },
  { icon: Settings, label: "Settings", href: "/dashboard-notary/settings" },
];

const SidebarBody = ({ pathname, router }) => {
  const [signingOut, setSigningOut] = useState(false);
  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    const session = readPortalSession();
    try {
      await logoutPortalUser({ refreshToken: session?.refreshToken });
    } catch (error) {
      console.warn("Portal logout failed; clearing local session anyway.", error);
    } finally {
      clearPortalSession();
      toast.success("Signed out.");
      router.replace("/login");
      setSigningOut(false);
    }
  };

  return (
    <>
      <div className="px-5 py-5 h-20 border-b border-zinc-100 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4ff] shadow-sm ring-1 ring-[#dbe6ff] shrink-0">
          <Image
            src="/logo.svg"
            alt="Notarix"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
            priority
          />
        </div>
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
            Notary Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
        <button onClick={handleSignOut} disabled={signingOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">{signingOut ? "Signing out…" : "Sign Out"}</span>
        </button>
      </div>
    </>
  );
};

export default function Sidebar() {
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  // Close drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile drawer */}
      <aside
        aria-label="Notary navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
          className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarBody pathname={pathname} router={router} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        aria-label="Notary navigation"
        className="hidden md:flex w-64 bg-white border-r border-zinc-200 flex-col sticky top-0 h-screen shrink-0 z-30"
      >
        <SidebarBody pathname={pathname} router={router} />
      </aside>
    </>
  );
}