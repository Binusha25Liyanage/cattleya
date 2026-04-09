import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/admin.middleware";
import { customers, ordersAnalytics, pendingDesigns, stats, toggleCustomerActive } from "../controllers/admin.controller";

const router = Router();

router.use(authenticate, authorizeAdmin);
router.get("/stats", stats);
router.get("/customers", customers);
router.put("/customers/:id/toggle-active", toggleCustomerActive);
router.get("/designs/pending", pendingDesigns);
router.get("/orders/analytics", ordersAnalytics);

export default router;
