"use client";

import { useEffect } from "react";
import StatsOverview from "@/components/dashboard-client/StatsOverview";
import OrdersTable from "@/components/dashboard-client/OrdersTable";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClientOrders, selectSitePortal } from "@/store/sitePortalSlice";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { clientOrders, clientOrdersStatus } = useAppSelector(selectSitePortal);

  useEffect(() => {
    dispatch(fetchClientOrders());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Orders</h1>
          <p className="text-gray-700 font-medium text-sm">Manage, track, and create notary service orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard-client/orders/new"
            className="bg-[#1a4fdb] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#1541b8] transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Order
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview orders={clientOrders} />

      {/* Orders Table */}
      {clientOrdersStatus === "loading" ? (
        <div className="rounded-[32px] border border-zinc-100 bg-white p-8 text-sm text-gray-700 shadow-sm">
          Loading orders...
        </div>
      ) : (
        <OrdersTable orders={clientOrders} />
      )}
    </div>
  );
}
