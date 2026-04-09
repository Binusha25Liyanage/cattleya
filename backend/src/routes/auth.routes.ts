import { Router } from "express";
import { body } from "express-validator";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validateRequest } from "../utils/validators";
import { authenticate } from "../middleware/auth.middleware";
import { forgotPassword, login, logout, me, register, refreshToken, resetPassword } from "../controllers/auth.controller";

const router = Router();

router.post("/register", authRateLimiter, body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 8 }), validateRequest, register);
router.post("/login", authRateLimiter, body("email").isEmail(), body("password").notEmpty(), validateRequest, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me", authenticate, me);
router.post("/forgot-password", authRateLimiter, body("email").isEmail(), validateRequest, forgotPassword);
router.post("/reset-password", authRateLimiter, body("email").isEmail(), body("password").isLength({ min: 8 }), validateRequest, resetPassword);

export default router;
