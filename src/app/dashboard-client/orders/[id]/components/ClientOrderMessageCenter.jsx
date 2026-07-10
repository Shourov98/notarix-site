"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { buildApiOrigin, buildAssetUrl } from "@/lib/siteApi";
import {
  fetchPortalConversationByOrder,
  fetchPortalMessages,
  markPortalMessageRead,
  selectSitePortal,
  sendPortalMessage,
  uploadPortalAttachments,
} from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const formatMessageTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const isImageMime = (mimeType) => Boolean(mimeType && mimeType.startsWith("image/"));

const resolveAttachmentUrl = (attachment) => {
  const raw = attachment?.url;
  if (!raw) return null;
  return buildAssetUrl(raw);
};

const resolveDownloadUrl = (attachment) => {
  if (attachment?.downloadUrl) {
    return buildAssetUrl(attachment.downloadUrl);
  }
  const viewUrl = resolveAttachmentUrl(attachment);
  if (!viewUrl) return null;
  if (/^https?:\/\//i.test(viewUrl)) {
    return viewUrl.includes("/upload/")
      ? viewUrl.replace("/upload/", "/upload/fl_attachment/")
      : viewUrl;
  }
  return viewUrl;
};

const triggerAttachmentDownload = (attachment) => {
  const downloadHref = resolveDownloadUrl(attachment);
  if (!downloadHref) {
    toast.error("Download link is unavailable.");
    return;
  }
  try {
    const link = document.createElement("a");
    link.href = downloadHref;
    if (attachment?.name) {
      link.download = attachment.name;
    }
    link.rel = "noreferrer";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    toast.error("Unable to start download.");
  }
};

const ROLE_LABEL = {
  Client: { header: "Client", bubble: "bg-white border border-zinc-100 text-zinc-800", headerClass: "text-[#1a4fdb]" },
  Admin: { header: "Admin", bubble: "bg-white border border-zinc-200 text-zinc-800", headerClass: "text-zinc-500" },
  Notary: { header: "Notary", bubble: "bg-emerald-50 border border-emerald-100 text-zinc-700", headerClass: "text-emerald-600" },
  System: { header: "System", bubble: "bg-zinc-100 border border-zinc-200 text-zinc-700", headerClass: "text-zinc-500" },
};

const resolveBubbleStyle = (message, currentUserName) => {
  const role = message?.senderRole || "System";
  const own =
    Boolean(message?.isOwnMessage) ||
    (currentUserName && message?.senderName && message.senderName === currentUserName);

  if (own) {
    return {
      headerLabel: `Client: ${message?.senderName || currentUserName || "You"}`,
      headerClass: "text-[#1a4fdb] text-right",
      bubble: "bg-[#1a4fdb] text-white rounded-2xl rounded-tr-none shadow-sm",
      wrapperClass: "ml-auto max-w-[80%] flex flex-col items-end",
    };
  }

  const palette = ROLE_LABEL[role] || ROLE_LABEL.System;
  return {
    headerLabel: `${palette.header}: ${message?.senderName || "Member"}`,
    headerClass: `${palette.headerClass} text-left`,
    bubble: `${palette.bubble} rounded-2xl rounded-tl-none shadow-sm`,
    wrapperClass: "max-w-[80%]",
  };
};

export default function ClientOrderMessageCenter({
  orderId,
  currentUserName,
  heightClass = "h-[400px]",
}) {
  const dispatch = useAppDispatch();
  const { activeConversation, messages, messagesStatus, messageActionStatus } =
    useAppSelector(selectSitePortal);

  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const socketUrl = buildApiOrigin();

  // Load conversation + messages when the order changes.
  useEffect(() => {
    if (!orderId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const conversation = await dispatch(fetchPortalConversationByOrder(orderId)).unwrap();
        if (cancelled || !conversation?.id) return;
        await dispatch(fetchPortalMessages(conversation.id));
      } catch {
        // Conversation may not exist yet; that's fine — composer stays open.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, orderId]);

  // Subscribe to socket.io for live updates.
  useEffect(() => {
    if (!activeConversation?.id) return undefined;
    const socket = io(socketUrl, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.emit("join_conversation", activeConversation.id);

    const handleNew = (message) => {
      if (message?.conversationId !== activeConversation.id) return;
      dispatch(fetchPortalMessages(activeConversation.id));
    };

    socket.on("new_message", handleNew);
    return () => {
      socket.off("new_message", handleNew);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeConversation?.id, dispatch, socketUrl]);

  // Mark unread messages as read.
  useEffect(() => {
    messages
      .filter((message) => !message.isRead)
      .forEach((message) => {
        dispatch(markPortalMessageRead(message.id));
      });
  }, [dispatch, messages]);

  // Auto-scroll to the bottom whenever messages change.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const next = files.map((file) => ({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      previewUrl: isImageMime(file.type) ? URL.createObjectURL(file) : null,
    }));
    setAttachments((current) => [...current, ...next].slice(0, 5));
    event.target.value = "";
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  useEffect(() => {
    return () => {
      attachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    const conversationId = activeConversation?.id;
    if (!conversationId) {
      toast.error("Conversation is still loading. Please wait a moment.");
      return;
    }
    if (!draft.trim() && attachments.length === 0) {
      toast.error("Write a message or attach a file before sending.");
      return;
    }
    try {
      if (attachments.length > 0) {
        await dispatch(
          uploadPortalAttachments({
            conversationId,
            files: attachments.map((item) => item.file),
            body: draft.trim(),
          })
        ).unwrap();
      } else {
        await dispatch(
          sendPortalMessage({ conversationId, body: draft.trim() })
        ).unwrap();
      }
      await dispatch(fetchPortalMessages(conversationId));
      attachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      setAttachments([]);
      setDraft("");
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || error?.payload?.message || "Unable to send message.";
      toast.error(message);
    }
  };

  const isSending = messageActionStatus === "loading";
  const isLoadingMessages = messagesStatus === "loading" && messages.length === 0;

  const headerSubtitle = useMemo(() => {
    if (!activeConversation) return "Live Support";
    return activeConversation.counterpart?.role || "Live Support";
  }, [activeConversation]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeConversation, attachments, draft]
  );

  return (
    <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">Message Center</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-700 mt-1">
              {headerSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            Live Support
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`p-6 ${heightClass} overflow-y-auto space-y-6 bg-zinc-50/30`}
      >
        {isLoadingMessages ? (
          <p className="text-sm text-gray-700">Loading conversation...</p>
        ) : null}

        {!isLoadingMessages && messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-6 text-sm text-zinc-600">
            No messages yet. Start the conversation and our team will respond shortly.
          </div>
        ) : null}

        {messages.map((message) => {
          const style = resolveBubbleStyle(message, currentUserName);
          return (
            <div key={message.id} className="space-y-2">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${style.headerClass}`}>
                {style.headerLabel}
                <span className="ml-2 font-medium tracking-normal text-zinc-400">
                  {formatMessageTime(message.createdAt)}
                </span>
              </p>
              <div className={`${style.wrapperClass}`}>
                <div className={`${style.bubble} p-4 max-w-full`}>
                  {message.body ? (
                    <p className="whitespace-pre-wrap break-words text-sm font-medium leading-relaxed">
                      {message.body}
                    </p>
                  ) : null}
                  {message.attachments?.length ? (
                    <div
                      className={`${
                        message.body ? "mt-3" : ""
                      } flex flex-col gap-2`}
                    >
                      {message.attachments.map((attachment) => {
                        const imageLike = isImageMime(attachment.mimeType);
                        const viewHref = resolveAttachmentUrl(attachment);
                        const isOwnBubble = Boolean(style.bubble.includes("bg-[#1a4fdb]"));
                        const tileClass = isOwnBubble
                          ? "border-white/25 bg-white/10 text-white"
                          : "border-zinc-200 bg-white text-zinc-700";

                        return (
                          <div
                            key={attachment.id}
                            className={`flex items-center gap-3 rounded-xl border p-3 ${tileClass}`}
                          >
                            {imageLike && viewHref ? (
                              <a
                                href={viewHref}
                                target="_blank"
                                rel="noreferrer"
                                className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/20"
                              >
                                <img
                                  src={viewHref}
                                  alt={attachment.name}
                                  className="h-full w-full object-cover"
                                />
                              </a>
                            ) : (
                              <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                                  isOwnBubble ? "bg-white/15 text-white" : "bg-zinc-50 text-[#1a4fdb]"
                                }`}
                              >
                                {imageLike ? (
                                  <ImageIcon className="h-6 w-6" />
                                ) : (
                                  <FileText className="h-6 w-6" />
                                )}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {attachment.name}
                              </p>
                              <p
                                className={`mt-0.5 text-xs ${
                                  isOwnBubble ? "text-white/70" : "text-zinc-500"
                                }`}
                              >
                                {attachment.size ? formatFileSize(attachment.size) : "Attachment"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => triggerAttachmentDownload(attachment)}
                              aria-label={`Download ${attachment.name}`}
                              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                isOwnBubble
                                  ? "bg-white/15 text-white hover:bg-white/25"
                                  : "bg-white text-zinc-600 hover:bg-[#1a4fdb] hover:text-white"
                              }`}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {attachments.length > 0 ? (
        <div className="px-6 pt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {attachments.map((item) => (
            <div
              key={item.id}
              className="relative flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3"
            >
              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
                  {isImageMime(item.mimeType) ? (
                    <ImageIcon className="h-6 w-6" />
                  ) : (
                    <FileText className="h-6 w-6" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1 pr-6">
                <p className="truncate text-sm font-semibold text-zinc-800">{item.name}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{formatFileSize(item.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(item.id)}
                aria-label={`Remove ${item.name}`}
                className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="p-4 border-t border-zinc-50 bg-white flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-700 hover:text-[#1a4fdb] transition-colors"
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 text-sm font-medium focus:outline-none placeholder:text-gray-700 bg-transparent"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending}
          aria-label="Send message"
          className="p-2.5 bg-[#1a4fdb] text-white rounded-xl hover:bg-[#1541b8] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}