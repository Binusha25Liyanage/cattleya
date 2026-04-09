import type { Request, Response, NextFunction } from "express";

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as Request & { user?: { role?: string } }).user;
  if (user?.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}
