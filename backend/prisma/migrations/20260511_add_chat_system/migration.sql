-- Prisma migration: add_chat_system
-- Apply this SQL after installing dependencies and running Prisma migrate.

CREATE TYPE "ConversationStatus" AS ENUM ('OPEN', 'CLOSED', 'RESOLVED');
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE');

CREATE TABLE "Conversation" (
  "id" TEXT PRIMARY KEY,
  "customerId" TEXT NOT NULL,
  "status" "ConversationStatus" NOT NULL DEFAULT 'OPEN',
  "subject" TEXT,
  "lastMessage" TEXT,
  "lastMessageAt" TIMESTAMPTZ,
  "unreadByAdmin" INTEGER NOT NULL DEFAULT 0,
  "unreadByCustomer" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Message" (
  "id" TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "senderRole" TEXT NOT NULL,
  "content" TEXT,
  "messageType" "MessageType" NOT NULL DEFAULT 'TEXT',
  "fileUrl" TEXT,
  "fileName" TEXT,
  "fileSize" INTEGER,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE;

CREATE INDEX "Conversation_customerId_idx" ON "Conversation" ("customerId");
CREATE INDEX "Conversation_status_idx" ON "Conversation" ("status");
CREATE INDEX "Message_conversationId_idx" ON "Message" ("conversationId");
CREATE INDEX "Message_senderId_idx" ON "Message" ("senderId");
