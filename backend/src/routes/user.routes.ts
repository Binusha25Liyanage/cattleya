import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createAddress, changePassword, deleteAddress, listAddresses, updateAddress, updateProfile } from "../controllers/user.controller";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.post("/addresses", authenticate, createAddress);
router.get("/addresses", authenticate, listAddresses);
router.put("/addresses/:id", authenticate, updateAddress);
router.delete("/addresses/:id", authenticate, deleteAddress);

export default router;
