import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { redisSubscriber } from "../config/redis";
import { parseCookies, verifyAccessToken } from "../utils/jwt";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || parseCookies(socket.handshake.headers.cookie as string | undefined).accessToken;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.data.userId);
  });

  redisSubscriber.subscribe("design-events");
  redisSubscriber.on("message", (_channel: string, message: string) => {
    const payload = JSON.parse(message) as { event: string; userId: string };
    io.to(payload.userId).emit(payload.event, payload);
  });

  return io;
}
