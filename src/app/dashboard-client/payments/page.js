"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { buildAssetUrl, getClientPayments } from "@/lib/siteApi";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

const statusTone = {
  Received: "bg-emerald-50 text-emerald-600",
  Pending: "bg-blue-50 text-blue-600",
  Failed: "bg-rose-50 text-rose-600",
};

export default function ClientPaymentsPage() {
  const [data, setData] = useState({ summary: null, records: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setData(await getClientPayments());
      } catch (error) {
        toast.error(error.message || "Unable to load payments.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const records = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data.records || [];
    return (data.records || []).filter((record) =>
      [record.orderId, record.companyName, record.reference, record.method]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [data.records, search]);

  const summary = data.summary || {
    totalOrderValue: 0,
    totalPaid: 0,
    pending: 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-zinc-900">Payments</h1>
          <p className="text-sm font-medium text-gray-700">
            Review invoices, receipts, and outstanding balances for your orders.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 active:scale-95">
          <Download className="h-4 w-4" />
          Download Receipts
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Total Order Value", value: formatCurrency(summary.totalOrderValue) },
          { label: "Payments Received", value: formatCurrency(summary.totalPaid) },
          { label: "Outstanding Balance", value: formatCurrency(summary.pending) },
        ].map((card) => (
          <div key={card.label} className="rounded-[32px] border border-zinc-100 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">{card.label}</p>
            <p className="mt-3 text-2xl font-bold text-zinc-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] border border-zinc-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-zinc-900">Payment Ledger</h2>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order, company, or reference..."
            className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-[#1a4fdb] focus:outline-none sm:w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left">
            <thead className="bg-zinc-50/40">
              <tr>
                {["Order", "Company", "Amount", "Status", "Method", "Due", "Receipt"].map((head) => (
                  <th key={head} className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-700">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-50/50">
                  <td className="px-6 py-5">
                    <Link href={record.route} className="font-bold text-[#1a4fdb] hover:underline">
                      {record.orderId}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-sm text-zinc-700">{record.companyName || "Direct client"}</td>
                  <td className="px-6 py-5 font-bold text-zinc-900">{record.amountLabel}</td>
                  <td className="px-6 py-5">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusTone[record.status] || "bg-zinc-100 text-zinc-600"}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-zinc-600">{record.method}</td>
                  <td className="px-6 py-5 text-sm text-zinc-600">{record.dueDateLabel || formatDate(record.dueDate)}</td>
                  <td className="px-6 py-5 text-sm">
                    {record.proof?.url ? (
                      <a
                        href={buildAssetUrl(record.proof.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#1a4fdb] hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-700">Not uploaded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-700">Loading payments...</p>
        ) : records.length === 0 ? (
          <p className="p-6 text-sm text-gray-700">No payment records found yet.</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-widest">
          Manual payment records are securely archived for each order.
        </span>
      </div>
    </div>
  );
}
