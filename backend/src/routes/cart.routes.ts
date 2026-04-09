import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/add", authenticate, addCartItem);
router.put("/update", authenticate, updateCartItem);
router.delete("/remove/:itemId", authenticate, removeCartItem);
router.delete("/clear", authenticate, clearCart);

export default router;
