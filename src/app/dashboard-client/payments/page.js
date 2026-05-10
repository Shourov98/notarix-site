import PaymentsStats from "@/components/dashboard-client/PaymentsStats";
import PaymentsTable from "@/components/dashboard-client/PaymentsTable";
import { Download, ShieldCheck } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Payments</h1>
          <p className="text-zinc-500 font-medium text-sm">Track and manage all transactions</p>
        </div>
        <button className="bg-white text-zinc-700 border border-zinc-200 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-50 transition-all active:scale-95 shadow-sm">
          <Download className="w-4 h-4" />
          Download Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <PaymentsStats />

      {/* Transactions Table */}
      <PaymentsTable />

      {/* Secure Footer */}
      <div className="flex items-center gap-2 text-zinc-400">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-widest">Secure Payment via Stripe</span>
      </div>
    </div>
  );
}
