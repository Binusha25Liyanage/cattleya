import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

const accessSecret = process.env.JWT_SECRET || "access-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh-secret";

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret) as JwtPayload & jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret) as JwtPayload & jwt.JwtPayload;
}

export function parseCookies(cookieHeader?: string) {
  return (cookieHeader || "").split(";").reduce<Record<string, string>>((acc, cookie) => {
    const [rawKey, ...rest] = cookie.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}
