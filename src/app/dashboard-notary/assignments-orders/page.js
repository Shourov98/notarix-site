"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarRange,
  Eye,
  Filter,
  Loader2,
  Play,
  Search,
  CheckCircle2,
  ClipboardList,
  Hourglass,
  ArrowRight,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const statusTone = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";
    case "In Progress":
      return "bg-orange-50 text-orange-700";
    case "Accepted By Notary":
      return "bg-blue-50 text-blue-700";
    case "Notary Assigned":
      return "bg-amber-50 text-amber-700";
    case "Rejected By Notary":
    case "Needs Reassignment":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
};

const formatDate = (value) => {
  if (!value) return "Pending";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTimeCell = (value) => {
  if (!value) return { date: "Pending", time: "" };
  const [datePart, ...timeParts] = String(value).split(" ");
  return {
    date: formatDate(datePart),
    time: timeParts.join(" "),
  };
};

const monthMatchesCurrent = (assignment) => {
  const raw = String(assignment.date || "").trim();
  if (!raw) return false;
  const datePart = raw.split(" ")[0];
  const parsed = new Date(datePart);
  if (Number.isNaN(parsed.getTime())) return false;
  const now = new Date();
  return (
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth()
  );
};

const cardIcons = {
  Total: ClipboardList,
  Pending: Hourglass,
  "In Progress": ArrowRight,
  Completed: CheckCircle2,
};

export default function NotaryAssignmentsOrdersPage() {
  const [overview, setOverview] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("current");

  const loadData = async (options = {}) => {
    const searchValue = options.search ?? search;
    const statusValue = options.statusFilter ?? statusFilter;

    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams();
      if (searchValue.trim()) query.set("search", searchValue.trim());
      if (statusValue !== "All") query.set("status", statusValue);
      const querySuffix = query.toString() ? `?${query.toString()}` : "";

      const [overviewPayload, assignmentsPayload] = await Promise.all([
        requestPortalJson("/site/notary/overview"),
        requestPortalJson(`/site/notary/assignments${querySuffix}`),
      ]);

      setOverview(overviewPayload);
      setAssignments(Array.isArray(assignmentsPayload) ? assignmentsPayload : []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial page load fetch for live assignments.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleAssignments = useMemo(() => {
    const source = Array.isArray(assignments) ? assignments : [];
    if (monthFilter !== "current") return source;
    return source.filter(monthMatchesCurrent);
  }, [assignments, monthFilter]);

  const tableRows = useMemo(
    () =>
      visibleAssignments.map((assignment) => ({
        ...assignment,
        dateTime: formatDateTimeCell(assignment.date),
      })),
    [visibleAssignments]
  );

  const statCards = useMemo(() => {
    const raw = overview?.assignmentOrderStats || [
      { label: "Total", value: String(assignments.length), sub: "Assigned orders" },
      {
        label: "Pending",
        value: String(assignments.filter((item) => item.status === "Notary Assigned").length),
        sub: "Awaiting acceptance",
      },
      {
        label: "In Progress",
        value: String(assignments.filter((item) => item.status === "In Progress").length),
        sub: "Currently active",
      },
      {
        label: "Completed",
        value: String(assignments.filter((item) => item.status === "Completed").length),
        sub: "Successfully signed",
      },
    ];

    return raw.map((card) => ({
      ...card,
      icon: cardIcons[card.label] || ClipboardList,
    }));
  }, [assignments, overview]);

  const handleAction = async (assignment, action) => {
    setActingId(`${assignment.rawId}:${action}`);
    setError("");

    const routeMap = {
      accept: `/site/notary/orders/${assignment.rawId}/accept`,
      reject: `/site/notary/orders/${assignment.rawId}/reject`,
      start: `/site/notary/orders/${assignment.rawId}/start`,
    };

    const bodyMap = {
      accept: { note: "Accepted from assignment orders page." },
      reject: { reason: "Declined from assignment orders page." },
      start: { note: "Started from assignment orders page." },
    };

    try {
      await requestPortalJson(routeMap[action], {
        method: "PATCH",
        body: JSON.stringify(bodyMap[action]),
      });
      await loadData();
    } catch (actionError) {
      setError(actionError.message || "Unable to update this assignment.");
    } finally {
      setActingId("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Assignments</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Manage your assigned orders and verification workflow.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex h-12 min-w-[250px] items-center rounded-2xl border border-zinc-200 bg-white px-4 shadow-sm">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  loadData({ search: event.currentTarget.value });
                }
              }}
              placeholder="Search orders..."
              className="ml-3 w-full bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
            />
          </label>

          <div className="flex gap-3">
            <label className="inline-flex h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm">
              <Filter className="h-4 w-4" />
              <select
                value={statusFilter}
                onChange={(event) => {
                  const value = event.target.value;
                  setStatusFilter(value);
                  loadData({ statusFilter: value });
                }}
                className="bg-transparent outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Assigned">Assigned</option>
                <option value="Accepted By Notary">Accepted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label className="inline-flex h-12 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm">
              <CalendarRange className="h-4 w-4" />
              <select
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="current">This Month</option>
                <option value="all">All Time</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">{error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2d4de0]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                  {card.label}
                </p>
              </div>
              <p className="mt-6 text-5xl font-bold tracking-tight text-zinc-900">{card.value}</p>
              <p className="mt-2 text-sm text-zinc-500">{card.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[24px] border border-zinc-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading assignments...
          </div>
        ) : tableRows.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead className="bg-zinc-50">
                  <tr>
                    {[
                      "Order ID",
                      "Title Company",
                      "Borrower Name",
                      "Location",
                      "Date & Time",
                      "Fee",
                      "Status",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-5 text-left text-sm font-bold text-slate-500"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {tableRows.map((assignment) => {
                    const isAccepting = actingId === `${assignment.rawId}:accept`;
                    const isRejecting = actingId === `${assignment.rawId}:reject`;
                    const isStarting = actingId === `${assignment.rawId}:start`;
                    const canAccept = assignment.status === "Notary Assigned";
                    const canStart = assignment.status === "Accepted By Notary";

                    return (
                      <tr key={assignment.rawId} className="hover:bg-zinc-50/50">
                        <td className="px-6 py-5 text-sm font-bold text-[#2d4de0]">{assignment.id}</td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-zinc-900">
                            {assignment.title || "Untitled client"}
                          </p>
                          <p className="mt-1 text-sm text-zinc-500">{assignment.orderType}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                              {String(assignment.borrower || "?").trim().charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-zinc-700">{assignment.borrower || "Pending"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-zinc-500">{assignment.location || "Pending"}</td>
                        <td className="px-6 py-5 text-sm text-zinc-500">
                          <p>{assignment.dateTime.date}</p>
                          <p className="mt-1">{assignment.dateTime.time}</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-zinc-900">{assignment.fee}</td>
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone(assignment.status)}`}
                          >
                            {assignment.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap items-center gap-2">
                            {canStart ? (
                              <button
                                type="button"
                                onClick={() => handleAction(assignment, "start")}
                                disabled={Boolean(actingId)}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2d4de0] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1f3cc5] disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {isStarting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                Start Session
                              </button>
                            ) : null}

                            {canAccept ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAction(assignment, "accept")}
                                  disabled={Boolean(actingId)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-[#2d4de0] transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAction(assignment, "reject")}
                                  disabled={Boolean(actingId)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                </button>
                              </>
                            ) : null}

                            <Link
                              href={assignment.route}
                              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                            >
                              <Eye className="h-4 w-4 text-[#2d4de0]" />
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 text-sm text-zinc-500">
              <p>Showing {tableRows.length} assignments</p>
              <button
                type="button"
                onClick={() => loadData()}
                className="rounded-xl border border-zinc-200 px-4 py-2 font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                Refresh
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-zinc-900">No assignments found</p>
            <p className="mt-2 text-sm text-zinc-500">
              Adjust the filters or wait for new assignments to reach this notary account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
