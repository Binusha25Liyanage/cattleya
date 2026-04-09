import type { Request, Response } from "express";
import { prisma } from "../config/db";

export async function stats(_req: Request, res: Response) {
  const [ordersToday, revenueMonth, pendingDesigns, lowStockItems] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
    prisma.customDesign.count({ where: { jobStatus: "waiting" } }),
    prisma.productVariant.count({ where: { stockQty: { lte: 5 } } }),
  ]);
  res.json({ success: true, data: { ordersToday, revenueMonth: revenueMonth._sum.total || 0, pendingDesigns, lowStockItems } });
}

export async function customers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({ where: { role: "CUSTOMER" }, orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: users });
}

export async function toggleCustomerActive(req: Request, res: Response) {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: req.body.isActive } });
  res.json({ success: true, data: user });
}

export async function pendingDesigns(_req: Request, res: Response) {
  const designs = await prisma.customDesign.findMany({ where: { status: "PENDING" }, include: { user: true }, orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: designs });
}

export async function ordersAnalytics(_req: Request, res: Response) {
  const entries = await Promise.all(
    Array.from({ length: 30 }).map(async (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - index);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
      const total = await prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: start, lt: end } } });
      return { date: start.toISOString().slice(0, 10), revenue: Number(total._sum.total || 0) };
    })
  );
  res.json({ success: true, data: entries.reverse() });
}
