"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  Paperclip,
  Play,
  Send,
  ShieldCheck,
  Upload,
  Video,
  XCircle,
} from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const workflowSteps = [
  { label: "Created", statuses: ["Pending Admin Review"] },
  { label: "Submitted", statuses: ["Accepted By Admin", "Rejected By Admin"] },
  { label: "Review", statuses: ["Accepted By Admin", "Rejected By Admin", "Notary Assigned"] },
  { label: "Assigned", statuses: ["Notary Assigned", "Accepted By Notary", "In Progress", "Completed"] },
  { label: "In Progress", statuses: ["In Progress", "Completed"] },
  { label: "Completed", statuses: ["Completed"] },
];

const statusTone = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";
    case "In Progress":
      return "bg-orange-50 text-orange-700";
    case "Accepted By Notary":
      return "bg-blue-50 text-blue-700";
    case "Notary Assigned":
      return "bg-amber-50 text-amber-700";
    case "Rejected By Notary":
    case "Needs Reassignment":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
};

const formatDate = (value) => {
  if (!value) return "Pending";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (dateValue, timeValue) =>
  [formatDate(dateValue), timeValue].filter(Boolean).join(" • ");

const formatTimestamp = (value) => {
  if (!value) return "No activity yet";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatFileSize = (size) => {
  if (!size || Number.isNaN(Number(size))) return null;
  const value = Number(size);
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
};

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-12 w-80 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-28 animate-pulse rounded-[28px] bg-white shadow-sm" />
      <div className="grid gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[24px] bg-white shadow-sm" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-[24px] bg-white shadow-sm" />
          <div className="h-80 animate-pulse rounded-[24px] bg-white shadow-sm" />
        </div>
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-[24px] bg-white shadow-sm" />
          <div className="h-64 animate-pulse rounded-[24px] bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext }) {
  return (
    <div className="rounded-[24px] border border-indigo-100 bg-white p-6 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-[20px] font-bold text-zinc-900">{value}</p>
      {subtext ? <p className="mt-2 text-sm text-zinc-500">{subtext}</p> : null}
    </div>
  );
}

export default function NotaryAssignmentDetailPage() {
  const params = useParams();
  const id = String(params?.id || "").replace(/^#/, "");
  const completedUploadRef = useRef(null);
  const attachmentRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [acting, setActing] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const loadOrder = async () => {
    return requestPortalJson(`/site/notary/assignments/${id}`);
  };

  const loadConversation = async () => {
    try {
      const orderConversation = await requestPortalJson(`/conversations/order/${id}`);
      setConversation(orderConversation);
      const payload = await requestPortalJson(`/conversations/${orderConversation.id}/messages`);
      setMessages(payload?.messages || []);
    } catch (conversationError) {
      if (String(conversationError.message || "").toLowerCase().includes("conversation not found")) {
        setConversation(null);
        setMessages([]);
        return;
      }
      throw conversationError;
    }
  };

  const refresh = async () => {
    const [nextOrder] = await Promise.all([loadOrder(), loadConversation()]);
    setOrder(nextOrder);
  };

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [orderPayload] = await Promise.all([loadOrder(), loadConversation()]);
        if (!cancelled) {
          setOrder(orderPayload);
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

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const stepIndex = useMemo(
    () =>
      Math.max(
        0,
        workflowSteps.findIndex((step) => step.statuses.includes(order?.workflowStatus || order?.status))
      ),
    [order]
  );

  const handleWorkflowAction = async (action) => {
    setActing(action);
    setError("");
    setSuccess("");

    const routeMap = {
      accept: `/site/notary/orders/${id}/accept`,
      reject: `/site/notary/orders/${id}/reject`,
      start: `/site/notary/orders/${id}/start`,
      complete: `/site/notary/orders/${id}/complete`,
    };
    const bodyMap = {
      accept: { note: "Accepted from assignment detail page." },
      reject: { reason: "Declined from assignment detail page." },
      start: { note: "Started from assignment detail page." },
      complete: { note: "Completed from assignment detail page." },
    };

    try {
      await requestPortalJson(routeMap[action], {
        method: "PATCH",
        body: JSON.stringify(bodyMap[action]),
      });
      await refresh();
      setSuccess(
        action === "accept"
          ? "Assignment accepted successfully."
          : action === "reject"
            ? "Assignment rejected successfully."
            : action === "start"
              ? "Assignment started successfully."
              : "Assignment marked complete successfully."
      );
    } catch (actionError) {
      setError(actionError.message || "Unable to update this assignment.");
    } finally {
      setActing("");
    }
  };

  const handleCompletedUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setActing("upload-completed");
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("documents", file));
      await requestPortalJson(`/site/notary/orders/${id}/completed-documents`, {
        method: "POST",
        body: formData,
      });
      await refresh();
      setSuccess("Completed documents uploaded successfully.");
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload completed documents.");
    } finally {
      setActing("");
      event.target.value = "";
    }
  };

  const handleSendMessage = async () => {
    if (!conversation || !messageBody.trim()) return;

    setActing("send-message");
    setError("");

    try {
      await requestPortalJson(`/conversations/${conversation.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: messageBody.trim() }),
      });
      setMessageBody("");
      await loadConversation();
    } catch (messageError) {
      setError(messageError.message || "Unable to send message.");
    } finally {
      setActing("");
    }
  };

  const handleAttachmentUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!conversation || !files.length) return;

    setActing("upload-attachment");
    setError("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("attachments", file));
      if (messageBody.trim()) {
        formData.append("body", messageBody.trim());
      }
      await requestPortalJson(`/conversations/${conversation.id}/attachments`, {
        method: "POST",
        body: formData,
      });
      setMessageBody("");
      await loadConversation();
    } catch (attachmentError) {
      setError(attachmentError.message || "Unable to upload message attachments.");
    } finally {
      setActing("");
      event.target.value = "";
    }
  };

  if (loading) return <DetailSkeleton />;

  if (error && !order) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h1 className="text-xl font-bold">Assignment unavailable</h1>
            <p className="mt-2 text-sm leading-7">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">{error}</p>
          </div>
        </div>
      ) : null}
      {success ? (
        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
          <p className="text-sm leading-7">{success}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <Link href="/dashboard-notary/assignments-orders" className="inline-flex items-center gap-2 hover:text-zinc-700">
              <ArrowLeft className="h-4 w-4" />
              Orders
            </Link>
            <span>Details</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900">{order?.id}</h1>
            <span className={`rounded-full px-4 py-2 text-sm font-bold ${statusTone(order?.status)}`}>
              {order?.status}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-zinc-100 bg-white px-8 py-7 shadow-sm">
        <div className="grid gap-4 md:grid-cols-6">
          {workflowSteps.map((step, index) => {
            const complete = index < stepIndex;
            const active = index === stepIndex;
            return (
              <div key={step.label} className="relative text-center">
                {index < workflowSteps.length - 1 ? (
                  <div className={`absolute left-1/2 top-5 hidden h-0.5 w-full md:block ${index < stepIndex ? "bg-[#2d4de0]" : "bg-zinc-200"}`} />
                ) : null}
                <div className={`relative mx-auto flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold ${complete || active ? "border-[#2d4de0] bg-[#2d4de0] text-white" : "border-zinc-300 bg-white text-zinc-400"}`}>
                  {complete ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <p className={`mt-3 text-sm font-semibold ${active ? "text-[#2d4de0]" : "text-zinc-500"}`}>{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <StatCard
          label="Fee Amount"
          value={`$${Number(order?.payment?.notaryOfferAmount || 0).toFixed(2)}`}
        />
        <StatCard
          label="Signing Date"
          value={formatDate(order?.schedule?.signingDate)}
          subtext={order?.schedule?.signingTime || ""}
        />
        <StatCard
          label="Location"
          value={order?.location || order?.property?.fullAddress || "Pending"}
          subtext={order?.service?.isRon ? "Remote Portal" : "On-site signing"}
        />
        <StatCard
          label="Order Type"
          value={order?.service?.orderType || "Unknown"}
          subtext={order?.service?.mode || ""}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900">Client Info</h2>
                <span className="text-sm font-semibold text-[#2d4de0]">{order?.client?.vendorCode || "Client"}</span>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Organization</p>
                  <p className="mt-2 text-xl font-semibold text-zinc-900">{order?.client?.company || order?.client?.name || "Unknown client"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Contact Email</p>
                  <p className="mt-2 text-sm text-zinc-700">{order?.client?.email || "Not available"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Assignment Notes</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">
                    {order?.payment?.assignmentNotes || order?.specialInstructions || "No assignment notes were provided."}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900">Borrower Info</h2>
                <span className="text-sm font-semibold text-[#2d4de0]">Live Record</span>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Full Name</p>
                  <p className="mt-2 text-xl font-semibold text-zinc-900">{order?.borrower?.name || "Unknown borrower"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Email</p>
                  <p className="mt-2 text-sm text-zinc-700">{order?.borrower?.email || "Not available"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Phone</p>
                  <p className="mt-2 text-sm text-zinc-700">{order?.borrower?.phone || "Not available"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Verification Status</p>
                  <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {order?.documentVerification?.rejected ? "Needs Attention" : "Tracked"}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900">Property & Signing Details</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Full Address</p>
                <p className="mt-2 text-xl font-semibold text-zinc-900">{order?.property?.fullAddress || "Pending"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Scheduled Time</p>
                <p className="mt-2 text-xl font-semibold text-zinc-900">
                  {formatDateTime(order?.schedule?.signingDate, order?.schedule?.signingTime)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Service Type</p>
                <p className="mt-2 text-sm text-zinc-700">{order?.service?.type || "Unknown service"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Order Route</p>
                <p className="mt-2 text-sm text-zinc-700">{order?.service?.mode || "Pending"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Paper Preferences</p>
                <p className="mt-2 text-sm text-zinc-700">
                  {order?.preferences?.paperSize || "Letter"} / {order?.preferences?.preferredInk || "Black"} ink
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Estimated Pages</p>
                <p className="mt-2 text-sm text-zinc-700">{order?.preferences?.estimatedPages || "Not provided"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">Documents</h2>
                <p className="mt-1 text-sm text-zinc-500">Source order documents and completed notarized files.</p>
              </div>
              <button
                type="button"
                onClick={() => completedUploadRef.current?.click()}
                disabled={!order?.actionState?.canUploadCompletedDocuments || acting === "upload-completed"}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-[#2d4de0] transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {acting === "upload-completed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Add Completed Documents
              </button>
              <input
                ref={completedUploadRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                multiple
                className="hidden"
                onChange={handleCompletedUpload}
              />
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Order Documents</p>
                <div className="mt-4 space-y-3">
                  {order?.documents?.length ? order.documents.map((document) => (
                    <div key={document.id} className="flex flex-col gap-3 rounded-[20px] border border-zinc-100 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-red-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-zinc-900">{document.name}</p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {(formatFileSize(document.size) || "File")} • Uploaded {formatTimestamp(document.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone(document.status)}`}>{document.status}</span>
                        {document.url ? (
                          <a href={document.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
                            <Eye className="h-4 w-4 text-[#2d4de0]" />
                          </a>
                        ) : null}
                        {document.downloadUrl ? (
                          <a href={document.downloadUrl} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
                            <Download className="h-4 w-4 text-[#2d4de0]" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-[20px] border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-sm text-zinc-500">
                      No order documents are attached yet.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Completed Documents</p>
                <div className="mt-4 space-y-3">
                  {order?.completedDocuments?.length ? order.completedDocuments.map((document) => (
                    <div key={document.id} className="flex flex-col gap-3 rounded-[20px] border border-zinc-100 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-zinc-900">{document.name}</p>
                          <p className="mt-1 text-sm text-zinc-500">
                            {(formatFileSize(document.size) || "File")} • Uploaded {formatTimestamp(document.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {document.url ? (
                          <a href={document.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
                            <Eye className="h-4 w-4 text-[#2d4de0]" />
                          </a>
                        ) : null}
                        {document.downloadUrl ? (
                          <a href={document.downloadUrl} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
                            <Download className="h-4 w-4 text-[#2d4de0]" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-[20px] border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-sm text-zinc-500">
                      No completed documents uploaded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-zinc-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
              <h2 className="text-2xl font-bold text-zinc-900">Message Center</h2>
              <div className="flex -space-x-2">
                {(conversation?.participants || []).slice(0, 4).map((participant) => (
                  <div
                    key={`${participant.actorId}-${participant.actorType}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-xs font-bold text-zinc-700"
                  >
                    {String(participant.name || "?").trim().slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              {messages.length ? messages.map((message) => (
                <div key={message.id} className={`max-w-3xl ${message.isOwnMessage ? "ml-auto" : ""}`}>
                  <div className={`rounded-[22px] px-5 py-4 ${message.isOwnMessage ? "bg-blue-50" : "bg-zinc-50"}`}>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-zinc-900">{message.senderName}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                        {message.senderRole}
                      </span>
                      <span className="text-zinc-400">{formatTimestamp(message.createdAt)}</span>
                    </div>
                    {message.body ? <p className="mt-3 text-sm leading-7 text-zinc-700">{message.body}</p> : null}
                    {message.attachments?.length ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {message.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.downloadUrl || attachment.url || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700"
                          >
                            <Paperclip className="h-4 w-4 text-[#2d4de0]" />
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )) : (
                <div className="rounded-[20px] border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-sm text-zinc-500">
                  {conversation ? "No messages yet in this order conversation." : "This order does not have a live conversation yet."}
                </div>
              )}
            </div>

            <div className="border-t border-zinc-100 px-4 py-4">
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3">
                <input
                  value={messageBody}
                  onChange={(event) => setMessageBody(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message to participants..."
                  className="flex-1 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                  disabled={!conversation}
                />
                <button
                  type="button"
                  onClick={() => attachmentRef.current?.click()}
                  disabled={!conversation || acting === "upload-attachment"}
                  className="text-zinc-500 disabled:opacity-40"
                >
                  {acting === "upload-attachment" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                </button>
                <input
                  ref={attachmentRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAttachmentUpload}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!conversation || !messageBody.trim() || acting === "send-message"}
                  className="text-[#2d4de0] disabled:opacity-40"
                >
                  {acting === "send-message" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[24px] bg-[#161d34] p-6 text-white shadow-xl shadow-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">RON Ready</p>
                <h2 className="mt-4 text-4xl font-bold">{order?.service?.isRon ? "Remote Session" : "Assignment Actions"}</h2>
                <p className="mt-4 text-sm leading-7 text-blue-100">
                  {order?.service?.isRon
                    ? "Start the encrypted video session for legally binding signatures."
                    : "Advance the assignment workflow and keep completed documents attached to the order."}
                </p>
              </div>
              <Video className="h-12 w-12 text-blue-200" />
            </div>

            <div className="mt-8 space-y-4">
              {order?.actionState?.canAccept ? (
                <button
                  type="button"
                  onClick={() => handleWorkflowAction("accept")}
                  disabled={Boolean(acting)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2d4de0] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#2040d0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {acting === "accept" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Accept Assignment
                </button>
              ) : null}

              {order?.actionState?.canStart ? (
                <button
                  type="button"
                  onClick={() => handleWorkflowAction("start")}
                  disabled={Boolean(acting)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2d4de0] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#2040d0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {acting === "start" ? <Loader2 className="h-4 w-4 animate-spin" /> : order?.service?.isRon ? <Video className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {order?.service?.isRon ? "Start Video Session" : "Start Signing"}
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => completedUploadRef.current?.click()}
                disabled={!order?.actionState?.canUploadCompletedDocuments || Boolean(acting)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {acting === "upload-completed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload Documents
              </button>

              <button
                type="button"
                onClick={() => handleWorkflowAction("complete")}
                disabled={!order?.actionState?.canComplete || Boolean(acting)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {acting === "complete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Mark Complete
              </button>

              {order?.actionState?.canReject ? (
                <button
                  type="button"
                  onClick={() => handleWorkflowAction("reject")}
                  disabled={Boolean(acting)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {acting === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Reject Assignment
                </button>
              ) : null}
            </div>
          </section>

          <section className="rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900">Payment</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone(order?.payment?.paymentStatus || "Pending")}`}>
                {order?.payment?.paymentStatus || "Pending"}
              </span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-zinc-600">
              <div className="flex items-center justify-between gap-4">
                <span>Total Amount</span>
                <span className="text-3xl font-bold text-zinc-900">${Number(order?.payment?.notaryOfferAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Due Date</span>
                <span className="font-semibold text-zinc-900">{order?.payment?.payoutDueDate ? formatDate(order.payment.payoutDueDate) : "Upon completion"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Release Days</span>
                <span className="font-semibold text-zinc-900">{order?.payment?.payoutReleaseDays ?? "Not set"}</span>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#2d4de0]" />
              <h2 className="text-2xl font-bold text-zinc-900">Audit Trail</h2>
            </div>
            <div className="mt-6 space-y-5">
              {order?.statusHistory?.length ? order.statusHistory.map((entry, index) => (
                <div key={`${entry.status}-${entry.changedAt}-${index}`} className="flex gap-4">
                  <div className="mt-1 flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#2d4de0]" />
                    {index < order.statusHistory.length - 1 ? <div className="mt-2 h-10 w-px bg-zinc-200" /> : null}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{entry.status}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-400">{formatTimestamp(entry.changedAt)}</p>
                    {entry.note ? <p className="mt-2 text-sm leading-6 text-zinc-600">{entry.note}</p> : null}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-zinc-500">No timeline entries yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
