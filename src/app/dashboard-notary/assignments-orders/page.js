"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchNotaryAssignments, selectSitePortal } from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const statusTone = (status) => {
  if (status === "Completed") return "bg-emerald-50 text-emerald-700";
  if (status === "In Progress") return "bg-orange-50 text-orange-700";
  if (status === "Accepted By Notary") return "bg-blue-50 text-[#2c49df]";
  return "bg-zinc-100 text-zinc-700";
};

export default function NotaryAssignmentsOrdersPage() {
  const dispatch = useAppDispatch();
  const { notaryAssignments, notaryAssignmentsStatus } = useAppSelector(selectSitePortal);

  useEffect(() => {
    dispatch(fetchNotaryAssignments());
  }, [dispatch]);

  const rows = useMemo(
    () =>
      (notaryAssignments || []).filter((item) =>
        ["Accepted By Notary", "In Progress", "Completed"].includes(item.workflowStatus)
      ),
    [notaryAssignments]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Assignment Orders</h1>
        <p className="mt-1 text-sm font-medium text-gray-700">
          Track accepted, active, and completed orders from one place.
        </p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-indigo-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full">
            <thead className="bg-zinc-50">
              <tr className="text-left text-gray-700">
                {["Order ID", "Type", "Client", "Borrower", "Location", "Schedule", "Offer", "Status", "Action"].map((head) => (
                  <th key={head} className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-zinc-100">
                  <td className="px-6 py-6 font-bold text-[#2c49df]">{row.id}</td>
                  <td className="px-6 py-6">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold text-zinc-700">
                      {row.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-zinc-700">{row.title}</td>
                  <td className="px-6 py-6 text-sm font-bold text-zinc-700">{row.borrower}</td>
                  <td className="px-6 py-6 text-sm text-gray-700">{row.location}</td>
                  <td className="px-6 py-6 text-sm text-gray-700">{row.date}</td>
                  <td className="px-6 py-6 font-bold text-zinc-900">{row.fee}</td>
                  <td className="px-6 py-6">
                    <span className={`rounded-full px-4 py-2 text-sm font-bold ${statusTone(row.workflowStatus)}`}>
                      {row.workflowStatus}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <Link
                      href={`/dashboard-notary/assignments-orders/${row.rawId || row.id.replace(/^#/, "")}`}
                      className="inline-flex rounded-xl bg-[#2c49df] px-4 py-2 text-sm font-bold text-white"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-sm text-gray-700">
                    {notaryAssignmentsStatus === "loading" ? "Loading assignments..." : "No accepted or completed assignments yet."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
