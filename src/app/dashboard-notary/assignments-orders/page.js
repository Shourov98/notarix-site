"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const toneForStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("completed")) return "bg-emerald-50 text-emerald-700";
  if (normalized.includes("progress")) return "bg-blue-50 text-blue-700";
  if (normalized.includes("accepted")) return "bg-indigo-50 text-indigo-700";
  if (normalized.includes("assigned") || normalized.includes("pending")) {
    return "bg-amber-50 text-amber-700";
  }
  if (normalized.includes("rejected")) return "bg-rose-50 text-rose-700";
  return "bg-zinc-100 text-zinc-700";
};

export default function NotaryAssignmentsOrdersPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAssignments = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = await requestPortalJson("/site/notary/assignments");
        if (!cancelled) {
          setAssignments(Array.isArray(payload) ? payload : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load assignments.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAssignments();

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => {
    const completed = assignments.filter((item) =>
      String(item.status || "").toLowerCase().includes("completed")
    ).length;
    const active = assignments.filter((item) =>
      ["accepted", "progress"].some((label) =>
        String(item.status || "").toLowerCase().includes(label)
      )
    ).length;
    const pending = assignments.filter((item) =>
      String(item.status || "").toLowerCase().includes("assigned")
    ).length;

    return { total: assignments.length, completed, active, pending };
  }, [assignments]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Assignment Orders</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Live notary assignments from the backend. No demo schedule rows.
        </p>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">{error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-4">
        {[
          ["Total Assignments", metrics.total],
          ["Pending Acceptance", metrics.pending],
          ["Active", metrics.active],
          ["Completed", metrics.completed],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[24px] border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="text-xl font-bold text-zinc-900">Assignments</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading assignments...
          </div>
        ) : assignments.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="bg-zinc-50">
                <tr>
                  {["Order ID", "Client", "Borrower", "Type", "Location", "Date", "Fee", "Status", "Action"].map((head) => (
                    <th key={head} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {assignments.map((assignment) => (
                  <tr key={assignment.rawId} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-5 font-bold text-[#2c49df]">{assignment.id}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-900">{assignment.title}</td>
                    <td className="px-6 py-5 text-sm text-zinc-600">{assignment.borrower}</td>
                    <td className="px-6 py-5 text-sm text-zinc-600">{assignment.orderType}</td>
                    <td className="px-6 py-5 text-sm text-zinc-500">{assignment.location || "Pending"}</td>
                    <td className="px-6 py-5 text-sm text-zinc-500">{assignment.date || "Pending"}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-900">{assignment.fee}</td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${toneForStatus(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        href={assignment.route}
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
            <p className="text-lg font-bold text-zinc-900">No assignments yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              When live assignment orders exist for this notary, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
