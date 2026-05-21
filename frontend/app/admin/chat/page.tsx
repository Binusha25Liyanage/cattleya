"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useSocket } from "@/lib/socket";
import { useAdminChatStore } from "@/store/adminChatStore";
import { ChatStats } from "@/components/chat/ChatStats";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { QuickRepliesPanel } from "@/components/chat/QuickRepliesPanel";
import { OnlineIndicator } from "@/components/chat/OnlineIndicator";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { MessageSquare, Search, Circle, MoreVertical, Paperclip, Send, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import type { ChatConversation, ChatMessage, ConversationStatus } from "@/types";

function formatDayLabel(dateString: string) {
  const date = new Date(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function AdminChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { socket } = useSocket();
  const [openQuickReplies, setOpenQuickReplies] = useState(false);
  const [draft, setDraft] = useState("");
  const [stats, setStats] = useState({ openCount: 0, totalToday: 0, avgResponseTime: "-", unresolvedCount: 0 });
  const [searchText, setSearchText] = useState("");
  const [activeSidebar, setActiveSidebar] = useState(true);

  const {
    conversations,
    activeConversationId,
    messages,
    totalUnread,
    onlineCustomers,
    typingCustomers,
    isLoadingConversations,
    isLoadingMessages,
    filter,
    setConversations,
    setActiveConversation,
    setMessages,
    setTotalUnread,
    setCustomerOnline,
    setCustomerTyping,
    markConversationRead,
    setLoadingConversations,
    setLoadingMessages,
    setFilter,
    setSearchQuery,
  } = useAdminChatStore();

  const activeConversation = useMemo(() => conversations.find((conv) => conv.id === activeConversationId) ?? null, [conversations, activeConversationId]);
  const activeMessages = useMemo(() => (activeConversationId ? messages[activeConversationId] ?? [] : []), [messages, activeConversationId]);
  const customerOnline = activeConversation ? onlineCustomers.has(activeConversation.customerId) : false;
  const customerTyping = activeConversation ? typingCustomers[activeConversation.id] : false;

  const loadStats = async () => {
    try {
      const response = await api.get<{ success: true; data: typeof stats }>('/chat/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadConversations = async (query = searchText, status = filter) => {
    setLoadingConversations(true);
    try {
      const response = await api.get<{ success: true; data: { conversations: ChatConversation[] } }>('/chat/conversations', {
        params: { search: query || undefined, status: status !== 'ALL' ? status : undefined, limit: 50 },
      });
      setConversations(response.data.data.conversations);
      setTotalUnread(response.data.data.conversations.reduce((sum, conv) => sum + conv.unreadByAdmin, 0));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversation = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const response = await api.get<{ success: true; data: ChatConversation }>(`/chat/conversations/${conversationId}`);
      const conversationData = response.data.data;
      setMessages(conversationId, conversationData.messages ?? []);
      setActiveConversation(conversationId);
      setDraft("");
      if (socket) {
        socket.emit("chat:join", { conversationId });
      }
      await api.put(`/chat/conversations/${conversationId}/read`);
      socket?.emit("chat:read", { conversationId });
      markConversationRead(conversationId);
      router.replace(`/admin/chat?id=${conversationId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const onSelectConversation = (conversationId: string) => {
    if (conversationId === activeConversationId) return;
    loadConversation(conversationId);
  };

  const handleSend = async () => {
    if (!draft.trim() || !activeConversationId) return;
    const content = draft.trim();
    setDraft("");
    setMessages(activeConversationId, [
      ...(messages[activeConversationId] ?? []),
      {
        id: `temp-${Date.now()}`,
        conversationId: activeConversationId,
        senderId: "local",
        senderRole: "ADMIN",
        content,
        messageType: "TEXT",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    socket?.emit("chat:message", { conversationId: activeConversationId, content, messageType: "TEXT" });
  };

  const updateStatus = async (status: ConversationStatus) => {
    if (!activeConversationId) return;
    try {
      const response = await api.put<{ success: true; data: ChatConversation }>(`/chat/conversations/${activeConversationId}/status`, { status });
      setConversations(conversations.map((conv) => (conv.id === activeConversationId ? response.data.data : conv)));
      toast.success(`Conversation marked ${status.toLowerCase()}`);
      socket?.emit("chat:status-changed", { conversationId: activeConversationId, status });
    } catch (error) {
      toast.error("Unable to update status.");
      console.error(error);
    }
  };

  const insertQuickReply = (text: string) => {
    setDraft((prev) => `${prev}${prev ? "\n" : ""}${text}`);
  };

  useEffect(() => {
    loadConversations();
    loadStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("chat:new-message-admin", (payload: { conversationId: string; customerName: string; preview: string; unreadCount: number }) => {
      toast(`${payload.customerName}: ${payload.preview}`, {
        icon: "💬",
      });
      loadConversations();
    });
    socket.on("chat:typing", (payload: { conversationId: string; isTyping: boolean }) => {
      setCustomerTyping(payload.conversationId, payload.isTyping);
    });
    socket.on("chat:online-status", (payload: { userId: string; role: string; isOnline: boolean }) => {
      if (payload.role === "CUSTOMER") {
        setCustomerOnline(payload.userId, payload.isOnline);
      }
    });
    socket.on("chat:message", (payload: { message: ChatMessage; conversationId: string }) => {
      if (!messages[payload.conversationId]) {
        loadConversations();
      } else {
        setMessages(payload.conversationId, [...(messages[payload.conversationId] ?? []), payload.message]);
      }
      if (payload.conversationId !== activeConversationId) {
        loadConversations();
      }
    });

    return () => {
      socket.off("chat:new-message-admin");
      socket.off("chat:typing");
      socket.off("chat:online-status");
      socket.off("chat:message");
    };
  }, [socket, messages, activeConversationId]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      loadConversation(id);
    }
  }, [searchParams]);

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr_280px]">
      <section className="rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-xl font-heading text-[#D0021B]">Chat Inbox</div>
            <div className="text-sm text-[#6B6B6B]">{stats.openCount} open | {stats.totalToday} today | {totalUnread} unread</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F5] px-3 py-2 text-sm text-[#1A1A1A]">
            <MessageSquare className="h-4 w-4 text-[#D0021B]" /> Inbox
          </div>
        </div>
        <div className="mb-4 rounded-3xl bg-[#F5F5F5] p-3">
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-white px-3 py-2">
            <Search className="h-4 w-4 text-[#6B6B6B]" />
            <input value={searchText} onChange={(event) => setSearchText(event.target.value)} onBlur={() => { setSearchQuery(searchText); loadConversations(searchText, filter); }} placeholder="Search customers" className="w-full bg-transparent text-sm text-[#1A1A1A] outline-none" />
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {(["ALL", "OPEN", "RESOLVED", "CLOSED"] as const).map((option) => (
              <button key={option} type="button" onClick={() => { setFilter(option); loadConversations(searchText, option); }} className={`rounded-full px-3 py-2 ${filter === option ? "bg-[#D0021B] text-white" : "bg-white text-[#6B6B6B]"}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 rounded-3xl bg-[#F5F5F5] p-4 text-sm text-[#6B6B6B]">
          <div>{stats.openCount} open</div>
          <div>{stats.totalToday} today</div>
          <div>{totalUnread} unread</div>
        </div>
        <div className="space-y-3 overflow-y-auto pb-2" style={{ maxHeight: "calc(100vh - 320px)" }}>
          {conversations.map((conversation) => {
            const unread = conversation.unreadByAdmin;
            return (
              <button key={conversation.id} type="button" onClick={() => onSelectConversation(conversation.id)} className={`w-full rounded-3xl border px-4 py-4 text-left transition ${activeConversationId === conversation.id ? "border-[#D0021B] bg-[#FFF1F2]" : "border-transparent bg-white hover:border-[#D0021B]/30"}`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${unread > 0 ? "border-[#D0021B]" : "border-[#E8E8E8]"} bg-white text-sm font-semibold text-[#1A1A1A]`}>
                    {conversation.customerId.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium text-[#1A1A1A]">{conversation.customer?.name || conversation.subject || "Customer chat"}</div>
                      <div className="text-[11px] text-[#6B6B6B]">{conversation.lastMessageAt ? formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true }) : "New"}</div>
                    </div>
                    <div className="mt-1 text-sm text-[#6B6B6B] line-clamp-1">{conversation.lastMessage || "No message yet"}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                    <Circle className={`h-2.5 w-2.5 ${conversation.status === "OPEN" ? "text-[#00C853]" : conversation.status === "RESOLVED" ? "text-[#B0B0B0]" : "text-[#4B4B4B]"}`} />
                    {conversation.status.toLowerCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    {onlineCustomers.has(conversation.customerId) ? <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#00C853] animate-pulse" /> : null}
                    {unread > 0 ? <span className="rounded-full bg-[#D0021B] px-2 py-0.5 text-[11px] text-white">{unread}</span> : null}
                  </div>
                </div>
              </button>
            );
          })}
          {!conversations.length && !isLoadingConversations ? <div className="rounded-3xl bg-[#F5F5F5] p-6 text-center text-[#6B6B6B]">No conversations yet</div> : null}
        </div>
      </section>
      <section className="rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
        {!activeConversation ? (
          <div className="flex h-[calc(100vh-96px)] flex-col items-center justify-center gap-5 text-center text-[#6B6B6B]">
            <div className="text-[80px] font-semibold text-[#D0021B] opacity-30">C</div>
            <div className="text-2xl font-heading">Select a conversation to start chatting</div>
            <ChatStats openConversations={stats.openCount} avgResponseTime={stats.avgResponseTime} resolvedToday={stats.totalToday} unreadCount={totalUnread} />
          </div>
        ) : (
          <div className="flex h-[calc(100vh-96px)] flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E8E8] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D0021B] bg-[#FFF1F2] text-lg text-[#D0021B]">{activeConversation.customer?.name?.slice(0, 2).toUpperCase() ?? activeConversation.customerId.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="text-lg font-heading text-[#1A1A1A]">{activeConversation.customer?.name || activeConversation.subject || "Customer Conversation"}</div>
                  <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                    <OnlineIndicator isOnline={customerOnline} />
                    {customerOnline ? "Online" : "Last seen recently"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select value={activeConversation.status} onChange={(event) => updateStatus(event.target.value as ConversationStatus)} className="rounded-2xl border border-[#E8E8E8] bg-[#F5F5F5] px-4 py-2 text-sm text-[#1A1A1A]">
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <button type="button" onClick={() => setActiveSidebar((state) => !state)} className="rounded-2xl border border-[#E8E8E8] bg-white px-3 py-2 text-sm text-[#1A1A1A]">{activeSidebar ? "Hide info" : "Show info"}</button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden bg-[#F5F5F5] p-4">
              <div className="h-full overflow-y-auto pr-3">
                {activeMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-[#6B6B6B]">No messages yet.</div>
                ) : (
                  Object.entries(activeMessages.reduce<Record<string, ChatMessage[]>>((group, message) => {
                    const label = formatDayLabel(message.createdAt);
                    group[label] = group[label] ? [...group[label], message] : [message];
                    return group;
                  }, {})).map(([day, dayMessages]) => (
                    <div key={day} className="space-y-3">
                      <div className="mx-auto mb-3 inline-flex rounded-full bg-[#E8E8E8] px-3 py-1 text-[11px] text-[#6B6B6B]">{day}</div>
                      {dayMessages.map((message) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isOwn={message.senderRole === "ADMIN"}
                          showAvatar={message.senderRole === "CUSTOMER"}
                          senderName={message.senderRole === "CUSTOMER" ? "Customer" : undefined}
                          status={message.isRead ? "read" : "sent"}
                          onImageClick={(url) => window.open(url, "_blank")}
                        />
                      ))}
                    </div>
                  ))
                )}
                {customerTyping ? <TypingIndicator /> : null}
              </div>
            </div>
            <div className="rounded-3xl border border-[#E8E8E8] bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[#1A1A1A]">Reply to customer</div>
                <button type="button" onClick={() => setOpenQuickReplies((state) => !state)} className="rounded-full border border-[#E8E8E8] px-3 py-2 text-sm text-[#1A1A1A]">Quick replies</button>
              </div>
              {openQuickReplies ? <QuickRepliesPanel onSelect={insertQuickReply} /> : null}
              <div className="mt-3 flex items-center gap-2 rounded-3xl bg-[#F5F5F5] p-3">
                <button type="button" className="rounded-full p-2 text-[#6B6B6B] hover:text-[#D0021B]">
                  <Paperclip className="h-5 w-5" />
                </button>
                <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && event.ctrlKey) { event.preventDefault(); handleSend(); } }} placeholder="Reply to customer..." className="min-h-[96px] flex-1 resize-none rounded-3xl bg-[#F5F5F5] px-4 py-3 text-sm text-[#1A1A1A] outline-none" />
                <button type="button" onClick={handleSend} className="inline-flex h-12 items-center justify-center rounded-full bg-[#D0021B] px-4 text-sm font-semibold text-white hover:bg-[#b0011a]">Send</button>
              </div>
            </div>
          </div>
        )}
      </section>
      <aside className={`rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm transition-all ${activeSidebar ? "block" : "hidden"}`}>
        {activeConversation ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D0021B] bg-[#FFF1F2] text-3xl text-[#D0021B]">{activeConversation.customer?.name?.slice(0, 2).toUpperCase() ?? activeConversation.customerId.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="text-lg font-heading">{activeConversation.customer?.name || "Customer"}</div>
                <div className="text-sm text-[#6B6B6B]">{activeConversation.customer?.email || activeConversation.customerId}</div>
              </div>
            </div>
            <div className="rounded-3xl bg-[#F5F5F5] p-4 text-sm text-[#6B6B6B]">
              <div>Started: {new Date(activeConversation.createdAt).toLocaleDateString()}</div>
              <div>Status: {activeConversation.status}</div>
              <div>Total messages: {activeMessages.length}</div>
            </div>
            <button type="button" className="w-full rounded-2xl border border-[#D0021B] px-4 py-3 text-sm font-semibold text-[#D0021B]">View Full Profile</button>
            <button type="button" className="w-full rounded-2xl bg-[#D0021B] px-4 py-3 text-sm font-semibold text-white">View Orders</button>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-[#6B6B6B]">
            <div className="text-[72px] font-semibold text-[#D0021B] opacity-30">C</div>
            <div className="text-lg font-heading">Customer details</div>
            <div>Select a conversation to view profile and order history.</div>
          </div>
        )}
      </aside>
    </div>
  );
}
