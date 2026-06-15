"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  acceptNotaryAssignment,
  fetchNotaryAssignments,
  selectSitePortal,
  rejectNotaryAssignment,
} from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function NotaryAssignmentsRequestsPage() {
  const dispatch = useAppDispatch();
  const {
    notaryAssignments,
    notaryAssignmentsStatus,
    notaryAssignmentActionStatus,
  } = useAppSelector(selectSitePortal);
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    dispatch(fetchNotaryAssignments({ status: "Notary Assigned" }));
  }, [dispatch]);

  const requests = useMemo(
    () => (notaryAssignments || []).filter((item) => item.workflowStatus === "Notary Assigned"),
    [notaryAssignments]
  );

  const handleAccept = async (orderId) => {
    try {
      await dispatch(acceptNotaryAssignment({ orderId })).unwrap();
      toast.success("Assignment accepted.");
      dispatch(fetchNotaryAssignments({ status: "Notary Assigned" }));
    } catch (error) {
      toast.error(error || "Unable to accept assignment.");
    }
  };

  const handleReject = async (orderId) => {
    const reason = window.prompt("Why are you rejecting this assignment?");
    if (!reason) return;

    try {
      setRejectingId(orderId);
      await dispatch(rejectNotaryAssignment({ orderId, reason })).unwrap();
      toast.success("Assignment rejected.");
      dispatch(fetchNotaryAssignments({ status: "Notary Assigned" }));
    } catch (error) {
      toast.error(error || "Unable to reject assignment.");
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">New Assignment Requests</h1>
        <p className="mt-1 text-sm font-medium text-gray-700">
          Review newly assigned orders and accept or decline them.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {requests.map((request) => (
          <div key={request.id} className="rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-700">{request.id}</p>
                <h2 className="mt-3 text-2xl font-bold text-zinc-900">{request.borrower}</h2>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700">
                Awaiting Acceptance
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-zinc-600">
              <p><strong className="text-zinc-900">Client:</strong> {request.title}</p>
              <p><strong className="text-zinc-900">Location:</strong> {request.location}</p>
              <p><strong className="text-zinc-900">Schedule:</strong> {request.date}</p>
              <p><strong className="text-zinc-900">Offer:</strong> <span className="font-bold text-[#2c49df]">{request.fee}</span></p>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                className="flex-1 rounded-xl bg-[#2c49df] py-3 font-bold text-white"
                onClick={() => handleAccept(request.rawId || request.id)}
                disabled={notaryAssignmentActionStatus === "loading"}
              >
                Accept Request
              </button>
              <button
                className="flex-1 rounded-xl border border-zinc-200 bg-white py-3 font-medium text-zinc-700"
                onClick={() => handleReject(request.rawId || request.id)}
                disabled={rejectingId === (request.rawId || request.id)}
              >
                Decline
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-indigo-200 bg-[#f7f8ff] p-12 text-center xl:col-span-2">
            <h3 className="text-2xl font-bold text-zinc-900">
              {notaryAssignmentsStatus === "loading" ? "Loading requests..." : "No pending requests"}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-gray-700">
              New assignments that match your profile will appear here for review.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
