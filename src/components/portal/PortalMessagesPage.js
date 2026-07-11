"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Menu,
  Paperclip,
  Search,
  Send,
  X,
} from "lucide-react";
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
  if (!downloadHref) return;
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
  } catch (error) {
    toast.error("Unable to start download.");
  }
};

const initialsOf = (name) =>
  String(name || "?")
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const ROLE_TONE_CLASSES = {
  Notary: { avatar: "bg-orange-100 text-orange-700", pill: "bg-orange-100 text-orange-700" },
  Client: { avatar: "bg-blue-100 text-blue-700", pill: "bg-blue-100 text-blue-700" },
  Admin: { avatar: "bg-violet-100 text-violet-700", pill: "bg-violet-100 text-violet-700" },
  "Super Admin": { avatar: "bg-violet-100 text-violet-700", pill: "bg-violet-100 text-violet-700" },
};

const defaultTone = { avatar: "bg-zinc-200 text-zinc-700", pill: "bg-zinc-100 text-zinc-600" };

const ROLE_FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "notaries", label: "Notaries" },
  { id: "clients", label: "Clients" },
  { id: "unread", label: "Unread" },
];

const resolveRoleTone = (role) => ROLE_TONE_CLASSES[role] || defaultTone;

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
  const [activeFilter, setActiveFilter] = useState("all");
  const [conversationsOpen, setConversationsOpen] = useState(false);
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
    const matchesQuery = (conversation) => {
      if (!query) return true;
      return [conversation.title, conversation.orderId, conversation.counterpart?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    };
    const matchesFilter = (conversation) => {
      const role = conversation.counterpart?.role;
      if (activeFilter === "notaries") return role === "Notary";
      if (activeFilter === "clients") {
        // For clients/notaries we treat anything that is NOT a notary as a
        // "client" bucket (covers Admin / Super Admin counterparts too).
        return role !== "Notary";
      }
      if (activeFilter === "unread") {
        return Boolean(conversation.unreadCount && conversation.unreadCount > 0);
      }
      return true;
    };
    return conversations.filter(
      (conversation) => matchesQuery(conversation) && matchesFilter(conversation)
    );
  }, [conversations, search, activeFilter]);

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setConversationsOpen(false);
  };

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

  const renderConversationList = ({ onSelect }) => (
    <>
      <div className="hidden md:block">
        <div className="space-y-5 p-6">
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
          <div className="flex flex-wrap items-center gap-2">
            {ROLE_FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#1a4fdb] text-white shadow-sm"
                      : "bg-white text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="block px-5 pt-4 md:hidden">
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
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ROLE_FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#1a4fdb] text-white shadow-sm"
                    : "bg-white text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {filteredConversations.map((conversation) => {
          const role = conversation.counterpart?.role;
          const tone = resolveRoleTone(role);
          const name = conversation.counterpart?.name || conversation.title;
          const unread = conversation.unreadCount || 0;
          const isActive = currentConversationId === conversation.id;
          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelect ? onSelect(conversation.id) : setActiveConversationId(conversation.id)}
              className={`flex w-full items-start gap-3 rounded-xl border-l-4 px-4 py-3 text-left transition ${
                isActive
                  ? "border-l-[#1a4fdb] bg-white shadow-sm"
                  : "border-l-transparent hover:bg-white/80"
              }`}
            >
              <div className="relative shrink-0">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold ${tone.avatar}`}
                  aria-hidden="true"
                >
                  {initialsOf(name)}
                </span>
                {unread > 0 ? (
                  <span
                    className="absolute -bottom-1 -right-1 grid h-5 min-w-[20px] place-items-center rounded-full border-2 border-white bg-[#1a4fdb] px-1.5 text-[10px] font-bold leading-none text-white shadow"
                    aria-label={`${unread} unread message${unread === 1 ? "" : "s"}`}
                  >
                    {unread > 99 ? "99+" : unread}
                  </span>
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`truncate text-sm ${
                      unread > 0 ? "font-extrabold text-zinc-900" : "font-bold text-zinc-800"
                    }`}
                  >
                    {name}
                  </p>
                  <span className="shrink-0 text-[10px] font-medium text-zinc-400">
                    {formatMessageTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {role ? (
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${tone.pill}`}
                    >
                      {role}
                    </span>
                  ) : null}
                  {conversation.orderId ? (
                    <span className="truncate text-[10px] font-bold uppercase tracking-widest text-[#1a4fdb]">
                      #{conversation.orderId}
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-1.5 truncate text-xs ${
                    unread > 0 ? "font-semibold text-zinc-700" : "text-zinc-500"
                  }`}
                >
                  {conversation.lastMessagePreview || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}

        {filteredConversations.length === 0 ? (
          <p className="px-3 py-8 text-sm text-zinc-500">
            {conversationsStatus === "loading"
              ? "Loading conversations..."
              : activeFilter === "all" && !search
              ? "No conversations available yet."
              : `No conversations match the ${activeFilter} filter.`}
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="relative flex h-[calc(100vh-13rem)] overflow-hidden rounded-[32px] border border-zinc-100 bg-white shadow-sm">
      {/* Mobile backdrop for the right-side conversation drawer */}
      <div
        onClick={() => setConversationsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden ${
          conversationsOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Conversation list — desktop sidebar + mobile right drawer */}
      <aside
        aria-label="Conversations"
        className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col border-l border-zinc-100 bg-zinc-50/40 shadow-xl transition-transform duration-300 ease-out md:static md:inset-auto md:left-auto md:right-auto md:z-auto md:w-80 md:max-w-none md:translate-x-0 md:border-l-0 md:border-r md:bg-zinc-50/40 md:shadow-none ${
          conversationsOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 md:hidden">
          <h2 className="text-lg font-bold text-zinc-900">Conversations</h2>
          <button
            type="button"
            onClick={() => setConversationsOpen(false)}
            aria-label="Close conversations"
            className="grid h-9 w-9 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {renderConversationList({ onSelect: handleSelectConversation })}
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setConversationsOpen(true)}
              aria-label="Open conversations"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-zinc-900 sm:text-lg">
                {activeConversation?.counterpart?.name || "Select a conversation"}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-gray-700">
                {activeConversation?.counterpart?.role || roleLabel}
              </p>
            </div>
          </div>
          {activeConversation?.orderId ? (
            <Link
              href={
                roleLabel === "Notary"
                  ? `/dashboard-notary/assignments-orders/${activeConversation.orderId}`
                  : `/dashboard-client/orders/${activeConversation.orderId}`
              }
              className="shrink-0 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 sm:px-4 sm:text-sm"
            >
              View Order
            </Link>
          ) : null}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-zinc-50/30 p-3 sm:p-6">
          {messages.map((message) => {
            const isOwn = Boolean(message.isOwnMessage);
            const wrapperClass = isOwn ? "flex justify-end" : "flex justify-start";
            const bubbleClass = isOwn
              ? "rounded-2xl rounded-tr-sm bg-[#1a4fdb] text-white shadow-sm"
              : "rounded-2xl rounded-tl-sm border border-zinc-200 bg-white text-zinc-800 shadow-sm";
            const metaTextClass = isOwn ? "text-[#1a4fdb]" : "text-zinc-500";

            return (
              <div key={message.id} className={`${wrapperClass} mb-5`}>
                <div className="flex max-w-[80%] flex-col gap-1.5">
                  <p
                    className={`px-2 text-[10px] font-bold uppercase tracking-widest ${metaTextClass} ${isOwn ? "text-right" : "text-left"}`}
                  >
                    {message.senderName}
                    <span className="ml-2 font-medium tracking-normal text-zinc-400">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </p>
                  <div className={`${bubbleClass} p-4`}>
                    {message.body ? (
                      <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                        {message.body}
                      </p>
                    ) : null}
                    {message.attachments?.length ? (
                      <div className={`${message.body ? "mt-3" : ""} flex flex-col gap-2`}>
                        {message.attachments.map((attachment) => {
                          const imageLike = isImageMime(attachment.mimeType);
                          const viewHref = resolveAttachmentUrl(attachment);
                          const tileClass = isOwn
                            ? "border-white/25 bg-white/10 text-white"
                            : "border-zinc-200 bg-zinc-50 text-zinc-700";

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
                                  className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/20"
                                >
                                  <img
                                    src={viewHref}
                                    alt={attachment.name}
                                    className="h-full w-full object-cover"
                                  />
                                </a>
                              ) : (
                                <div
                                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${
                                    isOwn ? "bg-white/15" : "bg-white text-zinc-500"
                                  }`}
                                >
                                  {imageLike ? (
                                    <ImageIcon className="h-7 w-7" />
                                  ) : (
                                    <FileText className="h-7 w-7" />
                                  )}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                  {attachment.name}
                                </p>
                                <p
                                  className={`mt-0.5 text-xs ${
                                    isOwn ? "text-white/70" : "text-zinc-500"
                                  }`}
                                >
                                  {attachment.size
                                    ? formatFileSize(attachment.size)
                                    : "Attachment"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => triggerAttachmentDownload(attachment)}
                                aria-label={`Download ${attachment.name}`}
                                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                  isOwn
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

          {messages.length === 0 ? (
            <p className="text-sm text-gray-700">
              {messagesStatus === "loading" ? "Loading messages..." : "No messages yet. Start the conversation."}
            </p>
          ) : null}
        </div>

        <div className="border-t border-zinc-100 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="shrink-0 rounded-xl border border-zinc-200 p-3 text-gray-700 hover:bg-zinc-50">
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
              className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] sm:px-4"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={messageActionStatus === "loading"}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#1a4fdb] px-4 py-3 text-sm font-bold text-white sm:px-5"
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
