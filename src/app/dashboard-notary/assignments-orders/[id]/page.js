"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Paperclip,
  Plus,
  Send,
  Upload,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { buildAssetUrl } from "@/lib/siteApi";
import {
  acceptNotaryAssignment,
  completeNotaryAssignment,
  fetchNotaryAssignment,
  fetchNotaryAssignments,
  fetchPortalConversationByOrder,
  fetchPortalMessages,
  selectSitePortal,
  sendPortalMessage,
  startNotaryAssignment,
} from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const steps = ["Created", "Submitted", "Review", "Assigned", "In Progress", "Completed"];

const statusToStepIndex = {
  "Pending Admin Review": 2,
  "Accepted By Admin": 2,
  "Notary Assigned": 3,
  "Accepted By Notary": 4,
  "In Progress": 4,
  Completed: 5,
};

const formatMessageTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

const formatAuditTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Not recorded";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDocumentMeta = (document) => {
  const parts = [];
  if (document?.size) {
    parts.push(`${(Number(document.size) / 1024 / 1024).toFixed(1)} MB`);
  }
  if (document?.mimeType) {
    parts.push(document.mimeType);
  }
  if (document?.status) {
    parts.push(document.status);
  }
  return parts.join(" • ") || "Document available";
};

export default function AssignmentOrderDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const dispatch = useAppDispatch();
  const fileInputRef = useRef(null);
  const [completionFiles, setCompletionFiles] = useState([]);
  const [draft, setDraft] = useState("");
  const {
    activeNotaryAssignment,
    activeNotaryAssignmentStatus,
    activeNotaryAssignmentError,
    notaryAssignmentActionStatus,
    activeConversation,
    messages,
    messagesStatus,
    messageActionStatus,
  } = useAppSelector(selectSitePortal);

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchNotaryAssignment(id));
    dispatch(fetchPortalConversationByOrder(id))
      .unwrap()
      .then((conversation) => {
        if (conversation?.id) {
          dispatch(fetchPortalMessages(conversation.id));
        }
      })
      .catch(() => {});
  }, [dispatch, id]);

  const refresh = () => {
    dispatch(fetchNotaryAssignment(id));
    dispatch(fetchNotaryAssignments());
    if (activeConversation?.id) {
      dispatch(fetchPortalMessages(activeConversation.id));
    }
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

  const handleSend = async () => {
    if (!activeConversation?.id || !draft.trim()) {
      return;
    }

    try {
      await dispatch(
        sendPortalMessage({
          conversationId: activeConversation.id,
          body: draft.trim(),
        })
      ).unwrap();
      setDraft("");
      dispatch(fetchPortalMessages(activeConversation.id));
    } catch (error) {
      toast.error(error || "Unable to send message.");
    }
  };

  const order = activeNotaryAssignment;
  const currentStepIndex = statusToStepIndex[order?.workflowStatus] ?? 4;
  const fullAddress =
    order?.property?.fullAddress ||
    [order?.property?.line1, order?.property?.city, order?.property?.state, order?.property?.zip]
      .filter(Boolean)
      .join(", ");
  const allDocuments = [...(order?.documents || []), ...(order?.completedDocuments || [])];
  const paymentLabel = order?.payment?.paymentStatus || "Pending";
  const canAccept = Boolean(order?.actionState?.canAccept);
  const canStart = Boolean(order?.actionState?.canStart) || order?.workflowStatus === "In Progress";
  const canComplete = Boolean(order?.actionState?.canComplete) || order?.workflowStatus === "In Progress";

  const timelineEntries = useMemo(() => {
    const history = order?.statusHistory || order?.timeline || [];
    return history.length > 0
      ? history
      : [
          {
            status: order?.workflowStatus || "Pending",
            changedAt: new Date().toISOString(),
            note: "Current assignment state.",
          },
        ];
  }, [order]);

  if (activeNotaryAssignmentStatus === "loading" && !activeNotaryAssignment) {
    return <div className="py-12 text-sm text-gray-700">Loading assignment...</div>;
  }

  if (!activeNotaryAssignment) {
    return (
      <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {activeNotaryAssignmentError || "Assignment not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <Link href="/dashboard-notary/assignments-orders" className="hover:text-zinc-900 transition-colors">
            Orders
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900">Details</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-900">Order {order.id}</h1>
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
            {order.workflowStatus}
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-zinc-100"></div>
          {steps.map((step, index) => {
            const completed = index < currentStepIndex;
            const current = index === currentStepIndex;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center gap-3 bg-white px-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    completed
                      ? "border-[#1a4fdb] bg-[#1a4fdb] text-white"
                      : current
                        ? "border-[#1a4fdb] bg-white text-[#1a4fdb] ring-4 ring-blue-50"
                        : "border-zinc-200 bg-white text-gray-700"
                  }`}
                >
                  {completed ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    completed || current ? "text-[#1a4fdb]" : "text-gray-700"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: "FEE AMOUNT", value: formatCurrency(order.payment?.notaryOfferAmount ?? order.payment?.feeAmount) },
          { label: "SIGNING DATE", value: order.schedule?.signingDate || "Not set", sub: order.schedule?.signingTime || "" },
          { label: "LOCATION", value: order.location || fullAddress || "Not provided", sub: order.service?.isRon ? "Remote Portal" : fullAddress },
          { label: "ORDER TYPE", value: order.service?.orderType || order.orderType || "Not provided", sub: order.service?.mode || "" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[32px] border border-zinc-100 bg-white p-6 shadow-sm">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-700">{stat.label}</p>
            <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
            {stat.sub ? <p className="mt-1 text-xs font-medium text-gray-700">{stat.sub}</p> : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6 rounded-[32px] border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-zinc-900">Client Info</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1a4fdb]">Edit</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-700">Organization</p>
                  <p className="text-sm font-bold text-zinc-800">{order.client?.company || order.client?.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-700">Contact Agent</p>
                  <p className="text-sm font-bold text-zinc-800">{order.client?.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-700">Vendor Code</p>
                  <p className="text-sm font-bold text-zinc-800">{order.client?.vendorCode || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-700">Email</p>
                  <p className="break-all text-xs font-bold text-[#1a4fdb]">{order.client?.email || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-[32px] border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-zinc-900">Borrower Info</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1a4fdb]">Verify ID</span>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-700">Full Name</p>
                  <p className="text-sm font-bold text-zinc-800">{order.borrower?.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-gray-700">Location</p>
                  <p className="text-sm font-bold text-zinc-800">{[order.property?.city, order.property?.state].filter(Boolean).join(", ") || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-gray-700">KBA Status</p>
                  <span className="rounded border border-emerald-100 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-600">
                    Passed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
            <h3 className="font-bold text-zinc-900">Property &amp; Signing Details</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-gray-700">Full Address</p>
                <p className="text-sm font-bold leading-relaxed text-zinc-800">
                  {order.property?.line1 || "Not provided"}
                  <br />
                  {[order.property?.city, order.property?.state, order.property?.zip].filter(Boolean).join(", ") || ""}
                </p>
              </div>
              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-gray-700">Scheduled Time</p>
                <p className="text-sm font-bold text-zinc-800">{order.schedule?.dateTime || "Not scheduled"}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-gray-700">Notary Access Code</p>
              <p className="text-lg font-bold tracking-[2px] text-[#1a4fdb]">{order.rawId || id}</p>
            </div>
            {order.specialInstructions ? (
              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-gray-700">Instructions</p>
                <p className="text-sm text-zinc-600">{order.specialInstructions}</p>
              </div>
            ) : null}
          </div>

          <div className="space-y-6 rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">Documents</h3>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1a4fdb]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Documents
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(event) => setCompletionFiles(Array.from(event.target.files || []))}
            />
            <div className="space-y-3">
              {allDocuments.length === 0 ? (
                <p className="text-sm text-gray-700">No documents available yet.</p>
              ) : (
                allDocuments.map((document) => (
                  <div key={document.id} className="group flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/20 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                        <FileText className="h-5 w-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-800">{document.name}</p>
                        <p className="text-[10px] font-medium text-gray-700">{formatDocumentMeta(document)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {document.url ? (
                        <a
                          href={buildAssetUrl(document.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-2 text-gray-700 shadow-sm transition-all hover:bg-white hover:text-[#1a4fdb]"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      ) : null}
                      {document.downloadUrl ? (
                        <a
                          href={buildAssetUrl(document.downloadUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-2 text-gray-700 shadow-sm transition-all hover:bg-white hover:text-[#1a4fdb]"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
            {completionFiles.length > 0 ? (
              <p className="text-xs text-gray-700">
                {completionFiles.length} file{completionFiles.length === 1 ? "" : "s"} selected for completed document upload.
              </p>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-[32px] border border-zinc-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-50 p-6">
              <h3 className="font-bold text-zinc-900">Message Center</h3>
              <div className="flex -space-x-2">
                {["CL", "AD", "NY"].map((initial, index) => (
                  <div
                    key={initial}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold ${
                      index === 0 ? "bg-zinc-100 text-zinc-700" : index === 1 ? "bg-blue-600 text-white" : "bg-zinc-800 text-white"
                    }`}
                  >
                    {initial}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[320px] space-y-8 overflow-y-auto bg-zinc-50/20 p-6">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-700">
                  {messagesStatus === "loading" ? "Loading messages..." : "No messages yet for this order."}
                </p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        message.isOwnMessage ? "bg-[#1a4fdb] text-white" : "bg-zinc-200 text-gray-700"
                      }`}
                    >
                      {String(message.senderName || "NA")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                          {message.senderName}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                            message.isOwnMessage ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-gray-700"
                          }`}
                        >
                          {message.senderRole || "Participant"}
                        </span>
                        <span className="text-[10px] font-medium text-gray-700">{formatMessageTime(message.createdAt)}</span>
                      </div>
                      <div
                        className={`inline-block max-w-[80%] rounded-2xl border p-4 shadow-sm ${
                          message.isOwnMessage
                            ? "rounded-tl-none border-blue-100 bg-blue-50/60"
                            : "rounded-tl-none border-zinc-100 bg-white"
                        }`}
                      >
                        <p className="text-sm font-medium leading-relaxed text-zinc-600">{message.body || "Attachment shared"}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-zinc-100 bg-white p-4">
              <div className="relative">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message to participants..."
                  className="w-full rounded-xl border border-zinc-200 py-3 pl-4 pr-20 text-sm transition-all focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                />
                <button
                  type="button"
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-gray-700 transition-colors hover:text-[#1a4fdb]"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={messageActionStatus === "loading"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-700 transition-colors hover:text-[#1a4fdb]"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="relative space-y-8 overflow-hidden rounded-[32px] bg-zinc-900 p-8 text-white shadow-xl shadow-zinc-200/50">
            <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">RON READY</span>
                <Video className="ml-auto h-4 w-4 text-white/20" />
              </div>
              <h2 className="text-2xl font-bold">Remote Session</h2>
              <p className="text-sm font-medium leading-relaxed text-white/40">
                Start the encrypted video session for legally binding signatures.
              </p>
            </div>

            <div className="space-y-3">
              {canAccept ? (
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={notaryAssignmentActionStatus === "loading"}
                  className="w-full rounded-[20px] border border-white/15 bg-white/5 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  Accept Assignment
                </button>
              ) : null}
              {canStart ? (
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={notaryAssignmentActionStatus === "loading"}
                  className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-[#1a4fdb] py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#1541b8]"
                >
                  <Video className="h-5 w-5" />
                  Start Video Session
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-3 rounded-[20px] border border-white/10 bg-white/5 py-4 text-sm font-bold text-white/80 transition-all hover:bg-white/10"
              >
                <Upload className="h-5 w-5" />
                Upload Documents
              </button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={notaryAssignmentActionStatus === "loading" || !canComplete}
                className="flex w-full items-center justify-center gap-3 rounded-[20px] border border-white/10 bg-white/5 py-4 text-sm font-bold text-white/80 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="h-5 w-5" />
                Mark Complete
              </button>
            </div>
          </div>

          <div className="space-y-8 rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
              <h3 className="font-bold text-zinc-900">Payment</h3>
              <span className="rounded border border-amber-100 bg-amber-50 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-600">
                {paymentLabel}
              </span>
            </div>
            <div className="space-y-6">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-700">Total Amount</p>
                <p className="text-3xl font-bold text-zinc-900">{formatCurrency(order.payment?.notaryOfferAmount ?? order.payment?.feeAmount)}</p>
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-gray-700">Due Date</span>
                <span className="text-zinc-900">{order.payment?.payoutDueDate ? new Date(order.payment.payoutDueDate).toLocaleDateString("en-US") : "Upon Completion"}</span>
              </div>
              <button className="w-full rounded-2xl border border-zinc-200 py-3.5 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50">
                Download Invoice
              </button>
            </div>
          </div>

          <div className="space-y-8 rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
            <h3 className="font-bold text-zinc-900">Audit Trail</h3>
            <div className="relative space-y-8 pl-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-zinc-100">
              {timelineEntries.map((entry, index) => (
                <div key={`${entry.status}-${entry.changedAt}-${index}`} className="relative">
                  <div
                    className={`absolute left-[-23px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      index === 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-[#1a4fdb]"
                    }`}
                  ></div>
                  <h4 className="text-xs font-bold text-zinc-800">{entry.status}</h4>
                  <p className="mt-1 text-[9px] font-bold uppercase text-gray-700">{formatAuditTime(entry.changedAt)}</p>
                  {entry.note ? <p className="mt-2 text-sm text-zinc-600">{entry.note}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
