import StatsOverview from "@/components/dashboard-client/StatsOverview";
import OrdersTable from "@/components/dashboard-client/OrdersTable";
import { PlusCircle, Filter } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Orders</h1>
          <p className="text-zinc-500 font-medium text-sm">Manage, track, and create notary service orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard-client/orders/new"
            className="bg-[#1a4fdb] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#1541b8] transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Order
          </Link>
          <button className="bg-zinc-50 text-zinc-600 border border-zinc-200 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-100 transition-all active:scale-95">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
