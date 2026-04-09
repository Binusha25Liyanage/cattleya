import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/db";
import { emailService } from "../services/email.service";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";

function authCookies(token: string, refreshToken: string) {
  const base = { httpOnly: true, sameSite: "lax" as const, secure: false, path: "/" };
  return { accessToken: token, refreshToken, base };
}

export async function register(req: Request, res: Response) {
  const { name, email, password, phone } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ success: false, message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, passwordHash, phone } });
  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role, email: user.email });
  const cookies = authCookies(accessToken, refreshToken);

  res.cookie("accessToken", cookies.accessToken, cookies.base).cookie("refreshToken", cookies.refreshToken, cookies.base);
  await emailService.sendWelcome(user.email, user.name).catch(() => null);
  res.status(201).json({ success: true, data: { user, accessToken } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role, email: user.email });
  const cookies = authCookies(accessToken, refreshToken);
  res.cookie("accessToken", cookies.accessToken, cookies.base).cookie("refreshToken", cookies.refreshToken, cookies.base);
  res.json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken } });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("accessToken").clearCookie("refreshToken").json({ success: true, data: { message: "Logged out" } });
}

export async function refreshToken(req: Request, res: Response) {
  const refreshTokenValue = req.headers.cookie?.split(";").find((item) => item.trim().startsWith("refreshToken="))?.split("=")[1];
  if (!refreshTokenValue) return res.status(401).json({ success: false, message: "Missing refresh token" });

  const payload = verifyRefreshToken(refreshTokenValue);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return res.status(401).json({ success: false, message: "Invalid token" });

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshTokenNew = signRefreshToken({ sub: user.id, role: user.role, email: user.email });
  res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax", secure: false, path: "/" });
  res.cookie("refreshToken", refreshTokenNew, { httpOnly: true, sameSite: "lax", secure: false, path: "/" });
  res.json({ success: true, data: { accessToken } });
}

export async function me(req: Request, res: Response) {
  const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { addresses: true } });
  res.json({ success: true, data: user });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ success: true, data: { message: "If the email exists, reset instructions were sent" } });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const link = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  await emailService.sendPasswordReset(email, link).catch(() => null);
  res.json({ success: true, data: { message: "Password reset email sent" } });
}

export async function resetPassword(req: Request, res: Response) {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { email }, data: { passwordHash } });
  res.json({ success: true, data: { message: "Password updated" } });
}
