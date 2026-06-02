"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  FileText,
  FolderCheck,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { useClientPortal } from "./ClientPortalProvider";

const STATUS_TONES = {
  Completed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  "Pending Admin Review": "bg-amber-50 text-amber-700",
  "Accepted By Admin": "bg-blue-50 text-blue-700",
  "Needs Reassignment": "bg-rose-50 text-rose-700",
  "In Progress": "bg-blue-50 text-blue-700",
};

const DOCUMENT_TONES = {
  Verified: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Rejected: "bg-rose-50 text-rose-700",
  Missing: "bg-zinc-100 text-zinc-600",
};

const formatPercent = (value) => `${Math.round(value)}%`;

const getStatusTone = (status) => STATUS_TONES[status] || "bg-zinc-100 text-zinc-700";
const getDocumentTone = (status) =>
  DOCUMENT_TONES[status] || "bg-zinc-100 text-zinc-600";

const formatDateLabel = (value) => {
  if (!value) return "Not scheduled";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-5 w-96 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-[2rem] bg-white shadow-sm" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="h-[26rem] animate-pulse rounded-[2rem] bg-white shadow-sm xl:col-span-2" />
        <div className="h-[26rem] animate-pulse rounded-[2rem] bg-white shadow-sm" />
      </div>
    </div>
  );
}

function EmptyPanel({ title, description, actionHref, actionLabel }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <FolderCheck className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1a4fdb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1541b8]"
        >
          {actionLabel}
          <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export default function ClientDashboardOverview() {
  const { stats, profile, documents, recentOrders, loading, error } = useClientPortal();

  const activeOrder = useMemo(
    () =>
      recentOrders.find(
        (order) => !["Completed", "Rejected By Admin", "Cancelled"].includes(order.status)
      ) || null,
    [recentOrders]
  );

  const distribution = useMemo(() => {
    const total = Math.max(Number(stats.totalOrders || 0), 0);
    const completed = Math.max(Number(stats.completedOrders || 0), 0);
    const pending = Math.max(Number(stats.pendingOrders || 0), 0);
    const active = Math.max(total - completed - pending, 0);

    if (!total) {
      return { completed: 0, active: 0, pending: 0 };
    }

    return {
      completed: (completed / total) * 100,
      active: (active / total) * 100,
      pending: (pending / total) * 100,
    };
  }, [stats.completedOrders, stats.pendingOrders, stats.totalOrders]);

  const documentSummary = useMemo(() => {
    return documents.reduce(
      (summary, document) => {
        const key = String(document.status || "Missing");
        summary[key] = (summary[key] || 0) + 1;
        return summary;
      },
      { Verified: 0, Pending: 0, Rejected: 0, Missing: 0 }
    );
  }, [documents]);

  const statCards = [
    {
      label: "TOTAL ORDERS",
      value: String(stats.totalOrders || 0),
      meta: recentOrders.length ? `${recentOrders.length} recent orders loaded` : "No recent order records yet",
      icon: FileText,
      tone: "bg-blue-50 text-[#1a4fdb]",
    },
    {
      label: "ACTIVE ORDERS",
      value: String(Math.max(Number(stats.totalOrders || 0) - Number(stats.completedOrders || 0) - Number(stats.pendingOrders || 0), 0)),
      meta: activeOrder ? `Current focus: ${activeOrder.id}` : "No active orders right now",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "COMPLETED ORDERS",
      value: String(stats.completedOrders || 0),
      meta: "Completed signings recorded in your account",
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "OUTSTANDING PAYMENTS",
      value: stats.outstandingPayments || "$0.00",
      meta: "Awaiting settlement or payment confirmation",
      icon: CreditCard,
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  if (loading) {
    return <OverviewSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h1 className="text-xl font-bold">Client dashboard unavailable</h1>
            <p className="mt-2 text-sm leading-7">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Overview</h1>
        <p className="mt-1 text-zinc-500 font-medium">
          Track live orders, document readiness, and payment progress from your real account data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {stat.label}
                </p>
                <h3 className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</h3>
              </div>
              <div className={`rounded-2xl p-3 ${stat.tone}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs font-medium text-zinc-500">{stat.meta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          {activeOrder ? (
            <div className="relative overflow-hidden rounded-[2rem] bg-[#1a4fdb] p-8 text-white shadow-[0_24px_60px_rgba(26,79,219,0.22)]">
              <div className="absolute right-0 top-0 h-56 w-56 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      Active Order
                    </span>
                    <span className="text-sm font-medium text-blue-100">#{activeOrder.id}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{activeOrder.type}</h2>
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-blue-100">
                    <span className="font-semibold text-white">{activeOrder.borrower || "Borrower pending"}</span>
                    <span>•</span>
                    <span>{activeOrder.location || "Location pending"}</span>
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusTone(activeOrder.status)}`}>
                      {activeOrder.status}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-100">
                      Fee {activeOrder.fee}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href={`/dashboard-client/orders/${activeOrder.id}`}
                      className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1a4fdb] transition hover:bg-blue-50"
                    >
                      View Details
                    </Link>
                    <Link
                      href="/dashboard-client/messages"
                      className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                    >
                      Open Messages
                    </Link>
                  </div>
                </div>

                <div className="min-w-[220px] rounded-[1.75rem] border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-blue-100">
                    <Timer className="h-5 w-5" />
                    <p className="text-sm font-medium">Scheduled</p>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-white">
                    {formatDateLabel(activeOrder.date)}
                  </p>
                  <p className="mt-3 text-sm text-blue-100">
                    Real order data only. This card disappears when there is no active order.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyPanel
              title="No active orders"
              description="You do not have any active notarization requests at the moment. New orders will appear here as soon as they are submitted."
              actionHref="/dashboard-client/orders/new"
              actionLabel="Create New Order"
            />
          )}

          <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Recent Orders</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Latest client-side orders from the backend.
                </p>
              </div>
              <Link
                href="/dashboard-client/orders"
                className="text-sm font-bold text-[#1a4fdb] hover:underline"
              >
                View All
              </Link>
            </div>

            {recentOrders.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-left">
                      {["Order ID", "Type", "Borrower", "Status", "Fee", "Date"].map((label) => (
                        <th
                          key={label}
                          className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-50/60">
                        <td className="py-5 pr-4">
                          <Link
                            href={`/dashboard-client/orders/${order.id}`}
                            className="text-sm font-bold text-[#1a4fdb] hover:underline"
                          >
                            #{order.id}
                          </Link>
                        </td>
                        <td className="py-5 pr-4 text-sm font-medium text-zinc-600">{order.type}</td>
                        <td className="py-5 pr-4 text-sm font-semibold text-zinc-900">
                          {order.borrower || "Borrower pending"}
                        </td>
                        <td className="py-5 pr-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusTone(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-5 pr-4 text-sm font-semibold text-zinc-900">{order.fee}</td>
                        <td className="py-5 text-sm text-zinc-500">{formatDateLabel(order.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyPanel
                title="No orders yet"
                description="Once a client order is created, the latest five will appear here automatically."
                actionHref="/dashboard-client/orders/new"
                actionLabel="Create First Order"
              />
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900">Order Distribution</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Based on your current backend order totals.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-600">Completed</span>
                  <span className="font-bold text-zinc-900">
                    {formatPercent(distribution.completed)}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-zinc-100">
                  <div
                    className="h-3 rounded-full bg-[#1a4fdb]"
                    style={{ width: `${distribution.completed}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-600">Active</span>
                  <span className="font-bold text-zinc-900">{formatPercent(distribution.active)}</span>
                </div>
                <div className="h-3 rounded-full bg-zinc-100">
                  <div
                    className="h-3 rounded-full bg-amber-500"
                    style={{ width: `${distribution.active}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-600">Pending Review</span>
                  <span className="font-bold text-zinc-900">{formatPercent(distribution.pending)}</span>
                </div>
                <div className="h-3 rounded-full bg-zinc-100">
                  <div
                    className="h-3 rounded-full bg-zinc-400"
                    style={{ width: `${distribution.pending}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900">Account Snapshot</h3>
            <div className="mt-6 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#1a4fdb]" />
                <div>
                  <p className="font-semibold text-zinc-900">{profile.name || "Unnamed client"}</p>
                  <p className="mt-1 text-zinc-500">{profile.email || "No email available"}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Company
                </p>
                <p className="mt-2 font-semibold text-zinc-900">
                  {profile.company || "Individual client account"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">{profile.status || "Unknown"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Verification
                  </p>
                  <p className="mt-2 font-semibold text-zinc-900">
                    {profile.verification || "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-zinc-900">Verification Documents</h3>
              <span className="text-sm font-semibold text-zinc-500">
                {documents.length} total
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                {documentSummary.Verified} verified
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                {documentSummary.Pending} pending
              </span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                {documentSummary.Rejected} rejected
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">
                {documentSummary.Missing} missing
              </span>
            </div>

            {documents.length ? (
              <div className="mt-6 space-y-3">
                {documents.slice(0, 5).map((document) => (
                  <div
                    key={document.id || document.title}
                    className="rounded-2xl border border-zinc-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-900">
                          {document.title}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {document.file ? "Uploaded" : "No file uploaded yet"}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getDocumentTone(document.status)}`}
                      >
                        {document.status || "Missing"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm leading-7 text-zinc-500">
                No verification documents have been uploaded for this account yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
