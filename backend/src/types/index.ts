export type Role = "ADMIN" | "CUSTOMER";

export type ProductCategory =
  | "TSHIRT"
  | "SHIRT"
  | "SARONG"
  | "FROCK"
  | "CROP_TOP"
  | "SAREE"
  | "LUNGI";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";

export type DesignStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ApiResponse<T> = { success: true; data: T };
export type ApiError = { success: false; message: string; errors?: unknown };

export type JwtPayload = {
  sub: string;
  role: Role;
  email: string;
};

export type CartItem = {
  itemId: string;
  productId: string;
  variantId: string;
  quantity: number;
  customDesignId?: string | null;
};

export type AIGenerationJob = {
  designId: string;
  userId: string;
  enhancedPrompt: string;
  styleParams: Record<string, unknown>;
};
