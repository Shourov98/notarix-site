"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Eye,
  Loader2,
  Paperclip,
  Search,
  Send,
  ShieldAlert,
} from "lucide-react";
import { requestPortalJson } from "@/lib/portal-api";

const formatDateTime = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "NA";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedThread, setSelectedThread] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadConversations = async () => {
      setLoadingConversations(true);
      setError("");

      try {
        const result = await requestPortalJson("/conversations");
        if (!cancelled) {
          const items = Array.isArray(result) ? result : [];
          setConversations(items);
          setSelectedId(items[0]?.id || "");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load conversations.");
        }
      } finally {
        if (!cancelled) {
          setLoadingConversations(false);
        }
      }
    };

    loadConversations();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedThread(null);
      return;
    }

    let cancelled = false;

    const loadThread = async () => {
      setLoadingThread(true);
      setError("");

      try {
        const result = await requestPortalJson(`/conversations/${selectedId}/messages`);
        if (!cancelled) {
          setSelectedThread(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load selected conversation.");
        }
      } finally {
        if (!cancelled) {
          setLoadingThread(false);
        }
      }
    };

    loadThread();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === selectedId) || null,
    [conversations, selectedId]
  );

  const sendMessage = async () => {
    const body = draft.trim();
    if (!body || !selectedId) return;

    setSending(true);
    setError("");

    try {
      await requestPortalJson(`/conversations/${selectedId}/messages`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });
      setDraft("");
      const refreshed = await requestPortalJson(`/conversations/${selectedId}/messages`);
      setSelectedThread(refreshed);
      const items = await requestPortalJson("/conversations");
      setConversations(Array.isArray(items) ? items : []);
    } catch (sendError) {
      setError(sendError.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-13rem)] overflow-hidden rounded-[32px] border border-zinc-100 bg-white shadow-sm">
      <div className="flex w-80 shrink-0 flex-col border-r border-zinc-100 bg-zinc-50/30">
        <div className="space-y-6 p-6">
          <h2 className="text-2xl font-bold text-zinc-900">Messages</h2>
          <div className="group relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
              disabled
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="flex items-center justify-center gap-3 px-6 py-16 text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading conversations...
            </div>
          ) : conversations.length ? (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedId(conversation.id)}
                className={`flex w-full gap-3 p-4 text-left transition-colors ${
                  conversation.id === selectedId
                    ? "border-l-4 border-l-[#1a4fdb] bg-white"
                    : "border-l-4 border-l-transparent hover:bg-white"
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 font-bold text-zinc-700">
                  {initials(conversation.counterpart?.name || conversation.title)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="truncate text-sm font-bold text-zinc-900">
                      {conversation.counterpart?.name || conversation.title}
                    </h4>
                    <span className="text-[10px] font-medium text-zinc-400">
                      {formatDateTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      Order
                    </span>
                    <span className="text-[10px] font-bold text-[#1a4fdb]">
                      #{conversation.orderId}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-xs text-zinc-500">
                    {conversation.lastMessagePreview || "No messages yet"}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-bold text-zinc-900">No conversations yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                Conversation threads will appear when an order chat exists.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-white">
        {error ? (
          <div className="border-b border-rose-100 bg-rose-50 px-6 py-3 text-sm text-rose-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        ) : null}

        {activeConversation ? (
          <>
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-zinc-100 px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 font-bold text-zinc-700">
                  {initials(activeConversation.counterpart?.name || activeConversation.title)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold leading-none text-zinc-900">
                      {activeConversation.counterpart?.name || activeConversation.title}
                    </h3>
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-blue-600">
                      {activeConversation.counterpart?.role || "Participant"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1a4fdb]">
                      #{activeConversation.orderId}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard-client/orders/${activeConversation.orderId}`}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
              >
                <Eye className="h-4 w-4" />
                View Order
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 border-b border-zinc-100 bg-zinc-100/50 px-6 py-2.5">
              <ShieldAlert className="h-4 w-4 text-orange-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Files and messages are loaded from the secured backend conversation.
              </span>
            </div>

            <div className="flex-1 overflow-y-auto bg-zinc-50/20 p-6">
              {loadingThread ? (
                <div className="flex items-center justify-center gap-3 py-16 text-zinc-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading thread...
                </div>
              ) : selectedThread?.messages?.length ? (
                <div className="space-y-5">
                  {selectedThread.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] ${message.isOwnMessage ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${message.isOwnMessage ? "text-[#1a4fdb]" : "text-zinc-400"}`}>
                          {message.senderName} • {formatDateTime(message.createdAt)}
                        </span>
                        <div
                          className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                            message.isOwnMessage
                              ? "rounded-tr-sm bg-[#1a4fdb] text-white"
                              : "rounded-tl-sm border border-zinc-200/50 bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {message.body || "Attachment only"}
                        </div>
                        {message.attachments?.length ? (
                          <div className="mt-1 space-y-2">
                            {message.attachments.map((attachment) => (
                              <a
                                key={attachment.id}
                                href={attachment.downloadUrl || attachment.url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                              >
                                {attachment.name}
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-lg font-bold text-zinc-900">No messages yet</p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Start the conversation here when you’re ready.
                  </p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3 border-t border-zinc-100 bg-white p-4">
              <button className="rounded-xl border border-zinc-200 p-3 text-zinc-500" disabled>
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm transition-all focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={sending || !draft.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#1a4fdb] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <div>
              <p className="text-xl font-bold text-zinc-900">No active conversation</p>
              <p className="mt-2 text-sm text-zinc-500">
                Select a real conversation from the left, or create an order to start one later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
