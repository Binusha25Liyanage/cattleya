import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { redisSubscriber } from "../config/redis";
import { parseCookies, verifyAccessToken } from "../utils/jwt";
import { prisma } from "../config/db";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true },
  });

  const onlineUsers = new Set<string>();
  const onlineAdmins = new Set<string>();

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || parseCookies(socket.handshake.headers.cookie as string | undefined).accessToken;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.userRole = payload.role;
      socket.data.userEmail = payload.email;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.data.userId as string;
    const role = socket.data.userRole as string;
    onlineUsers.add(userId);
    if (role === "ADMIN") onlineAdmins.add(userId);
    socket.join(userId);
    io.emit("chat:online-status", { userId, role, isOnline: true });

    if (role === "ADMIN") {
      const conversations = await prisma.conversation.findMany({ select: { id: true } });
      conversations.forEach((conversation) => {
        socket.join(`conversation:${conversation.id}`);
      });
    }

    socket.on("chat:join", async (payload: { conversationId: string }) => {
      const conversation = await prisma.conversation.findUnique({ where: { id: payload.conversationId } });
      if (!conversation) {
        return socket.emit("chat:error", { message: "Conversation not found" });
      }

      if (role !== "ADMIN" && conversation.customerId !== userId) {
        return socket.emit("chat:error", { message: "Access denied" });
      }

      socket.join(`conversation:${payload.conversationId}`);
      socket.emit("chat:online-status", { userId, role, isOnline: onlineAdmins.size > 0 });
    });

    socket.on("chat:message", async (payload: { conversationId: string; content: string; messageType: string }) => {
      const conversation = await prisma.conversation.findUnique({ where: { id: payload.conversationId } });
      if (!conversation) {
        return socket.emit("chat:error", { message: "Conversation not found" });
      }
      if (role !== "ADMIN" && conversation.customerId !== userId) {
        return socket.emit("chat:error", { message: "Access denied" });
      }

      const message = await prisma.message.create({
        data: {
          conversationId: payload.conversationId,
          senderId: userId,
          senderRole: role === "ADMIN" ? "ADMIN" : "CUSTOMER",
          content: payload.content,
          messageType: payload.messageType === "IMAGE" ? "IMAGE" : payload.messageType === "FILE" ? "FILE" : "TEXT",
        },
      });

      const updateData: Record<string, unknown> = {
        lastMessage: payload.content,
        lastMessageAt: new Date(),
      };
      if (role === "CUSTOMER") {
        updateData.unreadByAdmin = { increment: 1 };
      } else {
        updateData.unreadByCustomer = { increment: 1 };
      }

      await prisma.conversation.update({ where: { id: payload.conversationId }, data: updateData });

      io.to(`conversation:${payload.conversationId}`).emit("chat:message", {
        message,
        conversationId: payload.conversationId,
      });

      if (role === "CUSTOMER") {
        const customer = await prisma.user.findUnique({ where: { id: userId } });
        io.emit("chat:new-message-admin", {
          conversationId: payload.conversationId,
          customerName: customer?.name ?? "Customer",
          preview: payload.content.slice(0, 80),
          unreadCount: conversation.unreadByAdmin + 1,
        });
      }
    });

    socket.on("chat:typing", async (payload: { conversationId: string; isTyping: boolean }) => {
      const conversation = await prisma.conversation.findUnique({ where: { id: payload.conversationId } });
      if (!conversation) return;
      if (role !== "ADMIN" && conversation.customerId !== userId) return;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      socket.to(`conversation:${payload.conversationId}`).emit("chat:typing", {
        conversationId: payload.conversationId,
        isTyping: payload.isTyping,
        senderName: user?.name ?? "Support",
      });
    });

    socket.on("chat:read", async (payload: { conversationId: string }) => {
      const conversation = await prisma.conversation.findUnique({ where: { id: payload.conversationId } });
      if (!conversation) return;
      if (role !== "ADMIN" && conversation.customerId !== userId) return;

      if (role === "CUSTOMER") {
        await prisma.message.updateMany({ where: { conversationId: payload.conversationId, senderRole: "ADMIN", isRead: false }, data: { isRead: true } });
        await prisma.conversation.update({ where: { id: payload.conversationId }, data: { unreadByCustomer: 0 } });
        socket.to(`conversation:${payload.conversationId}`).emit("chat:read", { conversationId: payload.conversationId, readBy: "CUSTOMER" });
        return;
      }

      await prisma.message.updateMany({ where: { conversationId: payload.conversationId, senderRole: "CUSTOMER", isRead: false }, data: { isRead: true } });
      await prisma.conversation.update({ where: { id: payload.conversationId }, data: { unreadByAdmin: 0 } });
      socket.to(`conversation:${payload.conversationId}`).emit("chat:read", { conversationId: payload.conversationId, readBy: "ADMIN" });
    });

    socket.on("chat:status-changed", async (payload: { conversationId: string; status: string }) => {
      const conversation = await prisma.conversation.findUnique({ where: { id: payload.conversationId } });
      if (!conversation) return;
      if (role !== "ADMIN" && conversation.customerId !== userId) return;
      io.to(`conversation:${payload.conversationId}`).emit("chat:status-changed", { conversationId: payload.conversationId, status: payload.status });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      if (role === "ADMIN") onlineAdmins.delete(userId);
      io.emit("chat:online-status", { userId, role, isOnline: false });
    });
  });

  redisSubscriber.subscribe("design-events");
  redisSubscriber.on("message", (_channel: string, message: string) => {
    const payload = JSON.parse(message) as { event: string; userId: string };
    io.to(payload.userId).emit(payload.event, payload);
  });

  return io;
}
