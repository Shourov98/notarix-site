"use client";

import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPortalSession, requestPortalJsonOnce } from "@/lib/portal-api";

const buildInitials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "NT";

export default function Navbar() {
  const [identity, setIdentity] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "Notary",
  });

  useEffect(() => {
    const session = getPortalSession();
    const seedFromSession = () => {
      if (!session) return;
      setIdentity({
        name: session.email?.split("@")[0] || "",
        email: session.email || "",
        avatar: "",
        role: "Notary",
      });
    };

    seedFromSession();

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const overview = await requestPortalJsonOnce("/site/notary/overview");
        if (!cancelled) {
          setIdentity({
            name: overview?.profile?.name || session?.email?.split("@")[0] || "",
            email: overview?.profile?.email || session?.email || "",
            avatar: overview?.profile?.avatar || "",
            role: "Notary",
          });
        }
      } catch {
        // Keep session identity when overview fetch fails.
      }
    };

    loadProfile();

    const handleRefresh = () => {
      seedFromSession();
      loadProfile();
    };
    window.addEventListener("notarix:profile-updated", handleRefresh);

    return () => {
      cancelled = true;
      window.removeEventListener("notarix:profile-updated", handleRefresh);
    };
  }, []);

  const initials = useMemo(() => buildInitials(identity.name || identity.email), [identity]);

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-end border-b border-zinc-100 bg-white px-8">
      <div className="flex items-center gap-8">
        <button className="relative rounded-xl p-2 text-zinc-600 transition-colors hover:bg-zinc-50">
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-8 w-px bg-zinc-100" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold leading-none text-zinc-900">
              {identity.name || identity.email || "Notary User"}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
              {identity.role}
            </p>
          </div>
          {identity.avatar ? (
            <img
              src={identity.avatar}
              alt={identity.name || identity.email || "Notary"}
              className="h-11 w-11 rounded-full border border-zinc-200 object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 font-bold text-zinc-700">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
