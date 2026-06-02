"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ExternalLink, Loader2, PlusCircle } from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const toneForStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("completed")) return "bg-emerald-50 text-emerald-700";
  if (normalized.includes("progress")) return "bg-blue-50 text-blue-700";
  if (normalized.includes("pending")) return "bg-amber-50 text-amber-700";
  if (normalized.includes("rejected") || normalized.includes("cancel")) {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-zinc-100 text-zinc-700";
};

function OrdersSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-40 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-5 w-80 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[2rem] bg-white shadow-sm" />
        ))}
      </div>
      <div className="h-[30rem] animate-pulse rounded-[2rem] bg-white shadow-sm" />
    </div>
  );
}

export default function OrdersPage() {
  const [payload, setPayload] = useState({ orders: [], recentOrders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await requestPortalJson("/site/client/orders");
        if (!cancelled) {
          setPayload({
            orders: result?.orders || [],
            recentOrders: result?.recentOrders || [],
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load client orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const orders = payload.orders || [];

  const metrics = useMemo(() => {
    const completed = orders.filter((item) =>
      String(item.status || "").toLowerCase().includes("completed")
    ).length;
    const active = orders.filter((item) =>
      ["in progress", "accepted by admin", "accepted by notary", "notary assigned"].some((label) =>
        String(item.workflowStatus || item.status || "").toLowerCase().includes(label)
      )
    ).length;
    const pending = orders.filter((item) =>
      String(item.status || "").toLowerCase().includes("pending")
    ).length;

    return {
      total: orders.length,
      completed,
      active,
      pending,
    };
  }, [orders]);

  if (loading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h1 className="text-xl font-bold">Orders unavailable</h1>
            <p className="mt-2 text-sm leading-7">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            Real client orders from the backend. No mock rows.
          </p>
        </div>
        <Link
          href="/dashboard-client/orders/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1a4fdb] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8]"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Order
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Total Orders", value: metrics.total, meta: "All client orders" },
          { label: "Active Orders", value: metrics.active, meta: "Assigned or in progress" },
          { label: "Completed Orders", value: metrics.completed, meta: "Finished successfully" },
        ].map((card) => (
          <div key={card.label} className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{card.value}</p>
            <p className="mt-2 text-sm font-medium text-zinc-500">{card.meta}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="text-xl font-bold text-zinc-900">Order List</h2>
        </div>

        {orders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="bg-zinc-50">
                <tr>
                  {["Order ID", "Signer", "Service", "Location", "Date", "Status", "Notary", "Action"].map((head) => (
                    <th key={head} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-5 font-bold text-[#1a4fdb]">{order.id}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-900">{order.signerName}</td>
                    <td className="px-6 py-5 text-sm text-zinc-600">{order.serviceType}</td>
                    <td className="px-6 py-5 text-sm text-zinc-500">{order.location || "Location pending"}</td>
                    <td className="px-6 py-5 text-sm text-zinc-500">{order.date || "Not scheduled"}</td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${toneForStatus(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-600">
                      {order.notary?.name || "Unassigned"}
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        href={`/dashboard-client/orders/${String(order.id).replace(/^#/, "")}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                      >
                        View
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-zinc-900">No orders yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              When real client orders exist, they will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
