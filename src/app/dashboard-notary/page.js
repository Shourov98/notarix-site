"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ClipboardCheck, CalendarDays, CircleDollarSign } from "lucide-react";
import { fetchNotaryOverview, selectSitePortal } from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const iconMap = {
  "Completed Total Assignments": ClipboardCheck,
  "Open Assignments": CalendarDays,
  "Total Earnings": CircleDollarSign,
};

export default function DashboardNotaryPage() {
  const dispatch = useAppDispatch();
  const { notaryOverview, notaryStatus } = useAppSelector(selectSitePortal);

  useEffect(() => {
    dispatch(fetchNotaryOverview());
  }, [dispatch]);

  const stats = notaryOverview?.stats || [];
  const requests = notaryOverview?.requests || [];
  const assignments = notaryOverview?.assignments || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Notary Dashboard</h1>
        <p className="mt-1 text-sm font-medium text-gray-700">
          Review new assignments, manage in-progress work, and track completed orders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = iconMap[stat.label] || ClipboardCheck;
          return (
            <div key={stat.label} className="rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-700">
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
        <section className="xl:col-span-7 rounded-[24px] border border-indigo-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
            <h2 className="text-xl font-bold text-zinc-900">Pending Assignment Requests</h2>
            <Link href="/dashboard-notary/assignments-requests" className="text-sm font-bold text-[#2c49df]">
              View all
            </Link>
          </div>
          <div className="space-y-4 p-6">
            {requests.length === 0 ? (
              <p className="text-sm text-gray-700">
                {notaryStatus === "loading" ? "Loading requests..." : "No pending requests right now."}
              </p>
            ) : (
              requests.slice(0, 3).map((request) => (
                <div key={request.id} className="rounded-[20px] border border-zinc-100 bg-zinc-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-700">{request.id}</p>
                      <p className="mt-2 text-lg font-bold text-zinc-900">{request.borrower}</p>
                      <p className="mt-1 text-sm text-gray-700">{request.location}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase text-amber-700">
                      Awaiting Acceptance
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-zinc-600">{request.date}</p>
                    <p className="font-bold text-[#2c49df]">{request.fee}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="xl:col-span-5 rounded-[24px] border border-indigo-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
            <h2 className="text-xl font-bold text-zinc-900">Open Work</h2>
            <Link href="/dashboard-notary/assignments-orders" className="text-sm font-bold text-[#2c49df]">
              View assignments
            </Link>
          </div>
          <div className="space-y-4 p-6">
            {assignments.length === 0 ? (
              <p className="text-sm text-gray-700">
                {notaryStatus === "loading" ? "Loading assignments..." : "No accepted or active assignments yet."}
              </p>
            ) : (
              assignments.slice(0, 4).map((assignment) => (
                <div key={`${assignment.name}-${assignment.time}`} className="rounded-[20px] border border-zinc-100 bg-zinc-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-zinc-900">{assignment.name}</p>
                      <p className="mt-1 text-sm text-gray-700">{assignment.detail}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-[#2c49df]">
                      {assignment.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-zinc-600">{assignment.time}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
