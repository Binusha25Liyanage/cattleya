import { create } from "zustand";
import type { ChatConversation, ChatMessage } from "@/types";

interface ChatStore {
  isOpen: boolean;
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  unreadCount: number;
  isAdminOnline: boolean;
  isTyping: boolean;
  isLoading: boolean;
  isSending: boolean;
  hasMoreMessages: boolean;
  currentPage: number;
  totalPages: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setConversation: (conv: ChatConversation) => void;
  addMessage: (msg: ChatMessage) => void;
  prependMessages: (msgs: ChatMessage[]) => void;
  setUnreadCount: (n: number) => void;
  clearUnread: () => void;
  setAdminOnline: (online: boolean) => void;
  setTyping: (typing: boolean) => void;
  markAsRead: () => void;
  setLoading: (value: boolean) => void;
  setSending: (value: boolean) => void;
  setPage: (page: number) => void;
  setTotalPages: (value: number) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  conversation: null,
  messages: [],
  unreadCount: 0,
  isAdminOnline: false,
  isTyping: false,
  isLoading: false,
  isSending: false,
  hasMoreMessages: false,
  currentPage: 1,
  totalPages: 1,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, isTyping: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setConversation: (conv) => set({ conversation: conv, messages: conv.messages ?? [], unreadCount: conv.unreadByCustomer ?? 0, currentPage: 1, totalPages: 1, hasMoreMessages: false }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
      unreadCount: state.isOpen ? state.unreadCount : state.unreadCount + (msg.senderRole === "ADMIN" ? 1 : 0),
    })),
  prependMessages: (msgs) => set((state) => ({ messages: [...msgs, ...state.messages] })),
  setUnreadCount: (n) => set({ unreadCount: n }),
  clearUnread: () => set((state) => ({ unreadCount: 0, conversation: state.conversation ? { ...state.conversation, unreadByCustomer: 0 } : state.conversation })),
  setAdminOnline: (online) => set({ isAdminOnline: online }),
  setTyping: (typing) => set({ isTyping: typing }),
  markAsRead: () => set((state) => ({ messages: state.messages.map((message) => (message.senderRole === "ADMIN" ? { ...message, isRead: true } : message)), unreadCount: 0, conversation: state.conversation ? { ...state.conversation, unreadByCustomer: 0 } : state.conversation })),
  setLoading: (value) => set({ isLoading: value }),
  setSending: (value) => set({ isSending: value }),
  setPage: (page) => set({ currentPage: page }),
  setTotalPages: (value) => set({ totalPages: value, hasMoreMessages: value > 1 }),
}));
