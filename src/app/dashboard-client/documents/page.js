"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, Download, ExternalLink, FileText, Loader2 } from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const toneForStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("verified") || normalized.includes("available")) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (normalized.includes("pending")) return "bg-amber-50 text-amber-700";
  if (normalized.includes("rejected") || normalized.includes("missing")) {
    return "bg-rose-50 text-rose-700";
  }
  return "bg-zinc-100 text-zinc-700";
};

const formatDate = (value) => {
  if (!value) return "Not uploaded";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDocuments = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await requestPortalJson("/site/client/documents");
        if (!cancelled) {
          setDocuments(Array.isArray(result) ? result : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load documents.");
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Documents</h1>
        <p className="mt-1 text-sm font-medium text-zinc-500">
          Real verification and order documents from your client account.
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

      <div className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="text-xl font-bold text-zinc-900">Document Registry</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading documents...
          </div>
        ) : documents.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-zinc-50">
                <tr>
                  {["Name", "Source", "Order", "Type", "Status", "Uploaded", "Actions"].map((head) => (
                    <th key={head} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {documents.map((document) => (
                  <tr key={document.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1a4fdb]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{document.name}</p>
                          <p className="text-xs text-zinc-500">{document.mimeType || document.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-600">{document.source}</td>
                    <td className="px-6 py-5 text-sm text-zinc-600">
                      {document.orderId ? (
                        document.orderRoute ? (
                          <Link href={document.orderRoute} className="font-semibold text-[#1a4fdb] hover:underline">
                            {document.orderId}
                          </Link>
                        ) : (
                          document.orderId
                        )
                      ) : (
                        "Account"
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-600">{document.type}</td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${toneForStatus(document.status)}`}>
                        {document.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-500">{formatDate(document.uploadedAt)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {document.viewUrl ? (
                          <a
                            href={document.viewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                          >
                            View
                            <ExternalLink className="h-4 w-4" />
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-zinc-900">No documents available</p>
            <p className="mt-2 text-sm text-zinc-500">
              Verification files and order package uploads will appear here when they exist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
