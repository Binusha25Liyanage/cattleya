import type { Request, Response } from "express";
import crypto from "crypto";
import { redis } from "../config/redis";

function cartKey(userId: string) {
  return `cart:${userId}`;
}

export async function getCart(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const cart = await redis.get(cartKey(userId || "guest"));
  res.json({ success: true, data: cart ? JSON.parse(cart) : { items: [] } });
}

export async function addCartItem(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const key = cartKey(userId || "guest");
  const current = JSON.parse((await redis.get(key)) || '{"items":[]}');
  current.items.push({ itemId: crypto.randomUUID(), ...req.body });
  await redis.set(key, JSON.stringify(current), "EX", 60 * 60 * 24 * 30);
  res.json({ success: true, data: current });
}

export async function updateCartItem(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const key = cartKey(userId || "guest");
  const current = JSON.parse((await redis.get(key)) || '{"items":[]}');
  current.items = current.items.map((item: { itemId: string }) => (item.itemId === req.body.itemId ? { ...item, ...req.body } : item));
  await redis.set(key, JSON.stringify(current), "EX", 60 * 60 * 24 * 30);
  res.json({ success: true, data: current });
}

export async function removeCartItem(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const key = cartKey(userId || "guest");
  const current = JSON.parse((await redis.get(key)) || '{"items":[]}');
  current.items = current.items.filter((item: { itemId: string }) => item.itemId !== req.params.itemId);
  await redis.set(key, JSON.stringify(current), "EX", 60 * 60 * 24 * 30);
  res.json({ success: true, data: current });
}

export async function clearCart(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  await redis.del(cartKey(userId || "guest"));
  res.json({ success: true, data: { message: "Cart cleared" } });
}
