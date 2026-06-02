"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  ExternalLink,
  HandCoins,
  Loader2,
  MapPin,
  TimerReset,
  TriangleAlert,
} from "lucide-react";
import {
  invalidatePortalCache,
  requestPortalJson,
  requestPortalJsonOnce,
} from "@/lib/portal-api";

const STAT_ICONS = {
  "Completed Total Assignments": ClipboardCheck,
  "Open Assignments": CalendarDays,
  "Total Earnings": CircleDollarSign,
};

const REQUEST_STATUS_TONES = {
  "Notary Assigned": "bg-amber-50 text-amber-700 border-amber-100",
  "Accepted By Notary": "bg-blue-50 text-blue-700 border-blue-100",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

const toneForStatus = (status) =>
  REQUEST_STATUS_TONES[status] || "bg-zinc-100 text-zinc-600 border-zinc-200";

const formatRequestStatus = (status) =>
  String(status || "Pending")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

function NotarySkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-[24px] bg-white shadow-sm" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="h-[26rem] animate-pulse rounded-[24px] bg-white shadow-sm xl:col-span-8" />
        <div className="h-[26rem] animate-pulse rounded-[24px] bg-white shadow-sm xl:col-span-4" />
      </div>
    </div>
  );
}

function EmptyState({ title, description, href, cta }) {
  return (
    <div className="rounded-[24px] border border-dashed border-zinc-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
        <BriefcaseBusiness className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-zinc-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-500">{description}</p>
      {href && cta ? (
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#2c49df] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243dcc]"
        >
          {cta}
          <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export default function DashboardOverview() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = await requestPortalJsonOnce("/site/notary/overview");
        if (!cancelled) {
          setOverview(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load notary dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshOverview = async () => {
    try {
      invalidatePortalCache("/site/notary/overview");
      const payload = await requestPortalJsonOnce("/site/notary/overview");
      setOverview(payload);
    } catch (refreshError) {
      setError(refreshError.message || "Unable to refresh notary dashboard.");
    }
  };

  const handleAccept = async (assignment) => {
    if (!assignment?.rawId) return;

    setActingId(assignment.rawId);
    setError("");

    try {
      await requestPortalJson(`/site/notary/orders/${assignment.rawId}/accept`, {
        method: "PATCH",
        body: JSON.stringify({
          note: "Accepted from notary dashboard overview.",
        }),
      });
      await refreshOverview();
    } catch (submitError) {
      setError(submitError.message || "Unable to accept assignment.");
    } finally {
      setActingId("");
    }
  };

  const stats = overview?.stats || [];
  const assignments = overview?.assignments || [];
  const requests = overview?.requests || [];
  const assignmentOrderStats = overview?.assignmentOrderStats || [];

  const projectedValue = useMemo(() => {
    const totalEarnings = stats.find((item) => item.label === "Total Earnings")?.value || "$0.00";
    return totalEarnings;
  }, [stats]);

  if (loading) {
    return <NotarySkeleton />;
  }

  if (error && !overview) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h1 className="text-xl font-bold">Notary dashboard unavailable</h1>
            <p className="mt-2 text-sm leading-7">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = STAT_ICONS[stat.label] || ClipboardCheck;
          return (
            <div key={stat.label} className="rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="max-w-[16ch] text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {stat.label}
                  </p>
                  <p className="mt-5 text-3xl font-bold text-zinc-900">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2c49df]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="overflow-hidden rounded-[24px] border border-indigo-100 bg-white shadow-sm xl:col-span-8">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Active Assignments</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Live assignments currently tied to this notary account.
              </p>
            </div>
            <Link href="/dashboard-notary/assignments-orders" className="text-sm font-bold text-[#2c49df] hover:underline">
              View Schedule
            </Link>
          </div>
          <div>
            {assignments.length ? (
              assignments.map((item) => (
                <div
                  key={`${item.time}-${item.name}`}
                  className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-6 last:border-b-0 md:flex-row md:items-center"
                >
                  <div className="w-28 text-2xl font-bold tracking-tight text-zinc-900">{item.time || "--:--"}</div>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-zinc-900">{item.name || "Assignment"}</p>
                    <p className="mt-1 text-sm font-medium text-zinc-500">{item.detail || "Assignment details unavailable"}</p>
                  </div>
                  <span className={`self-start rounded-full border px-4 py-2 text-xs font-bold ${toneForStatus(item.status)}`}>
                    {formatRequestStatus(item.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8">
                <EmptyState
                  title="No active assignments"
                  description="Accepted or in-progress assignments will appear here as soon as they are assigned to this notary."
                  href="/dashboard-notary/assignments-orders"
                  cta="Open Assignments"
                />
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="rounded-[24px] bg-[#2c49df] p-7 text-white shadow-xl shadow-blue-200">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-100">
              Total Earnings
            </p>
            <p className="mt-7 text-4xl font-bold tracking-tight">{projectedValue}</p>
            <p className="mt-3 text-sm text-blue-100">
              Pulled directly from completed and assigned payout records.
            </p>
            <Link
              href="/dashboard-notary/payments"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#2c49df]"
            >
              Open Payments
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-zinc-900">Assignment Requests</h2>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2c49df] text-sm font-bold text-white">
            {requests.length}
          </span>
        </div>

        {requests.length ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {requests.map((request) => (
              <div key={request.rawId || request.id} className="rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                    <HandCoins className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold tracking-tight text-zinc-700">{request.fee}</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-zinc-900">{request.title || "Assignment request"}</h3>
                  <p className="mt-2 text-sm font-medium text-zinc-500">{request.borrower || "Borrower pending"}</p>
                </div>
                <div className="mt-6 space-y-3 text-zinc-600">
                  <div className="flex items-center gap-3">
                    <TimerReset className="h-4 w-4 text-zinc-400" />
                    <span>{request.date || "Date pending"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    <span>{request.location || "Location pending"}</span>
                  </div>
                </div>
                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    disabled={actingId === request.rawId}
                    onClick={() => handleAccept(request)}
                    className="flex-1 rounded-xl bg-[#2c49df] py-3 text-sm font-bold text-white transition hover:bg-[#243dcc] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {actingId === request.rawId ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Accepting...
                      </span>
                    ) : (
                      "Accept"
                    )}
                  </button>
                  <Link
                    href={request.route || "/dashboard-notary/assignments-orders"}
                    className="flex-1 rounded-xl border border-zinc-200 bg-white py-3 text-center text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No assignment requests"
            description="New notary assignment requests will appear here when an admin assigns work to this account."
            href="/dashboard-notary/assignments-orders"
            cta="View Assignment Queue"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {assignmentOrderStats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-2 text-sm font-medium text-zinc-500">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
