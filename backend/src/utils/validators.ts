import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
  }
  next();
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function parseCookies(cookieHeader?: string) {
  return (cookieHeader || "").split(";").reduce<Record<string, string>>((acc, cookie) => {
    const [rawKey, ...rest] = cookie.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}
