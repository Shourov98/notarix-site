"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { toast } from "sonner";
import { logoutPortalUser } from "@/lib/siteApi";
import { clearPortalSession, readPortalSession } from "@/lib/portalSession";
import { useSocket } from "@/hooks/useSocket";

const MAX_NOTIFICATIONS = 20;

const formatRelative = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const PortalHeader = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const popoverRef = useRef(null);

  useSocket("new_notification", (payload) => {
    setItems((current) =>
      [
        {
          id: payload?.id || `${Date.now()}-${Math.random()}`,
          title: payload?.title || "Notification",
          body: payload?.body || payload?.message || "",
          createdAt: payload?.createdAt || new Date().toISOString(),
        },
        ...current,
      ].slice(0, MAX_NOTIFICATIONS)
    );
    setUnread((value) => value + 1);
  });

  useSocket("order_status_updated", (payload) => {
    setItems((current) =>
      [
        {
          id: `${Date.now()}-${Math.random()}`,
          title: "Order updated",
          body: `Order #${payload?.orderId || ""} is now ${payload?.status || "updated"}.`,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ].slice(0, MAX_NOTIFICATIONS)
    );
    setUnread((value) => value + 1);
  });

  useSocket("assignment_updated", (payload) => {
    setItems((current) =>
      [
        {
          id: `${Date.now()}-${Math.random()}`,
          title: "Assignment updated",
          body: payload?.notaryName
            ? `Notary ${payload.notaryName} assigned to order #${payload?.orderId || ""}.`
            : `Order #${payload?.orderId || ""} was reassigned.`,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ].slice(0, MAX_NOTIFICATIONS)
    );
    setUnread((value) => value + 1);
  });

  useEffect(() => {
    const handleClickAway = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  const toggleNotifications = () => {
    setOpen((current) => {
      if (!current) {
        setUnread(0);
      }
      return !current;
    });
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    const session = readPortalSession();
    try {
      await logoutPortalUser({ refreshToken: session?.refreshToken });
    } catch (error) {
      // Ignore: clear local session regardless.
      console.warn("Portal logout failed; clearing local session anyway.", error);
    } finally {
      clearPortalSession();
      toast.success("Signed out.");
      router.replace("/login");
    }
  };

  return (
    <div className="sticky top-0 z-40 flex h-12 items-center justify-end gap-3 border-b border-zinc-100 bg-white/95 px-6 backdrop-blur">
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          aria-label="Notifications"
          onClick={toggleNotifications}
          className="relative grid h-9 w-9 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:text-[#1a4fdb]"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </button>
        {open ? (
          <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <p className="text-sm font-bold text-zinc-900">Notifications</p>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
              >
                <LogOut className="h-3.5 w-3.5" />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-zinc-500">
                  You are all caught up.
                </li>
              ) : (
                items.map((item) => (
                  <li key={item.id} className="border-t border-zinc-100 px-4 py-3">
                    <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                    {item.body ? (
                      <p className="mt-1 text-xs text-zinc-600">{item.body}</p>
                    ) : null}
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-zinc-400">
                      {formatRelative(item.createdAt)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PortalHeader;
