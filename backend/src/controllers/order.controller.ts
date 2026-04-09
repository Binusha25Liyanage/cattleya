import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { redis } from "../config/redis";
import { emailService } from "../services/email.service";

function cartKey(userId: string) {
  return `cart:${userId}`;
}

export async function createOrder(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const cart = JSON.parse((await redis.get(cartKey(userId || "guest"))) || '{"items":[]}');
  if (!cart.items.length) return res.status(400).json({ success: false, message: "Cart is empty" });

  const order = await prisma.order.create({
    data: {
      userId: userId || "",
      total: req.body.total,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      notes: req.body.notes,
      items: {
        create: cart.items.map((item: { productId: string; variantId: string; quantity: number; customDesignId?: string }) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: req.body.unitPrice || 0,
          customDesignId: item.customDesignId,
        })),
      },
    },
    include: { items: true },
  });

  await redis.del(cartKey(userId || "guest"));
  res.status(201).json({ success: true, data: order });
}

export async function listOrders(req: Request, res: Response) {
  const orders = await prisma.order.findMany({ include: { items: true, user: true }, orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: orders });
}

export async function myOrders(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const orders = await prisma.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: orders });
}

export async function getOrder(req: Request, res: Response) {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: { include: { product: true, variant: true } }, user: true } });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, data: order });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  if (order.userId) {
    const user = await prisma.user.findUnique({ where: { id: order.userId } });
    if (user) await emailService.sendOrderStatus(user.email, req.body.status).catch(() => null);
  }
  res.json({ success: true, data: order });
}

export async function cancelOrder(req: Request, res: Response) {
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: "CANCELLED" } });
  res.json({ success: true, data: order });
}
