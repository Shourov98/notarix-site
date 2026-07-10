"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, LogOut } from "lucide-react";
import { toast } from "sonner";
import { logoutPortalUser } from "@/lib/siteApi";
import { clearPortalSession, readPortalSession } from "@/lib/portalSession";
import { useSocket } from "@/hooks/useSocket";
import {
  fetchPortalNotifications,
  markAllPortalNotificationsRead,
  markPortalNotificationRead,
  selectSitePortal,
} from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const MAX_NOTIFICATIONS = 30;

const formatRelative = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const resolveBody = (notification) => {
  if (!notification) return "";
  if (notification.meta && typeof notification.meta === "object") {
    if (typeof notification.meta.body === "string") return notification.meta.body;
    if (typeof notification.meta.message === "string") return notification.meta.message;
    if (notification.meta.orderId) {
      return `Order #${notification.meta.orderId} was updated.`;
    }
  }
  if (typeof notification.meta === "string") return notification.meta;
  if (notification.action && typeof notification.action === "object") {
    if (notification.action.status) {
      return `Status is now ${notification.action.status}.`;
    }
  }
  return "";
};

const resolveEntityHref = (notification) => {
  if (!notification) return null;
  const { entityType, entityId } = notification;
  if (!entityType || !entityId) return null;
  const normalized = String(entityType).toLowerCase();
  if (normalized === "order") {
    return `/dashboard-client/orders/${entityId}`;
  }
  if (normalized === "document") {
    return `/dashboard-client/documents`;
  }
  if (normalized === "payment") {
    return `/dashboard-client/payments`;
  }
  return null;
};

const PortalHeader = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications, notificationsUnreadCount, notificationsStatus } =
    useAppSelector(selectSitePortal);

  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const popoverRef = useRef(null);

  // Hydrate notifications on mount.
  useEffect(() => {
    dispatch(fetchPortalNotifications());
  }, [dispatch]);

  // Live socket push — refresh the list when the server emits a new one.
  useSocket("new_notification", useCallback(() => {
    dispatch(fetchPortalNotifications());
  }, [dispatch]));

  useSocket("order_status_updated", useCallback(() => {
    dispatch(fetchPortalNotifications());
  }, [dispatch]));

  useSocket("assignment_updated", useCallback(() => {
    dispatch(fetchPortalNotifications());
  }, [dispatch]));

  // Click-away.
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
        dispatch(fetchPortalNotifications());
      }
      return !current;
    });
  };

  const handleMarkAsRead = useCallback(
    (notification) => {
      if (!notification || notification.read) return;
      dispatch(markPortalNotificationRead(notification.id));
    },
    [dispatch]
  );

  const handleMarkAllRead = useCallback(() => {
    if (notificationsUnreadCount === 0) return;
    dispatch(markAllPortalNotificationsRead());
  }, [dispatch, notificationsUnreadCount]);

  const handleNotificationClick = useCallback(
    (notification) => {
      handleMarkAsRead(notification);
      const href = resolveEntityHref(notification);
      if (href) {
        setOpen(false);
        router.push(href);
      }
    },
    [handleMarkAsRead, router]
  );

  const handleSignOut = async () => {
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
    }
  };

  const unreadCount = notificationsUnreadCount;
  const displayCount = unreadCount > 9 ? "9+" : String(unreadCount);
  const isLoading = notificationsStatus === "loading" && notifications.length === 0;
  const visibleNotifications = useMemo(
    () => (notifications || []).slice(0, MAX_NOTIFICATIONS),
    [notifications]
  );

  return (
    <div className="sticky top-0 z-40 flex h-12 items-center justify-end gap-3 border-b border-zinc-100 bg-white/95 px-6 backdrop-blur">
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          aria-label="Notifications"
          onClick={toggleNotifications}
          className={`relative grid h-9 w-9 place-items-center rounded-xl border transition ${
            unreadCount > 0
              ? "border-[#1a4fdb]/30 bg-[#1a4fdb]/10 text-[#1a4fdb] hover:bg-[#1a4fdb]/15"
              : "border-zinc-200 bg-white text-zinc-700 hover:text-[#1a4fdb]"
          }`}
        >
          <Bell className={`h-4 w-4 ${unreadCount > 0 ? "animate-pulse" : ""}`} />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {displayCount}
            </span>
          ) : null}
        </button>

        {open ? (
          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 z-50 mt-3 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-zinc-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-zinc-900">Notifications</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "You are all caught up."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0 || notificationsStatus === "loading"}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#1a4fdb] transition-colors hover:text-[#1541b8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-3 w-3" />
                  Mark all read
                </button>
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
            </div>

            <ul className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <li className="px-4 py-8 text-center text-sm text-zinc-500">
                  Loading notifications...
                </li>
              ) : visibleNotifications.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-zinc-500">
                  You are all caught up.
                </li>
              ) : (
                visibleNotifications.map((notification) => {
                  const body = resolveBody(notification);
                  const href = resolveEntityHref(notification);
                  const isUnread = !notification.read;
                  const content = (
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          isUnread ? "bg-[#1a4fdb]" : "bg-zinc-200"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm leading-snug ${
                            isUnread ? "font-bold text-zinc-900" : "font-medium text-zinc-700"
                          }`}
                        >
                          {notification.title || "Notification"}
                        </p>
                        {body ? (
                          <p className="mt-1 text-xs text-zinc-600 line-clamp-2">
                            {body}
                          </p>
                        ) : null}
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-zinc-400">
                          {formatRelative(
                            notification.createdAt || notification.updatedAt
                          )}
                        </p>
                      </div>
                    </div>
                  );
                  return (
                    <li
                      key={notification.id}
                      className={`border-t border-zinc-100 px-4 py-3 first:border-t-0 transition-colors ${
                        isUnread ? "bg-[#1a4fdb]/5 hover:bg-[#1a4fdb]/10" : "hover:bg-zinc-50"
                      }`}
                    >
                      {href ? (
                        <Link
                          href={href}
                          onClick={() => handleMarkAsRead(notification)}
                          className="block"
                        >
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleNotificationClick(notification)}
                          className="block w-full text-left"
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })
              )}
            </ul>

            <div className="border-t border-zinc-100 px-4 py-3 text-center">
              <Link
                href="/dashboard-client/settings/notifications"
                onClick={() => setOpen(false)}
                className="text-[10px] font-bold uppercase tracking-widest text-[#1a4fdb] hover:text-[#1541b8]"
              >
                Notification settings
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PortalHeader;