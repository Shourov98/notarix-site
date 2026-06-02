"use client";

import Link from "next/link";
import { Bell, PlusCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPortalSession } from "@/lib/portal-api";
import { useClientPortal } from "./ClientPortalProvider";

const buildInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "CL";

export default function Navbar() {
  const { profile } = useClientPortal();
  const [sessionIdentity, setSessionIdentity] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const session = getPortalSession();
    if (!session) return;

    setSessionIdentity({
      name: session.email?.split("@")[0] || "",
      email: session.email || "",
    });
  }, []);

  const identity = {
    name: profile?.name || sessionIdentity.name || "",
    email: profile?.email || sessionIdentity.email || "",
    avatar: profile?.avatar || "",
    role: "Client",
  };

  const initials = useMemo(() => buildInitials(identity.name || identity.email), [identity.email, identity.name]);

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-zinc-100 bg-white px-8">
      <div className="max-w-xl flex-1">
        <div className="group relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#1a4fdb]" />
          <input
            type="text"
            placeholder="Search orders, documents..."
            className="w-full rounded-xl border border-zinc-100 bg-zinc-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/dashboard-client/orders/new"
          className="flex items-center gap-2 rounded-xl bg-[#1a4fdb] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-[#1541b8]"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Order
        </Link>

        <div className="h-8 w-px bg-zinc-100" />

        <button className="relative rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-50">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-l border-zinc-100 pl-2">
          <div className="hidden text-right sm:block">
            <p className="mb-1 text-sm font-bold leading-none text-zinc-900">
              {identity.name || identity.email || "Client User"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {identity.role}
            </p>
          </div>
          {identity.avatar ? (
            <img
              src={identity.avatar}
              alt={identity.name || identity.email || "Client"}
              className="h-10 w-10 rounded-xl border border-zinc-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 font-bold text-zinc-700">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
