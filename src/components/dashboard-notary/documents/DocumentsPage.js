"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Download,
  Eye,
  FileBadge2,
  FileClock,
  FileUp,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { fetchNotaryAssignments, selectSitePortal } from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { buildAssetUrl } from "@/lib/siteApi";

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  } catch {
    return String(value);
  }
};

const formatSize = (bytes) => {
  if (!bytes || Number.isNaN(Number(bytes))) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = Number(bytes);
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
};

const fileTypeFromMime = (mime) => {
  if (!mime) return "FILE";
  if (mime.includes("pdf")) return "PDF";
  if (mime.startsWith("image/")) return mime.split("/")[1]?.toUpperCase() || "IMG";
  return mime.split("/")[1]?.toUpperCase() || "FILE";
};

export default function DocumentsPage({ role = "Notary" }) {
  const dispatch = useAppDispatch();
  const { notaryAssignments, notaryAssignmentsStatus } = useAppSelector(selectSitePortal);
  const [search, setSearch] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");

  useEffect(() => {
    dispatch(fetchNotaryAssignments());
  }, [dispatch]);

  const documents = useMemo(() => {
    const rows = [];
    (notaryAssignments || []).forEach((assignment) => {
      const rawId = assignment.rawId || assignment.id?.replace(/^#/, "");
      const orderDocuments = assignment.documents || [];
      orderDocuments.forEach((doc) => {
        rows.push({
          id: doc.id,
          name: doc.title || doc.name || "Document",
          orderId: assignment.id,
          rawOrderId: rawId,
          uploadedBy: doc.uploadedBy || "System",
          uploadedAt: doc.uploadedAt,
          mimeType: doc.mimeType,
          size: doc.size,
          url: buildAssetUrl(doc.url),
          downloadUrl: buildAssetUrl(doc.downloadUrl || doc.url),
        });
      });
    });
    return rows;
  }, [notaryAssignments]);

  const filteredDocuments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return documents.filter((doc) => {
      if (term) {
        const matches =
          doc.name.toLowerCase().includes(term) ||
          doc.orderId.toLowerCase().includes(term);
        if (!matches) return false;
      }
      if (orderIdFilter && !doc.orderId.toLowerCase().includes(orderIdFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [documents, search, orderIdFilter]);

  const stats = useMemo(() => {
    const total = documents.length;
    const lastWeekCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = documents.filter((doc) => {
      const ts = new Date(doc.uploadedAt || 0).getTime();
      return ts >= lastWeekCutoff;
    }).length;
    const pending = documents.filter((doc) => /pending|missing/i.test(doc.uploadedBy || "")).length;
    return { total, recent, pending };
  }, [documents]);

  const handleDownload = async (doc) => {
    const url = doc.downloadUrl || doc.url;
    if (!url) {
      toast.error("This document has no file attached.");
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      // Fall back to a direct download if fetch is blocked by CORS.
      window.open(url, "_blank", "noopener");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Files", value: String(stats.total), icon: FileBadge2 },
          { label: "Recent Uploads", value: `${stats.recent} / 7d`, icon: FileUp },
          { label: "Pending Documents", value: String(stats.pending), icon: FileClock },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-indigo-100 rounded-[24px] p-8 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-[#2c49df] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{card.label}</p>
              <p className="mt-3 text-3xl font-bold text-zinc-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-100 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
            <input
              type="text"
              placeholder="Search by file name or Order ID..."
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-[#2c49df]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Order ID"
              className="px-4 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-700"
              value={orderIdFilter}
              onChange={(event) => setOrderIdFilter(event.target.value)}
            />
            <button
              type="button"
              className="px-4 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-700 font-medium flex items-center gap-2"
              onClick={() => toast.info("Date filters are available on the admin side; the portal shows newest first by default.")}
            >
              <Calendar className="w-4 h-4" />
              Date Range
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-zinc-50">
              <tr>
                {["File Name", "Order ID", "Uploaded By", "Upload Date", "Type", "Size", "Actions"].map((head) => (
                  <th key={head} className="px-6 py-5 text-left text-sm font-bold text-gray-700">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => {
                const uploadedBy = (doc.uploadedBy || "").toLowerCase();
                const tone =
                  uploadedBy.includes("client")
                    ? "bg-blue-50 text-[#2c49df]"
                    : uploadedBy.includes("notary")
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-violet-50 text-violet-600";
                return (
                  <tr key={`${doc.orderId}-${doc.id}`} className="border-t border-zinc-100">
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-zinc-900 font-bold">{doc.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-zinc-600">{doc.orderId}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${tone}`}>{doc.uploadedBy}</span>
                    </td>
                    <td className="px-6 py-5 text-zinc-600">{formatDate(doc.uploadedAt)}</td>
                    <td className="px-6 py-5 text-zinc-600">{fileTypeFromMime(doc.mimeType)}</td>
                    <td className="px-6 py-5 text-zinc-600">{formatSize(doc.size)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4 text-[#2c49df]">
                        <button
                          type="button"
                          onClick={() => doc.url ? window.open(doc.url, "_blank", "noopener") : toast.error("No preview available.")}
                          aria-label={`View ${doc.name}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          aria-label={`Download ${doc.name}`}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="text-red-500"
                          aria-label="Request removal"
                          onClick={() =>
                            toast.info(
                              "Document removal is handled through the order workspace or by the admin team. Use the support page if you need to escalate."
                            )
                          }
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-700">
                    {notaryAssignmentsStatus === "loading" ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading documents...
                      </span>
                    ) : documents.length === 0 ? (
                      "You don't have any order documents yet."
                    ) : (
                      "No documents match the current filters."
                    )}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-5 border-t border-zinc-100 flex items-center justify-between text-sm text-gray-700">
          <p>
            Showing {filteredDocuments.length} of {documents.length} document{documents.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2c49df]" />
            <h2 className="text-xl font-bold text-zinc-900">Audit History</h2>
          </div>
          <p className="text-sm text-gray-700">
            All document activity is logged in the admin audit trail.
          </p>
        </div>
        <div className="p-6 text-sm text-gray-700">
          Document upload/edit events are recorded against the order they belong to. Open any
          order to see the full event timeline for the files attached to it.
        </div>
      </div>
    </div>
  );
}
