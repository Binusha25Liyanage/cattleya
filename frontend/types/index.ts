export type Role = "ADMIN" | "CUSTOMER";
export type ConversationStatus = "OPEN" | "CLOSED" | "RESOLVED";
export type MessageType = "TEXT" | "IMAGE" | "FILE";
export type ProductCategory = "TSHIRT" | "SHIRT" | "SARONG" | "FROCK" | "CROP_TOP" | "SAREE" | "LUNGI";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";
export type DesignStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ApiResponse<T> = { success: true; data: T };
export type ApiError = { success: false; message: string; errors?: unknown };

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: Role;
  content?: string | null;
  messageType: MessageType;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  isRead: boolean;
  createdAt: string;
  isFailed?: boolean;
};

export type ChatConversation = {
  id: string;
  customerId: string;
  customer?: { id: string; name: string; email: string; avatar?: string | null };
  status: ConversationStatus;
  subject?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadByAdmin: number;
  unreadByCustomer: number;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
};

export type ProductVariant = { id: string; size: string; color: string; colorHex: string; priceModifier: number; stockQty: number; sku: string };
export type Product = { id: string; name: string; slug: string; description: string; category: ProductCategory; basePrice: number; images: string[]; tags: string[]; isActive: boolean; isFeatured: boolean; variants?: ProductVariant[] };
export type Review = { id: string; rating: number; comment?: string | null; images: string[]; createdAt: string };
export type CustomDesign = { id: string; promptText: string; enhancedPrompt: string; imageUrl?: string | null; status: DesignStatus; jobStatus: string; createdAt: string };
export type OrderItem = { id: string; productId: string; variantId: string; quantity: number; unitPrice: number; customDesignId?: string | null };
export type Order = { id: string; status: OrderStatus; total: number; shippingAddress: Record<string, unknown>; paymentStatus: PaymentStatus; paymentRef?: string | null; paymentMethod?: string | null; createdAt: string; items: OrderItem[] };
export type Address = { id: string; label: string; line1: string; line2?: string | null; city: string; district: string; postalCode: string; isDefault: boolean };
