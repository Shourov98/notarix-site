"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

export default function NotaryAssignmentsRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = await requestPortalJson("/site/notary/assignments");
      const items = (Array.isArray(payload) ? payload : []).filter(
        (item) => item.status === "Notary Assigned"
      );
      setRequests(items);
    } catch (loadError) {
      setError(loadError.message || "Unable to load assignment requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (request) => {
    setActingId(request.rawId);
    setError("");

    try {
      await requestPortalJson(`/site/notary/orders/${request.rawId}/accept`, {
        method: "PATCH",
        body: JSON.stringify({ note: "Accepted from assignments requests page." }),
      });
      await loadRequests();
    } catch (submitError) {
      setError(submitError.message || "Unable to accept this assignment.");
    } finally {
      setActingId("");
    }
  };

  const handleReject = async (request) => {
    setActingId(request.rawId);
    setError("");

    try {
      await requestPortalJson(`/site/notary/orders/${request.rawId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason: "Declined from notary request queue." }),
      });
      await loadRequests();
    } catch (submitError) {
      setError(submitError.message || "Unable to reject this assignment.");
    } finally {
      setActingId("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Assignment Requests</h1>
          <p className="mt-2 text-sm text-zinc-500">
            These are live assignments waiting for this notary to accept or reject.
          </p>
        </div>
        <span className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#2c49df] px-4 text-sm font-bold text-white">
          {requests.length} pending
        </span>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">{error}</p>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-[24px] border border-zinc-100 bg-white px-6 py-16 text-zinc-500 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading assignment requests...
        </div>
      ) : requests.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {requests.map((request) => (
            <div key={request.rawId} className="rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {request.id}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-zinc-900">{request.title}</h2>
                  <p className="mt-2 text-sm text-zinc-500">{request.borrower}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  {request.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Type", request.orderType],
                  ["Date", request.date || "Pending"],
                  ["Location", request.location || "Pending"],
                  ["Fee", request.fee],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={actingId === request.rawId}
                  onClick={() => handleAccept(request)}
                  className="rounded-xl bg-[#2c49df] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#243dcc] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actingId === request.rawId ? "Working..." : "Accept"}
                </button>
                <button
                  type="button"
                  disabled={actingId === request.rawId}
                  onClick={() => handleReject(request)}
                  className="rounded-xl border border-rose-200 px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Reject
                </button>
                <Link
                  href={request.route}
                  className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-zinc-100 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-lg font-bold text-zinc-900">No assignment requests</p>
          <p className="mt-2 text-sm text-zinc-500">
            New notary assignment requests will appear here when the backend assigns them to this account.
          </p>
        </div>
      )}
    </div>
  );
}
