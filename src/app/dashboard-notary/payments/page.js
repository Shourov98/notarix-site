"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, Download, Loader2, ShieldCheck } from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const toneForStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("paid")) return "bg-emerald-50 text-emerald-700";
  if (normalized.includes("pending")) return "bg-amber-50 text-amber-700";
  if (normalized.includes("failed")) return "bg-rose-50 text-rose-700";
  return "bg-zinc-100 text-zinc-700";
};

export default function NotaryPaymentsPage() {
  const [payload, setPayload] = useState({ summary: {}, records: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPayments = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await requestPortalJson("/site/notary/payments");
        if (!cancelled) {
          setPayload({
            summary: result?.summary || {},
            records: result?.records || [],
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load notary payouts.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPayments();
    return () => {
      cancelled = true;
    };
  }, []);

  const { summary, records } = payload;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Earnings / Payments</h1>
        <p className="mt-1 text-sm font-medium text-zinc-500">
          Live payout records for this notary account.
        </p>
      </div>

      {error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">{error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Total Earned", value: `$${Number(summary.totalEarned || 0).toFixed(2)}` },
          { label: "Total Paid", value: `$${Number(summary.totalPaid || 0).toFixed(2)}` },
          { label: "Pending", value: `$${Number(summary.pending || 0).toFixed(2)}` },
        ].map((card) => (
          <div key={card.label} className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="text-xl font-bold text-zinc-900">Payout Records</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading payouts...
          </div>
        ) : records.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-zinc-50">
                <tr>
                  {["Order ID", "Client", "Amount", "Status", "Method", "Release", "Due Date", "Action"].map((head) => (
                    <th key={head} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-5 font-bold text-[#2c49df]">{record.orderId}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-900">{record.clientName}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-900">{record.amountLabel}</td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${toneForStatus(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-600">{record.method}</td>
                    <td className="px-6 py-5 text-sm text-zinc-500">
                      {typeof record.releaseDays === "number" ? `${record.releaseDays} days` : "Not set"}
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-500">{record.dueDateLabel}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={record.route}
                          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                        >
                          View Assignment
                        </Link>
                        {record.proof?.downloadUrl ? (
                          <a
                            href={record.proof.downloadUrl}
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                          >
                            Proof
                            <Download className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-zinc-900">No payouts yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              Payout records will appear when this notary has real assignment earnings in the backend.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-zinc-400">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-widest">
          Loaded from live payout data only
        </span>
      </div>
    </div>
  );
}
