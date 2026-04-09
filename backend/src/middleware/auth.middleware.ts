import type { Request, Response, NextFunction } from "express";
import { parseCookies, verifyAccessToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const cookieToken = parseCookies(req.headers.cookie).accessToken;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const payload = verifyAccessToken(token);
    (req as Request & { user?: typeof payload }).user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
