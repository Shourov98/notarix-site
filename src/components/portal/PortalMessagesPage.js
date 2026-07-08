"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, Image as ImageIcon, Paperclip, Search, Send, X } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { buildAssetUrl, buildApiOrigin } from "@/lib/siteApi";
import {
  fetchPortalConversationByOrder,
  fetchPortalConversations,
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

export default function PortalMessagesPage({ roleLabel = "Portal" }) {
  const dispatch = useAppDispatch();
  const {
    conversations,
    conversationsStatus,
    activeConversation,
    messages,
    messagesStatus,
    messageActionStatus,
  } = useAppSelector(selectSitePortal);

  const searchParams = useSearchParams();
  const [activeConversationId, setActiveConversationId] = useState("");
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [search, setSearch] = useState("");
  const currentConversationId = activeConversationId || conversations[0]?.id || "";
  const socketRef = useRef(null);
  const socketUrl = buildApiOrigin();
  const orderId = searchParams.get("order");

  useEffect(() => {
    dispatch(fetchPortalConversations());
  }, [dispatch]);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    dispatch(fetchPortalConversationByOrder(orderId))
      .unwrap()
      .then((conversation) => {
        if (conversation?.id) {
          setActiveConversationId(conversation.id);
        }
      })
      .catch(() => {});
  }, [dispatch, orderId]);

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [socketUrl]);

  useEffect(() => {
    if (currentConversationId) {
      dispatch(fetchPortalMessages(currentConversationId));
    }
  }, [dispatch, currentConversationId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !currentConversationId) {
      return undefined;
    }

    socket.emit("join_conversation", currentConversationId);

    const handleNewMessage = (message) => {
      if (message?.conversationId !== currentConversationId) {
        return;
      }

      dispatch(fetchPortalMessages(currentConversationId));
      dispatch(fetchPortalConversations());
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [currentConversationId, dispatch]);

  useEffect(() => {
    messages
      .filter((message) => !message.isRead)
      .forEach((message) => {
        dispatch(markPortalMessageRead(message.id));
      });
  }, [dispatch, messages]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) =>
      [conversation.title, conversation.orderId, conversation.counterpart?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [conversations, search]);

  const handleSend = async () => {
    if (!currentConversationId) return;
    if (!draft.trim() && attachments.length === 0) {
      toast.error("Write a message or add an attachment first.");
      return;
    }

    try {
      if (attachments.length > 0) {
        await dispatch(
          uploadPortalAttachments({
            conversationId: currentConversationId,
            files: attachments.map((item) => item.file),
            body: draft.trim(),
          })
        ).unwrap();
      } else {
        await dispatch(
          sendPortalMessage({
            conversationId: currentConversationId,
            body: draft.trim(),
          })
        ).unwrap();
      }

      await dispatch(fetchPortalMessages(currentConversationId));
      await dispatch(fetchPortalConversations());
      attachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      setDraft("");
      setAttachments([]);
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || error?.payload?.message || "Unable to send message.";
      toast.error(message);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const next = files.map((file) => ({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      previewUrl: isImageMime(file.type) ? URL.createObjectURL(file) : null,
    }));
    setAttachments(next);
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

  return (
    <div className="flex h-[calc(100vh-13rem)] overflow-hidden rounded-[32px] border border-zinc-100 bg-white shadow-sm">
      <aside className="w-80 shrink-0 border-r border-zinc-100 bg-zinc-50/40">
        <div className="space-y-6 p-6">
          <h2 className="text-2xl font-bold text-zinc-900">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb]"
            />
          </div>
        </div>

        <div className="overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveConversationId(conversation.id)}
              className={`w-full border-l-4 px-6 py-4 text-left transition ${
                currentConversationId === conversation.id
                  ? "border-l-[#1a4fdb] bg-white"
                  : "border-l-transparent hover:bg-white/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-zinc-900">
                    {conversation.counterpart?.name || conversation.title}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#1a4fdb]">
                    #{conversation.orderId}
                  </p>
                  <p className="mt-2 truncate text-xs text-gray-700">
                    {conversation.lastMessagePreview || "No messages yet"}
                  </p>
                </div>
                <span className="text-[10px] font-medium text-gray-700">
                  {formatMessageTime(conversation.lastMessageAt)}
                </span>
              </div>
            </button>
          ))}

          {filteredConversations.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-700">
              {conversationsStatus === "loading" ? "Loading conversations..." : "No conversations available yet."}
            </p>
          ) : null}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
          <div>
            <p className="text-lg font-bold text-zinc-900">
              {activeConversation?.counterpart?.name || "Select a conversation"}
            </p>
            <p className="mt-1 text-xs font-medium text-gray-700">
              {activeConversation?.counterpart?.role || roleLabel}
            </p>
          </div>
          {activeConversation?.orderId ? (
            <Link
              href={
                roleLabel === "Notary"
                  ? `/dashboard-notary/assignments-orders/${activeConversation.orderId}`
                  : `/dashboard-client/orders/${activeConversation.orderId}`
              }
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-700"
            >
              View Order
            </Link>
          ) : null}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-zinc-50/20 p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={message.isOwnMessage ? "ml-auto max-w-[80%]" : "max-w-[80%]"}
            >
              <p className={`mb-2 text-[10px] font-bold uppercase tracking-widest ${message.isOwnMessage ? "text-right text-[#1a4fdb]" : "text-gray-700"}`}>
                {message.senderName} • {formatMessageTime(message.createdAt)}
              </p>
              <div
                className={`rounded-2xl p-4 ${
                  message.isOwnMessage
                    ? "rounded-tr-sm bg-[#1a4fdb] text-white"
                    : "rounded-tl-sm border border-zinc-200 bg-zinc-100 text-zinc-700"
                }`}
              >
                {message.body ? <p className="text-sm leading-relaxed">{message.body}</p> : null}
                {message.attachments?.length ? (
                  <div className={`${message.body ? "mt-3" : ""} grid grid-cols-1 gap-2 sm:grid-cols-2`}>
                    {message.attachments.map((attachment) => {
                      const imageLike = isImageMime(attachment.mimeType);
                      const href = attachment.url ? buildAssetUrl(attachment.url) : null;
                      const containerClass = `flex items-center gap-3 rounded-xl border p-3 ${
                        message.isOwnMessage
                          ? "border-white/25 bg-white/10 text-white"
                          : "border-zinc-200 bg-white text-zinc-700"
                      }`;
                      const inner = (
                        <>
                          {imageLike && attachment.url ? (
                            <img
                              src={buildAssetUrl(attachment.url)}
                              alt={attachment.name}
                              className="h-12 w-12 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${
                                message.isOwnMessage ? "bg-white/15" : "bg-zinc-100"
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
                            <p className="truncate text-sm font-semibold">{attachment.name}</p>
                            <p
                              className={`mt-0.5 text-xs ${
                                message.isOwnMessage ? "text-white/70" : "text-zinc-500"
                              }`}
                            >
                              {attachment.size ? formatFileSize(attachment.size) : "Attachment"}
                            </p>
                          </div>
                        </>
                      );
                      return href ? (
                        <a
                          key={attachment.id}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className={containerClass}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div key={attachment.id} className={containerClass}>
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {messages.length === 0 ? (
            <p className="text-sm text-gray-700">
              {messagesStatus === "loading" ? "Loading messages..." : "No messages yet. Start the conversation."}
            </p>
          ) : null}
        </div>

        <div className="border-t border-zinc-100 p-4">
          <div className="flex items-center gap-3">
            <label className="rounded-xl border border-zinc-200 p-3 text-gray-700 hover:bg-zinc-50">
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb]"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={messageActionStatus === "loading"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1a4fdb] px-5 py-3 text-sm font-bold text-white"
            >
              Send
              <Send className="h-4 w-4" />
            </button>
          </div>
          {attachments.length > 0 ? (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
        </div>
      </section>
    </div>
  );
}
