"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { buildAssetUrl } from "@/lib/siteApi";

const defaultDocuments = [
  {
    name: "Loan_Agreement_V4.pdf",
    orderId: "#ORD-88219",
    uploadedBy: "CLIENT",
    uploadedByColor: "bg-blue-50 text-blue-600",
    type: "PDF",
    date: "Apr 27, 2026",
    size: "2.4 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  },
  {
    name: "ID_Verification_Front.jpg",
    orderId: "#ORD-90211",
    uploadedBy: "ADMIN",
    uploadedByColor: "bg-purple-50 text-purple-600",
    type: "Image",
    date: "Apr 27, 2026",
    size: "842 KB",
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50"
  },
  {
    name: "Loan_Agreement_V4.pdf",
    orderId: "#ORD-88219",
    uploadedBy: "CLIENT",
    uploadedByColor: "bg-blue-50 text-blue-600",
    type: "PDF",
    date: "Apr 27, 2026",
    size: "2.4 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  },
  {
    name: "ID_Verification_Front.jpg",
    orderId: "#ORD-90211",
    uploadedBy: "ADMIN",
    uploadedByColor: "bg-purple-50 text-purple-600",
    type: "Image",
    date: "Apr 27, 2026",
    size: "842 KB",
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50"
  },
  {
    name: "Notary_Seal_Certificate.pdf",
    orderId: "#ORD-87422",
    uploadedBy: "NOTARY",
    uploadedByColor: "bg-emerald-50 text-emerald-600",
    type: "PDF",
    date: "Apr 27, 2026",
    size: "1.1 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  }
];

const TABS = [
  { id: "all", label: "All Documents" },
  { id: "mine", label: "My Uploads" },
  { id: "shared", label: "Shared with Me" },
];

const UPLOADED_BY_OPTIONS = [
  { value: "all", label: "All Uploaders" },
  { value: "CLIENT", label: "Client" },
  { value: "ADMIN", label: "Admin" },
  { value: "NOTARY", label: "Notary" },
];

const FILE_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "pdf", label: "PDF" },
  { value: "image", label: "Image" },
  { value: "doc", label: "Document" },
  { value: "other", label: "Other" },
];

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "30", label: "Last 30 Days", days: 30 },
  { value: "90", label: "Last 3 Months", days: 90 },
  { value: "365", label: "Last Year", days: 365 },
];

const getFileTypeBucket = (doc) => {
  const mime = String(doc?.mimeType || doc?.type || "").toLowerCase();
  const label = String(doc?.typeLabel || doc?.type || "").toLowerCase();
  const name = String(doc?.name || doc?.originalName || doc?.filename || "").toLowerCase();

  if (mime.startsWith("image/") || label === "image") return "image";
  if (mime === "application/pdf" || label === "pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    mime.includes("word") ||
    mime.includes("text") ||
    label === "doc" ||
    /\.(docx?|txt|rtf|odt)$/.test(name)
  ) {
    return "doc";
  }
  return "other";
};

const matchesDateRange = (doc, range) => {
  if (range === "all") return true;
  const days = Number(range);
  if (!Number.isFinite(days) || days <= 0) return true;
  const raw = doc?.uploadedAt || doc?.createdAt || doc?.updatedAt;
  if (!raw) return true;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return true;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return date >= cutoff;
};

export default function DocumentsTable({
  documents = defaultDocuments,
  currentActorRole = "CLIENT",
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [uploadedBy, setUploadedBy] = useState("all");
  const [fileType, setFileType] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSize = (value) => {
    const bytes = Number(value);
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "Unknown";
    }

    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (bytes >= 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }

    return `${bytes} B`;
  };

  const uploadedByTone = (uploadedBy) => {
    switch (String(uploadedBy || "").toUpperCase()) {
      case "CLIENT":
        return "bg-blue-50 text-blue-600";
      case "NOTARY":
        return "bg-emerald-50 text-emerald-600";
      case "ADMIN":
      case "SUPER_ADMIN":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const normalizeDocument = (doc, index) => {
    const mimeType = doc?.mimeType || doc?.type || "";
    const name = doc?.name || doc?.originalName || doc?.filename || `Document ${index + 1}`;
    const orderId = doc?.orderId || doc?.order?.id || doc?.order?.orderId || "Not linked";
    const rawUploader =
      doc?.uploadedBy ||
      doc?.uploadedByRole ||
      doc?.ownerRole ||
      doc?.createdByRole ||
      "CLIENT";
    const isImage = mimeType.startsWith("image/");

    return {
      id: doc?.id || doc?._id || String(index),
      name,
      orderId: String(orderId).startsWith("#") ? orderId : orderId === "Not linked" ? orderId : `#${orderId}`,
      uploadedBy: String(rawUploader).toUpperCase().replaceAll("_", " "),
      uploadedByRaw: String(rawUploader).toUpperCase(),
      uploadedByColor: uploadedByTone(rawUploader),
      type: doc?.typeLabel || (isImage ? "Image" : mimeType ? mimeType.split("/").pop()?.toUpperCase() : "File"),
      typeBucket: getFileTypeBucket(doc),
      date: formatDate(doc?.uploadedAt || doc?.createdAt || doc?.updatedAt),
      rawDate: doc?.uploadedAt || doc?.createdAt || doc?.updatedAt || null,
      size: doc?.sizeLabel || formatSize(doc?.size),
      icon: isImage ? "image" : "file",
      iconColor: isImage ? "text-blue-500" : "text-rose-500",
      iconBg: isImage ? "bg-blue-50" : "bg-rose-50",
      downloadUrl: doc?.url ? buildAssetUrl(doc.url) : "",
    };
  };

  const resolveIcon = (icon) => {
    if (typeof icon !== "string") {
      return icon || FileText;
    }

    if (icon === "image") {
      return ImageIcon;
    }

    return FileText;
  };

  const normalizedDocuments = useMemo(
    () => (Array.isArray(documents) ? documents : []).map(normalizeDocument),
    [documents]
  );

  const filteredDocuments = useMemo(() => {
    const actorRole = String(currentActorRole || "").toUpperCase();

    return normalizedDocuments.filter((doc) => {
      // Tab filter
      if (activeTab === "mine") {
        if (actorRole && doc.uploadedByRaw !== actorRole) return false;
      } else if (activeTab === "shared") {
        if (actorRole && doc.uploadedByRaw === actorRole) return false;
      }

      // Uploaded By
      if (uploadedBy !== "all") {
        if (doc.uploadedByRaw !== uploadedBy) return false;
      }

      // File Type
      if (fileType !== "all") {
        if (doc.typeBucket !== fileType) return false;
      }

      // Date range
      if (!matchesDateRange({ ...doc, rawDate: doc.rawDate }, dateRange)) {
        return false;
      }

      return true;
    });
  }, [normalizedDocuments, activeTab, uploadedBy, fileType, dateRange, currentActorRole]);

  const hasActiveFilters =
    activeTab !== "all" ||
    uploadedBy !== "all" ||
    fileType !== "all" ||
    dateRange !== "all";

  const handleResetFilters = () => {
    setActiveTab("all");
    setUploadedBy("all");
    setFileType("all");
    setDateRange("all");
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden">
      {/* Filters & Tabs Header */}
      <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
        {/* Tabs */}
        <div className="flex items-center gap-8 border-b md:border-b-0 border-zinc-100">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  isActive ? "text-[#1a4fdb]" : "text-gray-700 hover:text-zinc-600"
                }`}
                aria-pressed={isActive}
              >
                {tab.label}
                {isActive ? (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a4fdb] rounded-full"></div>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Action Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={uploadedBy}
              onChange={(event) => setUploadedBy(event.target.value)}
              className="appearance-none flex items-center gap-2 pl-4 pr-8 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-zinc-100 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/15"
              aria-label="Filter by uploader"
            >
              {UPLOADED_BY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700" />
          </div>

          <div className="relative">
            <select
              value={fileType}
              onChange={(event) => setFileType(event.target.value)}
              className="appearance-none flex items-center gap-2 pl-4 pr-8 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-zinc-100 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/15"
              aria-label="Filter by file type"
            >
              {FILE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700" />
          </div>

          <div className="relative">
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="appearance-none flex items-center gap-2 pl-9 pr-8 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-zinc-100 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/15"
              aria-label="Filter by date range"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700" />
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700" />
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#1a4fdb] hover:text-[#1541b8] underline-offset-2 hover:underline transition-colors"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredDocuments.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-700">
            <p className="font-medium text-zinc-700">
              No documents match the current filters.
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-3 text-xs font-bold text-[#1a4fdb] hover:text-[#1541b8] underline-offset-2 hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">File Name</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Uploaded By</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Type</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Size</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredDocuments.map((doc, i) => (
                <tr key={doc.id || i} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <Link href={`/document/${doc.id || "123"}`} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.iconBg}`}>
                        {(() => {
                          const Icon = resolveIcon(doc.icon);
                          return <Icon className={`w-5 h-5 ${doc.iconColor}`} />;
                        })()}
                      </div>
                      <span className="text-sm font-bold text-zinc-900 group-hover:text-[#1a4fdb] transition-colors cursor-pointer">{doc.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">{doc.orderId}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${doc.uploadedByColor}`}>
                      {doc.uploadedBy}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">{doc.type}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">{doc.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">{doc.size}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 transition-all">
                      <Link href={`/document/${doc.id || "123"}`}>
                        <button className="p-2 text-gray-700 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      {doc.downloadUrl ? (
                        <a
                          href={doc.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-gray-700 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all"
                          aria-label={`Download ${doc.name}`}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      ) : (
                        <button className="p-2 text-gray-700 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-700 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer / Pagination */}
      <div className="p-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
        <span className="text-sm text-gray-700 font-medium">
          Showing {filteredDocuments.length} of {normalizedDocuments.length} document{normalizedDocuments.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50">
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}