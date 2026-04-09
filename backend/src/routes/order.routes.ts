import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/admin.middleware";
import { cancelOrder, createOrder, getOrder, listOrders, myOrders, updateOrderStatus } from "../controllers/order.controller";

const router = Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, authorizeAdmin, listOrders);
router.get("/my", authenticate, myOrders);
router.get("/:id", authenticate, getOrder);
router.put("/:id/status", authenticate, authorizeAdmin, updateOrderStatus);
router.post("/:id/cancel", authenticate, cancelOrder);

export default router;
