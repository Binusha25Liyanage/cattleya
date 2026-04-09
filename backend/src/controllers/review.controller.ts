import type { Request, Response } from "express";
import { prisma } from "../config/db";

export async function createReview(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const review = await prisma.review.create({ data: { userId, ...req.body } });
  res.status(201).json({ success: true, data: review });
}

export async function listProductReviews(req: Request, res: Response) {
  const reviews = await prisma.review.findMany({ where: { productId: req.params.id }, include: { user: true }, orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: reviews });
}

export async function deleteReview(req: Request, res: Response) {
  const review = await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: review });
}
