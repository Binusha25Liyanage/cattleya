import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { cloudinary } from "../config/cloudinary";
import type { Role } from "@prisma/client";
import fs from "fs";

const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function getUser(req: Request) {
  return (req as Request & { user?: { sub: string; role: Role; email: string } }).user!;
}

async function findConversation(conversationId: string) {
  return prisma.conversation.findUnique({ where: { id: conversationId } });
}

export async function createConversation(req: Request, res: Response) {
  const user = getUser(req);
  if (user.role !== "CUSTOMER") {
    return res.status(403).json({ success: false, message: "Only customers can start conversations" });
  }

  const existing = await prisma.conversation.findFirst({
    where: { customerId: user.sub, status: "OPEN" },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 50 } },
  });

  if (existing) {
    return res.json({ success: true, data: existing });
  }

  const conversation = await prisma.conversation.create({
    data: {
      customerId: user.sub,
      subject: req.body.subject,
    },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 50 } },
  });

  return res.status(201).json({ success: true, data: conversation });
}

export async function getMyConversation(req: Request, res: Response) {
  const user = getUser(req);
  if (user.role !== "CUSTOMER") {
    return res.status(403).json({ success: false, message: "Only customers can view their conversation" });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { customerId: user.sub, status: "OPEN" },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 50 } },
  });

  return res.json({ success: true, data: conversation });
}

export async function getConversationMessages(req: Request, res: Response) {
  const user = getUser(req);
  const { id } = req.params;
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 50), 100);
  const conversation = await findConversation(id);

  if (!conversation) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  if (user.role !== "ADMIN" && conversation.customerId !== user.sub) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const total = await prisma.message.count({ where: { conversationId: id } });
  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return res.json({
    success: true,
    data: {
      messages,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      currentPage: page,
    },
  });
}

export async function sendMessage(req: Request, res: Response) {
  const user = getUser(req);
  const { id } = req.params;
  const { content } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ success: false, message: "Message content is required" });
  }

  const conversation = await findConversation(id);
  if (!conversation) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  if (user.role !== "ADMIN" && conversation.customerId !== user.sub) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: user.sub,
      senderRole: user.role,
      content: content.trim(),
      messageType: "TEXT",
    },
  });

  await prisma.conversation.update({
    where: { id },
    data: {
      lastMessage: content.trim(),
      lastMessageAt: new Date(),
      unreadByAdmin: user.role === "CUSTOMER" ? { increment: 1 } : undefined,
      unreadByCustomer: user.role === "ADMIN" ? { increment: 1 } : undefined,
    },
  });

  return res.status(201).json({ success: true, data: message });
}

export async function uploadFile(req: Request, res: Response) {
  const user = getUser(req);
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: "File upload is required" });
  }

  if (!ALLOWED_FILE_TYPES.has(file.mimetype)) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ success: false, message: "Only images, PDF and Word documents are supported." });
  }

  if (file.size > 10 * 1024 * 1024) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ success: false, message: "File too large. Maximum size is 10MB." });
  }

  const conversation = await findConversation(id);
  if (!conversation) {
    fs.unlinkSync(file.path);
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  if (user.role !== "ADMIN" && conversation.customerId !== user.sub) {
    fs.unlinkSync(file.path);
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const uploadResult = await cloudinary.uploader.upload(file.path, {
    folder: "cattleya-chat",
    resource_type: "auto",
  });

  try {
    const fileType = file.mimetype.startsWith("image/") ? "IMAGE" : "FILE";
    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: user.sub,
        senderRole: user.role,
        content: file.originalname,
        messageType: fileType,
        fileUrl: uploadResult.secure_url,
        fileName: file.originalname,
        fileSize: file.size,
      },
    });

    await prisma.conversation.update({
      where: { id },
      data: {
        lastMessage: file.originalname,
        lastMessageAt: new Date(),
        unreadByAdmin: user.role === "CUSTOMER" ? { increment: 1 } : undefined,
        unreadByCustomer: user.role === "ADMIN" ? { increment: 1 } : undefined,
      },
    });

    fs.unlinkSync(file.path);
    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    fs.unlinkSync(file.path);
    return res.status(500).json({ success: false, message: "Unable to save file message" });
  }
}

export async function markConversationRead(req: Request, res: Response) {
  const user = getUser(req);
  const { id } = req.params;
  const conversation = await findConversation(id);

  if (!conversation) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  if (user.role !== "ADMIN" && conversation.customerId !== user.sub) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  if (user.role === "CUSTOMER") {
    await prisma.message.updateMany({
      where: { conversationId: id, senderRole: "ADMIN", isRead: false },
      data: { isRead: true },
    });
    await prisma.conversation.update({ where: { id }, data: { unreadByCustomer: 0 } });
    return res.json({ success: true, data: { readBy: "CUSTOMER" } });
  }

  await prisma.message.updateMany({
    where: { conversationId: id, senderRole: "CUSTOMER", isRead: false },
    data: { isRead: true },
  });
  await prisma.conversation.update({ where: { id }, data: { unreadByAdmin: 0 } });
  return res.json({ success: true, data: { readBy: "ADMIN" } });
}

export async function adminListConversations(req: Request, res: Response) {
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 20), 50);

  const where: Record<string, unknown> = {};
  if (status && ["OPEN", "CLOSED", "RESOLVED"].includes(status)) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const total = await prisma.conversation.count({ where });
  const conversations = await prisma.conversation.findMany({
    where,
    include: { customer: true },
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return res.json({
    success: true,
    data: {
      conversations,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      currentPage: page,
    },
  });
}

export async function adminGetConversation(req: Request, res: Response) {
  const { id } = req.params;
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      customer: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) {
    return res.status(404).json({ success: false, message: "Conversation not found" });
  }

  return res.json({ success: true, data: conversation });
}

export async function updateConversationStatus(req: Request, res: Response) {
  const { id } = req.params;
  const status = req.body.status as string;
  if (!status || !["OPEN", "CLOSED", "RESOLVED"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const conversation = await prisma.conversation.update({
    where: { id },
    data: { status },
  });

  return res.json({ success: true, data: conversation });
}

export async function chatStats(_req: Request, res: Response) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const openCountPromise = prisma.conversation.count({ where: { status: "OPEN" } });
  const totalTodayPromise = prisma.conversation.count({ where: { createdAt: { gte: startOfDay } } });
  const unresolvedCountPromise = prisma.conversation.count({ where: { status: { not: "RESOLVED" } } });

  const allMessages = await prisma.message.findMany({
    orderBy: { createdAt: "asc" },
  });

  const responseTimes: number[] = [];
  const lastCustomerByConversation: Record<string, Date | null> = {};

  for (const msg of allMessages) {
    if (msg.senderRole === "CUSTOMER") {
      lastCustomerByConversation[msg.conversationId] = msg.createdAt;
      continue;
    }

    if (msg.senderRole === "ADMIN") {
      const lastCustomer = lastCustomerByConversation[msg.conversationId];
      if (lastCustomer) {
        responseTimes.push(msg.createdAt.getTime() - lastCustomer.getTime());
        lastCustomerByConversation[msg.conversationId] = null;
      }
    }
  }

  const [openCount, totalToday, unresolvedCount] = await Promise.all([openCountPromise, totalTodayPromise, unresolvedCountPromise]);

  const avgResponseTime = responseTimes.length
    ? `${Math.round(responseTimes.reduce((sum, diff) => sum + diff, 0) / responseTimes.length / 60000)}m`
    : "-";

  return res.json({ success: true, data: { openCount, totalToday, avgResponseTime, unresolvedCount } });
}
