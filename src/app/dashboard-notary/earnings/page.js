"use client";

import {
  Download,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  Info,
  Building2,
  Search,
  ChevronDown,
  Eye,
  CheckCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getNotaryPayments } from "@/lib/siteApi";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const STATUS_TONE = {
  Paid: "bg-emerald-50 text-emerald-600",
  Scheduled: "bg-blue-50 text-blue-600",
  Pending: "bg-amber-50 text-amber-600",
  Failed: "bg-rose-50 text-rose-600",
};

const STATUS_DOT = {
  Paid: "bg-emerald-500",
  Scheduled: "bg-blue-500",
  Pending: "bg-amber-500",
  Failed: "bg-rose-500",
};

const formatCurrency = (value) => {
  const numeric = Number(value) || 0;
  return numeric.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

const initialsOf = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return parts.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("");
};

const TONE_CLASSES = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-orange-100 text-orange-600",
  "bg-rose-100 text-rose-600",
  "bg-emerald-100 text-emerald-600",
  "bg-indigo-100 text-indigo-600",
];

const toneFor = (id) => TONE_CLASSES[(String(id).length || 0) % TONE_CLASSES.length];

export default function EarningsPage() {
  const [data, setData] = useState({ summary: null, records: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Yearly");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const response = await getNotaryPayments();
        if (cancelled) return;
        setData({
          summary: response?.summary || { totalEarned: 0, totalPaid: 0, pending: 0 },
          records: Array.isArray(response?.records) ? response.records : [],
        });
      } catch (error) {
        if (!cancelled) toast.error(error?.message || "Unable to load earnings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = data.summary || { totalEarned: 0, totalPaid: 0, pending: 0 };
  const availableForWithdrawal = Math.max(
    0,
    Number(summary.totalEarned || 0) - Number(summary.totalPaid || 0)
  );

  const monthlyTotals = useMemo(() => {
    const buckets = new Array(12).fill(0);
    for (const record of data.records) {
      const stamp = record.dueDate || record.paidDate;
      if (!stamp) continue;
      const monthIndex = new Date(stamp).getMonth();
      if (Number.isNaN(monthIndex)) continue;
      buckets[monthIndex] += Number(record.amount) || 0;
    }
    return buckets;
  }, [data.records]);

  const maxMonthly = Math.max(1, ...monthlyTotals);
  const chartBars = monthlyTotals.map((value) => Math.max(8, Math.round((value / maxMonthly) * 100)));

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.records.filter((record) => {
      if (statusFilter !== "all" && record.status !== statusFilter) {
        return false;
      }
      if (!term) return true;
      return [record.clientName, record.orderId, record.reference]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [data.records, search, statusFilter]);

  const payoutRecords = useMemo(
    () => data.records.filter((record) => record.status === "Paid"),
    [data.records]
  );

  const lastPaid = payoutRecords[0];
  const handleWithdraw = () => {
    toast.info("Withdrawal requests aren't available yet — please contact support.");
  };
  const handleExport = () => {
    toast.info("CSV export will be ready soon. We're working on it.");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Earnings & Payments</h1>
          <p className="text-gray-700 font-medium text-sm">Monitor your income and manage payouts with precision.</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="bg-white text-zinc-700 border border-zinc-200 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Earned", value: formatCurrency(summary.totalEarned), icon: Wallet },
          { label: "This Month", value: formatCurrency(monthlyTotals[new Date().getMonth()] || 0), icon: TrendingUp },
          { label: "Pending", value: formatCurrency(summary.pending), icon: Clock },
          { label: "Paid Out", value: formatCurrency(summary.totalPaid), icon: CheckCircle2 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-zinc-100 p-6 rounded-[24px] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <stat.icon className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-900">{loading ? "—" : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-bold text-zinc-900 text-lg">Revenue Performance</h3>
            <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl p-1">
              {["Weekly", "Monthly", "Yearly"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === tab
                      ? "bg-white text-[#1a4fdb] shadow-sm border border-zinc-100"
                      : "text-gray-700 hover:text-zinc-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-3 relative pb-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[1, 2, 3, 4, 5].map((line) => (
                <div key={line} className="w-full h-px bg-zinc-50 border-dashed" />
              ))}
            </div>
            {chartBars.map((h, i) => (
              <div key={MONTHS[i]} className="flex-1 flex flex-col items-center gap-5 relative z-10">
                <div
                  className="w-full bg-[#1a4fdb]/10 rounded-t-2xl transition-all hover:bg-[#1a4fdb]/20 cursor-pointer relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl pointer-events-none">
                    {formatCurrency(monthlyTotals[i])}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 h-[480px] flex flex-col">
          <div className="bg-[#1a4fdb] rounded-[32px] p-8 text-white shadow-lg shadow-blue-100 flex-1 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-100">Available for Withdrawal</span>
                <Info className="w-4 h-4 text-blue-200" />
              </div>
              <p className="text-4xl font-bold mb-6">{loading ? "—" : formatCurrency(availableForWithdrawal)}</p>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold">Bank account not configured</p>
                  <p className="text-[10px] font-medium text-blue-200">Add one in Settings → Payments</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleWithdraw}
              className="w-full bg-white text-[#1a4fdb] font-bold text-sm py-4 rounded-[20px] hover:bg-zinc-50 transition-all active:scale-95 shadow-xl relative z-10"
            >
              Withdraw Funds
            </button>
          </div>

          <div className="bg-white border border-zinc-100 rounded-[24px] p-6 shadow-sm flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Last Payout
              </p>
              <p className="text-lg font-bold text-zinc-900">
                {lastPaid ? formatCurrency(lastPaid.amount) : "No payouts yet"}
              </p>
              <p className="text-xs font-medium text-gray-700">
                {lastPaid ? (lastPaid.paidDateLabel || lastPaid.paidDate || "") : "—"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Success</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-4 bg-white p-4 rounded-[24px] border border-zinc-100 shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#1a4fdb] transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by client name or order ID…"
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-zinc-100 bg-white">
          <h2 className="text-lg font-bold text-zinc-900">Recent Earnings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Client Name</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Service Type</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-center">Method</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm font-medium text-gray-700">
                    Loading earnings…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm font-medium text-gray-700">
                    No earnings match your filters yet.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const tone = STATUS_TONE[row.status] || "bg-zinc-50 text-zinc-600";
                  const dot = STATUS_DOT[row.status] || "bg-zinc-400";
                  return (
                    <tr key={row.id || row.orderId} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-zinc-900">{row.orderId || row.id || "—"}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${toneFor(row.id || row.orderId)}`}>
                            {initialsOf(row.clientName)}
                          </div>
                          <span className="text-sm font-medium text-zinc-700">{row.clientName || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-zinc-600">{row.method || "—"}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-700">{row.dueDateLabel || row.dueDate || "—"}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-zinc-900">{formatCurrency(row.amount)}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${tone}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                          {row.status || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-medium text-gray-700">{row.reference || "—"}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <a
                          href={row.proof?.url || row.route || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex p-2 text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all"
                          aria-label="View order"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
          <span className="text-sm text-gray-700 font-medium">
            Showing {filtered.length} of {data.records.length} transactions
          </span>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-zinc-100 bg-white">
          <h2 className="text-lg font-bold text-zinc-900">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/30">
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Payout ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Method</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-gray-700">
                    Loading payouts…
                  </td>
                </tr>
              ) : payoutRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-gray-700">
                    No payouts yet — they&apos;ll show up here once you complete your first assignment.
                  </td>
                </tr>
              ) : (
                payoutRecords.map((row) => (
                  <tr key={row.id || row.reference} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-zinc-900">{row.reference || row.id || "—"}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-zinc-600">{row.paidDateLabel || row.paidDate || "—"}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-700">{row.method || "—"}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm font-bold text-zinc-900">{formatCurrency(row.amount)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1.5 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Success</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}