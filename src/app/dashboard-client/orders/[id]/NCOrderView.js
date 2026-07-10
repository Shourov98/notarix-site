"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Check,
  User,
  Info,
  FileText,
  Paperclip,
  Video,
  Headphones,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { buildAssetUrl } from "@/lib/siteApi";
import ClientOrderMessageCenter from "./components/ClientOrderMessageCenter";

const AVATAR_TONES = [
  "bg-rose-100 text-rose-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-indigo-100 text-indigo-600",
  "bg-fuchsia-100 text-fuchsia-600",
];

const initialsFromName = (name = "") => {
  const trimmed = name.trim();
  if (!trimmed) return "—";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const toneFromSeed = (seed = "") => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
};

const formatLongDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatRelative = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) {
    const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${mins}m ago`;
  }
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatLongDate(value);
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const formatAmount = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const resolveStatusBadge = (workflowStatus) => {
  if (!workflowStatus) return { label: "Pending", tone: "bg-amber-50 text-amber-700" };
  if (workflowStatus === "Notary Assigned" || workflowStatus === "Accepted By Notary") {
    return { label: "Assigned", tone: "bg-[#1a4fdb] text-white" };
  }
  if (workflowStatus === "In Progress") {
    return { label: "In Progress", tone: "bg-blue-50 text-[#1a4fdb]" };
  }
  if (workflowStatus === "Completed") {
    return { label: "Completed", tone: "bg-emerald-50 text-emerald-700" };
  }
  if (
    workflowStatus === "Pending Admin Review" ||
    workflowStatus === "Accepted By Admin"
  ) {
    return { label: "In Review", tone: "bg-amber-50 text-amber-700" };
  }
  if (workflowStatus === "Rejected By Admin") {
    return { label: "Rejected", tone: "bg-red-50 text-red-600" };
  }
  return { label: workflowStatus, tone: "bg-zinc-100 text-zinc-700" };
};

const statusStepsDefault = [
  { key: "created", label: "Created", reached: false },
  { key: "submitted", label: "Submitted", reached: false },
  { key: "admin_review", label: "Admin Review", reached: false },
  { key: "negotiation", label: "Get rid of negotiation", reached: false },
  { key: "assigned", label: "Assigned", reached: false },
  { key: "in_progress", label: "In Progress", reached: false },
  { key: "completed", label: "Completed", reached: false },
];

export default function NCOrderView({ order }) {
  const {
    id = "",
    rawId = "",
    signerName = "",
    signerPhone = "",
    signerEmail = "",
    propertyAddress = {},
    signingDate = "",
    signingTime = "",
    isRon = false,
    specialInstructions = "",
    notary: notaryName = "Unassigned",
    notaryDetails = null,
    fees = null,
    statusSteps = null,
    workflowStatus = "",
    documents = [],
    createdAt = "",
  } = order || {};

  const steps = useMemo(() => {
    if (Array.isArray(statusSteps) && statusSteps.length > 0) {
      return statusSteps;
    }
    return statusStepsDefault.map((step, idx) => ({
      ...step,
      number: idx + 1,
      current: false,
    }));
  }, [statusSteps]);

  const feeSummary = useMemo(() => {
    const fallback = { service: 0, remote: 0, total: 0 };
    if (!fees) return fallback;
    return {
      service: Number(fees.service || 0),
      remote: Number(fees.remote || 0),
      total: Number(fees.total || fallback.total),
    };
  }, [fees]);

  const statusBadge = resolveStatusBadge(workflowStatus);

  const addressText = useMemo(() => {
    return [
      propertyAddress?.line1,
      propertyAddress?.city,
      propertyAddress?.state,
      propertyAddress?.zip,
    ]
      .filter(Boolean)
      .join(", ");
  }, [propertyAddress]);

  const fullAddress = useMemo(() => {
    const line1 = propertyAddress?.line1;
    const cityState = [propertyAddress?.city, propertyAddress?.state]
      .filter(Boolean)
      .join(", ");
    const tail = [cityState, propertyAddress?.zip].filter(Boolean).join(" ");
    return [line1, tail].filter(Boolean).join("\n");
  }, [propertyAddress]);

  const scheduledTimeText = useMemo(() => {
    if (!signingTime) return signingDate || "—";
    return `${signingDate || ""} ${signingTime}`.trim() || "—";
  }, [signingDate, signingTime]);

  const notaryDisplayName = notaryDetails?.name || (notaryName !== "Unassigned" ? notaryName : "");
  const notaryInitials = initialsFromName(notaryDisplayName);
  const notaryTone = notaryDetails?.avatarTone || toneFromSeed(notaryDisplayName);
  const notaryAvatarUrl = buildAssetUrl(notaryDetails?.avatar);
  const notaryStatus =
    notaryDetails?.status || (notaryDisplayName ? "Accepted" : "Pending");

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm flex items-center justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
              Order Id
            </p>
            <p className="text-lg font-bold text-zinc-900">#{rawId || id || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
              Signer
            </p>
            <p className="text-lg font-bold text-zinc-900">{signerName || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
              Created
            </p>
            <p className="text-lg font-bold text-zinc-900">{formatLongDate(createdAt || signingDate)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1a4fdb] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100">
          <ShieldCheck className="w-4 h-4" />
          {statusBadge.label}
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-100 -z-0" />
          {steps.map((step, idx) => (
            <div
              key={step.key || idx}
              className="flex flex-col items-center gap-3 relative z-10 bg-white px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.reached
                    ? "bg-[#1a4fdb] border-[#1a4fdb] text-white"
                    : step.current
                      ? "bg-white border-[#1a4fdb] text-[#1a4fdb] ring-4 ring-blue-50"
                      : "bg-white border-zinc-100 text-gray-700"
                }`}
              >
                {step.reached ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{step.number}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider text-center max-w-[110px] ${
                  step.current || step.reached ? "text-[#1a4fdb]" : "text-gray-700"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Info Cards */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-[#1a4fdb]">
              <User className="w-5 h-5" />
              <h3 className="font-bold text-zinc-900">Borrower Info</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Full Name
                </p>
                <p className="text-sm font-bold text-zinc-800">{signerName || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Address
                </p>
                <p className="text-sm font-medium text-zinc-600 leading-relaxed whitespace-pre-line">
                  {fullAddress || addressText || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Phone
                </p>
                <p className="text-sm font-bold text-zinc-800">{signerPhone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Email
                </p>
                <p className="text-sm font-bold text-zinc-800">
                  {signerEmail || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-[#1a4fdb]">
              <Info className="w-5 h-5" />
              <h3 className="font-bold text-zinc-900">Order Info</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Signing Type
                </p>
                <span className="inline-block bg-blue-50 text-[#1a4fdb] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {isRon ? "Remote" : "In-Person"}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Scheduled Time
                </p>
                <p className="text-sm font-bold text-zinc-800">{scheduledTimeText}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">
                  Instructions
                </p>
                <div className="bg-zinc-50 rounded-2xl p-4">
                  <p className="text-xs font-medium text-gray-700 italic leading-relaxed">
                    {specialInstructions
                      ? `“${specialInstructions}”`
                      : "No special instructions provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Message Center & Documents */}
        <div className="lg:col-span-6 space-y-6">
          <ClientOrderMessageCenter
            orderId={rawId || id}
            currentUserName={signerName}
          />

          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#1a4fdb]" />
                <h3 className="font-bold text-zinc-900">Document Section</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                {documents.length} file{documents.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 p-6 text-sm text-zinc-600">
                  No documents have been attached yet. Once uploaded by you or the notary,
                  they will appear here for preview or download.
                </div>
              ) : (
                documents.map((document) => {
                  const previewHref = buildAssetUrl(document.url);
                  const downloadHref = buildAssetUrl(document.downloadUrl) || previewHref;
                  const canPreview = Boolean(previewHref);
                  const canDownload = Boolean(downloadHref);
                  const uploadedLabel =
                    formatRelative(document.uploadedAt) ||
                    formatLongDate(document.uploadedAt) ||
                    "Uploaded";
                  const sizeLabel = formatFileSize(document.size);
                  return (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:border-blue-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-800">{document.name}</p>
                          <p className="text-[10px] font-medium text-gray-700">
                            {uploadedLabel}
                            {sizeLabel ? ` • ${sizeLabel}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {canPreview ? (
                          <a
                            href={previewHref}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-gray-700 hover:text-[#1a4fdb] uppercase tracking-widest transition-colors"
                          >
                            Preview
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Preview
                          </span>
                        )}
                        {canDownload ? (
                          <a
                            href={downloadHref}
                            target="_blank"
                            rel="noreferrer"
                            download={document.name || undefined}
                            className="text-[10px] font-bold text-gray-700 hover:text-[#1a4fdb] uppercase tracking-widest transition-colors"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Download
                          </span>
                        )}
                        {!canPreview && !canDownload ? (
                          <span
                            title="Upload pending"
                            className="text-[10px] font-bold text-amber-600 uppercase tracking-widest"
                          >
                            <Paperclip className="w-3 h-3 inline" /> Pending
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Notary & Actions */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-50 flex items-center gap-2 text-[#1a4fdb]">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Assigned Notary</h3>
            </div>
            <div className="p-6 space-y-4">
              {notaryDisplayName ? (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl overflow-hidden border border-zinc-100 flex items-center justify-center text-sm font-bold ${notaryTone}`}
                  >
                    {notaryAvatarUrl ? (
                      <img
                        src={notaryAvatarUrl}
                        alt={notaryDisplayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      notaryInitials
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{notaryDisplayName}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                        {String(notaryStatus || "Accepted").toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 p-4 text-sm text-zinc-600">
                  Notary assignment is pending. We will notify you as soon as a notary accepts this signing.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="space-y-4 border-b border-zinc-50 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                  Service Fee
                </span>
                <span className="text-sm font-bold text-zinc-800">{formatAmount(feeSummary.service)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                  Remote Convenience
                </span>
                <span className="text-sm font-bold text-zinc-800">{formatAmount(feeSummary.remote)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest">
                Total Service Fee
              </span>
              <span className="text-lg font-bold text-[#1a4fdb]">{formatAmount(feeSummary.total)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Link
              href={`/dashboard-client/messages?order=${encodeURIComponent(rawId || id || "")}`}
              className="w-full bg-[#1a4fdb] text-white py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <Video className="w-4 h-4" />
              Request Video Session
            </Link>
            <a
              href={`mailto:support@notarix.io?subject=${encodeURIComponent(
                `Support for order ${rawId || id || ""}`
              )}`}
              className="w-full bg-zinc-50 text-zinc-600 py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-2 border border-zinc-100 hover:bg-zinc-100 transition-all active:scale-95"
            >
              <Headphones className="w-4 h-4" />
              Contact Support
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}