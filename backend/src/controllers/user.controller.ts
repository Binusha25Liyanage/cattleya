import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";

export async function updateProfile(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const user = await prisma.user.update({ where: { id: userId }, data: req.body });
  res.json({ success: true, data: user });
}

export async function changePassword(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  res.json({ success: true, data: { message: "Password changed" } });
}

export async function createAddress(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const address = await prisma.address.create({ data: { userId, ...req.body } });
  res.status(201).json({ success: true, data: address });
}

export async function listAddresses(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { isDefault: "desc" } });
  res.json({ success: true, data: addresses });
}

export async function updateAddress(req: Request, res: Response) {
  const address = await prisma.address.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: address });
}

export async function deleteAddress(req: Request, res: Response) {
  await prisma.address.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: { message: "Address deleted" } });
}
