"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const badgeTone = (status) => {
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

const formatDate = (value) => {
  if (!value) return "Not scheduled";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "No activity yet";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-9 w-56 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-5 w-80 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[2rem] bg-white shadow-sm" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="h-[26rem] animate-pulse rounded-[2rem] bg-white shadow-sm" />
        <div className="h-[26rem] animate-pulse rounded-[2rem] bg-white shadow-sm" />
      </div>
    </div>
  );
}

export default function NotaryAssignmentDetailPage() {
  const params = useParams();
  const id = String(params?.id || "").replace(/^#/, "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadAssignment = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = await requestPortalJson(`/site/notary/assignments/${id}`);
        if (!cancelled) {
          setOrder(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load this assignment.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAssignment();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const documents = useMemo(
    () => [...(order?.documents || []), ...(order?.completedDocuments || [])],
    [order]
  );

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h1 className="text-xl font-bold">Assignment unavailable</h1>
            <p className="mt-2 text-sm leading-7">{error || "The requested assignment could not be found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            Live Assignment Detail
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">{order.id}</h1>
          <p className="mt-2 text-sm leading-7 text-zinc-500">
            This page is rendered from the real assigned order record only.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${badgeTone(order.status)}`}>
            {order.status}
          </span>
          <Link
            href="/dashboard-notary/assignments-orders"
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Back to Assignments
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Borrower</p>
          <p className="mt-3 text-2xl font-bold text-zinc-900">{order.borrower}</p>
          <p className="mt-2 text-sm text-zinc-500">{order.borrowerEmail || "Email unavailable"}</p>
          <p className="mt-1 text-sm text-zinc-500">{order.borrowerPhone || "Phone unavailable"}</p>
        </div>
        <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Schedule</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
            <CalendarDays className="h-4 w-4 text-[#2c49df]" />
            {formatDate(order.signingDate)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
            <Clock3 className="h-4 w-4 text-[#2c49df]" />
            {order.signingTime || "Time pending"}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
            <MapPin className="h-4 w-4 text-[#2c49df]" />
            {order.location || "Location pending"}
          </div>
        </div>
        <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Compensation</p>
          <p className="mt-3 text-2xl font-bold text-zinc-900">
            ${Number((order.payment?.notaryOfferAmount ?? order.payment?.feeAmount) || 0).toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Release period:{" "}
            {typeof order.payment?.payoutReleaseDays === "number"
              ? `${order.payment.payoutReleaseDays} days`
              : "Not set"}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Due date: {order.payment?.payoutDueDate ? formatDate(order.payment.payoutDueDate) : "Not set"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900">Assignment Information</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["Client", order.client || "Unknown client"],
                ["Service", order.service || "Service pending"],
                ["Vendor Code", order.vendorCode || "Not provided"],
                ["Signing Mode", order.type || "Unknown"],
                ["Paper Size", order.preferences?.paperSize || "Not set"],
                ["Preferred Ink", order.preferences?.preferredInk || "Not set"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Assignment Notes
              </p>
              <p className="mt-2 text-sm leading-7 text-zinc-600">
                {order.payment?.assignmentNotes || order.specialInstructions || "No assignment notes were provided."}
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#2c49df]" />
              <h2 className="text-xl font-bold text-zinc-900">Documents</h2>
            </div>
            {documents.length ? (
              <div className="mt-6 space-y-3">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col gap-3 rounded-2xl border border-zinc-100 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{document.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Uploaded {formatDateTime(document.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {document.url ? (
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                        >
                          View
                        </a>
                      ) : null}
                      {document.downloadUrl ? (
                        <a
                          href={document.downloadUrl}
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                        >
                          Download
                          <Download className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center">
                <p className="text-lg font-bold text-zinc-900">No documents yet</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Assignment files will appear here once they exist in the backend.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#2c49df]" />
              <h2 className="text-xl font-bold text-zinc-900">Timeline</h2>
            </div>
            {order.timeline?.length ? (
              <div className="mt-6 space-y-4">
                {order.timeline.map((entry, index) => (
                  <div key={`${entry.status}-${entry.changedAt}-${index}`} className="relative pl-6">
                    {index < order.timeline.length - 1 ? (
                      <div className="absolute left-[9px] top-6 h-[calc(100%+0.75rem)] w-px bg-zinc-200" />
                    ) : null}
                    <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full bg-[#2c49df]/10 ring-4 ring-white">
                      <div className="h-5 w-5 rounded-full bg-[#2c49df]" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">{entry.status}</p>
                    <p className="mt-1 text-xs text-zinc-500">{formatDateTime(entry.changedAt)}</p>
                    {entry.note ? (
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{entry.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-sm text-zinc-500">
                No workflow timeline entries are available yet.
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#2c49df]" />
              <h2 className="text-xl font-bold text-zinc-900">Summary</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm text-zinc-600">
              <p>
                <span className="font-semibold text-zinc-900">Current workflow:</span>{" "}
                {order.workflowStatus || order.status}
              </p>
              <p>
                <span className="font-semibold text-zinc-900">Payment status:</span>{" "}
                {order.payment?.paymentStatus || "Pending"}
              </p>
              <p>
                <span className="font-semibold text-zinc-900">Secondary signer:</span>{" "}
                {order.hasSecondarySigner ? "Yes" : "No"}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
