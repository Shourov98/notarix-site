"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  FileText,
  FolderOpen,
  MapPin,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { buildAssetUrl, replaceOrderDocument } from "@/lib/siteApi";
import { fetchClientOrder, selectSitePortal } from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const cardClass =
  "rounded-[28px] border border-zinc-100 bg-white p-7 shadow-sm space-y-5";

const InfoRow = ({ label, value }) => (
  <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-700">
      {label}
    </p>
    <p className="mt-2 text-sm font-semibold text-zinc-900">
      {value || "Not provided"}
    </p>
  </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
      <Icon className="h-5 w-5 text-[#1a4fdb]" />
    </div>
    <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
  </div>
);

export default function ClientOrderDetailsPage() {
  const params = useParams();
  const id = params?.id || "";
  const dispatch = useAppDispatch();
  const {
    activeClientOrder,
    activeClientOrderStatus,
    activeClientOrderError,
  } = useAppSelector(selectSitePortal);
  const fileInputRef = useRef(null);
  const [replacingDocumentId, setReplacingDocumentId] = useState("");
  const [replacementStatus, setReplacementStatus] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchClientOrder(id));
    }
  }, [dispatch, id]);

  const triggerReplace = (documentId) => {
    setReplacingDocumentId(documentId);
    setReplacementStatus((current) => ({ ...current, [documentId]: { state: "picking" } }));
    fileInputRef.current?.click();
  };

  const handleReplacementFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !replacingDocumentId) {
      setReplacingDocumentId("");
      return;
    }

    const documentId = replacingDocumentId;
    setReplacingDocumentId("");
    setReplacementStatus((current) => ({ ...current, [documentId]: { state: "uploading" } }));
    try {
      await replaceOrderDocument(id, documentId, file);
      setReplacementStatus((current) => ({
        ...current,
        [documentId]: { state: "done" },
      }));
      toast.success(`${file.name} uploaded successfully.`);
      await dispatch(fetchClientOrder(id));
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Unable to replace the document.";
      setReplacementStatus((current) => ({
        ...current,
        [documentId]: { state: "error", message },
      }));
      toast.error(message);
    }
  };

  if (activeClientOrderStatus === "loading" && !activeClientOrder) {
    return <div className="mx-auto max-w-5xl py-12 text-sm text-zinc-600">Loading order details...</div>;
  }

  if (!activeClientOrder) {
    return (
      <div className="mx-auto max-w-5xl rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {activeClientOrderError || "Order not found."}
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleReplacementFile}
      />
    <div className="mx-auto max-w-5xl space-y-6 pb-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-700">
            Order Details
          </p>
          <h1 className="mt-1 text-3xl font-bold text-zinc-900">{activeClientOrder.id}</h1>
          <p className="mt-2 text-sm text-zinc-600">
            {activeClientOrder.service} • {activeClientOrder.location}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase text-[#1a4fdb]">
            {activeClientOrder.status}
          </span>
          <Link
            href="/dashboard-client/orders"
            className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            Back to Orders
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className={cardClass}>
            <SectionTitle icon={Building2} title="Client Information" />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Client" value={activeClientOrder.client} />
              <InfoRow label="Client Email" value={activeClientOrder.clientEmail} />
              <InfoRow label="Vendor Code" value={activeClientOrder.vendorCode} />
              <InfoRow label="Workflow Status" value={activeClientOrder.workflowStatus} />
            </div>
          </section>

          <section className={cardClass}>
            <SectionTitle icon={UserRound} title="Borrower Information" />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Borrower" value={activeClientOrder.borrower} />
              <InfoRow label="Borrower Email" value={activeClientOrder.borrowerEmail} />
              <InfoRow label="Borrower Phone" value={activeClientOrder.borrowerPhone} />
              <InfoRow label="Secondary Signer" value={activeClientOrder.hasSecondarySigner ? "Yes" : "No"} />
            </div>
          </section>

          <section className={cardClass}>
            <SectionTitle icon={MapPin} title="Property & Signing" />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow
                label="Property Address"
                value={[
                  activeClientOrder.propertyAddress?.line1,
                  activeClientOrder.propertyAddress?.city,
                  activeClientOrder.propertyAddress?.state,
                  activeClientOrder.propertyAddress?.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
              <InfoRow
                label="Signing Schedule"
                value={`${activeClientOrder.signingDate} ${activeClientOrder.signingTime}`}
              />
              <InfoRow
                label="Special Instructions"
                value={activeClientOrder.specialInstructions || "None"}
              />
              <InfoRow
                label="Payment Status"
                value={activeClientOrder.payment?.paymentStatus || "Pending"}
              />
            </div>
          </section>

          <section className={cardClass}>
            <SectionTitle icon={FolderOpen} title="Uploaded Documents" />
            <div className="space-y-3">
              {(activeClientOrder.documents || []).length === 0 ? (
                <p className="text-sm text-zinc-600">No documents uploaded for this order yet.</p>
              ) : (
                activeClientOrder.documents.map((document) => {
                  const status = replacementStatus[document.id];
                  const isUploading = status?.state === "uploading";
                  const isDone = status?.state === "done";
                  const isError = status?.state === "error";
                  const openUrl = buildAssetUrl(document.url);
                  const canPreview = !!openUrl;
                  return (
                    <div
                      key={document.id}
                      className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#1a4fdb]" />
                          <div>
                            <p className="font-semibold text-zinc-900">{document.name}</p>
                            <p className="text-xs text-gray-700">{document.mimeType || "Uploaded file"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {canPreview ? (
                            <a
                              href={openUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
                            >
                              Open
                            </a>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => triggerReplace(document.id)}
                            disabled={isUploading}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#1a4fdb] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1642b8] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <RefreshCw className={`h-3.5 w-3.5 ${isUploading ? "animate-spin" : ""}`} />
                            {isUploading ? "Replacing..." : "Replace"}
                          </button>
                        </div>
                      </div>
                      {isDone ? (
                        <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" /> New version uploaded successfully.
                        </p>
                      ) : null}
                      {isError ? (
                        <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                          <AlertTriangle className="h-3.5 w-3.5" /> {status?.message || "Replace failed."}
                        </p>
                      ) : null}
                      {!canPreview ? (
                        <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                          <AlertTriangle className="h-3.5 w-3.5" /> Original file is unavailable. Please re-upload to continue.
                        </p>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className={cardClass}>
            <SectionTitle icon={ShieldCheck} title="Assigned Notary" />
            <div className="space-y-4">
              <InfoRow label="Notary" value={activeClientOrder.notary} />
              <InfoRow
                label="Offer Amount"
                value={
                  activeClientOrder.payment?.notaryOfferAmount
                    ? `$${Number(activeClientOrder.payment.notaryOfferAmount).toFixed(2)}`
                    : "Pending"
                }
              />
              <InfoRow
                label="Release Days"
                value={
                  activeClientOrder.payment?.payoutReleaseDays
                    ? `${activeClientOrder.payment.payoutReleaseDays} days`
                    : "Pending"
                }
              />
            </div>
          </section>

          <section className={cardClass}>
            <SectionTitle icon={CalendarDays} title="Order Timeline" />
            <div className="space-y-4">
              {(activeClientOrder.timeline || []).length === 0 ? (
                <p className="text-sm text-zinc-600">No status changes recorded yet.</p>
              ) : (
                activeClientOrder.timeline.map((entry) => (
                  <div key={`${entry.status}-${entry.changedAt}`} className="border-l-2 border-zinc-200 pl-4">
                    <p className="font-semibold text-zinc-900">{entry.status}</p>
                    <p className="text-sm text-gray-700">
                      {new Date(entry.changedAt).toLocaleString("en-US")}
                    </p>
                    {entry.note ? (
                      <p className="mt-1 text-sm text-zinc-600">{entry.note}</p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
    </>
  );
}
