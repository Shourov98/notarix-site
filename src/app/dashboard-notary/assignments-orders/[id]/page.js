"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  acceptNotaryAssignment,
  completeNotaryAssignment,
  fetchNotaryAssignment,
  fetchNotaryAssignments,
  selectSitePortal,
  startNotaryAssignment,
} from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const cardClass =
  "rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm space-y-5";

const InfoRow = ({ label, value }) => (
  <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">{label}</p>
    <p className="mt-2 text-sm font-semibold text-zinc-900">{value || "Not provided"}</p>
  </div>
);

export default function AssignmentOrderDetailPage() {
  const params = useParams();
  const id = params?.id || "";
  const dispatch = useAppDispatch();
  const {
    activeNotaryAssignment,
    activeNotaryAssignmentStatus,
    activeNotaryAssignmentError,
    notaryAssignmentActionStatus,
  } = useAppSelector(selectSitePortal);
  const [completionFiles, setCompletionFiles] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchNotaryAssignment(id));
    }
  }, [dispatch, id]);

  const refresh = () => {
    dispatch(fetchNotaryAssignment(id));
    dispatch(fetchNotaryAssignments());
  };

  const handleAccept = async () => {
    try {
      await dispatch(acceptNotaryAssignment({ orderId: id })).unwrap();
      toast.success("Assignment accepted.");
      refresh();
    } catch (error) {
      toast.error(error || "Unable to accept assignment.");
    }
  };

  const handleStart = async () => {
    try {
      await dispatch(startNotaryAssignment({ orderId: id })).unwrap();
      toast.success("Assignment started.");
      refresh();
    } catch (error) {
      toast.error(error || "Unable to start assignment.");
    }
  };

  const handleComplete = async () => {
    try {
      await dispatch(
        completeNotaryAssignment({
          orderId: id,
          files: completionFiles,
        })
      ).unwrap();
      toast.success("Assignment completed.");
      setCompletionFiles([]);
      refresh();
    } catch (error) {
      toast.error(error || "Unable to complete assignment.");
    }
  };

  if (activeNotaryAssignmentStatus === "loading" && !activeNotaryAssignment) {
    return <div className="py-12 text-sm text-zinc-500">Loading assignment...</div>;
  }

  if (!activeNotaryAssignment) {
    return (
      <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {activeNotaryAssignmentError || "Assignment not found."}
      </div>
    );
  }

  const order = activeNotaryAssignment;
  const canAccept = order.workflowStatus === "Notary Assigned";
  const canStart = ["Accepted By Notary", "Notary Assigned"].includes(order.workflowStatus);
  const canComplete = order.workflowStatus === "In Progress";

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Assignments &gt; Details</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-bold text-zinc-900">{order.id}</h1>
            <span className="rounded-full bg-blue-50 px-4 py-2 font-bold text-[#2c49df]">
              {order.workflowStatus}
            </span>
          </div>
        </div>
        <Link
          href="/dashboard-notary/assignments-orders"
          className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700"
        >
          Back to Assignments
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <section className={cardClass}>
            <h2 className="text-lg font-bold text-zinc-900">Assignment Summary</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Client" value={order.client} />
              <InfoRow label="Borrower" value={order.borrower} />
              <InfoRow label="Service" value={order.service} />
              <InfoRow label="Schedule" value={`${order.signingDate} ${order.signingTime}`} />
              <InfoRow
                label="Property"
                value={[
                  order.propertyAddress?.line1,
                  order.propertyAddress?.city,
                  order.propertyAddress?.state,
                  order.propertyAddress?.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
              <InfoRow label="Offer" value={`$${Number(order.payment?.notaryOfferAmount ?? order.payment?.feeAmount ?? 0).toFixed(2)}`} />
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg font-bold text-zinc-900">Client Documents</h2>
            <div className="space-y-3">
              {(order.documents || []).length === 0 ? (
                <p className="text-sm text-zinc-500">No client documents uploaded yet.</p>
              ) : (
                order.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                    <div>
                      <p className="font-semibold text-zinc-900">{document.name}</p>
                      <p className="text-xs text-zinc-500">{document.mimeType || "Uploaded file"}</p>
                    </div>
                    {document.url ? (
                      <a href={`http://localhost:5191${document.url}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#2c49df]">
                        Open
                      </a>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg font-bold text-zinc-900">Completed Documents</h2>
            <label className="block rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-600">
              <span className="block font-semibold text-zinc-900">Upload signed / completed documents</span>
              <input
                type="file"
                multiple
                className="mt-4 block"
                onChange={(event) => setCompletionFiles(Array.from(event.target.files || []))}
              />
            </label>
            {(order.completedDocuments || []).length > 0 ? (
              <div className="space-y-3">
                {order.completedDocuments.map((document) => (
                  <div key={document.id} className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                    <p className="font-semibold text-zinc-900">{document.name}</p>
                    {document.url ? (
                      <a href={`http://localhost:5191${document.url}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#2c49df]">
                        Open
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <section className={cardClass}>
            <h2 className="text-lg font-bold text-zinc-900">Workflow Actions</h2>
            <div className="space-y-4">
              {canAccept ? (
                <button
                  className="w-full rounded-2xl border border-[#2c49df] py-4 font-bold text-[#2c49df]"
                  onClick={handleAccept}
                  disabled={notaryAssignmentActionStatus === "loading"}
                >
                  Accept Assignment
                </button>
              ) : null}
              {canStart ? (
                <button
                  className="w-full rounded-2xl bg-[#2c49df] py-4 font-bold text-white"
                  onClick={handleStart}
                  disabled={notaryAssignmentActionStatus === "loading"}
                >
                  Start Signing
                </button>
              ) : null}
              {canComplete ? (
                <button
                  className="w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
                  onClick={handleComplete}
                  disabled={notaryAssignmentActionStatus === "loading"}
                >
                  Upload & Mark Complete
                </button>
              ) : null}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg font-bold text-zinc-900">Payout Details</h2>
            <div className="space-y-4">
              <InfoRow label="Offer Amount" value={`$${Number(order.payment?.notaryOfferAmount ?? order.payment?.feeAmount ?? 0).toFixed(2)}`} />
              <InfoRow
                label="Payout Release Days"
                value={order.payment?.payoutReleaseDays ? `${order.payment.payoutReleaseDays} days` : "Not set"}
              />
              <InfoRow
                label="Payout Due Date"
                value={order.payment?.payoutDueDate ? new Date(order.payment.payoutDueDate).toLocaleDateString("en-US") : "Pending completion"}
              />
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg font-bold text-zinc-900">Status Timeline</h2>
            <div className="space-y-4">
              {(order.timeline || []).map((entry) => (
                <div key={`${entry.status}-${entry.changedAt}`} className="border-l-2 border-zinc-200 pl-4">
                  <p className="font-semibold text-zinc-900">{entry.status}</p>
                  <p className="text-sm text-zinc-500">{new Date(entry.changedAt).toLocaleString("en-US")}</p>
                  {entry.note ? <p className="mt-1 text-sm text-zinc-600">{entry.note}</p> : null}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
