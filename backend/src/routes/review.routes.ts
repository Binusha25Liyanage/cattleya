import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/admin.middleware";
import { createReview, deleteReview, listProductReviews } from "../controllers/review.controller";

const router = Router();

router.post("/", authenticate, createReview);
router.get("/products/:id/reviews", listProductReviews);
router.delete("/:id", authenticate, authorizeAdmin, deleteReview);

export default router;
