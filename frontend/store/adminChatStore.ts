import { create } from "zustand";
import type { ChatConversation, ChatMessage } from "@/types";

interface AdminChatStore {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  totalUnread: number;
  onlineCustomers: Set<string>;
  typingCustomers: Record<string, boolean>;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  filter: "ALL" | "OPEN" | "RESOLVED" | "CLOSED";
  searchQuery: string;
  setConversations: (convs: ChatConversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, msg: ChatMessage) => void;
  updateConversation: (id: string, data: Partial<ChatConversation>) => void;
  setTotalUnread: (n: number) => void;
  setCustomerOnline: (userId: string, online: boolean) => void;
  setCustomerTyping: (conversationId: string, typing: boolean) => void;
  markConversationRead: (conversationId: string) => void;
  setLoadingConversations: (value: boolean) => void;
  setLoadingMessages: (value: boolean) => void;
  setFilter: (value: "ALL" | "OPEN" | "RESOLVED" | "CLOSED") => void;
  setSearchQuery: (value: string) => void;
  setMessages: (conversationId: string, msgs: ChatMessage[]) => void;
}

export const useAdminChatStore = create<AdminChatStore>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  totalUnread: 0,
  onlineCustomers: new Set<string>(),
  typingCustomers: {},
  isLoadingConversations: false,
  isLoadingMessages: false,
  filter: "ALL",
  searchQuery: "",
  setConversations: (convs) => set({ conversations: convs, totalUnread: convs.reduce((sum, conv) => sum + (conv.unreadByAdmin || 0), 0) }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  addMessage: (conversationId, msg) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: [...(state.messages[conversationId] || []), msg] },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, lastMessage: msg.content || conv.lastMessage, lastMessageAt: msg.createdAt, unreadByAdmin: msg.senderRole === "CUSTOMER" ? conv.unreadByAdmin + 1 : conv.unreadByAdmin } : conv
      ),
    })),
  updateConversation: (id, data) =>
    set((state) => ({
      conversations: state.conversations.map((conv) => (conv.id === id ? { ...conv, ...data } : conv)),
    })),
  setTotalUnread: (n) => set({ totalUnread: n }),
  setCustomerOnline: (userId, online) =>
    set((state) => {
      const next = new Set(state.onlineCustomers);
      if (online) next.add(userId);
      else next.delete(userId);
      return { onlineCustomers: next };
    }),
  setCustomerTyping: (conversationId, typing) => set((state) => ({ typingCustomers: { ...state.typingCustomers, [conversationId]: typing } })),
  markConversationRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) => (conv.id === conversationId ? { ...conv, unreadByAdmin: 0 } : conv)),
      totalUnread: Math.max(0, state.totalUnread - (state.conversations.find((conv) => conv.id === conversationId)?.unreadByAdmin || 0)),
    })),
  setLoadingConversations: (value) => set({ isLoadingConversations: value }),
  setLoadingMessages: (value) => set({ isLoadingMessages: value }),
  setFilter: (value) => set({ filter: value }),
  setSearchQuery: (value) => set({ searchQuery: value }),
  setMessages: (conversationId, msgs) => set((state) => ({ messages: { ...state.messages, [conversationId]: msgs } })),
}));
