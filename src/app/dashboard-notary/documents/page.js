"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Download, ExternalLink, FileText, Loader2 } from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const formatDateTime = (value) => {
  if (!value) return "Unknown upload time";
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

export default function NotaryDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDocuments = async () => {
      setLoading(true);
      setError("");

      try {
        const assignments = await requestPortalJson("/site/notary/assignments");
        const items = Array.isArray(assignments) ? assignments : [];

        const details = await Promise.all(
          items.map((item) => requestPortalJson(`/site/notary/assignments/${item.rawId}`))
        );

        const flattened = details.flatMap((detail) => {
          const route = `/dashboard-notary/assignments-orders/${String(detail.rawId || detail.id || "").replace(/^#/, "")}`;
          const sourceDocuments = (detail.documents || []).map((document) => ({
            ...document,
            source: "Order Upload",
            orderId: detail.id,
            route,
          }));
          const completedDocuments = (detail.completedDocuments || []).map((document) => ({
            ...document,
            source: "Completed Package",
            orderId: detail.id,
            route,
          }));

          return [...sourceDocuments, ...completedDocuments];
        });

        const sorted = flattened.sort(
          (left, right) => new Date(right.uploadedAt || 0) - new Date(left.uploadedAt || 0)
        );

        if (!cancelled) {
          setDocuments(sorted);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load notary documents.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDocuments();

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(
    () => ({
      total: documents.length,
      completedPackages: documents.filter((item) => item.source === "Completed Package").length,
      uploads: documents.filter((item) => item.source === "Order Upload").length,
    }),
    [documents]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Documents</h1>
        <p className="mt-1 text-sm font-medium text-zinc-500">
          Live files from current notary assignments only.
        </p>
      </div>

      {error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">{error}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Total Files", value: metrics.total },
          { label: "Order Uploads", value: metrics.uploads },
          { label: "Completed Packages", value: metrics.completedPackages },
        ].map((card) => (
          <div key={card.label} className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="text-xl font-bold text-zinc-900">Assignment Documents</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading documents...
          </div>
        ) : documents.length ? (
          <div className="divide-y divide-zinc-100">
            {documents.map((document) => (
              <div key={`${document.orderId}-${document.id}`} className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#2c49df]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900">{document.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {document.source} • {document.orderId} • {formatDateTime(document.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={document.route}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Open Assignment
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  {document.url ? (
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                    >
                      View
                    </a>
                  ) : null}
                  {document.downloadUrl ? (
                    <a
                      href={document.downloadUrl}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
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
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-zinc-900">No documents yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              Files will appear here only when real assignment documents exist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
