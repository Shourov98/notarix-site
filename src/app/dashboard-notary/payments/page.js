"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Landmark, Wallet, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { buildAssetUrl, getNotaryPayments } from "@/lib/siteApi";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const statusTone = {
  Paid: "bg-emerald-50 text-emerald-600",
  Scheduled: "bg-blue-50 text-blue-600",
  Pending: "bg-orange-50 text-orange-600",
  Failed: "bg-rose-50 text-rose-600",
};

export default function NotaryPaymentsPage() {
  const [data, setData] = useState({ summary: null, records: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setData(await getNotaryPayments());
      } catch (error) {
        toast.error(error.message || "Unable to load payouts.");
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
      [record.orderId, record.clientName, record.reference, record.method]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [data.records, search]);

  const summary = data.summary || {
    totalEarned: 0,
    totalPaid: 0,
    pending: 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Earnings &amp; Payments</h1>
          <p className="mt-1 text-sm font-medium text-gray-700">
            Track your payout schedule and completed transfers from assigned orders.
          </p>
        </div>
        <button className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-4 font-bold text-zinc-800 shadow-sm">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
        {[
          { label: "Total Earned", value: formatCurrency(summary.totalEarned), icon: Wallet },
          { label: "Paid Out", value: formatCurrency(summary.totalPaid), icon: WalletCards },
          { label: "Pending Payouts", value: formatCurrency(summary.pending), icon: Landmark },
          {
            label: "Available After Release",
            value: formatCurrency(summary.pending),
            icon: Wallet,
          },
        ].map((card) => (
          <div key={card.label} className="rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#2c49df]">
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-700">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-zinc-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-indigo-100 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by client, order ID, or reference..."
          className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-900 focus:border-[#2c49df] focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-[24px] border border-indigo-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="text-xl font-bold text-zinc-900">Payout Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead className="bg-zinc-50">
              <tr>
                {["Order", "Client", "Amount", "Status", "Release", "Method", "Proof"].map((head) => (
                  <th key={head} className="px-6 py-5 text-left text-sm font-bold text-gray-700">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t border-zinc-100">
                  <td className="px-6 py-6 font-bold text-[#2c49df]">
                    <Link href={record.route} className="hover:underline">
                      {record.orderId}
                    </Link>
                  </td>
                  <td className="px-6 py-6 text-zinc-700">{record.clientName}</td>
                  <td className="px-6 py-6 font-bold text-zinc-900">{record.amountLabel}</td>
                  <td className="px-6 py-6">
                    <span className={`rounded-full px-3 py-1 text-sm font-bold ${statusTone[record.status] || "bg-zinc-100 text-zinc-600"}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-zinc-600">
                    {record.releaseDays ? `${record.releaseDays} days` : "Not set"}
                    <div className="mt-1 text-xs text-gray-700">{record.dueDateLabel}</div>
                  </td>
                  <td className="px-6 py-6 text-zinc-600">{record.method}</td>
                  <td className="px-6 py-6 text-sm">
                    {record.proof?.url ? (
                      <a
                        href={buildAssetUrl(record.proof.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#2c49df] hover:underline"
                      >
                        View proof
                      </a>
                    ) : (
                      <span className="text-gray-700">Pending admin upload</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading ? (
          <p className="px-6 py-5 text-sm text-gray-700">Loading payouts...</p>
        ) : records.length === 0 ? (
          <p className="px-6 py-5 text-sm text-gray-700">No payout records available yet.</p>
        ) : null}
      </div>
    </div>
  );
}
