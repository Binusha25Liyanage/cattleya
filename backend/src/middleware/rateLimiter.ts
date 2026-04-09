import { RateLimiterMemory } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";

const generalLimiter = new RateLimiterMemory({ points: 100, duration: 15 * 60 });
const authLimiter = new RateLimiterMemory({ points: 5, duration: 15 * 60 });
const generateLimiter = new RateLimiterMemory({ points: 10, duration: 60 * 60 });

export async function generalRateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    await generalLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ success: false, message: "Too many requests" });
  }
}

export async function authRateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    await authLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ success: false, message: "Too many auth requests" });
  }
}

export async function generateDesignRateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const key = (req as Request & { user?: { sub?: string } }).user?.sub || req.ip;
    await generateLimiter.consume(key);
    next();
  } catch {
    res.status(429).json({ success: false, message: "Too many design generation requests" });
  }
}
