import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { uploadProductImages } from "../services/image.service";
import { toSlug } from "../utils/validators";

export async function listProducts(req: Request, res: Response) {
  const page = Number(req.query.page || 1);
  const pageSize = 12;
  const { category, search, size, color, price } = req.query;
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: String(category) } : {}),
      ...(search ? { OR: [{ name: { contains: String(search), mode: "insensitive" } }, { description: { contains: String(search), mode: "insensitive" } }] } : {}),
    },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  res.json({ success: true, data: { items: products, page, pageSize } });
}

export async function featuredProducts(_req: Request, res: Response) {
  const products = await prisma.product.findMany({ where: { isActive: true, isFeatured: true }, include: { variants: true }, take: 6 });
  res.json({ success: true, data: products });
}

export async function getProduct(req: Request, res: Response) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { variants: true, reviews: true } });
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, data: product });
}

export async function createProduct(req: Request, res: Response) {
  const data = req.body;
  const product = await prisma.product.create({ data: { ...data, slug: data.slug || toSlug(data.name) } });
  res.status(201).json({ success: true, data: product });
}

export async function updateProduct(req: Request, res: Response) {
  const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: product });
}

export async function deleteProduct(req: Request, res: Response) {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: { message: "Product deleted" } });
}

export async function uploadImages(req: Request, res: Response) {
  const files = (req.files || []) as Express.Multer.File[];
  const urls = await uploadProductImages(files);
  res.json({ success: true, data: urls });
}
