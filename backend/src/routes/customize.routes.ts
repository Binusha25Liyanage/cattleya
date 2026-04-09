import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/admin.middleware";
import { generateDesign, deleteDesign, enhancePrompt, myDesigns, status, updateDesignStatus } from "../controllers/customize.controller";
import { generateDesignRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/enhance-prompt", authenticate, enhancePrompt);
router.post("/generate", authenticate, generateDesignRateLimiter, generateDesign);
router.get("/status/:jobId", authenticate, status);
router.get("/my-designs", authenticate, myDesigns);
router.delete("/:id", authenticate, deleteDesign);
router.put("/:id/status", authenticate, authorizeAdmin, updateDesignStatus);

export default router;
