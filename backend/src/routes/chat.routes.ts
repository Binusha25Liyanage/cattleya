import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/admin.middleware";
import {
  createConversation,
  getMyConversation,
  getConversationMessages,
  sendMessage,
  uploadFile,
  markConversationRead,
  adminListConversations,
  adminGetConversation,
  updateConversationStatus,
  chatStats,
} from "../controllers/chat.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/conversations", authenticate, createConversation);
router.get("/conversations/mine", authenticate, getMyConversation);
router.get("/conversations/:id/messages", authenticate, getConversationMessages);
router.post("/conversations/:id/messages", authenticate, sendMessage);
router.post("/conversations/:id/files", authenticate, upload.single("file"), uploadFile);
router.put("/conversations/:id/read", authenticate, markConversationRead);

router.use(authenticate, authorizeAdmin);
router.get("/conversations", adminListConversations);
router.get("/conversations/:id", adminGetConversation);
router.put("/conversations/:id/status", updateConversationStatus);
router.get("/stats", chatStats);

export default router;
