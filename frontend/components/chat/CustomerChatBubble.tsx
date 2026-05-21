"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Paperclip, Send, X, Minus } from "lucide-react";
import { api } from "@/lib/api";
import { useSocket } from "@/lib/socket";
import { useUserStore } from "@/store/userStore";
import { useChatStore } from "@/store/chatStore";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { FilePreview } from "@/components/chat/FilePreview";
import { ImageLightbox } from "@/components/chat/ImageLightbox";
import { OnlineIndicator } from "@/components/chat/OnlineIndicator";
import { isToday, isYesterday } from "date-fns";
import toast from "react-hot-toast";
import type { ChatConversation, ChatMessage, ConversationStatus } from "@/types";

const SUBJECT_OPTIONS = ["Order inquiry", "Product question", "AI design", "Other"];
const MAX_MESSAGE_LENGTH = 1000;

function formatDayLabel(dateString: string) {
  const date = new Date(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function CustomerChatBubble() {
  const user = useUserStore((state) => state.user);
  const { socket } = useSocket();
  const [subject, setSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [welcomeActive, setWelcomeActive] = useState(true);
  const [hasConnectionIssue, setHasConnectionIssue] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const {
    isOpen,
    conversation,
    messages,
    unreadCount,
    isAdminOnline,
    isTyping,
    hasMoreMessages,
    currentPage,
    totalPages,
    open,
    close,
    setConversation,
    addMessage,
    prependMessages,
    setUnreadCount,
    clearUnread,
    setAdminOnline,
    setTyping,
    markAsRead,
    setLoading,
    setSending,
    setPage,
    setTotalPages,
  } = useChatStore();

  const groupedMessages = useMemo(() => {
    return messages.reduce<Record<string, ChatMessage[]>>((groups, message) => {
      const label = formatDayLabel(message.createdAt);
      groups[label] = groups[label] ? [...groups[label], message] : [message];
      return groups;
    }, {});
  }, [messages]);

  const messageList = useMemo(() => {
    if (messages.length > 200) {
      return messages.slice(messages.length - 200);
    }
    return messages;
  }, [messages]);

  const openChat = () => {
    open();
    setWelcomeActive(true);
  };

  const closeChat = () => {
    close();
    setTyping(false);
  };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const fetchConversation = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get<{ success: true; data: ChatConversation | null }>('/chat/conversations/mine');
      const conversationData = response.data.data;
      if (conversationData) {
        setConversation(conversationData);
        setWelcomeActive(false);
        setUnreadCount(conversationData.unreadByCustomer || 0);
        setTimeout(scrollToBottom, 100);
        joinRoom(conversationData.id);
        await api.put(`/chat/conversations/${conversationData.id}/read`);
        socket?.emit("chat:read", { conversationId: conversationData.id });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = (conversationId: string) => {
    if (!socket || !conversationId) return;
    socket.emit("chat:join", { conversationId });
  };

  const loadMoreMessages = async () => {
    if (!conversation || currentPage >= totalPages || loadingMessages) return;
    setLoadingMessages(true);
    try {
      const nextPage = currentPage + 1;
      const response = await api.get<{ success: true; data: { messages: ChatMessage[]; totalPages: number; currentPage: number } }>(`/chat/conversations/${conversation.id}/messages`, {
        params: { page: nextPage, limit: 50 },
      });
      prependMessages(response.data.data.messages);
      setPage(response.data.data.currentPage);
      setTotalPages(response.data.data.totalPages);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 180;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const createNewConversation = async (subjectValue?: string) => {
    if (!user) return null;
    const response = await api.post<{ success: true; data: ChatConversation }>('/chat/conversations', { subject: subjectValue });
    setConversation(response.data.data);
    setWelcomeActive(false);
    setUnreadCount(0);
    joinRoom(response.data.data.id);
    return response.data.data;
  };

  const handleSendText = async () => {
    if (!draft.trim()) return;
    const combined = draft.trim();
    if (combined.length > MAX_MESSAGE_LENGTH) {
      toast.error("Please shorten your message to 1000 characters.");
      return;
    }

    let conversationId = conversation?.id;
    if (!conversationId) {
      const created = await createNewConversation(selectedSubject || subject);
      conversationId = created?.id;
    }

    if (!conversationId) return;

    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderId: user?.id || "",
      senderRole: "CUSTOMER",
      content: combined,
      messageType: "TEXT",
      isRead: false,
      createdAt: new Date().toISOString(),
      isFailed: false,
    };

    addMessage(optimisticMessage);
    setDraft("");
    scrollToBottom();

    try {
      socket?.emit("chat:message", { conversationId, content: combined, messageType: "TEXT" });
    } catch (error) {
      toast.error("Message failed to send. Tap retry.");
      addMessage({ ...optimisticMessage, isFailed: true });
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      toast.error("Only images, PDF and Word documents are supported.");
      return;
    }

    let conversationId = conversation?.id;
    if (!conversationId) {
      const created = await createNewConversation(selectedSubject || subject);
      conversationId = created?.id;
    }

    if (!conversationId) return;
    const form = new FormData();
    form.append("file", file);

    try {
      const response = await api.post<{ success: true; data: ChatMessage }>(`/chat/conversations/${conversationId}/files`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addMessage(response.data.data);
      setFiles([]);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error(error);
    }
  };

  const handleRead = async () => {
    if (!conversation) return;
    try {
      await api.put(`/chat/conversations/${conversation.id}/read`);
      socket?.emit("chat:read", { conversationId: conversation.id });
      markAsRead();
      clearUnread();
    } catch {
      console.error("Unable to mark messages read");
    }
  };

  const handleRetry = (message: ChatMessage) => {
    if (!conversation) return;
    socket?.emit("chat:message", { conversationId: conversation.id, content: message.content || "", messageType: "TEXT" });
  };

  useEffect(() => {
    if (!isOpen || !user) return;
    fetchConversation();
  }, [isOpen, user]);

  useEffect(() => {
    const statusHandler = () => setHasConnectionIssue(false);
    const connectHandler = () => setHasConnectionIssue(false);
    if (!socket) return;

    socket.on("connect_error", () => setHasConnectionIssue(true));
    socket.on("disconnect", () => setHasConnectionIssue(true));
    socket.on("connect", connectHandler);
    socket.on("chat:message", (payload: { message: ChatMessage; conversationId: string }) => {
      if (payload.conversationId !== conversation?.id) return;
      addMessage(payload.message);
      if (payload.message.senderRole === "ADMIN") {
        handleRead();
      }
    });

    socket.on("chat:typing", (payload: { conversationId: string; isTyping: boolean; senderName: string }) => {
      if (payload.conversationId !== conversation?.id) return;
      setTyping(payload.isTyping);
    });

    socket.on("chat:read", (payload: { conversationId: string; readBy: string }) => {
      if (payload.conversationId !== conversation?.id) return;
      markAsRead();
    });

    socket.on("chat:status-changed", (payload: { conversationId: string; status: ConversationStatus }) => {
      if (payload.conversationId !== conversation?.id) return;
      if (conversation) setConversation({ ...conversation, status: payload.status });
    });

    socket.on("chat:online-status", (payload: { userId: string; role: string; isOnline: boolean }) => {
      if (payload.role === "ADMIN") {
        setAdminOnline(payload.isOnline);
      }
    });

    return () => {
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("connect", connectHandler);
      socket.off("chat:message");
      socket.off("chat:typing");
      socket.off("chat:read");
      socket.off("chat:status-changed");
      socket.off("chat:online-status");
    };
  }, [socket, conversation?.id]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messageList.length, isOpen]);

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex h-[520px] w-[380px] flex-col rounded-[24px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] ring-1 ring-black/5 sm:w-[420px]">
          <div className="flex items-center justify-between rounded-t-[24px] bg-[#D0021B] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">C</div>
              <div>
                <div className="font-heading text-lg">CATTLEYA Support</div>
                <div className="flex items-center gap-2 text-sm text-[#F3F3F3]">
                  <OnlineIndicator isOnline={isAdminOnline} pulse />
                  {isAdminOnline ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <button type="button" onClick={() => { setWelcomeActive(false); }}> <Minus className="h-4 w-4" /> </button>
              <button type="button" onClick={closeChat}> <X className="h-5 w-5" /> </button>
            </div>
          </div>
          {conversation?.status && conversation.status !== "OPEN" ? (
            <div className="border-b border-[#E8E8E8] bg-[#F5F5F5] px-4 py-3 text-sm text-[#6B6B6B]">
              This conversation is {conversation.status.toLowerCase()}. <button type="button" onClick={() => createNewConversation()} className="text-[#D0021B] underline">Start a new chat</button>
            </div>
          ) : null}
          {hasConnectionIssue ? (
            <div className="border-b border-[#F5A623] bg-[#FFF4E5] px-4 py-3 text-sm text-[#8A4B00]">Reconnecting...</div>
          ) : null}
          <div className="flex-1 overflow-hidden bg-[#F5F5F5] p-4">
            <div ref={scrollRef} onScroll={(event) => { if (event.currentTarget.scrollTop < 80 && hasMoreMessages) loadMoreMessages(); }} className="h-full space-y-3 overflow-y-auto pr-2">
              {conversation ? (
                Object.entries(groupedMessages).map(([day, dayMessages]) => (
                  <div key={day}>
                    <div className="mx-auto mb-3 inline-flex rounded-full bg-[#E8E8E8] px-3 py-1 text-[11px] text-[#6B6B6B]">{day}</div>
                    {dayMessages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.senderRole === "CUSTOMER"}
                        showAvatar={message.senderRole === "ADMIN"}
                        senderName={message.senderRole === "ADMIN" ? "CATTLEYA Support" : undefined}
                        status={message.isFailed ? "failed" : message.isRead ? "read" : "sent"}
                        onRetry={() => handleRetry(message)}
                        onImageClick={(url) => setLightboxImage(url)}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[#6B6B6B]">
                  <div className="h-12 w-12 rounded-full bg-[#F5F5F5] text-3xl leading-[48px]">C</div>
                  <div className="text-xl font-semibold text-[#D0021B]">Hello! 👋</div>
                  <div>How can we help you today?</div>
                </div>
              )}
              {isTyping ? <TypingIndicator /> : null}
            </div>
          </div>
          <div className="border-t border-[#E8E8E8] bg-white p-4">
            {!conversation ? (
              <div className="space-y-3">
                <div className="text-sm text-[#6B6B6B]">What's this about?</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUBJECT_OPTIONS.map((option) => (
                    <button key={option} type="button" onClick={() => { setSelectedSubject(option); }} className={`rounded-full border px-3 py-2 text-sm ${selectedSubject === option ? "border-[#D0021B] bg-[#FFE5E7] text-[#D0021B]" : "border-[#E8E8E8] bg-[#F5F5F5] text-[#1A1A1A]"}`}>
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => createNewConversation(selectedSubject || subject)} className="flex-1 rounded-2xl bg-[#D0021B] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#b0011a]">Start Chat</button>
                </div>
                <div className="text-xs text-[#6B6B6B]">Usually replies within a few hours</div>
              </div>
            ) : conversation.status !== "OPEN" ? (
              <div className="space-y-3 text-center text-sm text-[#6B6B6B]">
                <div>This chat has been closed by our team.</div>
                <button type="button" onClick={() => createNewConversation()} className="rounded-2xl bg-[#D0021B] px-4 py-3 text-sm font-semibold text-white">Start a new conversation?</button>
              </div>
            ) : (
              <div className="space-y-3">
                {files.length > 0 ? (
                  <div className="space-y-2">
                    {files.map((file) => (<FilePreview key={file.name} file={file} onRemove={() => setFiles((current) => current.filter((item) => item !== file))} />))}
                  </div>
                ) : null}
                <div className="flex items-center gap-2 rounded-3xl bg-[#F5F5F5] p-2">
                  <button type="button" className="rounded-full p-2 text-[#6B6B6B] hover:text-[#D0021B]" onClick={() => document.getElementById("customer-chat-file-input")?.click()}>
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onFocus={() => socket?.emit("chat:typing", { conversationId: conversation.id, isTyping: true })} onBlur={() => socket?.emit("chat:typing", { conversationId: conversation.id, isTyping: false })} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSendText(); } }} placeholder="Type your message..." className="min-h-[44px] flex-1 resize-none rounded-3xl bg-[#F5F5F5] px-3 py-3 text-sm text-[#1A1A1A] outline-none" />
                  <button type="button" onClick={handleSendText} disabled={!draft.trim()} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#D0021B] text-white disabled:cursor-not-allowed disabled:bg-[#A03C44]">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <input type="file" id="customer-chat-file-input" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setFiles([file]); handleFileSelect(file); event.target.value = ""; } }} />
                <div className="flex items-center justify-between text-[11px] text-[#6B6B6B]">
                  <span>{draft.length > 800 ? `${draft.length}/1000 characters` : ""}</span>
                  <button type="button" onClick={handleRead} className="text-[#D0021B] underline">Mark as read</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button onClick={openChat} className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#D0021B] text-white shadow-xl transition hover:scale-105">
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 ? <span className="absolute right-0 top-0 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-semibold text-[#D0021B]">{unreadCount}</span> : null}
          <span className={`absolute left-0 bottom-0 inline-flex h-3.5 w-3.5 rounded-full ${isAdminOnline ? "bg-[#00C853]" : "bg-[#9A9A9A]"}`} />
        </button>
      )}
      {lightboxImage ? <ImageLightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} /> : null}
    </div>
  );
}
